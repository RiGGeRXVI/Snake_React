import { isOpposite, stepSnake, type Dir } from './gameLogic'

import type { GameState } from '../types/game'

describe('isOpposite', () => {
  test.each<[Dir, Dir, boolean]>([
    ['UP', 'DOWN', true],
    ['DOWN', 'UP', true],
    ['LEFT', 'RIGHT', true],
    ['RIGHT', 'LEFT', true],
    ['UP', 'LEFT', false],
    ['UP', 'RIGHT', false],
    ['LEFT', 'DOWN', false]
  ])('isOpposite(%s, %s) = %s', (a, b, expected) => {
    expect(isOpposite(a, b)).toBe(expected)
  })
})

describe('stepSnake', () => {
  const baseState: GameState = {
    cols: 10,
    rows: 10,
    cellSize: 20,
    fruit: { x: 5, y: 5 },
    snakes: [
      {
        id: 1,
        color: '#00ff00',
        body: [
          { x: 2, y: 2 },
          { x: 1, y: 2 },
          { x: 0, y: 2 }
        ]
      },
      {
        id: 2,
        color: '#ff0000',
        body: [
          { x: 7, y: 7 },
          { x: 6, y: 7 },
          { x: 5, y: 7 }
        ]
      }
    ]
  }

  test('moves snake in given direction', () => {
    const next = stepSnake(baseState, 1, 'RIGHT')

    const snake = next.snakes.find((s) => s.id === 1)!

    expect(snake.body[0]).toEqual({ x: 3, y: 2 })
    expect(snake.body).toHaveLength(3)
  })

  test('does not move snake out of bounds', () => {
    const stateAtEdge: GameState = {
      ...baseState,
      snakes: [
        {
          id: 1,
          color: '#00ff00',
          body: [{ x: 0, y: 0 }]
        }
      ]
    }

    const next = stepSnake(stateAtEdge, 1, 'LEFT')

    expect(next).toBe(stateAtEdge)
  })

  test('snake grows when eating fruit', () => {
    const eatState: GameState = {
      ...baseState,
      fruit: { x: 3, y: 2 } // прямо перед головой
    }

    // зафиксируем random, чтобы тест был стабильным
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.1)

    const next = stepSnake(eatState, 1, 'RIGHT')

    const snake = next.snakes.find((s) => s.id === 1)!

    expect(snake.body).toHaveLength(4)
    expect(snake.body[0]).toEqual({ x: 3, y: 2 })

    spy.mockRestore()
  })

  test('fruit respawns to a free cell after being eaten', () => {
    const eatState: GameState = {
      ...baseState,
      fruit: { x: 3, y: 2 }
    }

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9)

    const next = stepSnake(eatState, 1, 'RIGHT')

    expect(next.fruit).not.toEqual(eatState.fruit)

    spy.mockRestore()
  })

  test('returns same state if snake id not found', () => {
    const next = stepSnake(baseState, 999 as 1, 'UP')

    expect(next).toBe(baseState)
  })
})
