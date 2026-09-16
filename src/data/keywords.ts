/**
 * 全站关键词字典与搜索意图分类拓扑 (符合 Prompt 第八、六十节规范)
 */

export interface KeywordCluster {
  topic: string;
  category: string;
  keywords: string[];
  searchIntent: string;
}

export const keywordClusters: KeywordCluster[] = [
  {
    topic: 'color',
    category: 'color',
    searchIntent: '网页与UI设计中快速选取并转换色彩模式代码',
    keywords: [
      '颜色拾取器',
      '在线调色板',
      'HEX转RGB',
      'RGB转HEX',
      'HSL颜色转换',
      'color picker online',
    ],
  },
  {
    topic: 'finance',
    category: 'number',
    searchIntent: '商务发票、报销单据及财务凭证标准大写金额规范书写',
    keywords: [
      '人民币大写转换',
      '金额大写转换器',
      '数字转大写',
      '发票大写金额',
      '大写金额规范',
      '财务数字大写',
    ],
  },
  {
    topic: 'favicon',
    category: 'favicon',
    searchIntent: 'Web网站多终端浏览器标签图标制作与全套尺寸裁切导出',
    keywords: [
      'favicon生成器',
      'ico生成器',
      '图片转ico',
      '网站图标制作',
      'apple-touch-icon生成',
      'favicon generator',
    ],
  },
  {
    topic: 'css',
    category: 'css',
    searchIntent: '前端开发中可视化调整并生成现代CSS3线性与径向渐变代码',
    keywords: [
      'css渐变生成器',
      'linear-gradient生成',
      '渐变背景css',
      '在线渐变设计',
      'css gradient generator',
    ],
  },
];
