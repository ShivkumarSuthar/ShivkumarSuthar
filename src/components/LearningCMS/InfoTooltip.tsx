/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function InfoTooltip({ text, position = 'top' }: InfoTooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span className="group relative inline-block ml-1.5 text-zinc-400 hover:text-indigo-400 transition-colors align-middle cursor-help select-none">
      <Info className="w-3.5 h-3.5 inline" />
      <span className={`pointer-events-none absolute ${positionClasses[position]} w-56 p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-200 text-[10px] font-mono leading-relaxed rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-2xl z-50 text-center normal-case tracking-tight`}>
        {text}
      </span>
    </span>
  );
}
