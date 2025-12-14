# Структура проекта

## Обзор
Проект будет реализован с двумя основными проектами:  
### Client
### Server

## Общая структура репозитория
Snake_React/
├── client/
├── server/
├── package.json
└── README.md


## Структура client
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ColorPalette/
│   │   ├── GameCanvas/
│   │   ├── Layout/
│   │   └── SnakePreview/
│   ├── pages/
│   │   ├── HomePage/
│   │   ├── GamePage/
│   │   ├── LeaderboardPage/
│   │   └── CustomizationPage/
│   ├── routes/
│   │   └── AppRouter.tsx
│   ├── services/
│   │   ├── socket.ts
│   │   └── profileStorage.ts
│   ├── utils/
│   │   ├── colors.ts
│   │   └── gameLogic.ts
│   ├── types/
│   │   └── game.ts
│   ├── styles/
│   ├── main.tsx
│   └── App.tsx (может отсутствовать / не использоваться)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js

## Структура server
server/
├── src/
│   ├── gameLogic.ts
│   ├── server.ts
│   └── server.test.ts
├── package.json
├── tsconfig.json
├── jest.config.ts
└── eslint.config.js

## Используемые библиотеки

### Зависимости:
- `"react": "^19.2.0"` - UI библиотека  
- `"react-dom": "^19.2.0"` - рендеринг React-компонентов  
- `"react-router-dom": "^6.0.0"` - маршрутизация  
- `"socket.io-client": "^4.7.5"` - клиентская работа с WebSocket  
- `"socket.io": "^4.7.5"` - серверная работа с WebSocket  
- `typescript ~5.9.3` - статическая типизация  
- `vite ^7.1.11` - сборщик и dev-сервер  
- `eslint ^9.36.0` - линтинг кода  
- `jest ^30.2.0` - тестирование  
- `express ^4.18.2` - Серверная платформа на Node.js для REST и WebSocket
- `cors ^2.8.5`: Разрешение CORS-запросов от клиента к серверу в dev-среде

## Структура роутинга и отображаемых страниц
- Главная страница (`/`) — ввод никнейма  
- Страница игры (`/game`) — игровое поле с UI  
- Страница лидеров (`/leaderboard`) — таблица лидеров  
- Страница кастомизации (`/customization`) — настройка змейки
