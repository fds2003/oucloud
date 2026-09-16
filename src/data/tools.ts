import { ToolMeta } from '../types/tool';

export const tools: ToolMeta[] = [
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: '在线颜色拾取器',
    shortName: '颜色拾取器',
    category: 'color',
    topic: 'color',
    intent: 'picker',
    status: 'published',
    component: 'ColorPicker',
    keywords: [
      '颜色拾取器',
      '在线调色板',
      'HEX转RGB',
      'RGB转HEX',
      'HSL颜色转换',
      'color picker'
    ],
    seo: {
      title: '在线颜色拾取器 - HEX/RGB/HSL 色值互转与取色工具 | OUCloud',
      description: '免费便捷的在线颜色拾取器与调色工具，支持 HEX、RGB、HSL 色值实时互转、预设调色板与一键快速复制。',
      h1: '在线颜色拾取器',
      intro: '简单高效的纯前端颜色选取工具，支持多种色彩模式实时换算与色卡选择，开箱即用无广告。',
      howTo: [
        '点击调色区或输入框选择你想要的颜色。',
        '在 HEX、RGB 或 HSL 栏位微调色彩参数，支持实时双向同步。',
        '点击对应数值旁的“复制”按钮，将色值用于你的设计或代码中。'
      ],
      explanation: '色彩模式基础：HEX 是由十六进制代码表示的色彩（如 #0ea5e9），常用于网页 CSS 样式；RGB 代表红绿蓝三原色的强度值（0-255）；HSL 则通过色相（Hue）、饱和度（Saturation）和亮度（Lightness）来更直观地调整人眼感知的色彩。',
      faq: [
        {
          question: '什么是 HEX、RGB 和 HSL 色彩模式？',
          answer: 'HEX 是 16 进制颜色编码，主要用于 CSS；RGB 是屏幕显示的红绿蓝物理光数值；HSL 则更贴合人眼认知，方便调整明暗与饱和度。'
        },
        {
          question: '这个工具会把我的颜色数据上传到服务器吗？',
          answer: '绝对不会。OUCloud 坚持 Tool First 和客户端运行原则，所有颜色计算完全在您的浏览器本地进行。'
        }
      ]
    },
    featured: true,
    relatedTools: ['css-gradient-generator', 'favicon-generator']
  },
  {
    id: 'rmb-uppercase',
    slug: 'rmb-uppercase',
    name: '人民币金额大写转换器',
    shortName: '金额大写转换',
    category: 'number',
    topic: 'finance',
    intent: 'converter',
    status: 'published',
    component: 'RmbUppercase',
    keywords: [
      '人民币大写转换',
      '金额大写转换器',
      '数字转大写',
      '发票大写金额',
      '大写金额规范'
    ],
    seo: {
      title: '人民币金额大写在线转换器 - 发票报销/财务合规标准大写 | OUCloud',
      description: '专业精准的人民币大写金额转换工具，采用纯高精度字符串算法，杜绝浮点数计算误差，完美支持角分、整/正、零的处理及万亿级大额财务转换。',
      h1: '人民币金额大写转换器',
      intro: '为会计、财务、商务合同与报销单据打造的合规大写转换工具，毫秒级实时计算与一键复制。',
      howTo: [
        '在输入框中填入需要转换的阿拉伯数字（支持小数角分）。',
        '工具即时生成符合中国人民银行与财务规范的标准中文大写金额。',
        '点击“复制大写金额”，直接粘贴至发票、支票或财务凭证中。'
      ],
      explanation: '人民币大写书写规则遵循《正确填写票据和结算凭证的基本规定》：中文大写金额数字到“元”为止的，在“元”之后应写“整”（或“正”）字；到“角”为止的，在“角”之后可以不写“整”字；大写金额数字有“分”的，“分”后面不写“整”字。同时连续的“0”在不同数位中需严谨处理“零”的书写。',
      faq: [
        {
          question: '为什么转换结果必须严格防范浮点数精度问题？',
          answer: '计算机在处理例如 0.1 + 0.2 或超大金额时，二进制浮点数容易产生精度漂移。OUCloud 采用纯高精度字符串切分与数位算法，确保财务场景 100% 准确无误差。'
        },
        {
          question: '角之后需要写“整”吗？',
          answer: '根据人民银行规定，金额到“角”为止的，“角”后写或不写“整”均可；但到“元”为止必须写“整”；有“分”的后面严禁写“整”。'
        }
      ]
    },
    featured: true,
    relatedTools: ['color-picker']
  },
  {
    id: 'favicon-generator',
    slug: 'favicon-generator',
    name: 'Favicon 网站图标生成器',
    shortName: 'Favicon 生成器',
    category: 'favicon',
    topic: 'favicon',
    intent: 'generator',
    status: 'published',
    component: 'FaviconGenerator',
    keywords: [
      'favicon生成器',
      'ico生成器',
      '图片转ico',
      '网站图标制作',
      'apple-touch-icon',
      'favicon generator'
    ],
    seo: {
      title: 'Favicon 网站图标生成器 - 纯前端一键导出多尺寸与HTML代码 | OUCloud',
      description: '支持 PNG、JPG、WebP 格式图片快速裁剪并导出 16x16、32x32、apple-touch-icon 等标准 Favicon 图标包，提供 HTML 引入代码，纯浏览器处理零文件上传。',
      h1: 'Favicon 网站图标生成器',
      intro: '上传任意图片，一键批量生成现代 Web 站点所需的全套 Favicon 图标与配置代码，纯本地安全处理。',
      howTo: [
        '拖拽或点击选择一张清晰的方形图片（推荐 512x512 PNG）。',
        '系统自动在本地 Canvas 中缩放并预览不同尺寸的效果。',
        '点击“下载图标压缩包”，解压后放入网站根目录，并复制页面展示的 HTML link 代码。'
      ],
      explanation: '现代网站不仅需要传统的 favicon.ico（通常包含 16x16 和 32x32），还需要针对 iOS 设备的 apple-touch-icon（180x180）以及 Android Chrome 的 Web App 图标（192x192、512x512）。规范的图标配置能够极大提升网站在收藏夹、标签页及移动端书签中的专业度。',
      faq: [
        {
          question: '我上传的图片会被保存到服务器吗？',
          answer: '不会。所有缩放、裁剪和压缩包构建均通过浏览器的 Canvas 与 WebAssembly/JSZip 在您本地设备完成，图片绝不离开您的浏览器。'
        },
        {
          question: '推荐上传多大分辨率的原图？',
          answer: '推荐上传 512x512 像素以上、具有透明背景的方形 PNG 图片，这样能保证在高清视网膜屏幕上也有出色的显示效果。'
        }
      ]
    },
    featured: true,
    relatedTools: ['css-gradient-generator', 'color-picker']
  },
  {
    id: 'css-gradient-generator',
    slug: 'gradient-generator',
    name: 'CSS 渐变生成器',
    shortName: 'CSS 渐变',
    category: 'css',
    topic: 'css',
    intent: 'generator',
    status: 'published',
    component: 'GradientGenerator',
    keywords: [
      'css渐变生成器',
      'linear-gradient生成',
      '渐变背景css',
      '在线渐变设计',
      'css gradient generator'
    ],
    seo: {
      title: 'CSS 渐变生成器 - 线性/径向渐变可视化设计与代码导出 | OUCloud',
      description: '可视化 CSS 渐变背景设计工具，支持任意角度、多色标添加与拖拽、精选高颜值渐变预设，实时预览并一键复制 CSS 代码。',
      h1: 'CSS 渐变生成器',
      intro: '直观的可视化渐变调色板，提供角度控制、多色阶微调与丰富的现代设计预设模板。',
      howTo: [
        '在色阶控制轴上点击添加色标，或者拖拽调整色标位置。',
        '旋转角度滑块或输入角度（0° - 360°）调整渐变流向。',
        '直接从下方的预览框查看实际效果，满意后点击复制 CSS 代码。'
      ],
      explanation: 'CSS 渐变（Gradients）是在两个或多个指定的颜色之间显示平稳过渡的视觉效果。CSS 定义了线性渐变（Linear Gradients）和径向渐变（Radial Gradients）。使用 CSS 渐变代替背景图片能显著减少页面网络加载时间，并且无论屏幕缩放多大都不会失真。',
      faq: [
        {
          question: '生成的 CSS 渐变代码是否兼容现代主流浏览器？',
          answer: '是的。现代浏览器（Chrome、Edge、Safari、Firefox）均原生全面支持标准 CSS3 linear-gradient 语法，无需添加任何浏览器私有前缀。'
        },
        {
          question: '我可以添加两个以上的颜色进行混合渐变吗？',
          answer: '完全可以。本工具支持无限添加色标（Color Stops），并可以为每个色标单独设定色彩和百分比位置。'
        }
      ]
    },
    featured: true,
    relatedTools: ['color-picker', 'favicon-generator']
  }
];
