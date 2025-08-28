#!/bin/bash
# Cisco Configuration Manager - Установка для Linux/macOS

echo "🔧 Cisco Configuration Manager - Установка"
echo "=========================================="

# Переход в директорию скрипта
cd "$(dirname "$0")"

# Определение ОС
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
else
    OS="Unix/Other"
fi

echo "🖥️  Операционная система: $OS"

# Проверка Python
echo ""
echo "🔍 Проверка Python..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PYTHON_VERSION=$(python3 --version 2>&1)
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PYTHON_VERSION=$(python --version 2>&1)
else
    echo "❌ Python не найден!"
    echo ""
    echo "💡 Установите Python 3.7+:"
    if [[ "$OS" == "Linux" ]]; then
        echo "   Ubuntu/Debian: sudo apt update && sudo apt install python3 python3-pip"
        echo "   CentOS/RHEL: sudo yum install python3 python3-pip"
        echo "   Fedora: sudo dnf install python3 python3-pip"
        echo "   Arch: sudo pacman -S python python-pip"
    elif [[ "$OS" == "macOS" ]]; then
        echo "   Homebrew: brew install python3"
        echo "   Или скачайте с https://python.org"
    fi
    exit 1
fi

echo "✅ $PYTHON_VERSION"

# Проверка версии Python
PYTHON_VERSION_NUM=$($PYTHON_CMD -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
REQUIRED_VERSION="3.7"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION_NUM" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Требуется Python 3.7 или выше, найден $PYTHON_VERSION_NUM"
    exit 1
fi

# Проверка pip
echo ""
echo "🔍 Проверка pip..."
if ! $PYTHON_CMD -m pip --version &> /dev/null; then
    echo "❌ pip не найден!"
    echo ""
    echo "💡 Установите pip:"
    if [[ "$OS" == "Linux" ]]; then
        echo "   Ubuntu/Debian: sudo apt install python3-pip"
        echo "   CentOS/RHEL: sudo yum install python3-pip"
    elif [[ "$OS" == "macOS" ]]; then
        echo "   pip обычно устанавливается с Python"
        echo "   Если нет: curl https://bootstrap.pypa.io/get-pip.py | python3"
    fi
    exit 1
fi

echo "✅ pip найден"

# Обновление pip
echo ""
echo "🔄 Обновление pip..."
$PYTHON_CMD -m pip install --user --upgrade pip --quiet

# Проверка файлов проекта
echo ""
echo "🔍 Проверка файлов проекта..."
REQUIRED_FILES=("app.py" "cisco_manager.py" "requirements.txt")

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Файл $file не найден!"
        exit 1
    else
        echo "✅ $file"
    fi
done

# Создание виртуального окружения (опционально)
read -p "Создать виртуальное окружение? (y/n): " create_venv
if [[ $create_venv =~ ^[Yy]$ ]]; then
    echo ""
    echo "📦 Создание виртуального окружения..."
    
    if [ -d "venv" ]; then
        echo "⚠️  Удаляем существующее виртуальное окружение..."
        rm -rf venv
    fi
    
    $PYTHON_CMD -m venv venv
    
    if [ $? -ne 0 ]; then
        echo "❌ Не удалось создать виртуальное окружение"
        echo "💡 Попробуйте установить python3-venv:"
        if [[ "$OS" == "Linux" ]]; then
            echo "   Ubuntu/Debian: sudo apt install python3-venv"
        fi
        exit 1
    fi
    
    echo "✅ Виртуальное окружение создано"
    
    # Активация виртуального окружения
    source venv/bin/activate
    echo "✅ Виртуальное окружение активировано"
    
    # Обновление pip в venv
    pip install --upgrade pip --quiet
fi

# Установка зависимостей
echo ""
echo "📥 Установка зависимостей..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    pip install -r requirements.txt
else
    $PYTHON_CMD -m pip install --user -r requirements.txt
fi

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    echo "💡 Проверьте подключение к интернету и права доступа"
    exit 1
fi

echo "✅ Зависимости установлены"

# Создание директорий
echo ""
echo "📁 Создание рабочих директорий..."
mkdir -p static/css static/js templates logs backups
echo "✅ Директории созданы"

# Создание .env файла
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️ Создание конфигурационного файла..."
    cat > .env << EOF
DEBUG=True
SECRET_KEY=cisco-config-secret-key-2024
HOST=0.0.0.0
PORT=5000
DEFAULT_SSH_TIMEOUT=20
DEFAULT_AUTH_TIMEOUT=20
MAX_CONCURRENT_CONNECTIONS=10
EOF
    echo "✅ Файл .env создан"
else
    echo "✅ Файл .env уже существует"
fi

# Создание скрипта запуска
echo ""
echo "📝 Создание скрипта быстрого запуска..."
cat > quick_start.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    python app.py
else
    python3 app.py 2>/dev/null || python app.py
fi
EOF

chmod +x quick_start.sh
echo "✅ Скрипт quick_start.sh создан"

# Делаем все .sh файлы исполняемыми
chmod +x *.sh

echo ""
echo "🎉 Установка завершена успешно!"
echo ""
echo "📋 Для запуска приложения:"
if [ -f "venv/bin/activate" ]; then
    echo "   ./quick_start.sh  (с виртуальным окружением)"
    echo "   или:"
    echo "   source venv/bin/activate && python app.py"
else
    echo "   ./start.sh"
    echo "   или:"
    echo "   python3 app.py"
fi
echo ""
echo "🌐 После запуска откройте: http://localhost:5000"
echo "📚 Документация: README.md"
echo ""

# Предложение запуска
read -p "Запустить приложение сейчас? (y/n): " start_now
if [[ $start_now =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Запуск приложения..."
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    $PYTHON_CMD app.py
fi
