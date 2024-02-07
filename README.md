# react-cordis

Real React for Cordis, like Server Components.

Heavily under constructing.

## Sample

```tsx
import { useCallback, useState } from 'react'
import { render } from 'react-cordis-notifier'

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

```

## LICENSE

MIT
