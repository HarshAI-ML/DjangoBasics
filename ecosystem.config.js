module.exports = {
  apps: [{
    name: "django",
    script: "/home/azureuser/DjangoBasics/milkman/venv/bin/python3",
    args: "manage.py runserver 0.0.0.0:8000",
    cwd: "/home/azureuser/DjangoBasics/milkman",
  }]
}
