# Task Tracker

Пет-проєкт: канбан-дошка задач.

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + React Query + React Router
- **Backend:** Node.js + Express 5 + TypeScript + Prisma + PostgreSQL + JWT

## Структура
```
task-tracker/
├── docker-compose.yml   # PostgreSQL у Docker
├── server/              # backend  -> http://localhost:4000
└── client/              # frontend -> http://localhost:5173
```

## Запуск (3 термінали)
```bash
# 1. база
docker compose up -d

# 2. бекенд
cd server
npm install
npm run db:migrate
npm run dev

# 3. фронтенд
cd client
npm install
npm run dev
```
Відкрий http://localhost:5173
