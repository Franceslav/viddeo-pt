#!/bin/bash

# Скрипт для синхронизации uploads файлов
echo "Синхронизация uploads файлов..."

# Проверяем, существует ли папка uploads
if [ ! -d "public/uploads" ]; then
    echo "Создаем папку public/uploads"
    mkdir -p public/uploads
fi

# Копируем все файлы из локальной папки uploads
echo "Копирование файлов..."
cp -r public/uploads/* public/uploads/ 2>/dev/null || echo "Нет файлов для копирования"

# Устанавливаем правильные права доступа
chmod -R 644 public/uploads/* 2>/dev/null || echo "Нет файлов для изменения прав"

echo "Синхронизация завершена!"
echo "Файлов в папке uploads: $(ls -1 public/uploads/ | wc -l)"
