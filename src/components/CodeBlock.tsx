import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export default function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className={`relative ${className}`}>
      <pre className="code-block">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}