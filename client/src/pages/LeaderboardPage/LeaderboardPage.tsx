import { useEffect, useState } from 'react'

import styles from './LeaderboardPage.module.css'

type Entry = {
  nickname: string
  wins: number
  games: number
}

const API_BASE = 'http://localhost:3001'

async function fetchLeaderboard(): Promise<Entry[]> {
  const r = await fetch(`${API_BASE}/leaderboard`)

  if (!r.ok) throw new Error('bad_response')

  const d: unknown = await r.json()

  if (
    typeof d === 'object' &&
    d !== null &&
    'list' in d &&
    Array.isArray((d as { list: unknown }).list)
  ) {
    return (d as { list: Entry[] }).list
  }

  return []
}

export function LeaderboardPage() {
  const [list, setList] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')

    try {
      const next = await fetchLeaderboard()

      setList(next)
    } catch {
      setError('Не удалось загрузить таблицу лидеров')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Важно: не вызываем load() внутри эффекта, чтобы линт не ругался
    const init = async () => {
      setLoading(true)
      setError('')

      try {
        const next = await fetchLeaderboard()

        setList(next)
      } catch {
        setError('Не удалось загрузить таблицу лидеров')
      } finally {
        setLoading(false)
      }
    }

    void init()
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.headRow}>
        <div>
          <h1 className={styles.title}>Таблица лидеров</h1>
          <p className={styles.subtitle}>Победы и количество сыгранных матчей (топ-20).</p>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={load} className={styles.btn}>
            Обновить
          </button>
        </div>
      </div>

      {loading && <div className={styles.card}>Загрузка…</div>}

      {error && (
        <div className={styles.card}>
          <p role="alert" className={styles.alert}>
            {error}
          </p>
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <div className={styles.card}>
          <p style={{ margin: 0 }} className={styles.muted}>
            Пока нет сыгранных матчей.
          </p>
        </div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Ник</th>
                <th className={styles.th}>Победы</th>
                <th className={styles.th}>Игры</th>
                <th className={styles.th}>Winrate</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e, idx) => {
                const winrate = e.games > 0 ? Math.round((e.wins / e.games) * 100) : 0

                return (
                  <tr key={e.nickname} className={styles.row}>
                    <td className={styles.td}>{idx + 1}</td>
                    <td className={styles.td}>
                      <span className={styles.nick}>{e.nickname}</span>
                    </td>
                    <td className={styles.td}>{e.wins}</td>
                    <td className={styles.td}>{e.games}</td>
                    <td className={styles.td}>{winrate}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
