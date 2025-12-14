import type { ReactElement } from 'react'

import { Navigate } from 'react-router-dom'

import { profileStorage } from '../services/profileStorage'

type Props = { children: ReactElement }

export function RequireNickname({ children }: Props) {
  const nickname = profileStorage.getNickname().trim()

  // правило: без ника (или короче 2 символов) — нельзя дальше
  if (nickname.length < 2) return <Navigate to="/" replace />

  return children
}
