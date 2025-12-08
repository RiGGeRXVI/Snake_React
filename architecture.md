# Структура проекта

## Обзор
Проект будет реализован с двумя основными проектами:  
### snake-game - основное приложение  
### ui-library - библиотека переиспользуемых компонентов

## Структура snake-game
snake-game/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── components/
│   │   │   ├── SnakeCanvas/
│   │   │   ├── GameUI/
│   │   │   ├── Leaderboard/
│   │   │   └── Customization/
│   │   ├── pages/
│   │   │   ├── HomePage/
│   │   │   ├── GamePage/
│   │   │   ├── LeaderboardPage/
│   │   │   └── CustomizationPage/
│   │   ├── routes/
│   │   │   └── AppRouter.tsx
│   │   ├── services/
│   │   │   ├── socket.ts
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── gameHelpers.ts
│   │   ├── index.html
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── gameController.ts
│   │   │   └── leaderboardController.ts
│   │   ├── models/
│   │   │   └── leaderboard.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── gameService.ts
│   │   │   └── leaderboardService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   ├── types/
│   │   ├── game.ts
│   │   └── user.ts
│   └── utils/
│       └── constants.ts
├── package.json
└── README.md

## Используемые библиотеки

### Зависимости:
- `"react": "^19.2.0"` — UI библиотека  
- `"react-dom": "^19.2.0"` — рендеринг React-компонентов  
- `"react-router-dom": "^6.0.0"` — маршрутизация  
- `"socket.io-client": "^4.7.5"` — клиентская работа с WebSocket  
- `"socket.io": "^4.7.5"` — серверная работа с WebSocket  
- `typescript ~5.9.3` — статическая типизация  
- `vite ^7.1.11` — сборщик и dev-сервер  
- `eslint ^9.36.0` — линтинг кода  
- `jest ^30.2.0` — тестирование  
- express (^4.18.2): Серверная платформа на Node.js для REST и WebSocket
- cors (^2.8.5): Разрешение CORS-запросов от клиента к серверу в dev-среде

## Компоненты
 

### Client:
- **SnakeCanvas** — отрисовка поля и змей с помощью Canvas API  
- **GameUI** — панель управления игрой, счет, таймер, кнопки паузы  
- **Leaderboard** — таблица лидеров с ником и количеством побед  
- **Customization** — кастомизация внешнего вида змейки  
- **HomePage** — ввод ника пользователя  
- **GamePage** — игровой экран  
- **LeaderboardPage** — страница с таблицей лидеров  
- **CustomizationPage** — страница настройки змейки  

## Структура роутинга и отображаемых страниц
- Главная страница (`/`) — ввод никнейма  
- Страница игры (`/game`) — игровое поле с UI  
- Страница лидеров (`/leaderboard`) — таблица лидеров  
- Страница кастомизации (`/customization`) — настройка змейки
