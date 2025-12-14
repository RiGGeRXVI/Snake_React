import http from 'http'

import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'

import { isOpposite, step } from './gameLogic.js'

import type { Dir, GameState, MatchEndReason } from './gameLogic.js'

type PlayerInfo = {
  socketId: string
  nickname: string
  color: string
}

type Match = {
  players: { socketId: string; id: 1 | 2 }[]
  dir: Record<1 | 2, Dir>
  pendingDir: Partial<Record<1 | 2, Dir>>
  state: GameState
  timer: NodeJS.Timeout
  
}

let match: Match | null = null

type LeaderboardEntry = {
  nickname: string
  wins: number
  games: number
}

const leaderboard = new Map<string, LeaderboardEntry>()

function endMatch(io: Server, reason: MatchEndReason, winnerId: 1 | 2 | null) {
  if (!match) return
  clearInterval(match.timer)

  const p1Socket = match.players.find((p) => p.id === 1)!.socketId
  const p2Socket = match.players.find((p) => p.id === 2)!.socketId

  const s1 = io.sockets.sockets.get(p1Socket)
  const s2 = io.sockets.sockets.get(p2Socket)

  const n1 = typeof s1?.data?.nickname === 'string' ? s1.data.nickname : 'Player1'
  const n2 = typeof s2?.data?.nickname === 'string' ? s2.data.nickname : 'Player2'

  const update = (nick: string, won: boolean) => {
    const cur = leaderboard.get(nick) ?? { nickname: nick, wins: 0, games: 0 }
    const next = { ...cur, games: cur.games + 1, wins: cur.wins + (won ? 1 : 0) }

    leaderboard.set(nick, next)
  }

  update(n1, winnerId === 1)
  update(n2, winnerId === 2)

  for (const pl of match.players) {
    io.to(pl.socketId).emit('match_end', { reason, winnerId })
  }

  match = null
}

const app = express()

app.use(cors())

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
})

let queue: PlayerInfo[] = []

function broadcastQueueStatus() {
  io.emit('queue_status', { playersWaiting: queue.length })
}

io.on('connection', (socket) => {
  socket.on('queue_join', (payload: { nickname: string; color: string }) => {
    const nickname = (payload?.nickname ?? '').trim()
    const color = (payload?.color ?? '').trim() || '#22c55e'

    if (nickname.length < 2) {
      socket.emit('error_message', { message: 'Nickname is required (min 2 chars).' })

      return
    }

    socket.data.nickname = nickname
    socket.data.color = color

    if (queue.some((p) => p.socketId === socket.id)) {
      socket.emit('queue_status', { playersWaiting: queue.length })

      return
    }

    queue.push({ socketId: socket.id, nickname, color })
    broadcastQueueStatus()

    // если набралось 2 игрока — стартуем матч
    if (queue.length >= 2) {
      const p1 = queue.shift()!
      const p2 = queue.shift()!

      io.to(p1.socketId).emit('match_start', {
        yourPlayerId: 1,
        players: [
          { id: 1, nickname: p1.nickname, color: p1.color },
          { id: 2, nickname: p2.nickname, color: p2.color }
        ]
      })

      io.to(p2.socketId).emit('match_start', {
        yourPlayerId: 2,
        players: [
          { id: 1, nickname: p1.nickname, color: p1.color },
          { id: 2, nickname: p2.nickname, color: p2.color }
        ]
      })

      // --- создаём матч и запускаем серверный тик ---
      const cols = 28
      const rows = 18

      match = {
        players: [
          { socketId: p1.socketId, id: 1 },
          { socketId: p2.socketId, id: 2 }
        ],
        dir: { 1: 'RIGHT', 2: 'LEFT' },
        pendingDir: {},
        state: {
          cols,
          rows,
          snakes: [
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
          ],
          fruit: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) - 3 }
        },
        timer: setInterval(() => {
          if (!match) return
          const d1 = match.pendingDir[1]
          const d2 = match.pendingDir[2]

          if (d1 && !isOpposite(match.dir[1], d1)) match.dir[1] = d1
          if (d2 && !isOpposite(match.dir[2], d2)) match.dir[2] = d2

          match.pendingDir = {}
          const res = step(match.state, match.dir)

          if (res.kind === 'end') {
            // отправим финальный кадр
            for (const pl of match.players) {
              io.to(pl.socketId).emit('state', { state: res.state })
            }
            endMatch(io, res.reason, res.winnerId)

            return
          }

          match.state = res.state

          for (const pl of match.players) {
            io.to(pl.socketId).emit('state', { state: match.state })
          }
        }, 180)

      }

      broadcastQueueStatus()
    }
  })

  socket.on('input_dir', (payload: { dir: Dir }) => {
    if (!match) return

    const player = match.players.find((p) => p.socketId === socket.id)

    if (!player) return

    const next = payload.dir
    const id = player.id

    if (match.pendingDir[id]) return

    const cur = match.dir[id]

    if (isOpposite(cur, next)) return

    match.pendingDir[id] = next
  })

  socket.on('disconnect', () => {
    const before = queue.length

    queue = queue.filter((p) => p.socketId !== socket.id)
    if (queue.length !== before) broadcastQueueStatus()

    // если игрок был в матче — останавливаем матч (MVP: один матч)
    if (match && match.players.some((p) => p.socketId === socket.id)) {
      endMatch(io, 'player_left', null)
    }       
  })
})

app.get('/health', (_req, res) => res.json({ ok: true }))
app.get('/leaderboard', (_req, res) => {
  const list = Array.from(leaderboard.values())
    .sort((a, b) => b.wins - a.wins || b.games - a.games)
    .slice(0, 20)

  res.json({ list })
})

const PORT = Number(process.env.PORT ?? 3001)

export function start(port: number = PORT) {
  return httpServer.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

if (process.env.NODE_ENV !== 'test') {
  start()
}
