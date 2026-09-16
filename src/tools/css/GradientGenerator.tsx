import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CopyButton } from '../../components/common/CopyButton';
import {
  GradientConfig,
  formatCssGradient,
  PRESET_GRADIENTS,
} from '../../lib/css/gradient';
import { Plus, Trash2, RotateCw } from 'lucide-react';

export const GradientGenerator: React.FC = () => {
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    stops: [
      { id: '1', color: '#0ea5e9', position: 0 },
      { id: '2', color: '#6366f1', position: 100 },
    ],
  });

  const cssString = `background: ${formatCssGradient(config)};`;

  const addStop = () => {
    const newId = String(Date.now());
    setConfig({
      ...config,
      stops: [...config.stops, { id: newId, color: '#ec4899', position: 50 }],
    });
  };

  const removeStop = (id: string) => {
    if (config.stops.length <= 2) {
      alert('渐变至少需要保留 2 个色标');
      return;
    }
    setConfig({
      ...config,
      stops: config.stops.filter((s) => s.id !== id),
    });
  };

  const updateStop = (id: string, updates: Partial<{ color: string; position: number }>) => {
    setConfig({
      ...config,
      stops: config.stops.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：实时预览与预设推荐 */}
          <div className="space-y-5">
            <div
              className="w-full h-56 rounded-2xl border border-slate-200/80 shadow-md transition-all duration-200 flex items-center justify-center relative overflow-hidden"
              style={{ background: formatCssGradient(config) }}
            >
              <span className="bg-slate-900/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                实时渐变效果预览
              </span>
            </div>

            {/* 渐变预设 */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 mb-2.5 block">
                精选高颜值渐变预设
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_GRADIENTS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setConfig(p.config)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-primary-400 bg-white shadow-sm transition-all text-left group"
                  >
                    <div
                      className="w-7 h-7 rounded-md shrink-0 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                      style={{ background: formatCssGradient(p.config) }}
                    />
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：参数控制与 CSS 代码导出 */}
          <div className="space-y-5">
            {/* 角度与类型调节 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> 渐变角度控制 ({config.angle}°)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfig({ ...config, type: 'linear' })}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      config.type === 'linear'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-slate-600 border'
                    }`}
                  >
                    线性 (Linear)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, type: 'radial' })}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      config.type === 'radial'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-slate-600 border'
                    }`}
                  >
                    径向 (Radial)
                  </button>
                </div>
              </div>

              {config.type === 'linear' && (
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={config.angle}
                  onChange={(e) => setConfig({ ...config, angle: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              )}
            </div>

            {/* 色标列表 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase text-slate-600">
                  色标调配 (Color Stops)
                </span>
                <Button size="sm" variant="outline" onClick={addStop} className="gap-1 text-xs py-1 h-7">
                  <Plus className="w-3.5 h-3.5" /> 添加色标
                </Button>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {config.stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm"
                  >
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                      className="w-24 text-xs font-mono border border-slate-300 rounded px-2 py-1"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                        className="w-full accent-primary-600 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-500 w-9 text-right">
                        {stop.position}%
                      </span>
                    </div>
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="删除此色标"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS 输出与一键复制 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">
                  CSS 样式代码
                </label>
                <CopyButton textToCopy={cssString} label="复制 CSS" copiedLabel="已复制 CSS" />
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto select-all">
                {cssString}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
