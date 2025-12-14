import { profileStorage } from './profileStorage'

describe('profileStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('getNickname returns empty string when nickname is not set', () => {
    expect(profileStorage.getNickname()).toBe('')
  })

  test('setNickname trims and stores nickname', () => {
    profileStorage.setNickname('  Player1  ')

    expect(localStorage.getItem('snake:nickname')).toBe('Player1')
    expect(profileStorage.getNickname()).toBe('Player1')
  })

  test('getColor returns default when not set', () => {
    expect(profileStorage.getColor()).toBe('#22c55e')
  })

  test('setColor stores color as-is', () => {
    profileStorage.setColor('#ffffff')

    expect(localStorage.getItem('snake:color')).toBe('#ffffff')
    expect(profileStorage.getColor()).toBe('#ffffff')
  })

  test('clearAll removes both nickname and color', () => {
    profileStorage.setNickname('User')
    profileStorage.setColor('#123456')

    profileStorage.clearAll()

    expect(profileStorage.getNickname()).toBe('')
    expect(profileStorage.getColor()).toBe('#22c55e')
    expect(localStorage.getItem('snake:nickname')).toBeNull()
    expect(localStorage.getItem('snake:color')).toBeNull()
  })
})
