#!/bin/bash

# Скрипт для копирования uploads файлов на сервер
# Использование: ./scripts/deploy-uploads.sh

echo "Копирование uploads файлов на сервер..."

# Создаем директорию если не существует
mkdir -p public/uploads

# Копируем все файлы из локальной папки uploads
if [ -d "public/uploads" ]; then
    echo "Директория public/uploads существует"
    ls -la public/uploads/
else
    echo "Директория public/uploads не найдена"
fi

echo "Готово!"
