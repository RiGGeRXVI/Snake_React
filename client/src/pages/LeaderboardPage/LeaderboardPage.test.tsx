import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { LeaderboardPage } from './LeaderboardPage'

type FetchResponse = {
  ok: boolean
  json: () => Promise<unknown>
}

function mockFetchOnce(res: FetchResponse): void {
  const fn = globalThis.fetch as unknown as jest.Mock

  fn.mockResolvedValueOnce(res)
}

describe('LeaderboardPage', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    globalThis.fetch = jest.fn()
  })

  test('shows loading initially', () => {
    // pending fetch
    ;(globalThis.fetch as unknown as jest.Mock).mockReturnValue(
      new Promise<FetchResponse>(() => {})
    )

    render(<LeaderboardPage />)

    expect(screen.getByText('Загрузка…')).toBeInTheDocument()
  })

  test('renders table when loaded', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({
        list: [
          { nickname: 'Alice', wins: 3, games: 5 },
          { nickname: 'Bob', wins: 1, games: 2 }
        ]
      })
    })

    render(<LeaderboardPage />)

    // ждём появления данных
    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()

    // winrate
    expect(screen.getByText('60%')).toBeInTheDocument() // 3/5 = 60
    expect(screen.getByText('50%')).toBeInTheDocument() // 1/2 = 50

    // loading ушёл
    expect(screen.queryByText('Загрузка…')).toBeNull()
  })

  test('shows empty state when list is empty', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({ list: [] })
    })

    render(<LeaderboardPage />)

    expect(await screen.findByText('Пока нет сыгранных матчей.')).toBeInTheDocument()
  })

  test('shows error when request fails', async () => {
    const fn = globalThis.fetch as unknown as jest.Mock

    fn.mockRejectedValueOnce(new Error('network'))

    render(<LeaderboardPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить таблицу лидеров')
  })

  test('clicking "Обновить" triggers reload', async () => {
    // 1) первый запрос — пусто
    mockFetchOnce({
      ok: true,
      json: async () => ({ list: [] })
    })

    // 2) второй запрос — данные
    mockFetchOnce({
      ok: true,
      json: async () => ({
        list: [{ nickname: 'Zed', wins: 2, games: 2 }]
      })
    })

    render(<LeaderboardPage />)

    // дождались empty state от первого запроса
    expect(await screen.findByText('Пока нет сыгранных матчей.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Обновить' }))

    // после обновления должны появиться новые данные
    expect(await screen.findByText('Zed')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()

    await waitFor(() => {
      expect((globalThis.fetch as unknown as jest.Mock).mock.calls.length).toBe(2)
    })
  })

  test('treats malformed server response as empty list', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({ somethingElse: 123 })
    })

    render(<LeaderboardPage />)

    expect(await screen.findByText('Пока нет сыгранных матчей.')).toBeInTheDocument()
  })

  test('shows error when response is not ok', async () => {
    mockFetchOnce({
      ok: false,
      json: async () => ({})
    })

    render(<LeaderboardPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить таблицу лидеров')
  })
})
