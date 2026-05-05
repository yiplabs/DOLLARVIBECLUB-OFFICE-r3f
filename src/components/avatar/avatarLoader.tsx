'use client'
import { Component, type ReactNode, Suspense } from 'react'
import type { AvatarConfig } from '@/lib/avatar/types'
import { PrimitiveAvatar } from './PrimitiveAvatar'
import { AvatarGLTF, KENNEY_AVAILABLE } from './AvatarGLTF'

type Props = {
  config: AvatarConfig
  position?: [number, number, number]
  showName?: boolean
  isWalking?: boolean
}

class AvatarBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[AvatarBoundary] falling back to primitive:', error.message)
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

/**
 * Renders the avatar. Always shows <PrimitiveAvatar> unless Kenney GLBs are
 * present AND <AvatarGLTF> opted in (KENNEY_AVAILABLE flag).
 */
export function AvatarMesh(props: Props) {
  if (!KENNEY_AVAILABLE) return <PrimitiveAvatar {...props} />

  return (
    <AvatarBoundary fallback={<PrimitiveAvatar {...props} />}>
      <Suspense fallback={<PrimitiveAvatar {...props} />}>
        <AvatarGLTF {...props} />
      </Suspense>
    </AvatarBoundary>
  )
}
