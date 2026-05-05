'use client'
import { create } from 'zustand'

export type QualityTier = 'low' | 'medium' | 'high'

type QualityStore = {
  tier: QualityTier
  postFx: boolean
  dof: boolean
  bloom: boolean
  shadows: boolean
  setTier: (tier: QualityTier) => void
}

const presetFor = (tier: QualityTier) => ({
  postFx: tier !== 'low',
  dof: tier === 'high',
  bloom: tier !== 'low',
  shadows: tier !== 'low',
})

export const useQualityStore = create<QualityStore>((set) => ({
  tier: 'medium',
  ...presetFor('medium'),
  setTier: (tier) => set({ tier, ...presetFor(tier) }),
}))
