import { useEffect, useMemo, useState } from 'react'

import styles from './CustomizationPage.module.css'
import { ColorPalette } from '../../components/ColorPalette/ColorPalette'
import { SnakePreview } from '../../components/SnakePreview/SnakePreview'
import { profileStorage } from '../../services/profileStorage'
import { SNAKE_COLORS } from '../../utils/colors'

export function CustomizationPage() {
  const [color, setColor] = useState(profileStorage.getColor())

  useEffect(() => {
    profileStorage.setColor(color)
  }, [color])

  const nickname = profileStorage.getNickname().trim()

  const currentName = useMemo(() => {
    return (
      SNAKE_COLORS.find((c) => c.hex.toLowerCase() === color.toLowerCase())?.name ??
      'Пользовательский'
    )
  }, [color])

  return (
    <div className={styles.root}>
      <div>
        <h1 className={styles.title}>Кастомизация</h1>
        <p className={styles.subtitle}>
          Выберите цвет змейки — он сохранится и будет использоваться в игре.
        </p>
      </div>

      <div className={styles.card}>
        <div>
          <div className={styles.label}>Игрок</div>
          <div className={styles.value}>{nickname || '—'}</div>
        </div>

        <div className={styles.colorRow}>
          <div className={styles.colorDot} style={{ background: color }} title={color} />
          <div>
            <div className={styles.label}>Текущий цвет</div>
            <div style={{ fontWeight: 900 }}>{currentName}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>Превью</h3>
        <SnakePreview color={color} />
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>Выберите цвет</h3>
        <ColorPalette colors={SNAKE_COLORS} value={color} onChange={setColor} />
        <p className={styles.hint}>Нажмите на квадрат — цвет применится сразу.</p>
      </div>
    </div>
  )
}
