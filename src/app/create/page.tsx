'use client'
import dynamic from 'next/dynamic'

const CharacterCreator = dynamic(
  () =>
    import('@/components/creator/CharacterCreator').then(
      (m) => m.CharacterCreator,
    ),
  { ssr: false },
)

export default function CreatePage() {
  return <CharacterCreator />
}
