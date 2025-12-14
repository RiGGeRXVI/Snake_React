import { fireEvent, render, screen } from '@testing-library/react'

import { CustomizationPage } from './CustomizationPage'
import { profileStorage } from '../../services/profileStorage'
import { SNAKE_COLORS } from '../../utils/colors'

jest.mock('../../components/ColorPalette/ColorPalette', () => {
  return {
    ColorPalette: (props: {
      colors: Array<{ name: string; hex: string }>
      value: string
      onChange: (hex: string) => void
    }) => {
      const next = props.colors[0]?.hex ?? '#000000'

      return (
        <button type="button" onClick={() => props.onChange(next)}>
          MockPalette
        </button>
      )
    }
  }
})

jest.mock('../../components/SnakePreview/SnakePreview', () => {
  return {
    SnakePreview: (props: { color: string }) => {
      return <div data-testid="snake-preview" data-color={props.color} />
    }
  }
})

describe('CustomizationPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('shows nickname from profileStorage', () => {
    profileStorage.setNickname('Nikita')

    render(<CustomizationPage />)

    expect(screen.getByText('Nikita')).toBeInTheDocument()
  })

  test('shows current color name from SNAKE_COLORS', () => {
    const first = SNAKE_COLORS[0]

    profileStorage.setColor(first.hex)

    render(<CustomizationPage />)

    expect(screen.getByText(first.name)).toBeInTheDocument()
    expect(screen.getByTitle(first.hex)).toBeInTheDocument()
    expect(screen.getByTestId('snake-preview')).toHaveAttribute('data-color', first.hex)
  })

  test('clicking palette changes color and saves it', () => {
    const first = SNAKE_COLORS[0]
    const second = SNAKE_COLORS[1] ?? first

    // стартуем с "second", а мок палитры выберет "first"
    profileStorage.setColor(second.hex)

    const spy = jest.spyOn(profileStorage, 'setColor')

    render(<CustomizationPage />)

    fireEvent.click(screen.getByRole('button', { name: 'MockPalette' }))

    expect(spy).toHaveBeenCalledWith(first.hex)
    expect(profileStorage.getColor()).toBe(first.hex)
    expect(screen.getByTestId('snake-preview')).toHaveAttribute('data-color', first.hex)

    spy.mockRestore()
  })

  test('shows dash when nickname is empty', () => {
    profileStorage.setNickname('')

    render(<CustomizationPage />)

    expect(screen.getByText('—')).toBeInTheDocument()
  })
})