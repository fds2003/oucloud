import { describe, it, expect } from 'vitest';
import { formatCssGradient, GradientConfig } from '../../src/lib/css/gradient';

describe('CSS Gradient Engine', () => {
  it('formats linear gradient CSS correctly', () => {
    const config: GradientConfig = {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ff0000', position: 0 },
        { id: '2', color: '#0000ff', position: 100 },
      ],
    };
    expect(formatCssGradient(config)).toBe('linear-gradient(90deg, #ff0000 0%, #0000ff 100%)');
  });

  it('formats radial gradient CSS correctly and sorts stops', () => {
    const config: GradientConfig = {
      type: 'radial',
      angle: 0,
      stops: [
        { id: '2', color: '#0000ff', position: 100 },
        { id: '1', color: '#ff0000', position: 0 },
      ],
    };
    expect(formatCssGradient(config)).toBe('radial-gradient(circle, #ff0000 0%, #0000ff 100%)');
  });
});
