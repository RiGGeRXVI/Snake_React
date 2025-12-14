import type { FC } from 'react'
import { Customization } from '../../components/Customization/Customization'

export const CustomizationPage: FC = () => {
  return (
    <section>
      <h1>Кастомизация</h1>
      <p>
        На этой странице игрок сможет менять внешний вид змейки
      </p>
      <Customization />
    </section>
  )
}
export default CustomizationPage