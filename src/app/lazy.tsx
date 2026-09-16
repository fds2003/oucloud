import React from 'react'

export type AsyncComponent<P = Record<string, unknown>> = React.FC<P> & {
  /** 主动加载对应 chunk；resolve 后组件即可同步渲染，不再 suspend */
  preload: () => Promise<void>
}

type Importer<P> = () => Promise<{ default: React.ComponentType<P> }>

/**
 * 可预加载的惰性组件。
 *
 * 为什么不用 React.lazy：
 * React.lazy 的内部 payload 只在组件「首次渲染」时才初始化，且模块 promise 的
 * resolve 发生在微任务中 —— 因此即便事先 await 了 import()，首次同步渲染时
 * payload 仍是 Pending，依旧会 suspend。而 renderToString 是同步的、不跑微任务，
 * 预渲染产物就会变成 Suspense fallback 骨架（SEO 归零）；客户端 hydrate 时同理
 * 会丢弃 SSR DOM 回退渲染，闪白且 CLS 劣化。
 *
 * 这里改为「模块加载完成后把组件写进闭包变量」：只要 preload() 已完成，
 * 首次渲染就是同步成功的，prerender 与 hydrate 两侧都能拿到真实内容。
 * 真正需要 Suspense 的只剩「客户端点击路由切换」这一种场景。
 */
export function asyncComponent<P = Record<string, unknown>>(
  importer: Importer<P>
): AsyncComponent<P> {
  // 内部按宽泛的 props 类型持有组件，对外暴露的仍是强类型 AsyncComponent<P>
  let Comp: React.ComponentType<Record<string, unknown>> | null = null
  let loading: Promise<void> | null = null

  const preload = (): Promise<void> => {
    if (!loading) {
      loading = importer().then((mod) => {
        Comp = mod.default as unknown as React.ComponentType<Record<string, unknown>>
      })
    }
    return loading
  }

  const Async = ((props: P) => {
    if (!Comp) {
      // 抛出 thenable：交给最近的 <Suspense> 显示 fallback，加载完成后 React 重试渲染
      throw preload()
    }
    return React.createElement(Comp, props as unknown as Record<string, unknown>)
  }) as unknown as AsyncComponent<P>

  Async.preload = preload
  Async.displayName = 'AsyncComponent'

  return Async
}
