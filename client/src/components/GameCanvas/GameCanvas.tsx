import { useEffect, useMemo, useRef } from 'react'

import type { GameState } from '../../types/game'

type Props = {
  state: GameState
}

function draw(ctx: CanvasRenderingContext2D, s: GameState) {
  const { cols, rows, cellSize, snakes, fruit } = s
  const w = cols * cellSize
  const h = rows * cellSize

  // фон поля
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#111827'
  ctx.fillRect(0, 0, w, h)

  // сетка
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1

  for (let x = 0; x <= cols; x++) {
    ctx.beginPath()
    ctx.moveTo(x * cellSize + 0.5, 0)
    ctx.lineTo(x * cellSize + 0.5, h)
    ctx.stroke()
  }

  for (let y = 0; y <= rows; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * cellSize + 0.5)
    ctx.lineTo(w, y * cellSize + 0.5)
    ctx.stroke()
  }

  // фрукт
  ctx.fillStyle = '#ef4444'
  ctx.fillRect(fruit.x * cellSize + 2, fruit.y * cellSize + 2, cellSize - 4, cellSize - 4)

  // змейки
  for (const snake of snakes) {
    snake.body.forEach((seg, idx) => {
      ctx.fillStyle = snake.color
      const pad = idx === 0 ? 2 : 3

      ctx.fillRect(seg.x * cellSize + pad, seg.y * cellSize + pad, cellSize - pad * 2, cellSize - pad * 2)

      // небольшая “обводка” головы для читаемости
      if (idx === 0) {
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'
        ctx.strokeRect(seg.x * cellSize + pad, seg.y * cellSize + pad, cellSize - pad * 2, cellSize - pad * 2)
      }
    })
  }
}

export function GameCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const size = useMemo(() => {
    return {
      width: state.cols * state.cellSize,
      height: state.rows * state.cellSize
    }
  }, [state.cols, state.rows, state.cellSize])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    draw(ctx, state)
  }, [state])

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      style={{
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        display: 'block'
      }}
    />
  )
}
