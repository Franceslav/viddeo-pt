# Инструкции по деплою

## После git pull на сервере:

```bash
# 1. Установить зависимости
npm install

# 2. Синхронизировать uploads файлы
chmod +x scripts/sync-uploads.sh
./scripts/sync-uploads.sh

# 3. Собрать проект
npm run build -- --no-lint

# 4. Перезапустить PM2
pm2 restart viddeo-pt
```

## Проверка uploads файлов:

```bash
# Проверить количество файлов
ls -la public/uploads/ | wc -l

# Проверить права доступа
ls -la public/uploads/

# Проверить доступность файла
curl -I http://localhost:3000/uploads/[filename]
```

## Если изображения не загружаются:

1. Проверить, что папка `public/uploads/` существует
2. Проверить права доступа к файлам (644)
3. Проверить конфигурацию Next.js в `next.config.ts`
4. Проверить логи PM2: `pm2 logs viddeo-pt`
