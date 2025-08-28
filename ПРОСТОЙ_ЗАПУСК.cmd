@echo off
chcp 65001 >nul

echo CISCO CONFIGURATION MANAGER
echo ============================

cd /d "%~dp0"

pip install flask netmiko paramiko flask-cors python-dotenv --quiet

if not exist ".env" echo SECRET_KEY=secret > .env

echo.
echo Запуск на http://localhost:5000
echo.

python app.py

pause
