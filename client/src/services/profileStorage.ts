const NICK_KEY = 'snake:nickname'
const COLOR_KEY = 'snake:color'

export const profileStorage = {
  getNickname(): string {
    return localStorage.getItem(NICK_KEY) ?? ''
  },
  setNickname(nickname: string): void {
    localStorage.setItem(NICK_KEY, nickname.trim())
  },

  getColor(): string {
    return localStorage.getItem(COLOR_KEY) ?? '#22c55e'
  },
  setColor(color: string): void {
    localStorage.setItem(COLOR_KEY, color)
  },

  clearAll(): void {
    localStorage.removeItem(NICK_KEY)
    localStorage.removeItem(COLOR_KEY)
  }
}
