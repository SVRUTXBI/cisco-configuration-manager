# 🌐 Cisco Configuration Manager

[![Version](https://img.shields.io/github/v/release/SVRUTXBI/cisco-configuration-manager)](https://github.com/SVRUTXBI/cisco-configuration-manager/releases)
[![Downloads](https://img.shields.io/github/downloads/SVRUTXBI/cisco-configuration-manager/total)](https://github.com/SVRUTXBI/cisco-configuration-manager/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.7+-blue.svg)](https://python.org)

Современное веб-приложение для управления и настройки коммутаторов Cisco с интуитивным интерфейсом, темным режимом и одноклчиковым запуском.

## 🚀 Быстрый старт

> 🪟 **Пользователи Windows**: Скачайте готовый [CiscoConfigManager-Windows.zip](https://github.com/SVRUTXBI/cisco-configuration-manager/releases/latest/download/CiscoConfigManager-Windows.zip) с EXE файлом или используйте [launcher.py](https://github.com/SVRUTXBI/cisco-configuration-manager/blob/main/launcher.py) + [Python 3.7+](https://python.org/downloads/) как альтернативу!

### 📥 Метод 1: Готовые исполняемые файлы (рекомендуется)

| Платформа | Скачать | Размер | Описание |
|-----------|---------|--------|----------|
| 🪟 **Windows** | **[CiscoConfigManager-Windows.zip](https://github.com/SVRUTXBI/cisco-configuration-manager/releases/latest/download/CiscoConfigManager-Windows.zip)** ⚠️ *или* **[launcher.py](https://github.com/SVRUTXBI/cisco-configuration-manager/blob/main/launcher.py)** + **[Python 3.7+](https://python.org/downloads/)** | ~20MB | EXE файл (если доступен) или GUI установщик |
| 🐧 **Linux** | **[CiscoConfigManager-Linux.tar.gz](https://github.com/SVRUTXBI/cisco-configuration-manager/releases/latest/download/CiscoConfigManager-Linux.tar.gz)** | ~19MB | Исполняемый файл + launcher.py |
| 📁 **Исходный код** | **[Source code.zip](https://github.com/SVRUTXBI/cisco-configuration-manager/archive/refs/heads/main.zip)** | ~1MB | Полный исходный код проекта |
| 🍎 **macOS** | **[CiscoConfigManager-macOS.tar.gz](https://github.com/SVRUTXBI/cisco-configuration-manager/releases/latest/download/CiscoConfigManager-macOS.tar.gz)** ⚠️ *или* **[launcher.py](https://github.com/SVRUTXBI/cisco-configuration-manager/blob/main/launcher.py)** + **[Python 3.7+](https://python.org/downloads/)** | ~20MB | Приложение (если доступно) или GUI установщик |

#### 🚀 Как использовать:

##### 🪟 **Windows:**

**📦 Вариант 1 - EXE файл (рекомендуется):**
1. **Скачайте** CiscoConfigManager-Windows.zip 
2. **Распакуйте** архив
3. **Запустите** CiscoConfigManager.exe двойным кликом
4. **Ждите** автоматического открытия браузера

**🐍 Вариант 2 - Если EXE недоступен:**
1. **Установите Python 3.7+** с https://python.org/downloads/ (⚠️ обязательно!)
2. **Скачайте** launcher.py (ПКМ → "Сохранить как...")
3. **Запустите**: двойной клик на `launcher.py` или `python launcher.py`
4. **Нажмите** "🚀 Установить и запустить"
5. **Ждите** автоматического открытия браузера

> ⚠️ **Примечание**: Исполняемые файлы создаются автоматически через GitHub Actions для Windows, Linux и macOS. Если файлы недоступны в релизе, используйте launcher.py как fallback вариант.
> 
> 🤖 **Автоматическая сборка**: При создании тега запускается GitHub Actions workflow который собирает исполняемые файлы для всех платформ и автоматически создает релиз.

##### 🐧 **Linux:**
1. **Скачайте** CiscoConfigManager-Linux.tar.gz
2. **Распакуйте**: `tar -xzf CiscoConfigManager-Linux.tar.gz`
3. **Запустите**: `./CiscoConfigManager` или `python launcher.py`

##### 🍎 **macOS:**

**📦 Вариант 1 - Готовое приложение (рекомендуется):**
1. **Скачайте** CiscoConfigManager-macOS.tar.gz
2. **Распакуйте**: `tar -xzf CiscoConfigManager-macOS.tar.gz`
3. **Запустите**: `./CiscoConfigManager` в Terminal
4. **Ждите** автоматического открытия браузера

**🐍 Вариант 2 - Если приложение недоступно:**
1. **Установите Python 3.7+** с https://python.org/downloads/
2. **Скачайте** launcher.py
3. **Запустите**: `python launcher.py` в Terminal
4. **Нажмите** "🚀 Установить и запустить"

> 💡 **Варианты запуска**: 
> - `CiscoConfigManager.exe` (Windows) - готовый EXE файл с Python внутри
> - `./CiscoConfigManager` (Linux/macOS) - исполняемый файл с Python внутри  
> - `python launcher.py` (все ОС) - GUI установщик с автоматической настройкой
> - `./setup.sh` (Linux/macOS) - установка из исходников

### 📁 Метод 2: Скачать исходный код

**[⬇️ Скачать Source code.zip](https://github.com/SVRUTXBI/cisco-configuration-manager/releases/latest)**

Затем используйте автоматическую установку ниже ⬇️

## ✨ Возможности

- 🌐 **Веб-интерфейс** - Современный и отзывчивый интерфейс
- 🌙 **Темный режим** - Автоматическое определение системных настроек + ручное переключение
- 🔌 **SSH подключение** - Безопасное подключение к устройствам Cisco
- ⚡ **Быстрые команды** - Готовые команды для диагностики
- 📝 **Шаблоны конфигурации** - Параметризованные шаблоны для быстрой настройки
- 📊 **Мониторинг статуса** - Отслеживание состояния устройств
- 💾 **Управление устройствами** - Добавление, редактирование и удаление устройств
- 🔧 **Конфигурирование** - Применение команд конфигурации
- 📱 **Адаптивный дизайн** - Работает на всех устройствах
- 🚀 **Одноклчиковый запуск** - EXE файл со встроенным лаунчером

## Технологии

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **SSH**: Netmiko
- **UI**: Font Awesome, jQuery

## Быстрая установка

### Автоматическая установка (рекомендуется)

```bash
./setup.sh
```

### Ручная установка

```bash
# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск приложения
python app.py
```

### Запуск

После установки используйте:
```bash
./start.sh
```

Приложение будет доступно по адресу: http://localhost:5000

> 📖 **Подробное руководство по установке:** [INSTALL.md](INSTALL.md)

## Использование

### Добавление устройства

1. Перейдите на страницу "Устройства"
2. Нажмите "Добавить устройство"
3. Заполните данные:
   - Название устройства
   - IP адрес
   - Имя пользователя
   - Пароль
   - Тип устройства (Cisco IOS, IOS XE, NX-OS, ASA)
4. Нажмите "Добавить"

### Подключение к устройству

1. В списке устройств нажмите кнопку подключения (🔌)
2. Дождитесь установления соединения
3. При успешном подключении статус изменится на "Подключено"

### Выполнение команд

1. Перейдите на страницу конфигурации устройства
2. Используйте быстрые команды или введите собственную
3. Для команд конфигурации используйте соответствующее поле

### Использование шаблонов

1. Перейдите на страницу "Шаблоны"
2. Выберите нужный шаблон
3. Заполните переменные
4. Примените к устройству

## Поддерживаемые устройства

- Cisco IOS
- Cisco IOS XE  
- Cisco NX-OS
- Cisco ASA

## Шаблоны конфигурации

Приложение включает готовые шаблоны:

- **Базовая настройка** - hostname, пароли, баннер
- **Настройка VLAN** - создание и назначение VLAN
- **Настройка Trunk** - конфигурация trunk портов
- **Настройка SSH** - включение SSH доступа

## Безопасность

- Все пароли хранятся в зашифрованном виде
- SSH соединения используют стандартные методы аутентификации
- Поддержка HTTPS (настройка в переменных окружения)
- Тайм-ауты соединений для предотвращения зависания

## API

Приложение предоставляет REST API для интеграции:

- `GET /api/devices` - Список устройств
- `POST /api/devices` - Добавить устройство
- `POST /api/devices/{id}/connect` - Подключиться к устройству
- `POST /api/devices/{id}/command` - Выполнить команду
- `POST /api/devices/{id}/config` - Применить конфигурацию
- `GET /api/devices/{id}/status` - Статус устройства

## Структура проекта

```
cisco-cfg/
├── app.py                 # Основное приложение Flask
├── cisco_manager.py       # Модуль управления Cisco устройствами
├── requirements.txt       # Зависимости Python
├── devices.json          # База данных устройств (создается автоматически)
├── templates/            # HTML шаблоны
│   ├── base.html
│   ├── index.html
│   ├── devices.html
│   ├── configure.html
│   └── templates.html
└── static/               # Статические файлы
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

## Разработка

### Добавление новых шаблонов

Шаблоны определяются в методе `get_config_templates()` класса `CiscoManager`. Для добавления нового шаблона:

```python
'new_template': {
    'name': 'Название шаблона',
    'description': 'Описание шаблона',
    'commands': [
        'команда {переменная}',
        'другая команда {другая_переменная}'
    ]
}
```

### Добавление новых типов устройств

Поддержка новых типов устройств добавляется через библиотеку Netmiko. Обновите список в форме добавления устройства и убедитесь, что тип поддерживается Netmiko.

## Устранение неполадок

### Проблемы с подключением

1. Проверьте правильность IP адреса и портов
2. Убедитесь, что SSH включен на устройстве
3. Проверьте логин и пароль
4. Убедитесь, что нет блокировки брандмауэром

### Тайм-ауты

Увеличьте значения тайм-аутов в переменных окружения:
```
DEFAULT_SSH_TIMEOUT=30
DEFAULT_AUTH_TIMEOUT=30
```

### Ошибки команд

- Убедитесь, что команда корректна для данного типа устройства
- Проверьте права пользователя на выполнение команды
- Для команд конфигурации убедитесь, что пользователь имеет привилегии

## Лицензия

MIT License

## Поддержка

Для получения поддержки создайте issue в репозитории проекта.

## 📝 Changelog

### v1.2.0 (Текущая версия)
- 🌙 **Темный режим** с автоматическим определением системных настроек
- 🔘 **Кнопка переключения** темы в навигации
- ⌨️ **Горячие клавиши** Ctrl+Shift+T для переключения темы
- 📋 **Меню выбора темы** (Светлая/Темная/Автоматически)
- 💾 **Сохранение настроек** в localStorage браузера
- 🎨 **Плавные анимации** переходов между темами
- 🚀 **EXE лаунчер** для одноклчикового запуска
- 🖥️ **GUI интерфейс** установки и запуска
- ✅ **Автоматическая установка** всех зависимостей

### v1.1.0
- 🐛 Исправлена ошибка `regex_findall` в шаблонах
- 🔧 Улучшена система установки
- 📦 Добавлен скрипт `setup.sh`
- 🎨 Улучшен дизайн интерфейса

### v1.0.0
- 🎉 Первый релиз
- 🖥️ Основной функционал управления устройствами
- 🌐 Веб-интерфейс
- 📝 Шаблоны конфигурации
- 🔌 SSH подключения через Netmiko

## 🎯 Скриншоты

### Главная страница
- Современный дизайн с карточками
- Статистика устройств
- Быстрые действия

### Темный режим
- Автоматическое переключение
- Сохранение настроек
- Красивые градиенты

### Управление устройствами
- Список устройств
- Формы подключения
- Мониторинг статуса

## 🤝 Вклад в проект

Проект открыт для вклада! Создавайте Issues и Pull Requests.

### Как внести вклад:
1. Fork репозитория
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

- 🐛 **Баги:** Создайте Issue в репозитории
- 💡 **Предложения:** Pull Requests приветствуются
- 📧 **Вопросы:** Используйте Discussions

---

**⭐ Поставьте звезду проекту, если он вам полезен!**
