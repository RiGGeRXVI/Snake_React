export type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Vec2 = { x: number; y: number }

export type Snake = {
  id: 1 | 2
  color: string
  body: Vec2[]
}

export type GameState = {
  cols: number
  rows: number
  snakes: Snake[]
  fruit: Vec2
}

export type MatchEndReason = 'wall' | 'self' | 'other' | 'head_to_head' | 'player_left'

export type StepResult =
  | { kind: 'state'; state: GameState }
  | { kind: 'end'; reason: MatchEndReason; winnerId: 1 | 2 | null; state: GameState }

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

export function hit(head: Vec2, body: Vec2[]): boolean {
  return body.some((p) => p.x === head.x && p.y === head.y)
}

export function outOfBounds(h: Vec2, cols: number, rows: number): boolean {
  return h.x < 0 || h.y < 0 || h.x >= cols || h.y >= rows
}

export function spawnFruit(cols: number, rows: number, occupied: Vec2[]): Vec2 {
  for (let i = 0; i < 500; i++) {
    const x = Math.floor(Math.random() * cols)
    const y = Math.floor(Math.random() * rows)

    if (!occupied.some((p) => p.x === x && p.y === y)) return { x, y }
  }

  return { x: Math.floor(cols / 2), y: Math.floor(rows / 2) }
}

export function step(state: GameState, dirs: Record<1 | 2, Dir>): StepResult {
  const moved: Snake[] = state.snakes.map((sn) => {
    const dv = dirVec[dirs[sn.id]]
    const head = sn.body[0]
    const nextHead = { x: head.x + dv.x, y: head.y + dv.y }
    const nextBody = [nextHead, ...sn.body.slice(0, sn.body.length - 1)]

    return { ...sn, body: nextBody }
  })

  const s1 = moved.find((s) => s.id === 1)!
  const s2 = moved.find((s) => s.id === 2)!
  const h1 = s1.body[0]
  const h2 = s2.body[0]

  const afterMove: GameState = { ...state, snakes: moved }

  // 1) стенки
  const o1 = outOfBounds(h1, state.cols, state.rows)
  const o2 = outOfBounds(h2, state.cols, state.rows)

  if (o1 && o2) return { kind: 'end', reason: 'wall', winnerId: null, state: afterMove }
  if (o1) return { kind: 'end', reason: 'wall', winnerId: 2, state: afterMove }
  if (o2) return { kind: 'end', reason: 'wall', winnerId: 1, state: afterMove }

  // 2) голова-в-голову
  if (h1.x === h2.x && h1.y === h2.y) {
    return { kind: 'end', reason: 'head_to_head', winnerId: null, state: afterMove }
  }

  // 3) удар в тело/самоудар
  const s1Self = hit(h1, s1.body.slice(1))
  const s2Self = hit(h2, s2.body.slice(1))
  const s1IntoS2 = hit(h1, s2.body)
  const s2IntoS1 = hit(h2, s1.body)

  if ((s1Self || s1IntoS2) && (s2Self || s2IntoS1)) {
    return { kind: 'end', reason: 'other', winnerId: null, state: afterMove }
  }
  if (s1Self) return { kind: 'end', reason: 'self', winnerId: 2, state: afterMove }
  if (s2Self) return { kind: 'end', reason: 'self', winnerId: 1, state: afterMove }
  if (s1IntoS2) return { kind: 'end', reason: 'other', winnerId: 2, state: afterMove }
  if (s2IntoS1) return { kind: 'end', reason: 'other', winnerId: 1, state: afterMove }

  // 4) фрукт + рост
  let fruit = state.fruit
  const ate1 = h1.x === fruit.x && h1.y === fruit.y
  const ate2 = h2.x === fruit.x && h2.y === fruit.y

  let snakesAfterFruit = moved

  if (ate1 || ate2) {
    snakesAfterFruit = moved.map((sn) => {
      const shouldGrow = (sn.id === 1 && ate1) || (sn.id === 2 && ate2)

      if (!shouldGrow) return sn

      const tail = sn.body[sn.body.length - 1]

      return { ...sn, body: [...sn.body, tail] }
    })

    const occupied = snakesAfterFruit.flatMap((s) => s.body)

    fruit = spawnFruit(state.cols, state.rows, occupied)
  }

  return { kind: 'state', state: { ...state, snakes: snakesAfterFruit, fruit } }
}
