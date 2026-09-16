import { CategoryMeta } from '../types/category'

export const categories: CategoryMeta[] = [
  {
    id: 'color',
    slug: 'color',
    name: '颜色工具',
    description: '在线颜色拾取、色值格式互转及调色板设计工具。',
    longDescription:
      '颜色是界面设计的第一语言。本分类收录面向前端开发者与设计师的免费在线颜色工具：从屏幕任意位置拾取色值、HEX/RGB/HSL 多格式实时互转，到基于 WCAG 2.1 标准的文本对比度合规检测，以及从图片中智能提取核心调色板。所有换算均在浏览器本地完成，输入的色值与上传的图片绝不上传服务器，适合涉密环境与日常开发调试场景。',
    icon: 'Palette',
  },
  {
    id: 'number',
    slug: 'number',
    name: '数字与财务',
    description: '人民币金额大写转换、数值计算等高效实用工具。',
    longDescription:
      '面向财务、会计与商务场景的数字处理工具集。人民币大写转换器严格遵循《正确填写票据和结算凭证的基本规定》，毫秒级输出符合发票与报销合规要求的标准大写金额；Unix 时间戳转换器支持 10 位秒与 13 位毫秒双向换算，覆盖开发者日常联调、日志分析与数据库运维需求。全部计算基于浏览器本地高精度引擎，无网络往返延迟。',
    icon: 'Coins',
  },
  {
    id: 'favicon',
    slug: 'favicon',
    name: 'Favicon 工具',
    description: '浏览器网站图标生成器、ICO 转换及前端 HTML 代码生成。',
    longDescription:
      'Favicon 是网站品牌在浏览器标签页、收藏夹与手机主屏幕上的第一印象。本分类提供从零开始的完整方案：上传任意图片一键打包多尺寸图标 ZIP、PNG/SVG 矢量文件转标准多分辨率 ICO、输入文字或 Emoji 五秒生成独立站标。所有光栅化与二进制打包均在本地 Canvas 引擎完成，源文件不出浏览器，保护设计版权。',
    icon: 'Image',
  },
  {
    id: 'css',
    slug: 'css',
    name: 'CSS 工具',
    description: '现代 CSS 渐变、布局代码可视化生成与一键复制。',
    longDescription:
      '现代 Web 界面的质感往往取决于细节：多节点线性渐变、平滑自然的多层软阴影、有机形态的 8 值不规则圆角。本分类将这些高频 CSS 效果可视化为拖拽即得的调参面板，实时预览并导出原生 CSS 与 Tailwind CSS 任意值语法，粘贴进项目即可使用，省去手动调试 cubic-bezier 与色值停靠点的繁琐过程。',
    icon: 'Code2',
  },
]
