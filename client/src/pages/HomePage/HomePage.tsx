import { useMemo, useState } from 'react'

import styles from './HomePage.module.css'
import { profileStorage } from '../../services/profileStorage'

export function HomePage() {
  const [input, setInput] = useState('')
  const [confirmedNick, setConfirmedNick] = useState(profileStorage.getNickname())

  const error = useMemo(() => {
    const v = input.trim()

    if (v.length === 0) return 'Ник обязателен'
    if (v.length < 2) return 'Минимум 2 символа'

    return ''
  }, [input])

  const onConfirm = () => {
    if (error) return
    const v = input.trim()

    profileStorage.setNickname(v)
    setConfirmedNick(v)
    setInput('')
  }

  const onClear = () => {
    profileStorage.clearAll()
    setConfirmedNick('')
    setInput('')
  }

  const hasNick = confirmedNick.trim().length >= 2

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>🐍 Snake</h1>
        <p className={styles.subtitle}>
          Выбери ник — и можно идти в кастомизацию и игру (кнопки сверху).
        </p>
      </div>

      <div className={styles.infoCard}>
        {hasNick ? (
          <p className={styles.infoText}>
            Ваш ник: <b className={styles.nickStrong}>{confirmedNick}</b>
          </p>
        ) : (
          <p className={styles.infoText}>Ник ещё не выбран — введите и подтвердите.</p>
        )}
      </div>

      <div className={styles.form}>
        <label htmlFor="nickname" className={styles.label}>
          Никнейм
        </label>

        <input
          id="nickname"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Например: Player1"
          className={styles.input}
        />

        {input.length > 0 && error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <div className={styles.btnRow}>
          <button type="button" onClick={onConfirm} className={styles.btnPrimary}>
            Подтвердить
          </button>

          <button type="button" onClick={onClear} className={styles.btnSecondary}>
            Сбросить
          </button>
        </div>

        <p className={styles.hint}>
          Подсказка: после подтверждения ника кнопки «Кастомизация» и «Игра» в верхней панели станут
          доступны.
        </p>
      </div>
    </div>
  )
}
