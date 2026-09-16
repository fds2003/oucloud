import type { ComponentType } from 'react';
import { RmbUppercaseTool } from './RmbUppercaseTool';

/**
 * data/tools.ts 中 ToolMeta.component 字符串 -> 实际组件。
 *
 * 只登记已实现并验收通过的工具；未登记的 component 会由 ToolPage
 * 渲染「开发中」占位页，避免出现死链。
 */
const TOOL_COMPONENTS: Record<string, ComponentType> = {
  RmbUppercase: RmbUppercaseTool
};

export function getToolComponent(component: string): ComponentType | undefined {
  return TOOL_COMPONENTS[component];
}
