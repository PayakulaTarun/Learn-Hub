
import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';

interface CustomEditorProps extends EditorProps {
  label?: string;
}

const MonacoEditor: React.FC<CustomEditorProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col h-full border border-slate-700 rounded-lg overflow-hidden bg-[#1e1e1e]">
      {label && (
        <div className="px-4 py-2 bg-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
          {label}
        </div>
      )}
      <div className="flex-1">
        <Editor
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            padding: { top: 10 },
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
