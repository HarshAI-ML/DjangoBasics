#!/bin/bash
cd /home/azureuser/DjangoBasics/milkman
source venv/bin/activate
gunicorn --workers 3 --bind unix:/home/azureuser/DjangoBasics/milkman/milkman.sock milkman.wsgi:application
