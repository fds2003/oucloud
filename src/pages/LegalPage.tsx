import { useSeo } from '../components/seo/useSeo';
import { SITE } from '../data/site';

type LegalDoc = 'about' | 'privacy' | 'terms';

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalContent {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: LegalSection[];
}

const DOCS: Record<LegalDoc, LegalContent> = {
  about: {
    path: '/about',
    title: `关于我们 - 纯前端在线工具平台 | ${SITE.name}`,
    description:
      'OUCloud 是一个坚持纯前端运算的在线工具平台，所有工具在浏览器本地完成处理，不注册、不上传文件。',
    h1: '关于 OUCloud',
    intro:
      'OUCloud 的出发点很简单：把高频小工具做成打开就能用、用完就走、不需要注册的网页工具。',
    sections: [
      {
        heading: '我们做什么',
        body: [
          '我们只做一件事：把日常办公、设计、开发中反复用到的小功能，做成在浏览器里就能完成的工具。',
          '目前已上线颜色拾取、人民币金额大写转换、Favicon 图标生成、CSS 渐变生成等工具，并会持续补充。'
        ]
      },
      {
        heading: '技术上的取舍',
        body: [
          '所有工具都是纯前端实现，运算在你的浏览器本地完成，没有后端参与，因此也没有数据上传的风险。',
          '整套站点以静态方式发布，页面本身极轻，在移动网络下同样能快速打开。'
        ]
      },
      {
        heading: '联系我们',
        body: ['如果你有工具需求、发现错误或有合作意向，欢迎通过站内反馈渠道联系我们。']
      }
    ]
  },
  privacy: {
    path: '/privacy',
    title: `隐私保护政策 | ${SITE.name}`,
    description:
      'OUCloud 隐私政策说明：工具运算全部在浏览器本地完成，不上传也不存储用户输入的金额、颜色与图片数据。',
    h1: '隐私保护政策',
    intro: '我们尽量不收集任何信息，以下说明本站具体处理了哪些数据。',
    sections: [
      {
        heading: '一、工具输入的数据',
        body: [
          '你在工具中输入的数字、文本、颜色值以及上传的图片，全部只在你的浏览器内存中参与运算，不会被上传到服务器，也不会被本站保存。',
          '刷新或关闭页面后，这些数据即被清除。'
        ]
      },
      {
        heading: '二、账号与个人信息',
        body: ['本站不提供账号体系，不需要也不要求你提交手机号、邮箱或任何身份信息。']
      },
      {
        heading: '三、本地存储与 Cookie',
        body: [
          '本站可能使用浏览器本地存储保存少量界面偏好设置，用于改善体验。这类数据保存在你的设备上，不会回传。'
        ]
      },
      {
        heading: '四、访问统计',
        body: [
          '为了解页面访问情况，本站可能使用第三方访问统计服务，仅记录不涉及个人身份的匿名访问数据（如访问页面、设备类型、来源渠道）。'
        ]
      },
      {
        heading: '五、政策更新',
        body: ['如本政策发生调整，我们会在本页面更新，并以页面公布内容为准。']
      }
    ]
  },
  terms: {
    path: '/terms',
    title: `服务与免责条款 | ${SITE.name}`,
    description:
      'OUCloud 服务条款与免责声明：本站工具计算结果仅供参考，财务、票据等正式场景请以主管机构规定为准。',
    h1: '服务与免责条款',
    intro: '使用本站即表示你已阅读并理解以下条款。',
    sections: [
      {
        heading: '一、服务内容',
        body: [
          '本站免费提供纯前端在线工具。工具按现状提供，我们不对可用性、连续性作出承诺，也可能随时调整或下线某个工具。'
        ]
      },
      {
        heading: '二、结果仅供参考',
        body: [
          '工具计算与转换结果仅供参考。涉及财务票据、合同、申报等正式场景时，请务必按银行、税务机关等主管机构的要求进行复核。',
          '因直接使用本站结果而产生的任何后果，本站不承担责任。'
        ]
      },
      {
        heading: '三、用户责任',
        body: [
          '你需对上传或输入的内容拥有合法权利，不得利用本站工具处理违反法律法规的内容。'
        ]
      },
      {
        heading: '四、知识产权',
        body: ['本站的界面、文案与代码归本站所有。未经许可，不得整体复制或用于商业再发布。']
      }
    ]
  }
};

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const content = DOCS[doc];

  useSeo({
    title: content.title,
    description: content.description,
    path: content.path
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {content.h1}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{content.intro}</p>

      <div className="mt-10 space-y-8">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-base font-semibold text-slate-900">{section.heading}</h2>
            <div className="mt-3 space-y-2">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
