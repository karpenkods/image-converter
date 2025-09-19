# Copilot Instructions for AI Agents

## Архитектура и основные компоненты
- Проект — современное приложение на Next.js (App Router, SSR), TypeScript, Redux Toolkit (RTK Query), Material-UI.
- Основная логика UI и бизнес-логика разделены:
  - `src/app/` — роутинг, layout, API-роуты (например, `api/convert/route.ts` для серверной обработки изображений через Sharp).
  - `src/components/` — UI-компоненты (загрузка, предпросмотр, настройки, провайдеры).
  - `src/store/` — настройка Redux store, слайсы, RTK Query API (`store/api/imageApi.ts`).
  - `src/types/` — глобальные типы TypeScript.

## Ключевые паттерны и соглашения
- Используется RTK Query для асинхронных запросов и кэширования (см. `store/api/imageApi.ts`).
- Все настройки пользователя (например, тема, параметры конвертации) сохраняются в localStorage через хук `useLocalStorage`.
- UI построен на Material-UI, поддерживаются светлая/тёмная темы и мультиязычность (next-i18next).
- Для загрузки файлов — `react-dropzone`, для скачивания — `file-saver`.
- Конвертация PDF реализована через jsPDF и html2canvas на клиенте, Sharp — на сервере.

## Важные developer workflow
- Запуск разработки: `npm run dev` (использует Turbopack).
- Сборка production: `npm run build` → `npm start`.
- Линтинг: `npm run lint` (ESLint + Prettier).
- Все команды прописаны в `package.json`.
- SSR поддерживается по умолчанию, все API-роуты Next.js — серверные.

## Особенности и интеграции
- Поддержка drag&drop, адаптивный дизайн, сохранение настроек, переключение тем и языков.
- Все бизнес-операции с изображениями (resize, convert) делаются через API-роуты, UI только инициирует действия.
- Для расширения API добавляйте новые endpoints в `src/app/api/` и соответствующие RTK Query endpoints.

## Примеры
- Добавление нового формата конвертации: реализуйте обработку в `api/convert/route.ts`, добавьте опции в UI-компоненты и типы.
- Для новых настроек пользователя — добавьте ключ в `useLocalStorage` и обновите соответствующий компонент.

## Рекомендации
- Следуйте существующей структуре папок и паттернам RTK Query/Redux Toolkit.
- Используйте типы из `src/types/` для новых данных.
- Для UI — используйте компоненты Material-UI и существующие стили.

## Ключевые файлы
- `src/app/api/convert/route.ts` — серверная логика конвертации
- `src/components/` — основные UI-компоненты
- `src/store/` — Redux Toolkit и RTK Query
- `src/hooks/useLocalStorage.ts` — работа с localStorage

_Обновляйте этот файл при изменении архитектуры или паттернов!_
