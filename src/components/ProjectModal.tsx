import React, { useEffect } from 'react';
import { ProjectItem } from '../types';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        id="modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-[#da7b5a]/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Modal Container */}
      <div
        id="project-detail-modal"
        className="relative w-full max-w-2xl bg-[var(--bg-surface)] text-[var(--text-main)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] text-[#1f1f1f] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] bg-[#ffffff]/20 px-2 py-0.5 rounded">
                {project.category}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#2563eb] text-[#1f1f1f]">
                {project.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f1f1f]">{project.title}</h2>
            <p className="text-xs sm:text-sm text-[#f8fafc]/90 mt-0.5">{project.subtitle}</p>
          </div>

          <button
            id="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-[#1f1f1f] hover:bg-[#ffffff]/15 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[var(--text-muted)]">
          {/* Timeline & Client */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
            <div>
              <span className="font-bold text-[var(--text-main)]">Client / Organization: </span>
              <span>{project.clientOrOrg || 'Commercial Client'}</span>
            </div>
            <div className="font-mono text-[var(--text-subtle)]">
              Timeline: {project.timeframe}
            </div>
          </div>

          {/* Problem & Solution */}
          {project.problemStatement && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                The Challenge
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-main)]">
                {project.problemStatement}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                The Architectural Solution
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-main)]">
                {project.solution}
              </p>
            </div>
          )}

          {/* Key Features List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Core Engineering Deliverables
            </h3>
            <ul className="space-y-2">
              {project.keyFeatures.map((feat, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                Impact & Performance Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {project.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center"
                  >
                    <div className="text-xs font-bold text-[#2563eb]">{metric}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Used */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-[#1f1f1f] bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors shadow-xs"
              >
                <span>Visit Live Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
