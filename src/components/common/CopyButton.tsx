import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button, ButtonProps } from './Button';

export interface CopyButtonProps extends Omit<ButtonProps, 'children'> {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = '复制',
  copiedLabel = '已复制',
  variant = 'outline',
  size = 'sm',
  className = '',
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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
