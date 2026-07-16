/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PortfolioData, 
  Experience, 
  Project, 
  Skill, 
  ThemeType,
  ContactMessage
} from '../types';
import { 
  User, 
  Briefcase, 
  FolderGit2, 
  Code2, 
  MessageSquare, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Copy, 
  Check, 
  Github, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Mail,
  Phone,
  Palette,
  Sun,
  Moon,
  X,
  FileText
} from 'lucide-react';

interface EditorPanelProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
  onReset: () => void;
  messages: ContactMessage[];
  onClearMessages: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditorPanel({
  data,
  onChange,
  onReset,
  messages,
  onClearMessages,
  isOpen,
  onClose
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'projects' | 'skills' | 'messages'>('profile');
  const [copied, setCopied] = useState(false);

  // Profile update
  const handleProfileChange = (key: keyof PortfolioData['personal'], value: string) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [key]: value
      }
    });
  };

  // Experience updates
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      role: 'New Role',
      company: 'Company Name',
      period: '2026 - Present',
      description: 'Describe your accomplishments and responsibilities here.'
    };
    onChange({
      ...data,
      experiences: [newExp, ...data.experiences]
    });
  };

  const handleUpdateExperience = (id: string, key: keyof Experience, value: string) => {
    const updated = data.experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [key]: value };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const handleDeleteExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter(exp => exp.id !== id)
    });
  };

  // Project updates
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Project',
      description: 'Describe the solution, your technical decisions, and the overall impact.',
      tags: ['React', 'TypeScript'],
      link: 'https://github.com',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=400&h=250&auto=format&fit=crop'
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const handleUpdateProject = (id: string, key: keyof Project, value: any) => {
    const updated = data.projects.map(proj => {
      if (proj.id === id) {
        if (key === 'tags') {
          // Convert comma separated string to array
          const tagsArray = typeof value === 'string' ? value.split(',').map(t => t.trim()).filter(Boolean) : value;
          return { ...proj, tags: tagsArray };
        }
        return { ...proj, [key]: value };
      }
      return proj;
    });
    onChange({ ...data, projects: updated });
  };

  const handleDeleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id)
    });
  };

  // Skills updates
  const handleUpdateSkillsList = (index: number, valStr: string) => {
    const list = valStr.split(',').map(s => s.trim()).filter(Boolean);
    const updated = [...data.skills];
    updated[index] = { ...updated[index], list };
    onChange({ ...data, skills: updated });
  };

  const handleUpdateSkillCategoryName = (index: number, category: string) => {
    const updated = [...data.skills];
    updated[index] = { ...updated[index], category };
    onChange({ ...data, skills: updated });
  };

  const handleAddSkillCategory = () => {
    const newSkill: Skill = {
      category: 'New Category',
      list: ['Skill A', 'Skill B']
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill]
    });
  };

  const handleDeleteSkillCategory = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, idx) => idx !== index)
    });
  };

  const handleThemeChange = (theme: ThemeType) => {
    onChange({ ...data, theme });
  };

  const handleModeChange = (themeMode: 'light' | 'dark') => {
    onChange({ ...data, themeMode });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[480px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col font-sans text-zinc-300">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-400" />
          <h2 className="text-md font-display font-medium text-zinc-100 tracking-tight">Portfolio Customizer</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
          id="close-editor-btn"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick theme selector */}
      <div className="p-4 bg-zinc-900/20 border-b border-zinc-800/60 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium font-mono">Accent Palette</span>
          <div className="flex gap-2">
            {(['slate', 'amber', 'emerald', 'indigo', 'rose'] as ThemeType[]).map((themeName) => {
              const isActive = data.theme === themeName;
              return (
                <button
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize flex-1 transition-all duration-200 ${
                    isActive 
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold scale-[1.03] shadow-md' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  {themeName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium font-mono">Theme Mode</span>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map((mode) => {
              const currentMode = data.themeMode || 'dark';
              const isActive = currentMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize flex-1 transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold scale-[1.03] shadow-md' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  {mode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex bg-zinc-900/30 border-b border-zinc-800 text-xs overflow-x-auto custom-editor-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 py-3 px-4 font-medium border-b-2 transition-colors shrink-0 ${
            activeTab === 'profile' 
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/50' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 py-3 px-4 font-medium border-b-2 transition-colors shrink-0 ${
            activeTab === 'experience' 
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/50' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Experience
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 py-3 px-4 font-medium border-b-2 transition-colors shrink-0 ${
            activeTab === 'projects' 
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/50' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 py-3 px-4 font-medium border-b-2 transition-colors shrink-0 ${
            activeTab === 'skills' 
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/50' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Skills
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-1.5 py-3 px-4 font-medium border-b-2 transition-colors shrink-0 relative ${
            activeTab === 'messages' 
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/50' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Inquiries
          {messages.length > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-editor-scrollbar bg-zinc-950/60">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 pb-2 border-b border-zinc-900">Personal Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.personal.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Professional Role</label>
                <input
                  type="text"
                  value={data.personal.role}
                  onChange={(e) => handleProfileChange('role', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Avatar / Portrait URL</label>
                <input
                  type="text"
                  value={data.personal.avatar}
                  onChange={(e) => handleProfileChange('avatar', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Short Biography</label>
                <textarea
                  rows={4}
                  value={data.personal.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Location</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={data.personal.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    value={data.personal.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={data.personal.phone || ''}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">GitHub URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Github className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={data.personal.github}
                    onChange={(e) => handleProfileChange('github', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">LinkedIn URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Linkedin className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={data.personal.linkedin}
                    onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Twitter / X URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Twitter className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={data.personal.twitter}
                    onChange={(e) => handleProfileChange('twitter', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Resume URL (PDF / Drive)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={data.personal.resume || ''}
                    onChange={(e) => handleProfileChange('resume', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-xs"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-100">Professional Journey</h3>
              <button
                onClick={handleAddExperience}
                className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-800 transition-colors"
                id="add-exp-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Work
              </button>
            </div>

            {data.experiences.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No experiences listed. Add one to begin.</p>
            ) : (
              <div className="space-y-4">
                {data.experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-3 relative group">
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-md transition-colors"
                      title="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="inline-block px-1.5 py-0.5 bg-zinc-900 text-[10px] font-mono text-zinc-500 border border-zinc-800 rounded">
                      Experience #{index + 1}
                    </span>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-650"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Role / Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-650"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Duration (e.g. 2024 - Present)</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleUpdateExperience(exp.id, 'period', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-650"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Key Description / Impact</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-650 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-100">Featured Creations</h3>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-800 transition-colors"
                id="add-proj-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            {data.projects.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No projects created. Click add above.</p>
            ) : (
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={proj.id} className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-3 relative">
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-md transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="inline-block px-1.5 py-0.5 bg-zinc-900 text-[10px] font-mono text-zinc-500 border border-zinc-800 rounded">
                      Project #{index + 1}
                    </span>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Elevator Description</label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Technologies / Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={proj.tags.join(', ')}
                        onChange={(e) => handleUpdateProject(proj.id, 'tags', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none font-mono"
                        placeholder="React, Redux, Node"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Image Thumbnail URL</label>
                        <input
                          type="text"
                          value={proj.image}
                          onChange={(e) => handleUpdateProject(proj.id, 'image', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 focus:outline-none font-mono text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Deployment / Repo Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 focus:outline-none font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-100">Technical Skill Categories</h3>
              <button
                onClick={handleAddSkillCategory}
                className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-800 transition-colors"
                id="add-skill-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-3 relative">
                  <button
                    onClick={() => handleDeleteSkillCategory(index)}
                    className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-md transition-colors"
                    title="Delete skill category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Category Name</label>
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => handleUpdateSkillCategoryName(index, e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Skill List (comma-separated)</label>
                    <textarea
                      rows={2}
                      value={skill.list.join(', ')}
                      onChange={(e) => handleUpdateSkillsList(index, e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none font-mono resize-none"
                      placeholder="React, CSS, HTML"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-100">Client Inquiries ({messages.length})</h3>
              {messages.length > 0 && (
                <button
                  onClick={onClearMessages}
                  className="text-[10px] font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
                  No inquiries received yet. Try filling out the contact form on your portfolio to see how it works!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200">{msg.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-500">{msg.email}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600 shrink-0">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-100 transition-colors border border-zinc-700/60"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Copied JSON!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Config Data
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-medium transition-colors border border-zinc-800"
          title="Reset to initial mockup"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
