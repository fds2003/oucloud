export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0 - 100
}

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  angle: number; // 0 - 360 (线性渐变生效)
  stops: GradientStop[];
}

/**
 * 格式化输出 CSS 渐变背景样式字符串
 */
export function formatCssGradient(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops
    .map((s) => `${s.color} ${Math.round(s.position)}%`)
    .join(', ');

  if (config.type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`;
  }

  return `linear-gradient(${config.angle}deg, ${stopsStr})`;
}

/**
 * 生成预设渐变推荐列表
 */
export const PRESET_GRADIENTS: { name: string; config: GradientConfig }[] = [
  {
    name: '极光青蓝 (Aurora)',
    config: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#00c6ff', position: 0 },
        { id: '2', color: '#0072ff', position: 100 },
      ],
    },
  },
  {
    name: '落日余晖 (Sunset)',
    config: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ff7e5f', position: 0 },
        { id: '2', color: '#feb47b', position: 100 },
      ],
    },
  },
  {
    name: '赛博霓虹 (Cyberpunk)',
    config: {
      type: 'linear',
      angle: 45,
      stops: [
        { id: '1', color: '#f72585', position: 0 },
        { id: '2', color: '#7209b7', position: 50 },
        { id: '3', color: '#4cc9f0', position: 100 },
      ],
    },
  },
  {
    name: '薄荷清新 (Fresh Mint)',
    config: {
      type: 'linear',
      angle: 120,
      stops: [
        { id: '1', color: '#a8ff78', position: 0 },
        { id: '2', color: '#78ffd6', position: 100 },
      ],
    },
  },
];
