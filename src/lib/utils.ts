import clsx, { type ClassValue } from 'clsx'

export const cn = (...inputs: ClassValue[]) => clsx(inputs)

export function generateGuestId(): string {
  if (typeof window === 'undefined') return 'guest_ssr'
  const existing = sessionStorage.getItem('dvc_guest_id')
  if (existing) return existing
  const id = `guest_${Math.random().toString(36).slice(2, 10)}`
  sessionStorage.setItem('dvc_guest_id', id)
  return id
}

export function pickGuestName(): string {
  const adjectives = ['cozy', 'sleepy', 'sunny', 'lo-fi', 'shippy', 'cracked', 'feral', 'crispy']
  const nouns = ['otter', 'fox', 'bee', 'lemur', 'koi', 'panda', 'newt', 'cricket']
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}`
}

export const safeWindow = () => (typeof window === 'undefined' ? null : window)
