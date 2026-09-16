import React from 'react'
import { asyncComponent, type AsyncComponent } from '../app/lazy'

/**
 * 工具组件按需加载。
 *
 * 此前是静态 import：4 个工具（含 Favicon 生成器的 jszip，约 95KB）全部打进首屏包，
 * 首页和静态页都在为用不到的代码付费。改为惰性组件后，每个工具独立成 chunk。
 *
 * 组件实例必须缓存复用：每次返回新的惰性组件会让 React 认为组件类型变化，
 * 从而卸载重建整棵子树（用户输入状态丢失）。
 */
const importers = {
  ColorPicker: () => import('./color/ColorPicker').then((m) => ({ default: m.ColorPicker })),
  RmbUppercase: () => import('./number/RmbUppercase').then((m) => ({ default: m.RmbUppercase })),
  FaviconGenerator: () =>
    import('./favicon/FaviconGenerator').then((m) => ({ default: m.FaviconGenerator })),
  GradientGenerator: () =>
    import('./css/GradientGenerator').then((m) => ({ default: m.GradientGenerator })),
  PngToIco: () => import('./favicon/PngToIco').then((m) => ({ default: m.PngToIco })),
  BoxShadowGenerator: () =>
    import('./css/BoxShadowGenerator').then((m) => ({ default: m.BoxShadowGenerator })),
  ImageColorPicker: () =>
    import('./color/ImageColorPicker').then((m) => ({ default: m.ImageColorPicker })),
  HexToRgb: () => import('./color/HexToRgb').then((m) => ({ default: m.HexToRgb })),
  TimestampConverter: () =>
    import('./number/TimestampConverter').then((m) => ({ default: m.TimestampConverter })),
  TextToFavicon: () =>
    import('./favicon/TextToFavicon').then((m) => ({ default: m.TextToFavicon })),
  SvgToFavicon: () =>
    import('./favicon/SvgToFavicon').then((m) => ({ default: m.SvgToFavicon })),
  ContrastChecker: () =>
    import('./color/ContrastChecker').then((m) => ({ default: m.ContrastChecker })),
  BorderRadiusGenerator: () =>
    import('./css/BorderRadiusGenerator').then((m) => ({ default: m.BorderRadiusGenerator })),
  DaxieGuifan: () =>
    import('./number/DaxieGuifan').then((m) => ({ default: m.DaxieGuifan })),
}

export type ToolComponentName = keyof typeof importers

const registry = new Map<string, AsyncComponent>()

function resolve(componentName: ToolComponentName): AsyncComponent {
  let component = registry.get(componentName)
  if (!component) {
    component = asyncComponent(importers[componentName])
    registry.set(componentName, component)
  }
  return component
}

export function getToolComponent(componentName: ToolComponentName): React.ComponentType {
  return resolve(componentName)
}

/** 供 prerender / hydrate 在同步渲染前预热，避免首屏吐出 fallback 骨架 */
export function preloadToolComponent(componentName: ToolComponentName): Promise<void> {
  return resolve(componentName).preload()
}

/** 已注册的组件名，供 tools:validate 校验 data/tools.ts 的声明与注册表一致 */
export const toolComponentNames: ToolComponentName[] = Object.keys(importers) as ToolComponentName[]
