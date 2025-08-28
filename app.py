#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cisco Configuration Management Web Application
"""

from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from flask_cors import CORS
import os
from dotenv import load_dotenv
from cisco_manager import CiscoManager
import json

# Загрузка переменных окружения
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'cisco-cfg-secret-key-2024')
CORS(app)

# Инициализация менеджера Cisco устройств
cisco_manager = CiscoManager()

@app.route('/')
def index():
    """Главная страница"""
    devices = cisco_manager.get_devices()
    return render_template('index.html', devices=devices)

@app.route('/devices')
def devices():
    """Страница управления устройствами"""
    devices = cisco_manager.get_devices()
    return render_template('devices.html', devices=devices)

@app.route('/api/devices', methods=['GET'])
def api_get_devices():
    """API: Получить список устройств"""
    try:
        devices = cisco_manager.get_devices()
        return jsonify({'success': True, 'devices': devices})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices', methods=['POST'])
def api_add_device():
    """API: Добавить новое устройство"""
    try:
        data = request.get_json()
        device_id = cisco_manager.add_device(
            name=data['name'],
            ip=data['ip'],
            username=data['username'],
            password=data['password'],
            device_type=data.get('device_type', 'cisco_ios')
        )
        return jsonify({'success': True, 'device_id': device_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/devices/<device_id>/connect', methods=['POST'])
def api_connect_device(device_id):
    """API: Подключиться к устройству"""
    try:
        result = cisco_manager.connect_device(device_id)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices/<device_id>/command', methods=['POST'])
def api_execute_command(device_id):
    """API: Выполнить команду на устройстве"""
    try:
        data = request.get_json()
        command = data.get('command')
        if not command:
            return jsonify({'success': False, 'error': 'Command is required'}), 400
            
        result = cisco_manager.execute_command(device_id, command)
        return jsonify({'success': True, 'output': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices/<device_id>/config', methods=['POST'])
def api_configure_device(device_id):
    """API: Настроить устройство"""
    try:
        data = request.get_json()
        commands = data.get('commands', [])
        if not commands:
            return jsonify({'success': False, 'error': 'Commands are required'}), 400
            
        result = cisco_manager.configure_device(device_id, commands)
        return jsonify({'success': True, 'output': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices/<device_id>/status', methods=['GET'])
def api_device_status(device_id):
    """API: Получить статус устройства"""
    try:
        status = cisco_manager.get_device_status(device_id)
        return jsonify({'success': True, 'status': status})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices/<device_id>', methods=['DELETE'])
def api_delete_device(device_id):
    """API: Удалить устройство"""
    try:
        result = cisco_manager.delete_device(device_id)
        if result:
            return jsonify({'success': True, 'message': 'Устройство успешно удалено'})
        else:
            return jsonify({'success': False, 'error': 'Устройство не найдено'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/templates', methods=['GET'])
def api_get_templates():
    """API: Получить шаблоны конфигурации"""
    try:
        templates = cisco_manager.get_config_templates()
        return jsonify({'success': True, 'templates': templates})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices/<device_id>/template', methods=['POST'])
def api_apply_template(device_id):
    """API: Применить шаблон конфигурации"""
    try:
        data = request.get_json()
        template_name = data.get('template_name')
        variables = data.get('variables', {})
        
        if not template_name:
            return jsonify({'success': False, 'error': 'Template name is required'}), 400
            
        result = cisco_manager.apply_template(device_id, template_name, variables)
        return jsonify({'success': True, 'output': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/devices/disconnect-all', methods=['POST'])
def api_disconnect_all():
    """API: Отключить все устройства"""
    try:
        cisco_manager.close_all_connections()
        return jsonify({'success': True, 'message': 'Все соединения закрыты'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/configure/<device_id>')
def configure_device(device_id):
    """Страница конфигурации устройства"""
    try:
        device = cisco_manager.get_device(device_id)
        if not device:
            flash('Устройство не найдено', 'error')
            return redirect(url_for('devices'))
        return render_template('configure.html', device=device)
    except Exception as e:
        flash(f'Ошибка: {str(e)}', 'error')
        return redirect(url_for('devices'))

@app.route('/templates')
def config_templates():
    """Страница шаблонов конфигурации"""
    templates = cisco_manager.get_config_templates()
    devices = cisco_manager.get_devices()
    return render_template('templates.html', templates=templates, devices=devices)

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Создание директорий если их нет
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    # Запуск приложения
    app.run(
        debug=os.environ.get('DEBUG', 'True').lower() == 'true',
        host=os.environ.get('HOST', '0.0.0.0'),
        port=int(os.environ.get('PORT', 5000))
    )
