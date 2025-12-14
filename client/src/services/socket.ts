import { io, type Socket } from 'socket.io-client'

export type QueueStatus = { playersWaiting: number }
export type MatchPlayer = { id: 1 | 2; nickname: string; color: string }
export type MatchStart = { yourPlayerId: 1 | 2; players: MatchPlayer[] }

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:3001', { transports: ['websocket'] })
  }

  return socket
}
