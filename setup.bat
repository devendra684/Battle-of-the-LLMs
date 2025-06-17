@echo off
setlocal enabledelayedexpansion

:: Colors
set "GREEN=[32m"
set "YELLOW=[33m"
set "NC=[0m"

:: For Windows 10 and later, enable VT100 emulation for colors
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    if exist "%SystemRoot%\System32\VirtualTerminal.flag" (
        echo Enabling VT100 emulation...
        reg add HKCU\CONSOLE /f /v VirtualTerminalLevel /t REG_DWORD /d 1
    )
)

echo %YELLOW%Setting up LLM Summarizer Showdown...%NC%

:: Create virtual environment for backend
echo.
echo %GREEN%Setting up Python virtual environment...%NC%
python -m venv venv
call venv\Scripts\activate.bat

:: Install Python dependencies
echo.
echo %GREEN%Installing Python dependencies...%NC%
pip install --upgrade pip
pip install -r requirements.txt

:: Create .env file if it doesn't exist
if not exist ".env" (
    echo.
    echo %YELLOW%Creating .env file...%NC%
    (
        echo # OpenAI API Key (get it from https://platform.openai.com/account/api-keys)
        echo OPENAI_API_KEY=your_openai_api_key_here
        echo.
        echo # HuggingFace Token (get it from https://huggingface.co/settings/tokens)
        echo HUGGINGFACE_TOKEN=your_huggingface_token_here
    ) > .env
    echo %GREEN%.env file created. Please update it with your API keys.%NC%
) else (
    echo.
    echo %GREEN%.env file already exists.%NC%
)

:: Install Node.js dependencies
echo.
echo %GREEN%Installing Node.js dependencies...%NC%
cd frontend
call npm install

:: Create a .env file for the frontend
if not exist ".env" (
    echo.
    echo %YELLOW%Creating frontend .env file...%NC%
    echo REACT_APP_API_URL=http://localhost:8000 > .env
    echo %GREEN%Frontend .env file created.%NC%
) else (
    echo.
    echo %GREEN%Frontend .env file already exists.%NC%
)

:: Build the frontend
echo.
echo %GREEN%Building the frontend...%NC%
call npm run build

cd ..

echo.
echo %GREEN%Setup complete!%NC%
echo.
echo To start the application, open two separate command prompts and run:%NC%
echo 1. Backend: %YELLOW%call venv\Scripts\activate.bat && uvicorn backend.main:app --reload%NC%
echo 2. Frontend: %YELLOW%cd frontend && npm start%NC%
echo.
echo Then open your browser to: %YELLOW%http://localhost:3000%NC%

pause
