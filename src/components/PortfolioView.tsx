import React, { useState } from 'react';
import { ProjectItem, ExperienceItem } from '../types';
import { PROJECTS, WORK_EXPERIENCE } from '../data/portfolioData';
import {
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  MapPin,
  CheckCircle2,
  Tag,
  Building2,
  Laptop
} from 'lucide-react';

interface PortfolioViewProps {
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onOpenProjectModal }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'fullstack' | 'frontend3d' | 'enterprise'>('all');

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fullstack') return p.category === 'Full-Stack';
    if (activeTab === 'frontend3d') return p.category === 'Frontend & 3D';
    if (activeTab === 'enterprise') return p.category === 'Enterprise & Tools';
    return true;
  });

  return (
    <div id="portfolio-view-container" className="space-y-8 w-full">
      {/* Intro Header matching Martin Burford */}
      <div className="space-y-3 border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md bg-[#2563eb]">
            Work Showcase
          </span>
          <span className="text-xs text-[var(--text-subtle)]">• 2022 to Present</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
          Portfolio & Commercial Engagements
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
          This page shows all commercial jobs, client applications, and featured production projects I have engineered over the past 3+ years. Accessibility, performance, responsiveness, and clean architecture are at the core of everything I build.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]'
            }`}
          >
            All Work ({PROJECTS.length})
          </button>
          <button
            onClick={() => setActiveTab('fullstack')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'fullstack'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]'
            }`}
          >
            Full-Stack Systems
          </button>
          <button
            onClick={() => setActiveTab('frontend3d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'frontend3d'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]'
            }`}
          >
            3D & Interactive WebGL
          </button>
          <button
            onClick={() => setActiveTab('enterprise')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'enterprise'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]'
            }`}
          >
            Enterprise CRM & Procurement
          </button>
        </div>
      </div>

      {/* Featured Projects Grid */}
      <div className="space-y-8">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            id={`project-card-${project.id}`}
            className="p-6 sm:p-8 rounded-2xl border transition-all hover:border-[#2563eb] space-y-5"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            {/* Card Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md bg-[#2563eb]">
                    {project.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                    {project.status}
                  </span>
                  {project.clientOrOrg && (
                    <span className="text-xs text-[var(--text-subtle)]">
                      • {project.clientOrOrg}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#2563eb] mt-0.5">
                  {project.subtitle}
                </p>
              </div>

              <div className="text-xs font-mono text-[var(--text-subtle)] shrink-0 sm:text-right">
                {project.timeframe}
              </div>
            </div>

            {/* Overview */}
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              {project.overview}
            </p>

            {/* Key Features */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                Key Engineering Highlights:
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-muted)]">
                {project.keyFeatures.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--border-subtle)]">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Links (Martin Burford style) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id={`view-details-${project.id}`}
                onClick={() => onOpenProjectModal(project)}
                className="chevron-hover-target inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
              >
                <span>View project case study</span>
                <ChevronRight className="w-4 h-4 chevron-arrow transition-transform" />
              </button>

              {project.liveUrl && (
                <a
                  id={`live-link-${project.id}`}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2563eb] hover:underline"
                >
                  <span>Visit live website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Commercial Employment History Section */}
      <div className="pt-8 space-y-6">
        <div className="border-b border-[var(--border-subtle)] pb-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#2563eb]" />
            <span>Commercial Employment History</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Companies, roles, and enterprise contributions since 2022
          </p>
        </div>

        <div className="space-y-6">
          {WORK_EXPERIENCE.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-xl border bg-[var(--bg-surface)] border-[var(--border-subtle)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                    {exp.type}
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)]">
                    {exp.role} • <span className="text-[#2563eb]">{exp.company}</span>
                  </h4>
                  <div className="text-xs text-[var(--text-subtle)] flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{exp.location}</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-medium text-[var(--text-muted)]">
                  {exp.period}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {exp.overview}
              </p>

              <div className="space-y-1.5">
                {exp.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                    <span className="text-[#2563eb] font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
