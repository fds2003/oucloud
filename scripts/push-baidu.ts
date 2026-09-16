#!/usr/bin/env node
/**
 * 百度站长平台 URL 自动推送脚本
 * 
 * 使用方式:
 *   pnpm seo:push           # 默认 dry-run 检查或读取环境变量推送
 *   BAIDU_PUSH_TOKEN=xxx pnpm seo:push
 */

import fs from 'fs'
import path from 'path'
import {
  extractUrlsFromSitemapXml,
  buildBaiduPushPayload,
  formatPushApiUrl,
} from '../src/lib/seo/pushBaidu'
import { SITE_URL } from '../src/data/site'

const ROOT_DIR = process.cwd()
const sitemapPath = fs.existsSync(path.join(ROOT_DIR, 'dist', 'sitemap.xml'))
  ? path.join(ROOT_DIR, 'dist', 'sitemap.xml')
  : path.join(ROOT_DIR, 'public', 'sitemap.xml')

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ 未找到 sitemap.xml，请先执行 pnpm build 或 pnpm sitemap 生成！')
  process.exit(1)
}

const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8')
const urls = extractUrlsFromSitemapXml(sitemapXml)

console.log(`\n🔍 从 sitemap.xml 成功提取 ${urls.length} 个规范 URL：`)
urls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`))

const token = process.env.BAIDU_PUSH_TOKEN

if (!token) {
  console.log('\n💡 [Dry Run 模式] 未检测到 BAIDU_PUSH_TOKEN 环境变量。')
  console.log('若需向百度站长平台正式推送，请执行：')
  console.log('  BAIDU_PUSH_TOKEN=your_token_here pnpm seo:push')
  console.log('✅ URL 列表已就绪，随时可触发线上推送！\n')
  process.exit(0)
}

const apiUrl = formatPushApiUrl(SITE_URL, token)
const payload = buildBaiduPushPayload(urls)

console.log(`\n🚀 正在向百度站长平台推送 ${urls.length} 个链接...`)

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
  },
  body: payload,
})
  .then(async (res) => {
    const data = await res.json()
    console.log('📬 百度响应结果：', data)
    if (data.success) {
      console.log(`🎉 成功推送 ${data.success} 条链接！今日剩余可用配额：${data.remain}`)
    } else {
      console.warn(`⚠️ 推送提示：${data.message || JSON.stringify(data)}`)
    }
  })
  .catch((err) => {
    console.error('❌ 网络请求失败：', err.message)
    process.exit(1)
  })
