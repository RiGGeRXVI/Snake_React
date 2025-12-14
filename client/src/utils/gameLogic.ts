import type { GameState, Vec2 } from '../types/game'

export type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const dirVec: Record<Dir, Vec2> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

export function isOpposite(a: Dir, b: Dir): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  )
}

export function stepSnake(state: GameState, snakeId: 1 | 2, dir: Dir): GameState {
  const snake = state.snakes.find((s) => s.id === snakeId)

  if (!snake) return state

  const head = snake.body[0]
  const dv = dirVec[dir]
  const next = { x: head.x + dv.x, y: head.y + dv.y }

  // выход за поле = конец (пока просто “стопаем” движение)
  if (next.x < 0 || next.y < 0 || next.x >= state.cols || next.y >= state.rows) return state

  const ate = next.x === state.fruit.x && next.y === state.fruit.y

  const newBody = [next, ...snake.body]

  if (!ate) newBody.pop()

  const newSnakes = state.snakes.map((s) => (s.id === snakeId ? { ...s, body: newBody } : s))

  const newFruit = ate ? spawnFruit(state, newSnakes.flatMap((s) => s.body)) : state.fruit

  return { ...state, snakes: newSnakes, fruit: newFruit }
}

function spawnFruit(state: GameState, occupied: Vec2[]): Vec2 {
  // простая попытка найти свободную клетку
  for (let i = 0; i < 300; i++) {
    const x = Math.floor(Math.random() * state.cols)
    const y = Math.floor(Math.random() * state.rows)

    if (!occupied.some((p) => p.x === x && p.y === y)) return { x, y }
  }

  return state.fruit
}
