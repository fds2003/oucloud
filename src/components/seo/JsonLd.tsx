import React from 'react';

export interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  // 转义 `<`：文案中若出现 "</script>" 会提前截断脚本块并造成 XSS。
  // \u003c 在 JSON 中等价于字面量 `<`，不影响 Schema 解析。
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};
