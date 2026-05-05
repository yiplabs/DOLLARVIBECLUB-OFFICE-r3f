'use client'
import { createContext, useCallback, useContext, useState } from 'react'
import { Toast, type ToastKind } from './Toast'

type ToastItem = { id: number; kind: ToastKind; message: string }

type ToastCtx = {
  push: (message: string, kind?: ToastKind) => void
}

const ctx = createContext<ToastCtx>({ push: () => {} })

export const useToast = () => useContext(ctx)

let nextId = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = nextId++
    setItems((s) => [...s, { id, kind, message }])
    window.setTimeout(
      () => setItems((s) => s.filter((it) => it.id !== id)),
      3500,
    )
  }, [])

  const dismiss = (id: number) =>
    setItems((s) => s.filter((it) => it.id !== id))

  return (
    <ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        {items.map((it) => (
          <div key={it.id} className="pointer-events-auto">
            <Toast kind={it.kind} message={it.message} onClose={() => dismiss(it.id)} />
          </div>
        ))}
      </div>
    </ctx.Provider>
  )
}
