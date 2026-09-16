import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { CopyButton } from '../../components/common/CopyButton';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  formatRgb,
  formatHsl,
  isValidHex,
  RGB,
  HSL,
} from '../../lib/color/conversion';

const PRESET_COLORS = [
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#eab308', '#84cc16', '#10b981', '#06b6d4',
  '#64748b', '#0f172a', '#ffffff', '#000000',
];

export const ColorPicker: React.FC = () => {
  const [hex, setHex] = useState('#0ea5e9');
  const [rgb, setRgb] = useState<RGB>({ r: 14, g: 165, b: 233 });
  const [hsl, setHsl] = useState<HSL>({ h: 199, s: 89, l: 48 });

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    if (isValidHex(newHex)) {
      const parsedRgb = hexToRgb(newHex);
      if (parsedRgb) {
        setRgb(parsedRgb);
        setHsl(rgbToHsl(parsedRgb));
      }
    }
  };

  const updateFromRgb = (newRgb: RGB) => {
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb));
  };

  const updateFromHsl = (newHsl: HSL) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：调色板与大预览 */}
          <div className="space-y-4">
            <div
              className="w-full h-44 rounded-xl border border-slate-200/80 shadow-inner transition-colors duration-150 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: isValidHex(hex) ? hex : '#ffffff' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <input
                type="color"
                value={isValidHex(hex) ? hex : '#0ea5e9'}
                onChange={(e) => updateFromHex(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="点击选择颜色"
              />
              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow pointer-events-none">
                点击此处直接拾取颜色
              </span>
            </div>

            {/* 常用预设色卡 */}
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-2 block">
                常用设计预设色彩
              </span>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateFromHex(c)}
                    className="w-full aspect-square rounded-md border border-slate-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: c }}
                    title={c}
                    aria-label={`选择颜色 ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：数值控制与一键复制 */}
          <div className="space-y-4">
            {/* HEX */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">HEX 色值</label>
                <CopyButton textToCopy={hex} size="sm" />
              </div>
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#0ea5e9"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* RGB */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">RGB 色值</label>
                <CopyButton textToCopy={formatRgb(rgb)} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">R (红)</span>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateFromRgb({ ...rgb, r: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">G (绿)</span>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateFromRgb({ ...rgb, g: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">B (蓝)</span>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateFromRgb({ ...rgb, b: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* HSL */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">HSL 色值</label>
                <CopyButton textToCopy={formatHsl(hsl)} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">H (色相 °)</span>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">S (饱和度 %)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">L (亮度 %)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
