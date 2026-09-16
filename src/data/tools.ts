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
      quickReference: {
        title: '常用设计色彩参数对照速查表（HEX / RGB / HSL）',
        caption: '下表均为本工具算法实时精准换算得出，复制即可直接写入 CSS 样式。',
        columns: ['色彩名称', 'HEX', 'RGB', 'HSL'],
        rows: [
          ['极简白 (White)', '#ffffff', 'rgb(255, 255, 255)', 'hsl(0, 0%, 100%)'],
          ['科技蓝 (Primary)', '#0ea5e9', 'rgb(14, 165, 233)', 'hsl(199, 89%, 48%)'],
          ['祖母绿 (Emerald)', '#10b981', 'rgb(16, 185, 129)', 'hsl(160, 84%, 39%)'],
          ['珊瑚橙 (Orange)', '#f97316', 'rgb(249, 115, 22)', 'hsl(25, 95%, 53%)'],
          ['玫瑰红 (Rose)', '#f43f5e', 'rgb(244, 63, 94)', 'hsl(350, 89%, 60%)'],
          ['深邃暗灰 (Slate)', '#0f172a', 'rgb(15, 23, 42)', 'hsl(222, 47%, 11%)'],
        ],
      },
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
        title: 'CSS 与 Tailwind 渐变常见写法速查表',
        caption: '下表写法均为本工具可直接导出的标准语法与实用类，复制即可使用。',
        columns: ['需求', '原生 CSS 写法', 'Tailwind CSS 类名', '说明'],
        rows: [
          [
            '水平双色渐变',
            'background: linear-gradient(90deg, #0ea5e9, #6366f1);',
            'bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]',
            '最常用水平过渡',
          ],
          [
            '三色对角渐变',
            'background: linear-gradient(45deg, #f72585, #7209b7, #4cc9f0);',
            'bg-gradient-to-tr from-[#f72585] via-[#7209b7] to-[#4cc9f0]',
            '科技风赛博霓虹',
          ],
          [
            '径向中心扩散',
            'background: radial-gradient(circle, #ff0000, #0000ff);',
            'bg-[radial-gradient(circle,#ff0000,#0000ff)]',
            '聚焦视觉焦点',
          ],
          [
            '渐变边框（支持圆角）',
            'border: 4px solid transparent; background: linear-gradient(#fff, #fff) padding-box, linear-gradient(...) border-box;',
            '——',
            '推荐方案，border-radius 正常生效',
          ],
          [
            '渐变文字',
            'background: linear-gradient(...); -webkit-background-clip: text; color: transparent;',
            'bg-gradient-to-r ... bg-clip-text text-transparent',
            '让标题呈现渐变色',
          ],
        ],
      },
    },
    featured: true,
    relatedTools: ['color-picker', 'favicon-generator', 'png-to-ico'],
  },
  {
    id: 'png-to-ico',
    slug: 'png-to-ico',
    name: 'PNG 转 ICO 在线转换器',
    shortName: 'PNG 转 ICO',
    category: 'favicon',
    topic: 'favicon',
    intent: 'converter',
    status: 'published',
    component: 'PngToIco',
    keywords: ['png转ico', 'png to ico', 'ico转换器', '图片转ico', 'favicon ico生成', 'ico格式转换'],
    seo: {
      title: 'PNG 转 ICO 在线转换器 | 纯前端一键导出标准 Favicon.ico',
      description:
        '免费纯前端 PNG 转 ICO 在线工具，支持 16x16、32x32、48x48 多分辨率封装为标准二进制 ICO 容器。图片无需上传服务器，秒级转换一键下载。',
      h1: 'PNG 转 ICO 在线转换器',
      intro:
        '将任意 PNG 图片无损转换为标准多尺寸 Windows 与网页 Favicon.ico 图标，纯浏览器本地运算，保护隐私零泄露。',
      howTo: [
        '点击上传或拖拽 PNG 图片至页面转换区。',
        '选择 ICO 容器需要包含的帧分辨率（默认包含 16x16、32x32、48x48）。',
        '点击“一键下载标准 favicon.ico”，直接保存并在网页 <head> 中引用。',
      ],
      explanation:
        'ICO 是微软制定的标准图标容器格式（ICONDIR 架构）。与简单将 PNG 后缀名改为 .ico 的伪 ICO 不同，本工具在浏览器本地直接构建规范的二进制头部与索引表，将多组不同分辨率的 PNG 帧封装于单一 .ico 文件中，确保主流浏览器标签页、Windows 桌面和书签栏均能精准适配渲染。',
      faq: [
        {
          question: '为什么不能直接把 .png 文件的扩展名改成 .ico？',
          answer:
            '直接重命名只会改变文件名，文件底层依然是 PNG 结构。部分 CDN、旧版浏览器和 Windows 资源管理器在读取时会因无法识别 ICONDIR 头信息而报错或无法显示。本工具使用真实二进制打包，输出标准真彩色 ICO 文件。',
        },
        {
          question: '转换过程会将我的图片上传到远程服务器吗？',
          answer:
            '绝对不会。OUCloud 遵循严格的“纯前端本地运算”准则，所有 Canvas 缩放与二进制封装均在您的浏览器内存中完成，断网亦可正常转换，数据零泄露风险。',
        },
        {
          question: '建议上传多大尺寸的原图？',
          answer:
            '建议上传尺寸在 256x256 或 512x512 以上的透明背景正方形 PNG 矢量或高清图，这样各小尺寸图标（如 16x16、32x32）在下采样时清晰度最佳。',
        },
      ],
      quickReference: {
        title: 'ICO 标准帧分辨率与典型使用场景速查表',
        caption: '标准 Windows 与 Web ICO 文件推荐封装以下三组核心分辨率。',
        columns: ['分辨率', '典型应用环境', '重要性'],
        rows: [
          ['16 x 16', '标准浏览器标签页 (Browser Tab)', '必选 (核心)'],
          ['32 x 32', '高分屏标签页、浏览器书签栏、任务栏', '必选 (核心)'],
          ['48 x 48', 'Windows 桌面快捷方式、文件管理器大图标', '推荐 (重要)'],
          ['64 x 64', 'Windows 控制面板及高 DPI 显示器', '可选'],
          ['128 x 128 / 256 x 256', '现代超清桌面或安装程序图标', '可选'],
        ],
      },
    },
    featured: true,
    relatedTools: ['favicon-generator', 'color-picker'],
  },
  {
    id: 'box-shadow-generator',
    slug: 'box-shadow-generator',
    name: 'CSS 阴影生成器',
    shortName: 'CSS 阴影生成器',
    category: 'css',
    topic: 'css',
    intent: 'generator',
    status: 'published',
    component: 'BoxShadowGenerator',
    keywords: [
      'css阴影生成器',
      'box-shadow生成器',
      'css软阴影',
      'tailwind阴影生成',
      'css弥散阴影',
      'box-shadow generator',
    ],
    seo: {
      title: 'CSS 阴影生成器 | 多层平滑自然软阴影与 Tailwind CSS 代码一键导出',
      description:
        '现代纯前端 CSS 阴影在线生成工具，基于平滑多层指数衰减算法打造自然软阴影，支持内阴影、多层弥散调配及 Tailwind CSS 类名一键复制。',
      h1: 'CSS 阴影生成器',
      intro:
        '告别传统生硬的单层阴影。利用多层平滑指数衰减算法，即时可视化微调生成细腻、自然、高级的现代 CSS 软阴影与 Tailwind CSS 实用类代码。',
      howTo: [
        '选择一套精选预设模板（如极简微浮、立体浮层或品牌光晕）。',
        '微调平滑层数（1~6层）、偏移距离、模糊半径与总透明度。',
        '点击“复制 CSS”或“复制 Tailwind”，直接粘贴应用至你的网页组件中。',
      ],
      explanation:
        '真实的物理阴影是由光源衍射形成的连续渐变。传统 CSS 仅写一层 box-shadow 往往边缘发黑生硬。现代高级 UI 设计（如 Stripe、Vercel、Apple）普遍采用“多层平滑阴影（Smooth Shadow）”技术：通过将总透明度分散到 2~6 层不同距离与模糊度的阴影中，使视觉边缘呈现自然的非线性衰减，营造出极富质感的层次感。',
      faq: [
        {
          question: '什么是多层平滑阴影（Smooth Shadow）？',
          answer:
            '多层阴影是将一个原本单一的 box-shadow 拆解为多个由近及远、模糊逐渐扩大、透明度平滑递减的阴影层。由于模拟了自然环境中的环境光漫反射，相比单层生硬的阴影，视觉上更加柔和、高级且不会弄脏背景。',
        },
        {
          question: '导出的 Tailwind CSS 实用类代码如何使用？',
          answer:
            '工具生成的 Tailwind 代码采用标准 Arbitrary Value 语法（如 shadow-[0px_2px_4px_rgba(...)]），无需修改 tailwind.config.js，直接复制到 HTML 或 JSX 的 className 中即可即时生效。',
        },
        {
          question: '内阴影（Inset）适合用在什么场景？',
          answer:
            '内阴影将光晕绘制在元素边框内侧，非常适合用来制作凹陷效果的输入框（Input）、卡片下压态、内嵌容器底栏或拟物风格开关。',
        },
      ],
      quickReference: {
        title: '现代 UI 设计阴影层级与推荐参数速查表',
        caption: '下表为常见现代前端组件设计层级规范参考。',
        columns: ['设计层级', '典型应用场景', '推荐层数与透明度', '视觉感知'],
        rows: [
          ['基础层 (Elevation 1)', '列表卡片、轻按钮、表格行悬浮', '2 层 / 5%~8% 透明度', '轻盈微浮，不抢焦点'],
          ['中浮层 (Elevation 2)', '下拉菜单、气泡卡片、悬浮工具栏', '3 层 / 10%~14% 透明度', '明确悬浮感，层级分明'],
          ['高浮层 (Elevation 3)', '模态弹窗 (Modal)、Toast 消息提示', '4~5 层 / 15%~20% 透明度', '强视觉隔离，居于顶层'],
          ['光晕层 (Brand Glow)', '核心 CTA 购买按钮、发光霓虹徽章', '3 层 / 主题色 30%~40%', '吸引点击，营造科技感'],
        ],
      },
    },
    featured: true,
    relatedTools: ['css-gradient-generator', 'color-picker'],
  },
  {
    id: 'image-color-picker',
    slug: 'image-color-picker',
    name: '图片在线取色器',
    shortName: '图片取色器',
    category: 'color',
    topic: 'color',
    intent: 'picker',
    status: 'published',
    component: 'ImageColorPicker',
    keywords: [
      '图片取色器',
      '图片提取颜色',
      '在线吸色器',
      '图片调色板提取',
      '图片色彩分析',
      'image color picker',
    ],
    seo: {
      title: '图片在线取色器 | 纯前端像素十字准星吸色与智能调色板提取',
      description:
        '免费纯前端图片在线取色工具，支持拖拽上传 PNG/JPG/WebP/SVG，鼠标十字放大镜精确定位吸取像素色值，自动聚类提取核心 6 色调色板。数据不上传服务器，保护隐私。',
      h1: '图片在线取色器',
      intro:
        '从任意壁纸、设计稿或照片中精准提取色彩。提供毫秒级十字准星像素吸色与核心调色板智能提取，纯浏览器本地安全处理，零图片上传。',
      howTo: [
        '点击上传或拖拽任意图片（或点击试用内置精美预设壁纸）。',
        '在图片上方移动鼠标，十字准星将实时显示悬停像素的精确 HEX 与 RGB。',
        '点击图片任意位置选定色彩，或直接在下方一键复制提取出的核心调色板。',
      ],
      explanation:
        '图片色彩提取基于浏览器的 Canvas API 与色彩空间量化聚类算法。通过将数百万连续像素投射至离散色彩量化网格（Quantization Grid），剔除透明背景与杂讯噪点，按出现频率与视觉分布聚合出最能代表该图像核心氛围的主色系。全流程 100% 在您的客户端设备上完成，无论多大的私密图片均不会泄露到云端。',
      faq: [
        {
          question: '我上传的设计稿或照片会被保存在服务器上吗？',
          answer:
            '绝对不会。OUCloud 坚持纯前端无后端原则，图片通过浏览器的 FileReader API 直接读入本地内存渲染并进行像素取色，没有任何网络传输与数据留存。',
        },
        {
          question: '如何精确吸取图片中极细线条的颜色？',
          answer:
            '鼠标悬停在图片上时会自动激活圆形微型放大镜，并带有中心十字准星定位。移动鼠标至目标像素后单击即可锁定该颜色。',
        },
        {
          question: '提取的调色板可以一次性批量复制吗？',
          answer:
            '可以。调色板右上角提供“复制全套”按钮，点击后即可一键将提取出的全部 HEX 色值以逗号分隔形式复制到剪贴板，方便直接粘贴至 CSS 或设计软件。',
        },
      ],
      quickReference: {
        title: '常见色彩搭配与取色应用场景速查表',
        caption: '下表为设计、UI及品牌建设中从实景图像提取调色板的典型用法。',
        columns: ['图像类型', '典型提取主色', '应用建议'],
        rows: [
          [
            '自然风景与晚霞',
            '橙红、暖金、冷紫渐变',
            '适合作为情绪丰富、温暖有故事感的海报与页面背景',
          ],
          [
            '科技感霓虹夜景',
            '深蓝、墨青、电光蓝绿',
            '适合作为极客、SaaS 软件及深色模式界面主色调',
          ],
          [
            '植物与大地森林',
            '深苔绿、橄榄黄、大地棕',
            '适合倡导环保、自然、健康生活方式的品牌视觉系统',
          ],
          [
            '极简建筑与黑白',
            '冷灰、暖灰、深炭灰、皓白',
            '适合极简风格卡片底色、边框阴影及低对比度文字层级',
          ],
        ],
      },
    },
    featured: true,
    relatedTools: ['color-picker', 'css-gradient-generator', 'hex-to-rgb'],
  },
  {
    id: 'hex-to-rgb',
    slug: 'hex-to-rgb',
    name: 'HEX 转 RGB 在线转换器',
    shortName: 'HEX 转 RGB',
    category: 'color',
    topic: 'color',
    intent: 'converter',
    status: 'published',
    component: 'HexToRgb',
    keywords: [
      'hex转rgb',
      'hex to rgb',
      'rgb转hex',
      '16进制转rgb',
      '颜色进制转换',
      '十六进制颜色换算',
    ],
    seo: {
      title: 'HEX 转 RGB 在线转换器 | 十六进制色彩代码与 RGB/RGBA 实时双向换算',
      description:
        '免费纯前端 HEX 转 RGB 在线工具，支持 3 位与 6 位十六进制颜色代码一键换算为标准 RGB 十进制与三通道分离数值，支持逆向 RGB 转 HEX 与 CSS 一键复制。',
      h1: 'HEX 转 RGB 在线转换器',
      intro:
        '专为前端开发与 UI 设计打造的精准单意图颜色进制换算工具。输入 HEX 十六进制代码即时呈现 RGB/RGBA 格式，支持双向逆向换算与全渠道数值拆解。',
      howTo: [
        '在输入框填入 HEX 颜色代码（支持带 # 或不带 #，如 #0ea5e9 或 0ea5e9）。',
        '工具即时输出对应的 rgb(r, g, b) 格式与独立的 R、G、B 通道十进制分量。',
        '点击“复制 RGB”直接粘贴至 CSS 代码中，亦可点击顶部切换为 RGB 转 HEX 逆向模式。',
      ],
      explanation:
        '计算机显示器使用 RGB（红绿蓝三原色）加色模型来呈现上千万种色彩。在 Web 前端开发中，HEX 十六进制写法（如 #FF8000）本质上是三个 0~255 的十进制数值以两两十六进制（00~FF）拼接而成的紧凑表示法。HEX 转 RGB 过程即将每两位十六进制数解析换算为 0~255 的整数分量（例如 FF=255, 80=128, 00=0），从而适配各种图形渲染引擎与 CSS 样式。',
      faq: [
        {
          question: '3 位的简写 HEX（如 #FFF）是如何换算为 RGB 的？',
          answer:
            '在 CSS 规范中，3 位十六进制简写会将每个字符自身复制一次展开为 6 位。例如 #FFF 会展开为 #FFFFFF，换算得到 rgb(255, 255, 255)；#03F 会展开为 #0033FF，换算得到 rgb(0, 51, 255)。',
        },
        {
          question: '输入颜色代码时必须带有井号（#）吗？',
          answer:
            '不需要。本工具内置智能规范化清洗，无论你输入带 # 还是不带 #（例如 0ea5e9），均能自动识别并准确换算。',
        },
        {
          question: '如何获取带透明度的 RGBA 格式？',
          answer:
            '可直接在 6 位 HEX 后追加两位透明度十六进制（即 8 位 HEX8 格式，例如 #0ea5e980 代表 50% 透明度），或在下方协同面板一键跳转至主调色板微调。',
        },
      ],
      quickReference: {
        title: '常用 Web 标准色彩 HEX 与 RGB 对照速查表',
        caption: '下表为常见核心色调的 HEX 与标准 RGB 十进制数值换算对照。',
        columns: ['色彩名称', 'HEX 十六进制', 'RGB 十进制', '视觉感知'],
        rows: [
          ['纯白 (White)', '#ffffff', 'rgb(255, 255, 255)', '最高亮度三原色全开'],
          ['纯黑 (Black)', '#000000', 'rgb(0, 0, 0)', '三原色全关'],
          ['纯红 (Red)', '#ff0000', 'rgb(255, 0, 0)', '红色通道峰值'],
          ['纯绿 (Green)', '#00ff00', 'rgb(0, 255, 0)', '绿色通道峰值'],
          ['纯蓝 (Blue)', '#0000ff', 'rgb(0, 0, 255)', '蓝色通道峰值'],
          ['科技蓝 (Sky Blue)', '#0ea5e9', 'rgb(14, 165, 233)', '高饱和现代界面品牌色'],
          ['靛青 (Indigo)', '#6366f1', 'rgb(99, 102, 241)', '高雅科技渐变搭配色'],
        ],
      },
    },
    featured: true,
    relatedTools: ['color-picker', 'image-color-picker', 'css-gradient-generator'],
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: 'Unix 时间戳在线转换器',
    shortName: '时间戳转换器',
    category: 'number',
    topic: 'finance',
    intent: 'converter',
    status: 'published',
    component: 'TimestampConverter',
    keywords: [
      '时间戳转换',
      'unix时间戳',
      '时间戳转日期',
      '日期转时间戳',
      '毫秒时间戳转换',
      'timestamp converter',
    ],
    seo: {
      title: 'Unix 时间戳在线转换器 | 10位秒与13位毫秒时间戳与北京时间/UTC双向转换',
      description:
        '免费高精度纯前端 Unix 时间戳在线转换工具，实时秒级/毫秒级心跳走字，支持 10 位与 13 位时间戳自适应识别，提供北京时间、UTC 时区转换及各编程语言获取时间戳代码。',
      h1: 'Unix 时间戳在线转换器',
      intro:
        '开发者日常高频必备的时间戳换算工具。支持秒级（10 位）与毫秒级（13 位）时间戳实时双向转换，提供实时走字心跳时钟与主流编程语言获取时间戳范例代码。',
      howTo: [
        '输入 10 位或 13 位数字时间戳，工具自动识别单位并即时输出北京时间与 UTC 时间。',
        '亦可切换至“日期时间转时间戳”模式，输入 YYYY-MM-DD HH:mm:ss 格式日期，即刻逆向计算时间戳。',
        '点击对应卡片右侧的“复制”按钮，直接获取秒级、毫秒级或 ISO 格式字符串。',
      ],
      explanation:
        'Unix 时间戳（Epoch Time）是从协调世界时（UTC）1970 年 1 月 1 日 00:00:00 起所经过的总秒数或毫秒数，是跨操作系统、跨数据库与前后端交互中最标准的时间表示法。本工具纯由浏览器本地 JavaScript 高精度 Date 引擎计算，不受服务器网络波动与时区配置漂移影响，确保秒级与毫秒级绝对精准。',
      faq: [
        {
          question: '10 位时间戳和 13 位时间戳有什么区别？',
          answer:
            '10 位时间戳以“秒（Seconds）”为单位，常用于 Linux 操作系统底层、PHP、Python (int)、MySQL 以及早期后端接口；13 位时间戳以“毫秒（Milliseconds）”为单位，是 JavaScript (Date.now())、Java、现代微服务及高频事件日志的默认标准。本工具支持全自动智能识别。',
        },
        {
          question: '时间戳换算会出现时区偏差吗？',
          answer:
            'Unix 时间戳在全球任何地点都是绝对统一的绝对物理时间。换算为可读字符串时才涉及本地时区。本工具默认同时展示中国大陆开发者最常用的北京时间（UTC+8）与全球通用的世界协调时（UTC 0），并在转换时支持时区自由指定。',
        },
        {
          question: '为什么转换出的时间比实际相差 8 个小时？',
          answer:
            '这是由于部分接口返回的是 UTC 零时区时间，而你在本地使用中国标准时间阅读。在本工具的输出面板中，你可以清晰对照北京时间与 UTC 时间的分立数值，彻底排查 8 小时时区差。',
        },
      ],
      quickReference: {
        title: '常见关键历史时间戳与里程碑速查表',
        caption: '下表为开发中经常用于测试与边界校验的典型时间戳。',
        columns: ['描述', '北京时间 (UTC+8)', '秒级时间戳 (10位)', '毫秒级时间戳 (13位)'],
        rows: [
          ['Unix 纪元起点', '1970-01-01 08:00:00', '0', '0'],
          ['10 亿秒里程碑', '2001-09-09 09:46:40', '1000000000', '1000000000000'],
          ['当前年代标准参考', '2023-11-15 06:13:20', '1700000000', '1700000000000'],
          ['32位有符号上限 (Y2038)', '2038-01-19 11:14:07', '2147483647', '2147483647000'],
        ],
      },
    },
    featured: true,
    relatedTools: ['rmb-uppercase', 'color-picker'],
  },
  {
    id: 'text-to-favicon',
    slug: 'text-to-favicon',
    name: '纯文本与 Emoji 生成 Favicon',
    shortName: 'Emoji转Favicon',
    category: 'favicon',
    topic: 'favicon',
    intent: 'generator',
    status: 'published',
    component: 'TextToFavicon',
    keywords: [
      'emoji转favicon',
      '文字生成favicon',
      'emoji网站图标',
      '文字制作ico',
      '在线favicon制作',
      'text to favicon',
    ],
    seo: {
      title: '纯文本与 Emoji 生成 Favicon | 免 Logo 纯前端一键导出 .ico/.png/.svg',
      description:
        '专为独立开发者打造的免 Logo 快速 Favicon 生成工具。输入单个文字或精选 Emoji，自定义背景底色与圆角，即时导出标准 favicon.ico、高清 PNG 与矢量 SVG。',
      h1: '纯文本与 Emoji 生成 Favicon',
      intro:
        '没有现成 Logo？输入单个汉字或精选 Emoji，自定义底色与圆角，5 秒即可为你的独立项目或 MVP 打造一套清晰醒目的现代网站图标。',
      howTo: [
        '输入 1 个核心文字或从推荐库挑选一个 Emoji（如 🚀、⚡、💡）。',
        '选择图标容器形状（圆角矩形、正圆形或正方形），挑选搭配的品牌底色。',
        '点击“下载 favicon.ico”或“下载 PNG”，直接保存并在网站 <head> 中引用。',
      ],
      explanation:
        '大多数独立项目、个人博客与初创 MVP 早期缺乏专业 Logo 设计，浏览器标签页往往只能展示空白灰色文档图标。本工具通过纯前端 HTML5 Canvas 与 SVG 矢量渲染技术，将排版级文字与 Emoji 高保真居中光栅化，并封装为含多帧分辨率的标准二进制 ICO 容器。全流程在浏览器本地毫秒级完成，零设计门槛。',
      faq: [
        {
          question: 'Emoji 在不同操作系统（如 Windows 与 macOS）上渲染会有差异吗？',
          answer:
            '在本地 Canvas 导出时，浏览器会基于当前操作系统原生字库渲染该 Emoji 并固定光栅化为 PNG/ICO 图像。因此导出的图片在所有访问你网站的访客屏幕上都将呈现完全统一的视觉样式，不会发生系统兼容性形变。',
        },
        {
          question: '生成的 Favicon 在高分屏（Retina / 4K）上会模糊吗？',
          answer:
            '不会。本工具导出的 favicon.ico 内部封装了 16x16、32x32 及 48x48 多分辨率图像帧，同时支持导出 512x512 高清 PNG 与纯矢量 SVG，全面适配 Retina 高分辨率屏幕与手机桌面图标。',
        },
        {
          question: '如何直接在 HTML 页面中引用生成的图标？',
          answer:
            '将下载的 favicon.ico 与 favicon.svg 放置于网站根目录，在 HTML 的 <head> 标签内加入工具右下角提供的两行 <link> 代码即可。',
        },
      ],
      quickReference: {
        title: '独立项目与常见产品类型 Favicon Emoji 灵感对照表',
        caption: '下表为初创产品与个人独立项目最常用的高辨识度 Emoji 搭配参考。',
        columns: ['产品类型', '推荐 Emoji', '推荐底色', '传达心智'],
        rows: [
          ['SaaS / 效率工具', '🚀 (火箭)', '#0ea5e9 (天空蓝)', '快速启动、现代科技、高效成长'],
          ['极速服务 / API', '⚡ (闪电)', '#f59e0b (琥珀金)', '极致响应、高性能、强大驱动'],
          ['AI / 智能工具', '💡 (灵感)', '#6366f1 (靛青紫)', '智慧启发、创意涌现、前沿思考'],
          ['开发者开源库', '🛠️ (工具)', '#0f172a (深空暗)', '极客精神、实用坚固、专业规范'],
          ['数据与金融', '📊 (图表)', '#10b981 (翡翠绿)', '增长可视、财富稳健、合规严谨'],
        ],
      },
    },
    featured: true,
    relatedTools: ['favicon-generator', 'png-to-ico', 'color-picker'],
  },
  {
    id: 'svg-to-favicon',
    slug: 'svg-to-favicon',
    name: 'SVG 转 Favicon 在线转换器',
    shortName: 'SVG转Favicon',
    category: 'favicon',
    topic: 'favicon',
    intent: 'converter',
    status: 'published',
    component: 'SvgToFavicon',
    keywords: [
      'svg转favicon',
      'svg转ico',
      'svg to favicon',
      'svg to ico',
      '矢量转网站图标',
      'svg favicon generator',
    ],
    seo: {
      title: 'SVG 转 Favicon 在线转换器 | 纯前端矢量 SVG 一键转多分辨率 .ico 与高清 PNG',
      description:
        '免费纯前端 SVG 转 Favicon 工具，支持拖拽上传 .svg 文件或直接粘贴 SVG 代码，本地 Canvas 高保真渲染光栅化，一键导出 16/32/48 多帧 favicon.ico、512px PNG 与规范 SVG。',
      h1: 'SVG 转 Favicon 在线转换器',
      intro:
        '将任意 SVG 矢量图标一键转换为标准全套 Favicon。支持直接上传文件或粘贴 SVG 代码，纯前端本地解析与多分辨率光栅化，彻底兼容各主流浏览器。',
      howTo: [
        '点击上传你的 .svg 矢量文件，或直接在代码框粘贴 <svg> 源代码。',
        '右侧将即时呈现 64px、32px、16px 微缩尺寸效果与拟真标签栏预览。',
        '点击“下载 favicon.ico”获取兼容性绝佳的多分辨率二进制图标，或下载高清 PNG 与清洗后的 SVG。',
      ],
      explanation:
        '现代前端技术中 SVG 已成为图标设计的主流标准，但在老旧系统、Windows 桌面快捷方式以及部分搜索引擎爬虫中，传统的 .ico 仍然是不可或缺的兜底格式。本工具通过本地 Canvas 离线光栅化引擎，将矢量贝塞尔曲线精准栅格化为 16x16、32x32 与 48x48 图像帧并写入微软标准二进制 ICONDIR 结构，同时保留现代浏览器对 SVG Favicon 的原生支持。',
      faq: [
        {
          question: 'SVG 格式作为 Favicon 有什么优势与兼容性限制？',
          answer:
            'SVG Favicon 的核心优势在于矢量无损无限缩放，并原生支持根据操作系统的 @media (prefers-color-scheme: dark) 自动切换暗色图标。但部分早期浏览器（如旧版 Safari、IE 及 Windows 资源管理器）不支持 SVG Favicon，因此生产环境中推荐同时提供 favicon.svg 与 favicon.ico。',
        },
        {
          question: '上传的 SVG 会被清理安全性隐患吗？',
          answer:
            '是的。本工具内置严格的矢量安全消毒流程，自动剥离任何潜在恶意的 <script> 标签与内联 DOM 事件监听属性（如 onload/onclick），并自动修复补全缺失的 xmlns 命名空间与 viewBox 视野参数。',
        },
        {
          question: '转换过程会将我的 SVG 文件发送给第三方吗？',
          answer:
            '完全不会。所有 DOM 解析、Canvas 栅格化与二进制打包均在您的本地浏览器内存中进行，断网亦可正常转换，保护设计版权与数据资产。',
        },
      ],
      quickReference: {
        title: '现代 Web 站点 Favicon 双轨制配置规范速查表',
        caption: '推荐同时提供 SVG 与 ICO 双格式以实现 100% 现代与传统设备双向兼容。',
        columns: ['文件格式', '推荐文件名', 'HTML 声明示例', '主要适配目标'],
        rows: [
          [
            '现代矢量 SVG',
            'favicon.svg',
            '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
            '现代 Chrome, Edge, Firefox, 支持自适应暗黑模式',
          ],
          [
            '通用二进制 ICO',
            'favicon.ico',
            '<link rel="shortcut icon" href="/favicon.ico">',
            'Safari 兜底, Windows 桌面快捷方式, 收藏夹, 旧版客户端',
          ],
          [
            '移动高清 PNG',
            'apple-touch-icon.png',
            '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
            'iOS Safari 主屏幕快捷方式 (180x180)',
          ],
        ],
      },
    },
    featured: true,
    relatedTools: ['favicon-generator', 'png-to-ico', 'text-to-favicon'],
  },
  {
    id: 'contrast-checker',
    slug: 'contrast-checker',
    name: '色彩对比度检测器 (WCAG 2.1)',
    shortName: '对比度检测',
    category: 'color',
    topic: 'color',
    intent: 'checker',
    status: 'published',
    component: 'ContrastChecker',
    keywords: [
      '色彩对比度检测',
      'wcag对比度',
      '颜色可读性检测',
      'contrast checker',
      '无障碍色彩检测',
      'wcag 2.1',
    ],
    seo: {
      title: '色彩对比度检测器 | 依据 WCAG 2.1 标准的 Web 颜色无障碍可读性评估工具',
      description:
        '基于国际 WCAG 2.1 标准的专业 Web 无障碍色彩对比度检测工具。输入前景色与背景色，实时计算对比度比率与 AA/AAA 合规评级，提供真实排版预览与一键智能优化修复。',
      h1: '色彩对比度检测器 (WCAG 2.1)',
      intro:
        '确保你的网页对所有用户均清晰可读。即时检测前景色与背景色的相对亮度比率，评估 WCAG 2.1 AA/AAA 无障碍合规性，提供真实排版与组件预览。',
      howTo: [
        '分别输入或点选前景色（文字）与背景色的 HEX 十六进制代码。',
        '工具即时计算精确对比度比率，并标明普通正文、大字号文本及 UI 控件的 AA/AAA 达标状态。',
        '若对比度不足，可点击“一键应用合规建议”，自动微调明度达到 4.5:1 无障碍标准。',
      ],
      explanation:
        'Web 内容无障碍指南（WCAG 2.1）由 W3C 制定，是全球现代网站开发的通用法律与设计门禁。人眼对不同明度的辨识力基于非线性相对亮度（Relative Luminance）。WCAG 规范要求普通正文对比度必须达到 4.5:1（AA 级）或 7.0:1（AAA 级）；大号文字及关键图形 UI 控件必须达到 3.0:1。合规的对比度设计能够保障老龄群体、视障用户及户外阳光强光下的良好阅读体验。',
      faq: [
        {
          question: '什么是 WCAG 2.1 的 AA 级与 AAA 级标准？',
          answer:
            'AA 级是大多数国际法规（如美加欧洲政府网站）所强制要求的最低合规基线：普通正文（<18pt）需达到 4.5:1，大字号（≥18pt 或 14pt 粗体）需达到 3.0:1；AAA 级是最高级别的极致可读性标准：普通正文需达到 7.0:1，大字号需达到 4.5:1。',
        },
        {
          question: '如果对比度恰好是 4.4:1 会被判定为失败吗？',
          answer:
            '是的。在各大无障碍审计工具（如 Lighthouse、Axe）中，4.5:1 是不可通融的硬性阈值，4.49:1 亦会直接报错。此时你可以使用本工具的“一键微调”功能，仅需微移 1% 亮度即可无感达标。',
        },
        {
          question: '图标和输入框边框也需要符合对比度规范吗？',
          answer:
            '是的。WCAG 2.1 明确将非文本内容（如按钮边框、表单激活态下划线、状态图标）纳入评估范围，最低需满足 3.0:1 的对比度。',
        },
      ],
      quickReference: {
        title: 'WCAG 2.1 色彩对比度合规层级标准速查表',
        caption: '下表为国际 W3C 官方公布的各级别最低对比度要求。',
        columns: ['评估维度', 'AA 级要求 (最低合规)', 'AAA 级要求 (最高标准)', '适用场景'],
        rows: [
          ['普通正文 (Regular Text)', '4.5 : 1', '7.0 : 1', '正文段落、表单文本、表格内容 (<18pt)'],
          ['大字号文本 (Large Text)', '3.0 : 1', '4.5 : 1', '大标题、横幅标语 (≥18pt 或 ≥14pt 粗体)'],
          ['UI 交互控件与图标', '3.0 : 1', '建议 4.5 : 1', '输入框边框、按钮轮廓、核心导航图标'],
          ['纯装饰性内容 / 禁用态', '无限制', '无限制', 'Disabled 按钮、版权纯水印、背景插画'],
        ],
      },
    },
    featured: true,
    relatedTools: ['color-picker', 'hex-to-rgb', 'image-color-picker'],
  },
  {
    id: 'border-radius-generator',
    slug: 'border-radius-generator',
    name: 'CSS 圆角生成器 (8值不规则形状)',
    shortName: 'CSS 圆角生成器',
    category: 'css',
    topic: 'css',
    intent: 'generator',
    status: 'published',
    component: 'BorderRadiusGenerator',
    keywords: [
      'css圆角生成器',
      'border-radius生成器',
      '8值圆角',
      'fancy border radius',
      '有机形状生成器',
      'css blob',
    ],
    seo: {
      title: 'CSS 圆角生成器 | 8值不规则平滑有机异形 (Blob) 与 Tailwind CSS 代码生成',
      description:
        '现代纯前端 CSS 8 值圆角可视化生成工具，支持四个角独立的水平与垂直半轴微调，生成现代有机水滴、鹅卵石、科技徽章等异形形状，支持原生 CSS 与 Tailwind CSS 实用类代码一键复制。',
      h1: 'CSS 圆角生成器 (8值不规则形状)',
      intro:
        '突破传统对称圆角。自由可视化微调 8 个水平与垂直半轴参数，即刻生成极具现代有机生命力的水滴、徽章与异形卡片背景，支持原生 CSS 与 Tailwind 语法一键导出。',
      howTo: [
        '选择一套预设形状模板（如有机制滴、科技徽章、自然卵石），或直接拖动右侧 8 方向半轴滑块。',
        '左侧画布将即时平滑光栅化呈现异形几何形态，并支持切换多种渐变底色。',
        '点击“复制 CSS”或“复制 Tailwind”，直接将包含斜杠语法的代码粘贴至你的组件中。',
      ],
      explanation:
        'CSS 中的 border-radius 不仅支持 4 个角的值，还支持使用斜杠（/）分隔的 8 个值语法（例如 border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%）。斜杠前代表四个角椭圆的水平半径（Horizontal Radii），斜杠后代表垂直半径（Vertical Radii）。通过组合非对称的 8 个百分比，能够绘制出数学级平滑的有机水滴（Organic Blob）和流体微动效，极大丰富界面的现代美感。',
      faq: [
        {
          question: 'CSS border-radius 中间斜杠（/）代表什么含义？',
          answer:
            '斜杠用来分隔水平椭圆半轴与垂直椭圆半轴。斜杠前是四个角的水平方向圆角（从左上顺时针到左下），斜杠后是四个角的垂直方向圆角。常规单值（如 12px）实际上是让水平和垂直半轴相等（即正圆弧）。',
        },
        {
          question: '导出的 Tailwind CSS 代码兼容性如何？',
          answer:
            '工具导出的 Tailwind 代码采用任意值（Arbitrary Values）规范格式（例如 rounded-[60%_40%_30%_70%/_60%_30%_70%_40%]），Tailwind CSS v3+ 官方全版本原生兼容，无需安装额外插件即可直接写入 className。',
        },
        {
          question: '不规则圆角适合应用在哪些 UI 场景？',
          answer:
            '非常适合用作个人头像框、创意产品特性卡片封面背景、品牌标语强调底块或配合 CSS 动画 keyframes 实现水滴呼吸浮动效果。',
        },
      ],
      quickReference: {
        title: '常见 CSS 不规则有机形态参数速查表',
        caption: '下表为设计中常用的现代 Organic Blob 形态代码速查。',
        columns: ['形态名称', '核心 CSS border-radius 语法', '适用设计场景'],
        rows: [
          [
            '有机水滴 (Blob)',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '创意设计作品集头像、前沿科技网站背景徽标',
          ],
          [
            '科技徽章 (Badge)',
            '70% 30% 70% 30% / 30% 70% 30% 70%',
            '前沿功能亮点标签、限时特惠微凸卡片',
          ],
          [
            '自然卵石 (Pebble)',
            '45% 55% 40% 60% / 55% 45% 60% 40%',
            '生活方式、健康管理及温暖极简品牌背景',
          ],
          [
            '对角微折 (Diagonal)',
            '80% 20% 80% 20% / 20% 80% 20% 80%',
            '前沿卡片封面悬浮态、特色按钮微动效',
          ],
        ],
      },
    },
    featured: true,
    relatedTools: ['css-gradient-generator', 'box-shadow-generator'],
  },
  {
    id: 'daxie-guifan',
    slug: 'daxie-guifan',
    name: '人民币大写规范速查指南',
    shortName: '大写金额规范',
    category: 'number',
    topic: 'finance',
    intent: 'checker',
    status: 'published',
    component: 'DaxieGuifan',
    keywords: [
      '人民币大写规范',
      '发票大写怎么写',
      '金额大写规范',
      '大写金额零的规则',
      '大写金额整的用法',
      '支票大写规则',
    ],
    seo: {
      title: '人民币大写规范速查指南 | 官方票据结算凭证书写规则与在线合规性自检',
      description:
        '依据中国人民银行《正确填写票据和结算凭证的基本规定》打造的权威大写金额规范指南。提供大写数字标准字样、零与整的使用规则，并提供实时语法错别字自检测试。',
      h1: '人民币大写规范速查指南',
      intro:
        '财务报销、发票开具与商务合同必备的法定大写金额书写规范。提供正规大写字样对照、官方四大约束解析与交互式合规自测台，防范财务票据退票风险。',
      howTo: [
        '查阅上方标准大写数字对照表与禁止错别字说明（如不得以“两”代“贰”）。',
        '在自测输入框填入你需要核验的大写金额（如“壹万贰仟元整”）。',
        '系统将自动对照银发〔1997〕393号规定校验是否漏写“整”或多写“整”，并给出法定修改建议。',
      ],
      explanation:
        '根据中国人民银行银发〔1997〕393号《支付结算办法》附件规定，票据和结算凭证金额以中文大写和阿拉伯数码同时记载，两者必须完全一致。中文大写金额数字必须使用正楷或行书填写，严禁自造简写或错写，违规票据银行将不予受理。本指南提供完整的法定规则条文与即时校验功能。',
      faq: [
        {
          question: '什么时候大写金额末尾必须写“整”或“正”？',
          answer:
            '中文大写金额数字到“元”为止的，在“元”之后必须写“整”（或“正”）字；在“角”之后可以不写“整”字；如果大写金额数字有“分”的，“分”后面绝对不能写“整”字。',
        },
        {
          question: '阿拉伯数字中间有连续多个“0”时如何书写大写？',
          answer:
            '阿拉伯数字中间连续有几个“0”时，中文大写金额中只写一个“零”字。例如￥10,005.00，应写作“人民币壹万零伍元整”。',
        },
        {
          question: '“元”可以写成“圆”吗？“整”可以写成“正”吗？',
          answer:
            '可以。根据中国人民银行规定，“元”与“圆”通用，“整”与“正”通用，法律效力完全一致。',
        },
      ],
      quickReference: {
        title: '人民币大写核心易错规则速查备忘录',
        caption: '下表为财务审核中最为高频的四大退票风险点总结。',
        columns: ['规则场景', '常见错误写法 (被退票)', '法定合规标准写法', '法定规则依据'],
        rows: [
          ['含角分尾部带整', '壹佰元伍角叁分整', '壹佰元伍角叁分', '有分不得写整'],
          ['仅到元缺少整字', '壹佰元', '壹佰元整 (或正)', '到元必须写整'],
          ['金额代词简化', '两万元整', '贰万元整', '严禁以两代贰'],
          ['角位为零分位非零', '壹佰元叁分', '壹佰元零叁分', '角位为零分位非零须补零'],
        ],
      },
    },
    featured: true,
    relatedTools: ['rmb-uppercase', 'timestamp-converter'],
  },
]
