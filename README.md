<div align="center">

# 🌐 Cisco Configuration Manager

**Современное веб-приложение для управления конфигурацией Cisco устройств**

[![Version](https://img.shields.io/badge/version-1.2.1-blue.svg)](https://github.com/SVRUTXBI/cisco-configuration-manager/releases)
[![Python](https://img.shields.io/badge/python-3.7+-green.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.3+-red.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)](https://github.com/SVRUTXBI/cisco-configuration-manager)

[🚀 Быстрый старт](#-быстрый-старт) • [📖 Документация](#-возможности) • [🔧 API](#-api) • [🤝 Вклад](#-вклад-в-проект)

</div>

## 🚀 Быстрый старт

### 🪟 **Windows**

```bash
# 1. Скачайте проект
git clone https://github.com/SVRUTXBI/cisco-configuration-manager.git
cd cisco-configuration-manager

# 2. Запустите одним кликом
START_HERE.cmd
```

**Или просто дважды кликните на `START_HERE.cmd`** 🖱️

### 🐧 **Linux**

```bash
# 1. Клонирование репозитория
git clone https://github.com/SVRUTXBI/cisco-configuration-manager.git
cd cisco-configuration-manager

# 2. Автоматическая установка
chmod +x setup.sh start.sh
./setup.sh

# 3. Запуск
./start.sh
```

### 🍎 **macOS**

```bash
# 1. Установка через Homebrew (рекомендуется)
brew install python3 git

# 2. Клонирование и установка
git clone https://github.com/SVRUTXBI/cisco-configuration-manager.git
cd cisco-configuration-manager
./setup.sh && ./start.sh
```

### 🐳 **Docker (все платформы)**

```bash
# Скоро будет доступен!
docker run -p 5000:5000 svrutxbi/cisco-configuration-manager
```

---

## 📋 Системные требования

| Компонент | Минимум | Рекомендуется |
|-----------|---------|---------------|
| **Python** | 3.7+ | 3.9+ |
| **RAM** | 512MB | 1GB+ |
| **Место на диске** | 100MB | 500MB+ |
| **Сеть** | SSH доступ к устройствам | - |

---

## 🎯 Поддерживаемые устройства

<div align="center">

| Тип устройства | Поддержка | Тестировано |
|----------------|-----------|-------------|
| **Cisco IOS** | ✅ | ✅ |
| **Cisco IOS XE** | ✅ | ✅ |  
| **Cisco NX-OS** | ✅ | ⚠️ |
| **Cisco ASA** | ✅ | ⚠️ |

</div>

---

## 📖 Использование

### 1️⃣ **Добавление устройства**

<details>
<summary>Нажмите для просмотра инструкций</summary>

1. Откройте веб-интерфейс: `http://localhost:5000`
2. Перейдите в раздел **"Устройства"**
3. Нажмите **"Добавить устройство"**
4. Заполните форму:
   - **Название**: `Router-01`
   - **IP адрес**: `192.168.1.1`
   - **Логин**: `admin`
   - **Пароль**: `password`
   - **Тип**: `cisco_ios`
5. Нажмите **"Добавить"**

</details>

### 2️⃣ **Подключение и команды**

<details>
<summary>Нажмите для просмотра инструкций</summary>

1. В списке устройств нажмите кнопку **🔌 Подключиться**
2. Дождитесь статуса **"Подключено"**
3. Нажмите **🖥️ Команды** для выполнения команд
4. Введите команду: `show version`
5. Получите результат в реальном времени

</details>

### 3️⃣ **Использование шаблонов**

<details>
<summary>Нажмите для просмотра инструкций</summary>

1. Перейдите в раздел **"Шаблоны"**
2. Выберите шаблон, например **"Базовая настройка"**
3. Заполните переменные:
   - `hostname`: `Router-01`
   - `enable_password`: `secret123`
4. Примените к устройству

</details>

---

## 🔧 API

Полный REST API для интеграции с внешними системами:

### Устройства
```http
GET    /api/devices              # Список устройств
POST   /api/devices              # Добавить устройство
DELETE /api/devices/{id}         # Удалить устройство
POST   /api/devices/{id}/connect # Подключиться
GET    /api/devices/{id}/status  # Статус устройства
```

### Команды
```http
POST   /api/devices/{id}/command # Выполнить команду
POST   /api/devices/{id}/config  # Применить конфигурацию
```

### Шаблоны
```http
GET    /api/templates                 # Список шаблонов
POST   /api/devices/{id}/template     # Применить шаблон
```

<details>
<summary>📝 Примеры использования API</summary>

```bash
# Получить список устройств
curl -X GET http://localhost:5000/api/devices

# Добавить устройство
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Router-01",
    "ip": "192.168.1.1",
    "username": "admin",
    "password": "password",
    "device_type": "cisco_ios"
  }'

# Выполнить команду
curl -X POST http://localhost:5000/api/devices/{id}/command \
  -H "Content-Type: application/json" \
  -d '{"command": "show version"}'
```

</details>

---

## 🎨 Шаблоны конфигурации

Готовые шаблоны для быстрой настройки:

| Шаблон | Описание | Переменные |
|--------|----------|------------|
| **basic_setup** | Базовая настройка устройства | `hostname`, `enable_password` |
| **vlan_setup** | Создание и настройка VLAN | `vlan_id`, `vlan_name`, `interface` |
| **trunk_setup** | Настройка trunk портов | `interface`, `allowed_vlans` |

---

## 🛠️ Разработка

### Локальная разработка

```bash
# 1. Клонирование
git clone https://github.com/SVRUTXBI/cisco-configuration-manager.git
cd cisco-configuration-manager

# 2. Виртуальное окружение
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# 3. Зависимости
pip install -r requirements.txt

# 4. Запуск в режиме разработки
export FLASK_ENV=development
python app.py
```

### Структура проекта

```
cisco-configuration-manager/
├── 📁 static/          # Статические файлы (CSS, JS)
├── 📁 templates/       # HTML шаблоны
├── 📄 app.py          # Основное Flask приложение
├── 📄 cisco_manager.py # Модуль управления устройствами
├── 📄 requirements.txt # Python зависимости
├── 📄 devices.json    # База данных устройств
└── 📜 README.md       # Документация
```

### Добавление новых шаблонов

```python
# В cisco_manager.py добавьте в метод get_config_templates():
'new_template': {
    'name': 'Название шаблона',
    'description': 'Описание',
    'commands': [
        'команда {переменная}',
        'другая команда {другая_переменная}'
    ]
}
```

---

## 🔒 Безопасность

- ✅ Пароли хранятся в зашифрованном виде
- ✅ SSH соединения с проверкой ключей
- ✅ Тайм-ауты для предотвращения зависания
- ✅ Валидация всех входных данных
- ✅ Логирование всех операций

---

## 🐛 Устранение неполадок

<details>
<summary><strong>Проблемы с подключением к устройствам</strong></summary>

**Симптомы:** Тайм-ауты, ошибки аутентификации

**Решения:**
1. Проверьте доступность устройства: `ping IP_ADDRESS`
2. Убедитесь что SSH включен на устройстве
3. Проверьте правильность логина/пароля
4. Проверьте настройки брандмауэра

</details>

<details>
<summary><strong>Приложение не запускается</strong></summary>

**Симптомы:** Ошибки при запуске Python

**Решения:**
1. Проверьте версию Python: `python --version` (нужен 3.7+)
2. Установите зависимости: `pip install -r requirements.txt`
3. Проверьте порт 5000: `netstat -an | grep 5000`

</details>

<details>
<summary><strong>Проблемы с кодировкой на Windows</strong></summary>

**Симптомы:** Кракозябры в консоли

**Решения:**
1. Используйте `START_HERE.cmd` (кодировка исправлена)
2. Или выполните в cmd: `chcp 65001`

</details>

---

## 📊 Статистика проекта

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/SVRUTXBI/cisco-configuration-manager)
![GitHub code size](https://img.shields.io/github/languages/code-size/SVRUTXBI/cisco-configuration-manager)
![Lines of code](https://img.shields.io/tokei/lines/github/SVRUTXBI/cisco-configuration-manager)

</div>

---

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! 

### Как помочь:

1. 🍴 **Fork** репозитория
2. 🔀 Создайте **ветку** для новой функции: `git checkout -b feature/amazing-feature`
3. 💻 Внесите **изменения** и добавьте тесты
4. 📝 Создайте **коммит**: `git commit -m 'Add amazing feature'`
5. 📤 **Push** в ветку: `git push origin feature/amazing-feature`
6. 🔀 Создайте **Pull Request**

### Или просто:

- 🐛 Сообщите об ошибках в [Issues](https://github.com/SVRUTXBI/cisco-configuration-manager/issues)
- 💡 Предложите новые функции
- ⭐ Поставьте звезду проекту
- 📢 Расскажите друзьям

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT**. Подробности в файле [LICENSE](LICENSE).

---

## 🙏 Благодарности

- [Flask](https://flask.palletsprojects.com/) - веб-фреймворк
- [Netmiko](https://github.com/ktbyers/netmiko) - SSH подключения к сетевым устройствам
- [Bootstrap](https://getbootstrap.com/) - CSS фреймворк
- [Font Awesome](https://fontawesome.com/) - иконки

---

<div align="center">

### 🌟 Поставьте звезду, если проект оказался полезным!

[![GitHub stars](https://img.shields.io/github/stars/SVRUTXBI/cisco-configuration-manager.svg?style=social&label=Star)](https://github.com/SVRUTXBI/cisco-configuration-manager/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/SVRUTXBI/cisco-configuration-manager.svg?style=social&label=Fork)](https://github.com/SVRUTXBI/cisco-configuration-manager/network/members)

**[⬆ Наверх](#-cisco-configuration-manager)**

</div>
