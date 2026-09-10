import React from 'react';
import { TabType } from '../types';
import {
  PERSONAL_INFO,
  WORK_EXPERIENCE,
  PROJECTS,
  CURRENT_TECH_STACK,
  OTHER_TECH_STACK
} from '../data/portfolioData';
import {
  Printer,
  Download,
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Globe,
  MapPin,
  GraduationCap,
  Briefcase,
  Wrench,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface CvViewProps {
  onBackToHome: () => void;
}

export const CvView: React.FC<CvViewProps> = ({ onBackToHome }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
${PERSONAL_INFO.name.toUpperCase()}
Full-Stack Developer
Phone: ${PERSONAL_INFO.phone} | Email: ${PERSONAL_INFO.email}
Website: ${PERSONAL_INFO.website} | LinkedIn: ${PERSONAL_INFO.linkedin}
Location: ${PERSONAL_INFO.location}

==================================================
PROFESSIONAL SUMMARY
==================================================
${PERSONAL_INFO.bioParagraph1}
${PERSONAL_INFO.bioParagraph2}

==================================================
TECHNICAL SKILLS
==================================================
* Frontend: React.js, Next.js, Three.js, Babylon.js, GSAP, Framer Motion, Vue.js, HTML5, CSS3
* Languages: TypeScript, JavaScript (ES6+), Java
* State & Data: Redux Toolkit (RTK), Zustand, TanStack Query, Context API
* Backend: Node.js, Express.js, RESTful API Development & Integration
* Databases: MongoDB, MySQL, SQL
* UI & Styling: Tailwind CSS, Material UI (MUI), Bootstrap, Styled Components, Shadcn/ui
* Cloud & DevOps: Docker, AWS (EC2, VPS)
* Development Tools: Git, GitHub, JIRA, Figma, Postman, Email on Acid, Veeva Vault
* Problem Solving: Root Cause Analysis, Debugging, Performance Optimization, Refactoring

==================================================
EMPLOYMENT HISTORY
==================================================
1. Dev Technosys Pvt Ltd. (Jaipur, Rajasthan) - May 2023 - Present
   MERN STACK DEVELOPER
   - Worked on the AIE South Africa web ecosystem for 2+ years.
   - Contributed to multiple production applications and primary website.
   - Responsible for debugging, root-cause analysis, and performance optimization.
   - Collaborated with team members and stakeholders to analyze requirements.

2. Rams Creative Technologies Pvt Ltd - Feb 2024 - May 2024
   REACT DEVELOPER
   - Developed immersive 3D web experiences using React.js, Three.js, and Babylon.js.
   - Built engaging interfaces and animations for Cretea Spa.
   - Implemented interactive animations using GSAP, Framer Motion, and Redux.

3. Viseven India Pvt. Ltd. - October 2022 - January 2024
   FRONTEND DEVELOPER
   - Developed responsive web interfaces using HTML, CSS, JavaScript, Vue.js, and React.js.
   - Built and maintained e-Wizard templates across Veeva, Salesforce, and Email on Acid.

==================================================
EDUCATION
==================================================
Bachelor of Science in Information Technology - Mumbai University (2022)

==================================================
KEY PROJECTS
==================================================
- Suthar Living: Full-Stack Web Application (Next.js 16, React 19, TypeScript, Tailwind, MongoDB)
- Foliary: Portfolio CRM (React.js, Node.js, Express.js, MongoDB)
- POMS: Purchase Order Management System (React.js, Node.js, Express.js, MongoDB)
`;

    const blob = new Blob([textContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shivkumar-suthar-cv.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="cv-view-container" className="space-y-6 w-full">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border bg-[var(--bg-surface)] border-[var(--border-subtle)] shadow-xs">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2563eb] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Download Plain Text</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* CV Paper Document (Matches Resume PDF content exactly) */}
      <div
        id="printable-cv-document"
        className="cv-card p-6 sm:p-12 rounded-2xl border bg-white text-[#222220] shadow-sm max-w-4xl mx-auto space-y-8"
        style={{
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* CV Header */}
        <header className="border-b-2 border-[#2563eb] pb-6 space-y-3 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a]">
            {PERSONAL_INFO.name.toUpperCase()}
          </h1>
          <p className="text-base sm:text-lg font-bold text-[#2563eb]">
            {PERSONAL_INFO.title} • {PERSONAL_INFO.experienceYears} Commercial Experience
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-xs font-medium text-[#475569] pt-1">
            <a href={`tel:${PERSONAL_INFO.phone}`} className="flex items-center gap-1 hover:text-[#2563eb]">
              <Phone className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{PERSONAL_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-1 hover:text-[#2563eb]">
              <Mail className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{PERSONAL_INFO.email}</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <a href={PERSONAL_INFO.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2563eb]">
              <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Website</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#2563eb]">
              <Linkedin className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>LinkedIn</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{PERSONAL_INFO.location}</span>
            </span>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#334155]">
            {PERSONAL_INFO.bioParagraph1}
          </p>
        </section>

        {/* Technical Skills Matrix (Exact representation from resume) */}
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2563eb] border-b border-gray-200 pb-1 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-[#2563eb]" />
            <span>Technical Skills</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-[#222220]/90">
            <div>
              <span className="font-bold text-[#222220]">★ Programming Languages:</span> Java, JavaScript (ES6+), TypeScript, HTML5, CSS3
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ Frontend:</span> React.js, Next.js, Three.js, Babylon.js, GSAP, Framer Motion, Vue.js
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ State & Data:</span> Redux Toolkit (RTK), Zustand, TanStack Query, Context API
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ Backend & APIs:</span> Node.js, Express.js, RESTful API Development & Integration
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ Databases:</span> MongoDB, MySQL, SQL
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ UI & Styling:</span> Tailwind CSS, Material UI (MUI), Bootstrap, Styled Components, Shadcn/ui
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ Cloud & DevOps:</span> Docker, AWS (EC2, VPS and others)
            </div>
            <div>
              <span className="font-bold text-[#222220]">★ Development Tools:</span> Git, GitHub, JIRA, Figma, Postman, Email on Acid, Veeva Vault
            </div>
            <div className="sm:col-span-2 pt-1 text-[11px] text-[#222220]/75">
              <span className="font-bold text-[#222220]">★ Problem Solving & Analytical Skills:</span> Root Cause Analysis, Debugging & Troubleshooting, Technical Problem Decomposition, Performance Optimization, Code Analysis & Refactoring, Requirements Analysis, Solution Design & Technical Decision-Making.
            </div>
          </div>
        </section>

        {/* Employment History (From Resume) */}
        <section className="space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2563eb] border-b border-gray-200 pb-1 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#2563eb]" />
            <span>Employment History</span>
          </h2>

          {/* Role 1: Dev Technosys */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">
                  ★ Dev Technosys Pvt Ltd. <span className="font-medium text-gray-500">(Jaipur, Rajasthan)</span>
                </h3>
                <div className="text-xs font-bold text-[#2563eb] uppercase tracking-wide">
                  MERN STACK DEVELOPER
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600 sm:text-right">
                May 2023 – Present
              </div>
            </div>
            <ul className="list-disc list-outside pl-5 text-xs text-[#1e293b] space-y-1.5 leading-relaxed">
              <li>
                Worked on the <strong>AIE South Africa web ecosystem</strong> for 2+ years, developing new modules and features while maintaining, enhancing, and improving existing production applications.
              </li>
              <li>
                Contributed to multiple production applications and the primary website, handling features from requirement analysis and development through integration, testing, and production support.
              </li>
              <li>
                Responsible for debugging, root-cause analysis, performance optimization, code reviews, and resolving production issues across existing and newly developed features.
              </li>
              <li>
                Collaborated with team members and stakeholders to analyze requirements, develop technical solutions, and deliver maintainable features.
              </li>
            </ul>
          </div>

          {/* Role 2: Rams Creative Technologies */}
          <div className="space-y-2 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">
                  ★ Rams Creative Technologies Pvt Ltd <span className="font-medium text-gray-500">(Jaipur, Rajasthan)</span>
                </h3>
                <div className="text-xs font-bold text-[#2563eb] uppercase tracking-wide">
                  REACT DEVELOPER
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600 sm:text-right">
                Feb 2024 – May 2024
              </div>
            </div>
            <ul className="list-disc list-outside pl-5 text-xs text-[#1e293b] space-y-1.5 leading-relaxed">
              <li>
                Developed immersive 3D web experiences using React.js, Three.js, and Babylon.js.
              </li>
              <li>
                Built engaging, brand-aligned interfaces and animations for Cretea Spa, improving visual experience and responsiveness.
              </li>
              <li>
                Contributed to MERN stack applications, focusing on UI/UX, responsive design, and performance optimization.
              </li>
              <li>
                Implemented interactive animations and state management using GSAP, Framer Motion, and Redux, with backend integration using Node.js, Express.js, and MongoDB.
              </li>
            </ul>
          </div>

          {/* Role 3: Viseven India */}
          <div className="space-y-2 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">
                  ★ Viseven India Pvt. Ltd. <span className="font-medium text-gray-500">(Jaipur, Rajasthan)</span>
                </h3>
                <div className="text-xs font-bold text-[#2563eb] uppercase tracking-wide">
                  FRONTEND DEVELOPER
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600 sm:text-right">
                October 2022 – January 2024
              </div>
            </div>
            <ul className="list-disc list-outside pl-5 text-xs text-[#1e293b] space-y-1.5 leading-relaxed">
              <li>
                Developed responsive and accessible web interfaces using HTML, CSS, JavaScript, Vue.js, and React.js.
              </li>
              <li>
                Built and maintained e-Wizard templates, integrating and testing campaigns across Veeva, Salesforce, and Email on Acid.
              </li>
              <li>
                Collaborated with cross-functional teams using JIRA and maintained code through Git version control.
              </li>
              <li>
                Worked with Vue.js, Veeva CMS/Vault, Salesforce, and frontend development workflows.
              </li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section className="space-y-2 pt-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2563eb] border-b border-gray-200 pb-1 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#2563eb]" />
            <span>Education</span>
          </h2>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#0f172a]">★ {PERSONAL_INFO.education.degree}</span>
              <span className="text-gray-600"> — {PERSONAL_INFO.education.institution}</span>
            </div>
            <div className="font-semibold text-gray-600">{PERSONAL_INFO.education.year}</div>
          </div>
        </section>

        {/* Selected Personal Projects */}
        <section className="space-y-4 pt-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2563eb] border-b border-gray-200 pb-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#2563eb]" />
            <span>Selected Personal Projects</span>
          </h2>

          <div className="space-y-3 text-xs text-[#1e293b]">
            <div>
              <div className="font-bold text-[#0f172a] flex items-center justify-between">
                <span>★ Suthar Living — Full-Stack Web Application</span>
                <a
                  href="https://www.sutharinteriorstudio.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563eb] hover:underline font-normal text-[11px]"
                >
                  sutharinteriorstudio.in
                </a>
              </div>
              <div className="text-[11px] text-[#2563eb] font-medium mb-1">
                Next.js 16 • React 19 • TypeScript • Tailwind CSS • MongoDB • Node.js • GSAP • Docker
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Designed and developed a production-ready business website for an interior contracting and furniture renovation business with GSAP smooth interactions, dynamic blogs, enquiry workflows, and admin APIs.
              </p>
            </div>

            <div>
              <div className="font-bold text-[#0f172a]">★ Foliary — Portfolio CRM (In Progress)</div>
              <div className="text-[11px] text-[#2563eb] font-medium mb-1">
                React.js • Node.js • Express.js • RESTful API • MongoDB • Material-UI
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Solved the manual portfolio update problem by creating a self-updating dashboard pulling data dynamically instead of requiring code recompilation.
              </p>
            </div>

            <div>
              <div className="font-bold text-[#0f172a]">★ POMS — Purchase Order Management System</div>
              <div className="text-[11px] text-[#2563eb] font-medium mb-1">
                React.js • Node.js • Express.js • RESTful API • MongoDB
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Custom purchase order management software streamlining internal tool requests, approval chains, real-time status tracking, and printable bill documentation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
