import React, { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { CopyButton } from '../../components/common/CopyButton';
import { convertToRmbUppercase } from '../../lib/number/rmbUppercase';
import { CheckCircle, AlertCircle, ArrowDown } from 'lucide-react';

const COMMON_PRESETS = [
  { label: '壹佰元整', val: '100' },
  { label: '壹仟元整', val: '1000' },
  { label: '伍万元整', val: '50000' },
  { label: '发票常用小数', val: '12345.67' },
];

export const RmbUppercase: React.FC = () => {
  const [inputVal, setInputVal] = useState('12345.67');

  const conversion = useMemo(() => {
    return convertToRmbUppercase(inputVal);
  }, [inputVal]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-5">
          {/* 输入框 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="rmb-input" className="text-sm font-semibold text-slate-800">
                输入阿拉伯数字金额 (元)
              </label>
              <div className="flex gap-1.5">
                {COMMON_PRESETS.map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setInputVal(p.val)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
                  >
                    {p.val}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-semibold text-base pointer-events-none">
                ¥
              </span>
              <input
                id="rmb-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.trim())}
                placeholder="例如：1234.56"
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
            </div>
          </div>

          {/* 转换流向指示 */}
          <div className="flex justify-center -my-1 text-slate-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* 转换结果输出区 */}
          <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-primary-700 flex items-center gap-1.5">
                {conversion.success ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    标准财务中文大写
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    输入提示
                  </>
                )}
              </span>
              {conversion.success && (
                <CopyButton
                  textToCopy={conversion.result}
                  label="复制大写"
                  copiedLabel="已复制大写"
                  variant="primary"
                  size="sm"
                />
              )}
            </div>

            <div className="min-h-[3rem] flex items-center">
              {conversion.success ? (
                <span className="text-xl sm:text-2xl font-bold tracking-wide text-slate-900 select-all">
                  {conversion.result}
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600">
                  {conversion.error}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
