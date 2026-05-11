#!/bin/bash
echo "Updating survey data..."
python3 update_data.py || python update_data.py
if [ $? -eq 0 ]; then
    echo "Update complete."
else
    echo "Error updating data!"
fi
read -p "Press enter to exit..."
