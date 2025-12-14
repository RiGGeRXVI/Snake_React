import { fireEvent, render, screen } from '@testing-library/react'

import { Layout } from './Layout'
import { profileStorage } from '../../services/profileStorage'

const navigateMock = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => navigateMock
  }
})

jest.mock('../../services/profileStorage', () => {
  return {
    profileStorage: {
      getNickname: jest.fn()
    }
  }
})

describe('Layout', () => {
  beforeEach(() => {
    navigateMock.mockReset()
  })

  test('when nickname is empty: protected buttons are disabled and player pill shows dash', () => {
    ;(profileStorage.getNickname as unknown as jest.Mock).mockReturnValue('')

    render(
      <Layout>
        <div>Inner</div>
      </Layout>
    )

    expect(screen.getByText('Inner')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Кастомизация' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Игра' })).toBeDisabled()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  test('when nickname exists: protected buttons enabled and player pill shows nickname', () => {
    ;(profileStorage.getNickname as unknown as jest.Mock).mockReturnValue('Nikita')

    render(
      <Layout>
        <div>Inner</div>
      </Layout>
    )

    expect(screen.getByRole('button', { name: 'Кастомизация' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Игра' })).not.toBeDisabled()
    expect(screen.getByText('Nikita')).toBeInTheDocument()
  })

  test('navigation buttons call navigate with correct routes', () => {
    ;(profileStorage.getNickname as unknown as jest.Mock).mockReturnValue('Nikita')

    render(
      <Layout>
        <div>Inner</div>
      </Layout>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Домой' }))
    expect(navigateMock).toHaveBeenCalledWith('/')

    fireEvent.click(screen.getByRole('button', { name: 'Кастомизация' }))
    expect(navigateMock).toHaveBeenCalledWith('/customization')

    fireEvent.click(screen.getByRole('button', { name: 'Игра' }))
    expect(navigateMock).toHaveBeenCalledWith('/game')

    fireEvent.click(screen.getByRole('button', { name: 'Лидеры' }))
    expect(navigateMock).toHaveBeenCalledWith('/leaderboard')
  })
})
