/**
 * 产品分析与埋点抽象层 (符合 Prompt 第四十八节规范)
 * 隐私原则：严禁发送用户图片、文件内容、输入金额或具体色值等敏感私密数据。
 */

export type ToolEventType =
  | 'tool_view'
  | 'tool_start'
  | 'tool_complete'
  | 'tool_download'
  | 'tool_copy'
  | 'tool_error';

export interface EventPayload {
  toolId: string;
  category?: string;
  durationMs?: number;
  errorCode?: string;
  [key: string]: unknown;
}

const FORBIDDEN_KEYS = new Set([
  'image',
  'file',
  'content',
  'amount',
  'color',
  'password',
  'secret',
  'inputValue',
]);

/**
 * 安全上报事件
 */
export function trackEvent(eventType: ToolEventType, payload: EventPayload): void {
  // 安全过滤：防止开发者无意中传入私密字段
  const sanitizedPayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!FORBIDDEN_KEYS.has(key.toLowerCase())) {
      sanitizedPayload[key] = value;
    }
  }

  // 第一阶段本地控制台输出与轻量指标统计，后续可接入 Cloudflare Web Analytics
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics] ${eventType}`, sanitizedPayload);
  }

  // 预留与 Cloudflare 或标准分析接口对接的钩子
  if (typeof window !== 'undefined' && (window as unknown as { _saEvent?: (name: string, data: unknown) => void })._saEvent) {
    (window as unknown as { _saEvent: (name: string, data: unknown) => void })._saEvent(eventType, sanitizedPayload);
  }
}
