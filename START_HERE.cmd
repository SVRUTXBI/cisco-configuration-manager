@echo off
chcp 65001 >nul
title Cisco Configuration Manager - ЗАПУСК ЗДЕСЬ

echo.
echo ============================================
echo    🌐 CISCO CONFIGURATION MANAGER
echo ============================================
echo.

cd /d "%~dp0"

REM Проверка Python
echo 🔍 Проверка Python...
python --version
if errorlevel 1 (
    echo.
    echo ❌ ОШИБКА: Python не найден!
    echo.
    echo 💡 Установите Python с https://python.org
    echo    ✅ Обязательно отметьте "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

echo ✅ Python найден
echo.

REM Установка зависимостей одной командой
echo 📦 Установка зависимостей...
python -m pip install flask netmiko paramiko flask-cors python-dotenv werkzeug --quiet --upgrade
if errorlevel 1 (
    echo ❌ Ошибка установки. Попробуйте вручную:
    echo pip install flask netmiko paramiko flask-cors python-dotenv
    pause
    exit /b 1
)

echo ✅ Зависимости установлены
echo.

REM Создание конфигурации
echo ⚙️ Создание конфигурации...
if not exist ".env" (
    echo DEBUG=True > .env
    echo SECRET_KEY=cisco-config-secret-key-2024 >> .env
    echo HOST=127.0.0.1 >> .env
    echo PORT=5000 >> .env
)

REM Создание директорий
if not exist "static" mkdir static
if not exist "static\css" mkdir static\css  
if not exist "static\js" mkdir static\js
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

echo ✅ Конфигурация готова
echo.

echo ============================================
echo           🚀 ЗАПУСК ПРИЛОЖЕНИЯ
echo ============================================
echo.
echo 🌐 Приложение будет доступно:
echo    http://localhost:5000
echo.
echo 🔄 Запуск через 3 секунды...
echo    (для отмены нажмите Ctrl+C)
echo.

timeout /t 3

echo 🚀 Запускаю Flask приложение...
echo.

python app.py

echo.
echo 👋 Приложение остановлено
pause
