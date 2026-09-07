@echo off
title Email Spam Filter (Naive Bayes)
echo ========================================================
echo   Starting Email Spam Filter Web Server...
echo ========================================================
cd /d "%~dp0"
start http://localhost:5000
python app.py
pause
