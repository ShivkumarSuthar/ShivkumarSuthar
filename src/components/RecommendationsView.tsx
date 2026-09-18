import React from 'react';
import { RECOMMENDATIONS, PERSONAL_INFO } from '../data/portfolioData';
import { Quote, ThumbsUp, Linkedin, ExternalLink, MessageSquareQuote } from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  return (
    <div id="recommendations-view-container" className="space-y-8 w-full">
      {/* Header matching Martin Burford */}
      <div className="space-y-3 border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1f1f1f] px-2 py-0.5 rounded-md bg-[#2563eb]">
            Social Proof
          </span>
          <span className="text-xs text-[var(--text-subtle)]">• Colleague & Client Endorsements</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
          Recommendations & Testimonials
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
          Throughout my 3+ years of commercial software development, I have collaborated with architects, designers, engineering managers, and business owners. Here is what they have shared about my technical problem-solving, code maintainability, and delivery reliability.
        </p>

        <div className="pt-2">
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#1f1f1f] bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors shadow-xs"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>Connect on LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-6">
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.id}
            id={`recommendation-${rec.id}`}
            className="p-6 sm:p-8 rounded-2xl border relative space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#2563eb] text-[#1f1f1f] flex items-center justify-center font-bold text-sm shadow-xs">
                  {rec.avatarInitials}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                    {rec.author}
                  </h3>
                  <p className="text-xs font-semibold text-[#2563eb]">{rec.role}</p>
                  <p className="text-xs text-[var(--text-subtle)]">{rec.company}</p>
                </div>
              </div>

              <div className="text-xs font-mono text-[var(--text-subtle)] shrink-0">
                {rec.date}
              </div>
            </div>

            <div className="text-xs font-medium text-[var(--text-subtle)] italic border-l-2 border-[#2563eb] pl-3 py-0.5">
              Relationship: {rec.relationship}
            </div>

            <blockquote className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed relative pt-2">
              <span className="text-[#2563eb] font-serif text-2xl leading-none mr-1">“</span>
              {rec.testimonial}
              <span className="text-[#2563eb] font-serif text-2xl leading-none ml-1">”</span>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
};
