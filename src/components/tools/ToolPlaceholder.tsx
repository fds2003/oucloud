import { Construction } from 'lucide-react';
import { Card } from '../common/Card';

export function ToolPlaceholder({ name }: { name: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Construction className="h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-700">{name}正在开发中</p>
      <p className="text-xs text-slate-500">该工具即将上线，敬请期待。</p>
    </Card>
  );
}
