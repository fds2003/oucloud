import { ToolMeta } from '../types/tool'

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
    keywords: ['颜色拾取器', '在线调色板', 'HEX转RGB', 'RGB转HEX', 'HSL颜色转换', 'color picker'],
    seo: {
      title: '在线颜色拾取器 - HEX/RGB/HSL 色值互转与取色工具 | OUCloud',
      description:
        '免费便捷的在线颜色拾取器与调色工具，支持 HEX、RGB、HSL 色值实时互转、预设调色板与一键快速复制。',
      h1: '在线颜色拾取器',
      intro: '简单高效的纯前端颜色选取工具，支持多种色彩模式实时换算与色卡选择，开箱即用无广告。',
      howTo: [
        '点击调色区或输入框选择你想要的颜色。',
        '在 HEX、RGB 或 HSL 栏位微调色彩参数，支持实时双向同步。',
        '点击对应数值旁的“复制”按钮，将色值用于你的设计或代码中。',
      ],
      explanation:
        '色彩模式基础：HEX 是由十六进制代码表示的色彩（如 #0ea5e9），常用于网页 CSS 样式；RGB 代表红绿蓝三原色的强度值（0-255）；HSL 则通过色相（Hue）、饱和度（Saturation）和亮度（Lightness）来更直观地调整人眼感知的色彩。',
      faq: [
        {
          question: '什么是 HEX、RGB 和 HSL 色彩模式？',
          answer:
            'HEX 是 16 进制颜色编码，主要用于 CSS；RGB 是屏幕显示的红绿蓝物理光数值；HSL 则更贴合人眼认知，方便调整明暗与饱和度。',
        },
        {
          question: '这个工具会把我的颜色数据上传到服务器吗？',
          answer:
            '绝对不会。OUCloud 坚持 Tool First 和客户端运行原则，所有颜色计算完全在您的浏览器本地进行。',
        },
      ],
    },
    featured: true,
    relatedTools: ['css-gradient-generator', 'favicon-generator'],
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
    keywords: ['人民币大写转换', '金额大写转换器', '数字转大写', '发票大写金额', '大写金额规范'],
    seo: {
      title: '人民币金额大写在线转换器 - 发票报销/财务合规标准大写 | OUCloud',
      description:
        '专业精准的人民币大写金额转换工具，采用纯高精度字符串算法，杜绝浮点数计算误差，完美支持角分、整/正、零的处理及万亿级大额财务转换。',
      h1: '人民币金额大写转换器',
      intro: '为会计、财务、商务合同与报销单据打造的合规大写转换工具，毫秒级实时计算与一键复制。',
      howTo: [
        '在输入框中填入需要转换的阿拉伯数字（支持小数角分）。',
        '工具即时生成符合中国人民银行与财务规范的标准中文大写金额。',
        '点击“复制大写金额”，直接粘贴至发票、支票或财务凭证中。',
      ],
      explanation:
        '人民币大写书写规则遵循《正确填写票据和结算凭证的基本规定》：中文大写金额数字到“元”为止的，在“元”之后应写“整”（或“正”）字；到“角”为止的，在“角”之后可以不写“整”字；大写金额数字有“分”的，“分”后面不写“整”字。同时连续的“0”在不同数位中需严谨处理“零”的书写。',
      faq: [
        {
          question: '大写金额中的“零”到底要不要写？',
          answer:
            '只有当数字中间出现空位时才写“零”，且连续的空位只写一个“零”。例如 10005 写作“壹万零伍元整”；100.03 因“角”位为 0 需补“零”，写作“壹佰元零叁分”；而末尾的 0 不写，如 100 写作“壹佰元整”。',
        },
        {
          question: '到“角”为止，“整”字该不该写？',
          answer:
            '根据人民银行规定，金额到“元”为止必须写“整”（或“正”）；到“角”为止写或不写均可，本工具统一输出“整”（如 10.1 → 壹拾元壹角整）；有“分”时严禁写“整”。',
        },
        {
          question: '角分与小数点怎么处理？超过两位小数会怎样？',
          answer:
            '小数点后第一位为“角”、第二位为“分”。人民币最小单位为“分”，若输入超过两位小数且第三位非零（如 1.239），工具会明确报错而非静默截断，避免财务金额失真。本工具采用纯高精度字符串算法，不会出现 0.1 + 0.2 类的浮点漂移。',
        },
        {
          question: '能在 Excel 或 Word 里直接生成大写金额吗？',
          answer:
            'Excel 可通过 [DBNum2] 数字格式配合 TEXT 函数嵌套实现，但“零”的补位与“角分”边界（如 100.03 需补“零”、有“分”不写“整”）用公式很难覆盖周全，实务中常漏写“零”。建议用本工具生成后复制到凭证，或以其结果作为公式正确性的核对基准。',
        },
        {
          question: '大写金额的书写规范依据是什么？',
          answer:
            '依据中国人民银行《正确填写票据和结算凭证的基本规定》：中文大写金额应用正楷或行书填写（壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿、元、角、分、零、整），金额前应标明“人民币”字样且不得留有空白。本工具算法严格遵循该规定。',
        },
      ],
      quickReference: {
        title: '人民币大写规范速查表（零 / 整 / 角分）',
        caption:
          '以上写法均由本工具算法实际输出，遵循中国人民银行《正确填写票据和结算凭证的基本规定》。',
        columns: ['金额', '标准大写', '规则要点'],
        rows: [
          ['¥0', '零元整', '无金额时写作“零元整”'],
          ['¥0.05', '伍分', '整数部分为 0，直接写“分”'],
          ['¥100', '壹佰元整', '到“元”为止必须写“整”'],
          ['¥10.10', '壹拾元壹角整', '到“角”为止，“整”可写可不写'],
          ['¥100.03', '壹佰元零叁分', '“角”位为 0 时需补“零”'],
          ['¥100.53', '壹佰元伍角叁分', '有“分”时不再写“整”'],
          ['¥10,005', '壹万零伍元整', '中间连续空位只写一个“零”'],
          ['¥1,000,000', '壹佰万元整', '按万 / 亿逐级进位'],
        ],
      },
    },
    featured: true,
    relatedTools: ['color-picker'],
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
      'favicon generator',
    ],
    seo: {
      title: 'Favicon 网站图标生成器 - 2026 适用多尺寸一键导出与 HTML 引入代码 | OUCloud',
      description:
        '支持 PNG、JPG、WebP 格式图片快速裁剪并导出 16x16、32x32、apple-touch-icon 等标准 Favicon 图标包，提供 HTML 引入代码，纯浏览器处理零文件上传。',
      h1: 'Favicon 网站图标生成器',
      intro:
        '上传任意图片，一键批量生成现代 Web 站点所需的全套 Favicon 图标与配置代码，纯本地安全处理。',
      howTo: [
        '拖拽或点击选择一张清晰的方形图片（推荐 512x512 PNG）。',
        '系统自动在本地 Canvas 中缩放并预览不同尺寸的效果。',
        '点击“下载图标压缩包”，解压后放入网站根目录，并复制页面展示的 HTML link 代码。',
      ],
      explanation:
        '现代网站不仅需要传统的 favicon.ico（通常包含 16x16 和 32x32），还需要针对 iOS 设备的 apple-touch-icon（180x180）以及 Android Chrome 的 Web App 图标（192x192、512x512）。规范的图标配置能够极大提升网站在收藏夹、标签页及移动端书签中的专业度。',
      faq: [
        {
          question: '什么是 Favicon？网站为什么需要它？',
          answer:
            'Favicon（Favorites Icon）是显示在浏览器标签页、书签栏、浏览历史以及手机主屏上的小图标。缺少它时浏览器会显示默认的空白文档图标，既降低品牌辨识度，也让用户在打开多个标签页时难以快速定位你的站点。',
        },
        {
          question: '我上传的图片会被保存到服务器吗？',
          answer:
            '不会。所有缩放、裁剪和压缩包构建均通过浏览器的 Canvas 与 WebAssembly/JSZip 在您本地设备完成，图片绝不离开您的浏览器。',
        },
        {
          question: '推荐上传多大分辨率的原图？',
          answer:
            '推荐上传 512x512 像素以上、具有透明背景的方形 PNG 图片，这样能保证在高清视网膜屏幕上也有出色的显示效果。',
        },
      ],
      quickReference: {
        title: 'Favicon 标准尺寸速查表（2026 适用）',
        caption: '下表为本工具实际导出的全部尺寸，覆盖主流桌面浏览器、iOS 与 Android 平台。',
        columns: ['尺寸', '输出文件名', '适用场景'],
        rows: [
          ['16×16', 'favicon-16x16.png', '浏览器标签页、书签栏'],
          ['32×32', 'favicon-32x32.png', '桌面浏览器标准图标'],
          ['180×180', 'apple-touch-icon.png', 'iOS 添加到主屏'],
          ['192×192', 'android-chrome-192x192.png', 'Android Chrome / PWA'],
          ['512×512', 'android-chrome-512x512.png', '高清启动画面、应用市场'],
          ['16 / 32 / 48', 'favicon.ico', '兼容旧版浏览器（三帧封装）'],
        ],
      },
    },
    featured: true,
    relatedTools: ['css-gradient-generator', 'color-picker'],
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
      'css渐变边框',
      '渐变边框css',
      'border-image渐变',
      '在线渐变设计',
      'css gradient generator',
    ],
    seo: {
      title: 'CSS 渐变生成器 - 线性/径向渐变与渐变边框代码导出 | OUCloud',
      description:
        '可视化 CSS 渐变设计工具，支持任意角度、多色标添加与拖拽、精选高颜值渐变预设，并可一键导出渐变背景与渐变边框（含支持圆角写法）CSS 代码。',
      h1: 'CSS 渐变生成器',
      intro:
        '直观的可视化渐变调色板，提供角度控制、多色阶微调与丰富的现代设计预设模板，支持一键导出渐变背景与渐变边框代码。',
      howTo: [
        '在色阶控制轴上点击添加色标，或者拖拽调整色标位置。',
        '旋转角度滑块或输入角度（0° - 360°）调整渐变流向。',
        '需要渐变边框时切换到“渐变边框”标签，调整边框宽度与圆角。',
        '从左侧预览框确认实际效果，满意后点击复制对应的 CSS 代码。',
      ],
      explanation:
        'CSS 渐变（Gradients）是在两个或多个指定的颜色之间显示平稳过渡的视觉效果。CSS 定义了线性渐变（Linear Gradients）和径向渐变（Radial Gradients）。使用 CSS 渐变代替背景图片能显著减少页面网络加载时间，并且无论屏幕缩放多大都不会失真。',
      faq: [
        {
          question: '生成的 CSS 渐变代码是否兼容现代主流浏览器？',
          answer:
            '是的。现代浏览器（Chrome、Edge、Safari、Firefox）均原生全面支持标准 CSS3 linear-gradient 语法，无需添加任何浏览器私有前缀。',
        },
        {
          question: '我可以添加两个以上的颜色进行混合渐变吗？',
          answer:
            '完全可以。本工具支持无限添加色标（Color Stops），并可以为每个色标单独设定色彩和百分比位置。',
        },
        {
          question: 'CSS 渐变边框怎么写？',
          answer:
            '推荐双层背景加 background-clip 的写法：border: 4px solid transparent; background: linear-gradient(#fff, #fff) padding-box, 你的渐变 border-box; —— 它支持圆角。若不需要圆角，可以用更短的 border: 4px solid transparent; border-image: 你的渐变 1;。切换到本工具的“渐变边框”标签，两种代码都会直接生成好。',
        },
        {
          question: '为什么 border-image 的渐变边框设了圆角没效果？',
          answer:
            'border-image 会接管边框区域的绘制，按规范它与 border-radius 互斥，圆角不会生效，这是 CSS 的既定行为而非浏览器 Bug。需要圆角边框时，请改用 background-clip 双层背景方案。',
        },
      ],
      quickReference: {
        title: 'CSS 渐变常见写法速查表',
        caption: '下表写法均为本工具可直接导出的标准语法，复制后替换其中的颜色即可使用。',
        columns: ['需求', '核心 CSS 写法', '说明'],
        rows: [
          [
            '渐变背景',
            'background: linear-gradient(90deg, #0ea5e9, #6366f1);',
            '最常用，支持任意角度与多色标',
          ],
          [
            '渐变边框（支持圆角）',
            'border: 4px solid transparent; background: linear-gradient(#fff, #fff) padding-box, linear-gradient(...) border-box;',
            '推荐方案，border-radius 正常生效',
          ],
          [
            '渐变边框（简短写法）',
            'border: 4px solid transparent; border-image: linear-gradient(...) 1;',
            '写法最短，但不支持圆角',
          ],
          [
            '渐变文字',
            'background: linear-gradient(...); -webkit-background-clip: text; color: transparent;',
            '把文字裁切成渐变色',
          ],
        ],
      },
    },
    featured: true,
    relatedTools: ['color-picker', 'favicon-generator'],
  },
]
