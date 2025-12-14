import { fireEvent, render, screen } from '@testing-library/react'

import { HomePage } from './HomePage'
import { profileStorage } from '../../services/profileStorage'

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('shows message when nickname is not chosen', () => {
    render(<HomePage />)

    expect(screen.getByText('Ник ещё не выбран — введите и подтвердите.')).toBeInTheDocument()
  })

  test('validates nickname: shows error for 1 char', () => {
    render(<HomePage />)

    const input = screen.getByLabelText('Никнейм') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'a' } })

    expect(screen.getByRole('alert')).toHaveTextContent('Минимум 2 символа')
  })

  test('confirm saves nickname, shows "Ваш ник" and clears input', () => {
    render(<HomePage />)

    const input = screen.getByLabelText('Никнейм') as HTMLInputElement

    fireEvent.change(input, { target: { value: '  Player1  ' } })

    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить' }))

    expect(screen.getByText('Ваш ник:')).toBeInTheDocument()
    expect(screen.getByText('Player1')).toBeInTheDocument()
    expect(profileStorage.getNickname()).toBe('Player1')
    expect(input.value).toBe('')
  })

  test('clear resets nickname and clears input', () => {
    profileStorage.setNickname('User')

    render(<HomePage />)

    // убедимся, что отображается выбранный ник из storage
    expect(screen.getByText('User')).toBeInTheDocument()

    const input = screen.getByLabelText('Никнейм') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Something' } })

    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(profileStorage.getNickname()).toBe('')
    expect(screen.getByText('Ник ещё не выбран — введите и подтвердите.')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  test('does not confirm when input is empty (no changes)', () => {
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить' }))

    expect(profileStorage.getNickname()).toBe('')
    expect(screen.getByText('Ник ещё не выбран — введите и подтвердите.')).toBeInTheDocument()
  })
})
