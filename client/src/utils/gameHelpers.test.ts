import { calculateNextScore } from './gameHelpers'

test('calculateNextScore увеличивает счёт на 1', () => {
  const result = calculateNextScore(5)
  expect(result).toBe(6)
})
