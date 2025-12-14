export type Vec2 = { x: number; y: number }

export type Snake = {
  id: 1 | 2
  color: string
  body: Vec2[] // [0] = голова
}

export type GameState = {
  cols: number
  rows: number
  cellSize: number
  snakes: Snake[]
  fruit: Vec2
}
