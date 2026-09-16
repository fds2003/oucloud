import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button, ButtonProps } from './Button';
import { copyToClipboard } from '../../lib/browser';
import { trackEvent } from '../../lib/analytics';

export interface CopyButtonProps extends Omit<ButtonProps, 'children'> {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  toolId?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = '复制',
  copiedLabel = '已复制',
  variant = 'outline',
  size = 'sm',
  toolId,
  className = '',
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      if (toolId) {
        trackEvent('tool_copy', { toolId });
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant={copied ? 'secondary' : variant}
      size={size}
      onClick={handleCopy}
      className={`gap-1.5 transition-all ${className}`}
      {...props}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};
