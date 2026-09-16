/**
 * 百度站长平台 API 主动推送引擎
 * 官方规范：POST http://data.zz.baidu.com/urls?site=xxx&token=xxx
 * Content-Type: text/plain
 * Body: URL 列表，每行一个
 */

/**
 * 从 sitemap.xml 文本中提取所有合法的 <loc> URL
 */
export function extractUrlsFromSitemapXml(xmlContent: string): string[] {
  if (!xmlContent || typeof xmlContent !== 'string') return []

  const urls: string[] = []
  const regex = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi
  let match: RegExpExecArray | null

  while ((match = regex.exec(xmlContent)) !== null) {
    if (match[1]) {
      urls.push(match[1].trim())
    }
  }

  return urls
}

/**
 * 将 URL 数组拼接为百度推送所要求的换行分隔纯文本
 */
export function buildBaiduPushPayload(urls: string[]): string {
  return urls.map((u) => u.trim()).filter(Boolean).join('\n')
}

/**
 * 格式化百度 API 推送端点 URL
 */
export function formatPushApiUrl(site: string, token: string): string {
  const cleanSite = site.trim().replace(/\/+$/, '')
  return `http://data.zz.baidu.com/urls?site=${cleanSite}&token=${token.trim()}`
}
