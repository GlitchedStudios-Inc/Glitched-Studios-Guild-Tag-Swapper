@echo off
echo Installing required packages

call npm install discord.js-selfbot-v13

call npm install axios

del Setup.bat

pause
