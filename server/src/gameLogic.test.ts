import {
  hit,
  isOpposite,
  outOfBounds,
  spawnFruit,
  step,
  type Dir,
  type GameState
} from './gameLogic'

const oppositeCases = [
  ['UP', 'DOWN', true],
  ['DOWN', 'UP', true],
  ['LEFT', 'RIGHT', true],
  ['RIGHT', 'LEFT', true],
  ['UP', 'LEFT', false],
  ['RIGHT', 'UP', false]
] as const satisfies ReadonlyArray<readonly [Dir, Dir, boolean]>

function makeState(partial?: Partial<GameState>): GameState {
  return {
    cols: 10,
    rows: 10,
    fruit: { x: 5, y: 5 },
    snakes: [
      { id: 1, color: '#0f0', body: [{ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }] },
      { id: 2, color: '#f00', body: [{ x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }] }
    ],
    ...partial
  }
}

describe('gameLogic', () => {
  describe('isOpposite', () => {
    test.each(oppositeCases)('isOpposite(%s, %s) => %s', (a, b, expected) => {
      expect(isOpposite(a, b)).toBe(expected)
    })
  })

  describe('hit', () => {
    test('returns true when head equals some body point', () => {
      expect(hit({ x: 1, y: 2 }, [{ x: 0, y: 0 }, { x: 1, y: 2 }])).toBe(true)
    })

    test('returns false when head is not in body', () => {
      expect(hit({ x: 9, y: 9 }, [{ x: 0, y: 0 }, { x: 1, y: 2 }])).toBe(false)
    })
  })

  describe('outOfBounds', () => {
    test('detects borders correctly', () => {
      expect(outOfBounds({ x: -1, y: 0 }, 10, 10)).toBe(true)
      expect(outOfBounds({ x: 0, y: -1 }, 10, 10)).toBe(true)
      expect(outOfBounds({ x: 10, y: 0 }, 10, 10)).toBe(true)
      expect(outOfBounds({ x: 0, y: 10 }, 10, 10)).toBe(true)

      expect(outOfBounds({ x: 0, y: 0 }, 10, 10)).toBe(false)
      expect(outOfBounds({ x: 9, y: 9 }, 10, 10)).toBe(false)
    })
  })

  describe('spawnFruit', () => {
    test('returns a position inside field and not occupied (deterministic random)', () => {
      const spy = jest.spyOn(Math, 'random')

      spy.mockReturnValueOnce(0.1).mockReturnValueOnce(0.2) // (1,2)

      const occupied = [{ x: 0, y: 0 }, { x: 3, y: 3 }]
      const pos = spawnFruit(10, 10, occupied)

      expect(pos).toEqual({ x: 1, y: 2 })
      spy.mockRestore()
    })

    test('tries again if first generated cell is occupied', () => {
      const spy = jest.spyOn(Math, 'random')

      spy
        .mockReturnValueOnce(0.1).mockReturnValueOnce(0.2) // (1,2) occupied
        .mockReturnValueOnce(0.4).mockReturnValueOnce(0.5) // (4,5) free

      const occupied = [{ x: 1, y: 2 }]
      const pos = spawnFruit(10, 10, occupied)

      expect(pos).toEqual({ x: 4, y: 5 })
      spy.mockRestore()
    })
  })

  describe('step - endings', () => {
    test('ends with wall when snake 1 goes out of bounds', () => {
      const state = makeState({
        cols: 3,
        rows: 3,
        snakes: [
          { id: 1, color: 'g', body: [{ x: 0, y: 0 }] },
          { id: 2, color: 'r', body: [{ x: 1, y: 1 }] }
        ]
      })

      const res = step(state, { 1: 'LEFT', 2: 'UP' })

      expect(res.kind).toBe('end')

      if (res.kind === 'end') {
        expect(res.reason).toBe('wall')
        expect(res.winnerId).toBe(2)
      }
    })

    test('ends with head_to_head when heads meet on same cell', () => {
      const state = makeState({
        snakes: [
          { id: 1, color: 'g', body: [{ x: 4, y: 5 }] },
          { id: 2, color: 'r', body: [{ x: 6, y: 5 }] }
        ]
      })

      const res = step(state, { 1: 'RIGHT', 2: 'LEFT' })

      expect(res.kind).toBe('end')

      if (res.kind === 'end') {
        expect(res.reason).toBe('head_to_head')
        expect(res.winnerId).toBeNull()
      }
    })

    test('ends with self when snake hits its own body', () => {
      const state = makeState({
        snakes: [
          {
            id: 1,
            color: 'g',
            body: [{ x: 2, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 0 }]
          },
          { id: 2, color: 'r', body: [{ x: 7, y: 7 }] }
        ]
      })

      const res = step(state, { 1: 'UP', 2: 'UP' })

      expect(res.kind).toBe('end')

      if (res.kind === 'end') {
        expect(res.reason).toBe('self')
        expect(res.winnerId).toBe(2)
      }
    })

    test('ends with other when snake1 head hits snake2 body', () => {
      const state = makeState({
        snakes: [
          { id: 1, color: 'g', body: [{ x: 4, y: 4 }] },
          { id: 2, color: 'r', body: [{ x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }] }
        ]
      })

      const res = step(state, { 1: 'RIGHT', 2: 'UP' })

      expect(res.kind).toBe('end')

      if (res.kind === 'end') {
        expect(res.reason).toBe('other')
        expect(res.winnerId).toBe(2)
      }
    })
  })

  describe('step - fruit & growth', () => {
    test('grows snake when it eats fruit and respawns fruit', () => {
      const state = makeState({
        fruit: { x: 3, y: 2 },
        snakes: [
          { id: 1, color: 'g', body: [{ x: 2, y: 2 }, { x: 1, y: 2 }] },
          { id: 2, color: 'r', body: [{ x: 7, y: 7 }, { x: 8, y: 7 }] }
        ]
      })

      const spy = jest.spyOn(Math, 'random')

      spy.mockReturnValue(0.99) // (9,9)

      const res = step(state, { 1: 'RIGHT', 2: 'LEFT' })

      expect(res.kind).toBe('state')

      if (res.kind === 'state') {
        const s1 = res.state.snakes.find((s) => s.id === 1)!

        expect(s1.body[0]).toEqual({ x: 3, y: 2 })
        expect(s1.body).toHaveLength(3)
        expect(res.state.fruit).not.toEqual({ x: 3, y: 2 })
      }

      spy.mockRestore()
    })

    test('does not grow when fruit not eaten', () => {
      const state = makeState({
        fruit: { x: 9, y: 9 },
        snakes: [
          { id: 1, color: 'g', body: [{ x: 2, y: 2 }, { x: 1, y: 2 }] },
          { id: 2, color: 'r', body: [{ x: 7, y: 7 }, { x: 8, y: 7 }] }
        ]
      })

      const res = step(state, { 1: 'RIGHT', 2: 'LEFT' })

      expect(res.kind).toBe('state')

      if (res.kind === 'state') {
        const s1 = res.state.snakes.find((s) => s.id === 1)!

        expect(s1.body).toHaveLength(2)
        expect(res.state.fruit).toEqual({ x: 9, y: 9 })
      }
    })
  })
})
