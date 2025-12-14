import { fireEvent, render, screen } from '@testing-library/react'

import { ColorPalette } from './ColorPalette'

describe('ColorPalette', () => {
  test('renders one button per color and calls onChange with hex on click', () => {
    const onChange = jest.fn()

    render(
      <ColorPalette
        colors={[
          { name: 'Green', hex: '#22c55e' },
          { name: 'Red', hex: '#ef4444' }
        ]}
        value="#22c55e"
        onChange={onChange}
      />
    )

    const green = screen.getByRole('button', { name: 'Выбрать цвет: Green' })
    const red = screen.getByRole('button', { name: 'Выбрать цвет: Red' })

    expect(green).toBeInTheDocument()
    expect(red).toBeInTheDocument()

    fireEvent.click(red)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('#ef4444')
  })

  test('shows selected color via outline style', () => {
    const onChange = jest.fn()

    render(
      <ColorPalette
        colors={[
          { name: 'Green', hex: '#22c55e' },
          { name: 'Red', hex: '#ef4444' }
        ]}
        value="#ef4444"
        onChange={onChange}
      />
    )

    const red = screen.getByRole('button', { name: 'Выбрать цвет: Red' })
    const green = screen.getByRole('button', { name: 'Выбрать цвет: Green' })

    expect(red).toHaveStyle({ outline: '2px solid #111' })
    expect(green).toHaveStyle({ outline: 'none' })
  })
})
