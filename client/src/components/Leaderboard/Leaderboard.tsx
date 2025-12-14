import type { FC } from 'react'
import type { User } from '../../types'

const mockUsers: User[] = [
  { id: '1', name: 'Player1', score: 10 },
  { id: '2', name: 'Player2', score: 8 }
]

export const Leaderboard: FC = () => {
  return (
    <div>
      <ul>
        {mockUsers.map((user: User) => (
          <li key={user.id}>
            {user.name}: {user.score}
          </li>
        ))}
      </ul>
      <p>
        В будущем данные будут приходить с сервера по API
      </p>
    </div>
  )
}
