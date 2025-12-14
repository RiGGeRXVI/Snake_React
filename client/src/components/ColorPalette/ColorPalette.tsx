import type { NamedColor } from '../../utils/colors'

type Props = {
  colors: NamedColor[]
  value: string
  onChange: (hex: string) => void
}

export function ColorPalette({ colors, value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
      {colors.map(({ name, hex }) => (
        <button
          key={hex}
          type="button"
          onClick={() => onChange(hex)}
          aria-label={`Выбрать цвет: ${name}`}
          title={name}
          style={{
            width: 28,
            height: 28,
            background: hex,
            border: hex.toLowerCase() === '#acacacff' ? '1px solid #999' : '1px solid transparent',
            outline: hex === value ? '2px solid #111' : 'none',
            cursor: 'pointer'
          }}
        />
      ))}
    </div>
  )
}
