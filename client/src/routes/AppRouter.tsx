import type { FC } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { HomePage } from '../pages/HomePage/HomePage'
import { GamePage } from '../pages/GamePage/GamePage'
import { LeaderboardPage } from '../pages/LeaderboardPage/LeaderboardPage'
import { CustomizationPage } from '../pages/CustomizationPage/CustomizationPage'

export const AppRouter: FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/game">Игра</Link>
            </li>
            <li>
              <Link to="/leaderboard">Таблица лидеров</Link>
            </li>
            <li>
              <Link to="/customization">Кастомизация</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/customization" element={<CustomizationPage />} />
        </Routes>
      </main>
    </div>
  )
}
