import { useMemo, useState } from 'react';
import { Eraser } from 'lucide-react';
import { convertToRmbUppercase } from '../../lib/number/rmbUppercase';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { CopyButton } from '../common/CopyButton';
import { Input } from '../common/Input';

const QUICK_SAMPLES = ['100', '1234.56', '10000', '0.01', '100000000'];

export function RmbUppercaseTool() {
  const [value, setValue] = useState('');

  const outcome = useMemo(() => {
    if (!value.trim()) return null;
    return convertToRmbUppercase(value);
  }, [value]);

  const result = outcome?.success ? outcome.result : '';
  const error = outcome && !outcome.success ? outcome.error : undefined;

  return (
    <div className="space-y-6">
      <Card>
        <Input
          id="rmb-amount"
          label="输入金额（元）"
          placeholder="例如：1234.56"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          error={error}
          helperText="支持最多两位小数（角、分），上限为万亿级金额。"
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">常用示例</span>
          {QUICK_SAMPLES.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setValue(sample)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              {sample}
            </button>
          ))}
          {value && (
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setValue('')}>
              <Eraser className="h-3.5 w-3.5" />
              清空
            </Button>
          )}
        </div>
      </Card>

      <Card className="bg-slate-50/60">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-slate-700">大写结果</h2>
          {result && <CopyButton textToCopy={result} label="复制大写金额" />}
        </div>
        <p
          aria-live="polite"
          className={`mt-3 break-all text-xl font-semibold leading-relaxed ${
            result ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          {result || '输入金额后自动生成标准中文大写'}
        </p>
      </Card>
    </div>
  );
}
