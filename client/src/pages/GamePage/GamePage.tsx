import type { FC } from 'react'
import { SnakeCanvas } from '../../components/SnakeCanvas/SnakeCanvas'
import { GameUI } from '../../components/GameUI/GameUI'

export const GamePage: FC = () => {
  return (
    <section>
      <h1>Игровое поле</h1>
      <p>
        На этой странице будет происходить сама игра: канвас со змеёй,
        управление и отображение текущего счёта
      </p>
      <SnakeCanvas />
      <GameUI />
    </section>
  )
}
export default GamePage