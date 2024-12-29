@echo off
echo Installing required packages

npm install discord.js-selfbot-v13

npm install axios

if exist Start.bat (
    echo Starting the bot
    start Start.bat
) else (
    echo Start.bat not found. Please ensure it exists in the same directory.
)

pause