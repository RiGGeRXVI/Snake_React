import type { ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'

import styles from './Layout.module.css'
import { profileStorage } from '../../services/profileStorage'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  const navigate = useNavigate()

  const nickname = profileStorage.getNickname().trim()
  const hasNick = nickname.length >= 2

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <button className={styles.navBtn} type="button" onClick={() => navigate('/')}>
            Домой
          </button>

          <button
            className={styles.navBtn}
            type="button"
            disabled={!hasNick}
            title={!hasNick ? 'Сначала подтвердите ник' : undefined}
            onClick={() => navigate('/customization')}
          >
            Кастомизация
          </button>

          <button
            className={styles.navBtn}
            type="button"
            disabled={!hasNick}
            title={!hasNick ? 'Сначала подтвердите ник' : undefined}
            onClick={() => navigate('/game')}
          >
            Игра
          </button>

          <button className={styles.navBtn} type="button" onClick={() => navigate('/leaderboard')}>
            Лидеры
          </button>
        </nav>

        <div className={styles.right}>
          <span className={styles.playerLabel}>Игрок:</span>
          <span className={styles.playerPill}>{hasNick ? nickname : '—'}</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>{children}</div>
      </main>
    </div>
  )
}
