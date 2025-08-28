#!/bin/bash
# Cisco Configuration Manager - Быстрый запуск

echo "🚀 Cisco Configuration Manager"
echo "============================"

cd "$(dirname "$0")"

# Попытка запуска с виртуальным окружением
if [ -f "venv/bin/activate" ]; then
    echo "🔄 Активация виртуального окружения..."
    source venv/bin/activate
    echo "🌐 Запуск на http://localhost:5000"
    python app.py
else
    # Запуск с системным Python
    echo "🌐 Запуск на http://localhost:5000"
    if command -v python3 &> /dev/null; then
        python3 app.py
    else
        python app.py
    fi
fi
