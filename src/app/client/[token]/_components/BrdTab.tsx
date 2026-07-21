import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BrdTabProps {
  summary: string;
}

export function BrdTab({ summary }: BrdTabProps) {
  return (
    <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6 md:p-8 animate-in fade-in">
      <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-a:text-purple-400">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {summary}
        </ReactMarkdown>
      </div>
    </div>
  );
}
