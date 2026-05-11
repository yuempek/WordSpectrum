@echo off
echo Updating survey data...
python update_data.py
if %ERRORLEVEL% NEQ 0 (
    echo Error updating data!
) else (
    echo Update complete.
)
pause
