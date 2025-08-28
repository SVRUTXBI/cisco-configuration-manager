#!/bin/bash
# Cisco Configuration Manager - Запуск для Linux/macOS

echo "🌐 Cisco Configuration Manager - Запуск"
echo "======================================"

# Переход в директорию скрипта
cd "$(dirname "$0")"

# Проверка Python
echo "🔍 Проверка Python..."
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ Python не найден!"
        echo "💡 Установите Python 3.7+ из официального сайта python.org"
        echo "   или используйте менеджер пакетов:"
        echo "   Ubuntu/Debian: sudo apt install python3 python3-pip"
        echo "   CentOS/RHEL: sudo yum install python3 python3-pip"
        echo "   macOS: brew install python3"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
echo "✅ $PYTHON_VERSION найден"

# Проверка pip
echo "🔍 Проверка pip..."
if ! $PYTHON_CMD -m pip --version &> /dev/null; then
    echo "❌ pip не найден!"
    echo "💡 Установите pip:"
    echo "   Ubuntu/Debian: sudo apt install python3-pip"
    echo "   CentOS/RHEL: sudo yum install python3-pip"
    echo "   macOS: pip обычно идет с Python"
    exit 1
fi

echo "✅ pip найден"

# Проверка основных файлов
echo "🔍 Проверка файлов проекта..."
if [ ! -f "app.py" ]; then
    echo "❌ Файл app.py не найден!"
    exit 1
fi

if [ ! -f "cisco_manager.py" ]; then
    echo "❌ Файл cisco_manager.py не найден!"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    echo "❌ Файл requirements.txt не найден!"
    exit 1
fi

echo "✅ Файлы проекта найдены"

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."
$PYTHON_CMD -m pip install --user flask netmiko paramiko flask-cors python-dotenv werkzeug --quiet

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    echo "💡 Попробуйте вручную:"
    echo "   $PYTHON_CMD -m pip install --user flask netmiko paramiko flask-cors python-dotenv"
    exit 1
fi

echo "✅ Зависимости установлены"

# Создание директорий
echo ""
echo "📁 Создание рабочих директорий..."
mkdir -p static/css static/js logs backups
echo "✅ Директории созданы"

# Создание .env файла
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️ Создание конфигурационного файла..."
    cat > .env << EOF
DEBUG=True
SECRET_KEY=cisco-config-secret-key-2024
HOST=127.0.0.1
PORT=5000
EOF
    echo "✅ Файл .env создан"
fi

# Запуск приложения
echo ""
echo "======================================"
echo "         🚀 ЗАПУСК ПРИЛОЖЕНИЯ"
echo "======================================"
echo ""
echo "🌐 Приложение будет доступно:"
echo "   http://localhost:5000"
echo ""
echo "🔄 Для остановки нажмите Ctrl+C"
echo ""

$PYTHON_CMD app.py
