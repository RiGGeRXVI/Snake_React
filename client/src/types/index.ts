export interface User {
  id: string
  name: string
  score: number
}

export interface GameState {
  score: number
  isRunning: boolean
}
