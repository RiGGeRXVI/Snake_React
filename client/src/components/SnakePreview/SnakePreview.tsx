type Props = {
  color: string
  size?: number
}

export function SnakePreview({ color, size = 18 }: Props) {
  const cells = Array.from({ length: 7 }, (_, i) => i)

  return (
    <div style={{ display: 'inline-flex', gap: 6, padding: 12,background: '#e5e7eb', border: '1px solid #ccc' }}>
      {cells.map((i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            background: color,
            borderRadius: i === 0 ? 6 : 3,
            opacity: i === 0 ? 1 : 0.9
          }}
          title={i === 0 ? 'Голова' : 'Сегмент'}
        />
      ))}
    </div>
  )
}
