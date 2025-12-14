import { Route, Routes } from 'react-router-dom'

import { RequireNickname } from './RequireNickname'
import { Layout } from '../components/Layout/Layout'
import { CustomizationPage } from '../pages/CustomizationPage/CustomizationPage'
import { GamePage } from '../pages/GamePage/GamePage'
import { HomePage } from '../pages/HomePage/HomePage'
import { LeaderboardPage } from '../pages/LeaderboardPage/LeaderboardPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>} 
      />

      <Route
        path="/customization"
        element={
          <RequireNickname>
            <Layout>
              <CustomizationPage />
            </Layout>
          </RequireNickname>
        }
      />

      <Route
        path="/game"
        element={
          <RequireNickname>
            <Layout>
              <GamePage />
            </Layout>
          </RequireNickname>
        }
      />

      <Route path="/leaderboard" element={
        <Layout>
          <LeaderboardPage />
        </Layout>} 
      />
    </Routes>
  )
}
