import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSocket, type MatchStart, type QueueStatus } from '../../services/socket'
import { profileStorage } from '../../services/profileStorage'
import { GameCanvas } from '../../components/GameCanvas/GameCanvas'
import type { GameState, Snake } from '../../types/game'
import styles from './GamePage.module.css'



export function GamePage() {

  const navigate = useNavigate()

  
    
  // ===== Профиль игрока =====
  const nickname = profileStorage.getNickname()
  const color = profileStorage.getColor()


  // ===== Состояние сети =====
  const [status, setStatus] = useState<QueueStatus>({ playersWaiting: 0 })
  const [match, setMatch] = useState<MatchStart | null>(null)


  // ===== Состояние игры ======
  const [game, setGame] = useState<GameState | null>(null)
  
  
  // ===== Ошибки =====
  const [error, setError] = useState<string>('')

  const [ended, setEnded] = useState<{ reason: string; winnerId: number | null } | null>(null)

  const endedRef = useRef<{ reason: string; winnerId: number | null } | null>(null)
  useEffect(() => {
    endedRef.current = ended
  }, [ended])

  const handleKey = useCallback((e: KeyboardEvent) => {
        const key = e.key.toLowerCase()

        const next =
            key === 'arrowup' || key === 'w' ? 'UP' :
            key === 'arrowdown' || key === 's' ? 'DOWN' :
            key === 'arrowleft' || key === 'a' ? 'LEFT' :
            key === 'arrowright' || key === 'd' ? 'RIGHT' :
            null

        if (!next) return
        e.preventDefault()

        
        getSocket().emit('input_dir', { dir: next })
        }, [])

  useEffect(() => {
  window.addEventListener('keydown', handleKey)
  return () => window.removeEventListener('keydown', handleKey)
}, [handleKey])


  useEffect(() => {
    const s = getSocket()

    const onQueueStatus = (payload: QueueStatus) => setStatus(payload)
    const onMatchStart = (payload: MatchStart) => {
    setMatch(payload)
    setEnded(null)
  endedRef.current = null


    // === инициализация состояния игры ===
    const cols = 28
    const rows = 18
    const cellSize = 24

    const p1 = payload.players.find((p) => p.id === 1)!
    const p2 = payload.players.find((p) => p.id === 2)!

    const snakes: Snake[] = [
        {
        id: 1,
        color: p1.color,
        body: [
            { x: 6, y: Math.floor(rows / 2) },
            { x: 5, y: Math.floor(rows / 2) },
            { x: 4, y: Math.floor(rows / 2) }
        ]
        },
        {
        id: 2,
        color: p2.color,
        body: [
            { x: cols - 7, y: Math.floor(rows / 2) },
            { x: cols - 6, y: Math.floor(rows / 2) },
            { x: cols - 5, y: Math.floor(rows / 2) }
        ]
        }
    ]

    setGame({
        cols,
        rows,
        cellSize,
        snakes,
        fruit: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) - 3 }
    })
    }

    

    const onError = (payload: { message: string }) => setError(payload.message)

    const onState = (payload: { state: Omit<GameState, 'cellSize'> }) => {
    setGame((prev) => {
      if (endedRef.current) return prev
      const cellSize = prev?.cellSize ?? 24
      return { ...payload.state, cellSize }
    })
    }

    const onMatchEnd = (payload: { reason: string; winnerId: number | null }) => {
      setEnded(payload)
    }


    s.on('queue_status', onQueueStatus)
    s.on('match_start', onMatchStart)
    s.on('error_message', onError)
    s.on('state', onState)
    s.on('match_end', onMatchEnd)


    // вступаем в очередь
    s.emit('queue_join', { nickname, color })

    return () => {
      s.off('queue_status', onQueueStatus)
      s.off('match_start', onMatchStart)
      s.off('error_message', onError)
      s.off('state', onState)
      s.off('match_end', onMatchEnd)

    }
  }, [nickname, color])

  const playAgain = () => {
    // сброс локального состояния
    setEnded(null)
    setMatch(null)
    setGame(null)
    setError('')

    // снова в очередь
    getSocket().emit('queue_join', {
      nickname: profileStorage.getNickname(),
      color: profileStorage.getColor()
    })
  }

  const goToResults = () => {
    navigate('/leaderboard')
  }


  if (error) {
    return (
      <div className={styles.root}>
        <h1 className={styles.title}>Игра</h1>
        <div className={styles.card}>
          <p role="alert" className={styles.alert}>{error}</p>
        </div>

      </div>
    )
  }

  if (!match) {
    return (
  <div className={styles.root}>
    <div>
      <h1 className={styles.title}>Игра</h1>
      <p className={styles.subtitle}>Ожидание начала игры…</p>
    </div>

    <div className={styles.card}>
      <p className={styles.row}>
        <span>
          <span className={styles.k}>Ник:</span> <span className={styles.v}>{nickname}</span>
        </span>
        <span>
          <span className={styles.k}>Цвет:</span>
          <span className={styles.dot} style={{ background: color }} />
        </span>
      </p>

      <p style={{ margin: '10px 0 0' }}>
        В очереди сейчас: <b>{status.playersWaiting}</b> / 2
      </p>

      <p style={{ margin: '6px 0 0', color: 'rgba(0,0,0,0.6)' }}>
        Открой второй браузер/инкогнито и зайди в игру под другим ником — матч стартует.
      </p>
    </div>
  </div>
)

  }

  const winnerName =
    ended && ended.winnerId
      ? match?.players.find((p) => p.id === ended.winnerId)?.nickname ?? 'Неизвестно'
      : null

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Матч начался!</h1>
      <p className={styles.subtitle}>Управление: WASD или стрелки</p>
      <p>
        Ты игрок #{match.yourPlayerId}
      </p>
      <ul>
        {match.players.map((p) => (
          <li key={p.id}>
            Игрок {p.id}: <b>{p.nickname}</b> <span style={{ display: 'inline-block', width: 12, height: 12, background: p.color, border: '1px solid #999' }} />
          </li>
        ))}
      </ul>
    {game && (
      <div className={styles.canvasFrame}>
          <GameCanvas state={game} />
      </div>
      )}
          {ended && (
      <div className={styles.card}>
        <h2 className={styles.endTitle}>Матч завершён</h2>

        <p style={{ margin: '0 0 6px' }}>
          Причина: <b>{ended.reason}</b>
        </p>

        <p style={{ margin: 0 }}>
          Победитель: {winnerName ? <b className={styles.v}>{winnerName}</b> : 'Ничья'}
        </p>

        <div className={styles.btnRow}>
          <button type="button" onClick={playAgain} className={styles.btnPrimary}>
            Сыграть снова
          </button>
          <button type="button" onClick={goToResults} className={styles.btnSecondary}>
            Перейти к результатам
          </button>
        </div>
      </div>
    )}
    </div>
  )
}
