import React, { useState } from 'react';
import { CODE_SAMPLES } from '../data/portfolioData';
import { Code2, Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';

export const CodeSamplesView: React.FC = () => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(CODE_SAMPLES[0].id);
  const [copied, setCopied] = useState(false);

  const activeSample = CODE_SAMPLES.find((s) => s.id === selectedSampleId) || CODE_SAMPLES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-samples-view-container" className="space-y-8 w-full">
      {/* Intro */}
      <div className="space-y-3 border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1f1f1f] px-2 py-0.5 rounded-md bg-[#2563eb]">
            Source & Architecture
          </span>
          <span className="text-xs text-[var(--text-subtle)]">• Production Snippets</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
          Code Samples & Patterns
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
          While many client codebases remain protected under commercial NDAs, these architectural snippets illustrate my patterns for modern Next.js 16 Server Actions, GSAP animation hooks, and resilient TanStack Query cache synchronization.
        </p>

        {/* Sample Selection Tabs */}
        <div className="flex flex-wrap gap-2 pt-3">
          {CODE_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => setSelectedSampleId(sample.id)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                selectedSampleId === sample.id
                  ? 'bg-[#2563eb] text-[#1f1f1f] border-[#2563eb] shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)]'
              }`}
            >
              {sample.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Sample Display */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Sample Meta Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563eb] uppercase tracking-wider mb-1">
              <Terminal className="w-4 h-4 text-[#2563eb]" />
              <span>{activeSample.category}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">
              {activeSample.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
              {activeSample.description}
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[#2563eb] text-[var(--text-main)] transition-colors self-start sm:self-auto shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Code</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Copy Snippet</span>
              </>
            )}
          </button>
        </div>

        {/* Key Takeaways */}
        <div className="px-6 py-3.5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)]">
          <span className="font-bold text-[var(--text-main)]">Key Architecture Highlights:</span>
          {activeSample.takeaways.map((takeaway, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
              <span>{takeaway}</span>
            </span>
          ))}
        </div>

        {/* Code Block */}
        <div className="bg-[#ffffff] text-[#0f172a] p-5 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed border-t border-[var(--border-subtle)]">
          <pre>
            <code className="text-[#0f172a] font-medium">{activeSample.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
