#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cisco Device Management Module
"""

import json
import os
from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoTimeoutException, NetmikoAuthenticationException
import uuid
from datetime import datetime
import threading
import time

class CiscoManager:
    """Менеджер для управления Cisco устройствами"""
    
    def __init__(self, devices_file='devices.json'):
        self.devices_file = devices_file
        self.devices = self._load_devices()
        self.connections = {}
        self.lock = threading.Lock()
        
    def _load_devices(self):
        """Загрузить устройства из файла"""
        if os.path.exists(self.devices_file):
            try:
                with open(self.devices_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return {}
        return {}
    
    def _save_devices(self):
        """Сохранить устройства в файл"""
        with open(self.devices_file, 'w', encoding='utf-8') as f:
            json.dump(self.devices, f, ensure_ascii=False, indent=2)
    
    def add_device(self, name, ip, username, password, device_type='cisco_ios', port=22):
        """Добавить новое устройство"""
        device_id = str(uuid.uuid4())
        device = {
            'id': device_id,
            'name': name,
            'ip': ip,
            'username': username,
            'password': password,
            'device_type': device_type,
            'port': port,
            'created_at': datetime.now().isoformat(),
            'last_connected': None,
            'status': 'disconnected'
        }
        
        with self.lock:
            self.devices[device_id] = device
            self._save_devices()
        
        return device_id
    
    def get_devices(self):
        """Получить список всех устройств"""
        return list(self.devices.values())
    
    def get_device(self, device_id):
        """Получить устройство по ID"""
        return self.devices.get(device_id)
    
    def delete_device(self, device_id):
        """Удалить устройство"""
        with self.lock:
            if device_id in self.devices:
                # Закрыть соединение если открыто
                self._close_connection(device_id)
                del self.devices[device_id]
                self._save_devices()
                return True
        return False
    
    def connect_device(self, device_id):
        """Подключиться к устройству"""
        device = self.devices.get(device_id)
        if not device:
            raise ValueError("Устройство не найдено")
        
        try:
            # Проверяем, есть ли уже активное соединение
            if device_id in self.connections:
                connection = self.connections[device_id]
                try:
                    # Проверяем соединение
                    connection.send_command('show version', timeout=5)
                    return "Соединение уже активно"
                except:
                    # Соединение неактивно, удаляем его
                    self._close_connection(device_id)
            
            # Создаем новое соединение
            device_params = {
                'device_type': device['device_type'],
                'host': device['ip'],
                'username': device['username'],
                'password': device['password'],
                'port': device.get('port', 22),
                'timeout': 20,
                'auth_timeout': 20,
                'global_delay_factor': 2,
            }
            
            connection = ConnectHandler(**device_params)
            self.connections[device_id] = connection
            
            # Обновляем статус устройства
            with self.lock:
                self.devices[device_id]['status'] = 'connected'
                self.devices[device_id]['last_connected'] = datetime.now().isoformat()
                self._save_devices()
            
            # Получаем базовую информацию об устройстве
            hostname = connection.send_command('show version | include System image')
            return f"Подключено успешно. {hostname}"
            
        except NetmikoTimeoutException:
            raise Exception("Превышено время ожидания подключения")
        except NetmikoAuthenticationException:
            raise Exception("Ошибка аутентификации")
        except Exception as e:
            raise Exception(f"Ошибка подключения: {str(e)}")
    
    def execute_command(self, device_id, command):
        """Выполнить команду на устройстве"""
        if device_id not in self.connections:
            self.connect_device(device_id)
        
        try:
            connection = self.connections[device_id]
            output = connection.send_command(command, timeout=30)
            return output
        except Exception as e:
            # При ошибке пытаемся переподключиться
            self._close_connection(device_id)
            raise Exception(f"Ошибка выполнения команды: {str(e)}")
    
    def configure_device(self, device_id, commands):
        """Настроить устройство (выполнить команды конфигурации)"""
        if device_id not in self.connections:
            self.connect_device(device_id)
        
        try:
            connection = self.connections[device_id]
            
            # Входим в режим конфигурации
            output = connection.send_config_set(commands)
            
            # Сохраняем конфигурацию
            save_output = connection.send_command('write memory')
            
            return {
                'config_output': output,
                'save_output': save_output
            }
        except Exception as e:
            self._close_connection(device_id)
            raise Exception(f"Ошибка конфигурации: {str(e)}")
    
    def get_device_status(self, device_id):
        """Получить статус устройства"""
        device = self.devices.get(device_id)
        if not device:
            return None
        
        status = {
            'connected': device_id in self.connections,
            'last_connected': device.get('last_connected'),
            'device_info': device
        }
        
        # Если устройство подключено, получаем дополнительную информацию
        if device_id in self.connections:
            try:
                connection = self.connections[device_id]
                uptime = connection.send_command('show version | include uptime')
                interfaces = connection.send_command('show ip interface brief')
                status['uptime'] = uptime
                status['interfaces'] = interfaces
            except:
                # Если ошибка, соединение неактивно
                self._close_connection(device_id)
                status['connected'] = False
        
        return status
    
    def _close_connection(self, device_id):
        """Закрыть соединение с устройством"""
        if device_id in self.connections:
            try:
                self.connections[device_id].disconnect()
            except:
                pass
            del self.connections[device_id]
            
            # Обновляем статус
            with self.lock:
                if device_id in self.devices:
                    self.devices[device_id]['status'] = 'disconnected'
                    self._save_devices()
    
    def close_all_connections(self):
        """Закрыть все соединения"""
        for device_id in list(self.connections.keys()):
            self._close_connection(device_id)
    
    def get_config_templates(self):
        """Получить шаблоны конфигурации"""
        templates = {
            'basic_setup': {
                'name': 'Базовая настройка',
                'description': 'Основные настройки коммутатора',
                'commands': [
                    'hostname {hostname}',
                    'enable secret {enable_password}',
                    'service password-encryption',
                    'banner motd # Unauthorized access prohibited #',
                    'line console 0',
                    'password {console_password}',
                    'login',
                    'exit',
                    'line vty 0 15',
                    'password {vty_password}',
                    'login',
                    'transport input ssh telnet',
                    'exit'
                ]
            },
            'vlan_setup': {
                'name': 'Настройка VLAN',
                'description': 'Создание и настройка VLAN',
                'commands': [
                    'vlan {vlan_id}',
                    'name {vlan_name}',
                    'exit',
                    'interface {interface}',
                    'switchport mode access',
                    'switchport access vlan {vlan_id}',
                    'exit'
                ]
            },
            'trunk_setup': {
                'name': 'Настройка Trunk',
                'description': 'Настройка trunk порта',
                'commands': [
                    'interface {interface}',
                    'switchport mode trunk',
                    'switchport trunk allowed vlan {allowed_vlans}',
                    'switchport trunk native vlan {native_vlan}',
                    'exit'
                ]
            },
            'ssh_setup': {
                'name': 'Настройка SSH',
                'description': 'Включение и настройка SSH',
                'commands': [
                    'ip domain-name {domain}',
                    'crypto key generate rsa general-keys modulus 2048',
                    'username {username} privilege 15 password {password}',
                    'line vty 0 15',
                    'login local',
                    'transport input ssh',
                    'exit',
                    'ip ssh version 2'
                ]
            }
        }
        return templates
    
    def apply_template(self, device_id, template_name, variables):
        """Применить шаблон конфигурации"""
        templates = self.get_config_templates()
        
        if template_name not in templates:
            raise ValueError("Шаблон не найден")
        
        template = templates[template_name]
        commands = []
        
        for command in template['commands']:
            try:
                formatted_command = command.format(**variables)
                commands.append(formatted_command)
            except KeyError as e:
                raise ValueError(f"Переменная {e} не найдена в параметрах")
        
        return self.configure_device(device_id, commands)
