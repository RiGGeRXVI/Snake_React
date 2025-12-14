import { render, screen } from '@testing-library/react'

import { SnakePreview } from './SnakePreview'

describe('SnakePreview', () => {
  test('renders 7 cells (1 head + 6 segments)', () => {
    render(<SnakePreview color="#22c55e" />)

    expect(screen.getAllByTitle('Голова')).toHaveLength(1)
    expect(screen.getAllByTitle('Сегмент')).toHaveLength(6)
  })

  test('applies provided color to head and segments', () => {
    render(<SnakePreview color="#123456" />)

    const head = screen.getByTitle('Голова')
    const segments = screen.getAllByTitle('Сегмент')

    expect(head).toHaveStyle({ background: '#123456' })

    for (const s of segments) {
      expect(s).toHaveStyle({ background: '#123456' })
    }
  })

  test('uses default size when not provided and custom size when provided', () => {
    render(<SnakePreview color="#22c55e" />)

    const headDefault = screen.getByTitle('Голова')

    expect(headDefault).toHaveStyle({ width: '18px', height: '18px' })
  })
})
