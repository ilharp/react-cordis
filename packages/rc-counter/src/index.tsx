import type { Context } from 'koishi'
import { Schema } from 'koishi'
import { useCallback, useState } from 'react'
import { render } from 'react-cordis-notifier'

export const name = 'rc-counter'
export const inject = ['notifier']
export const filter = false
export const reusable = true

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  render(ctx, <Counter />)
}

function Counter() {
  const [count, setCount] = useState(0)

  const increase = useCallback(() => setCount((x) => x + 1), [])
  const decrease = useCallback(() => setCount((x) => x - 1), [])

  return (
    <>
      <p>Current: {count}</p>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </>
  )
}
