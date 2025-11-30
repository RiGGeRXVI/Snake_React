import type { FC } from 'react'
import { Leaderboard } from '../../components/Leaderboard/Leaderboard'

export const LeaderboardPage: FC = () => {
  return (
    <section>
      <h1>Таблица лидеров</h1>
      <p>
        Здесь будет отображаться список лучших игроков, загрузка данных
        с сервера и фильтрация результатов
      </p>
      <Leaderboard />
    </section>
  )
}
export default LeaderboardPage