@echo off
setlocal

echo.
echo === Flask To-Do App Setup ===
echo.

set "PYTHON_CMD="

where py >nul 2>nul
if %errorlevel%==0 (
    py -3.13 --version >nul 2>nul
    if %errorlevel%==0 (
        set "PYTHON_CMD=py -3.13"
    )
)

if not defined PYTHON_CMD (
    where python >nul 2>nul
    if %errorlevel%==0 (
        python --version >nul 2>nul
        if %errorlevel%==0 (
            set "PYTHON_CMD=python"
        )
    )
)

if not defined PYTHON_CMD (
    echo Python is not working from Command Prompt yet.
    echo.
    echo Most likely Windows is using the Microsoft Store alias instead of real Python.
    echo.
    echo Fix:
    echo 1. Open Windows Settings.
    echo 2. Search for: App execution aliases
    echo 3. Turn OFF python.exe and python3.exe
    echo 4. Install Python 3.13 from https://www.python.org/downloads/windows/
    echo 5. During install, check: Add python.exe to PATH
    echo 6. Close and reopen Command Prompt, then run this file again.
    echo.
    pause
    exit /b 1
)

echo Using Python command: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.

if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment: .venv
    %PYTHON_CMD% -m venv .venv
    if errorlevel 1 (
        echo Failed to create the virtual environment.
        pause
        exit /b 1
    )
) else (
    echo Virtual environment already exists: .venv
)

echo.
echo Installing Flask inside the virtual environment...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install Flask.
    pause
    exit /b 1
)

echo.
echo Starting the Flask app...
echo Open this address in your browser:
echo http://127.0.0.1:5000
echo.
".venv\Scripts\python.exe" app.py

endlocal
