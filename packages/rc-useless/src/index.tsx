import type {} from '@koishijs/plugin-notifier'
import type { Context } from 'koishi'
import { Schema } from 'koishi'
import { useCallback, useEffect, useState } from 'react'
import { render } from 'react-cordis-notifier'

export const name = 'rc-useless'
export const inject = ['notifier']
export const filter = false
export const reusable = true

export const usage = `
## 没用的插件，基于 react-cordis。
`

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  render(ctx, <Useless ctx={ctx} />)
}

function Useless({ ctx }: { ctx: Context }) {
  const [i, setI] = useState(6)

  useEffect(() => {
    if (i) {
      const timeout = setTimeout(() => setI(i - 1), 1000)
      return () => clearTimeout(timeout)
    }

    ctx.scope.dispose()
    return () => {}
  }, [i])

  const increment = useCallback(() => setI((x) => x + 1), [])

  return (
    <>
      <p>插件将在 {i} 秒后关闭……</p>
      <p>
        <button onClick={increment}>续一秒</button>
      </p>
    </>
  )
}
