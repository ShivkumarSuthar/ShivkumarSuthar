import { ExperienceItem, ProjectItem, SkillItem, RecommendationItem, CodeSampleItem } from '../types';

export const PERSONAL_INFO = {
  name: 'Shivkumar Suthar',
  title: 'Full-Stack Engineer',
  experienceYears: '3+ years',
  location: 'Jaipur, India',
  email: 'suthar.developer@gmail.com',
  phone: '+91 6377290604',
  website: 'https://www.sutharinteriorstudio.in',
  linkedin: 'https://www.linkedin.com/in/suthar-shivkumar/',
  github: 'https://github.com/shivkumarsuthar',
  availableForHire: true,
  availabilityText: "I'm currently available for work",
  bioHeadline:
    'Full Stack Developer building full-stack apps with MongoDB, Express, React, Next.js, and Node.js',
  bioParagraph1:
    'Full-Stack Developer with 3+ years of commercial experience building scalable web applications end to end. Strong frontend foundation in React.js, Next.js, and TypeScript, with hands-on backend work in Node.js, Express.js, MongoDB, and MySQL. Delivering production features across the stack — UI architecture, REST APIs, state management (Zustand, TanStack Query, Redux Toolkit), and Core Web Vitals performance for enterprise platforms.',
  bioParagraph2:
    'Comfortable owning full product flows: component-driven UIs with Tailwind CSS, API design and integration, database-backed features, and production debugging. Proven delivery on MERN and Next.js systems for university portals, interior studio platforms, and interactive client products.',
  education: {
    degree: 'Bachelor of Science in Information Technology (B.Sc. IT)',
    institution: 'Mumbai University',
    year: '2022',
  },
};

export const CURRENT_TECH_STACK: SkillItem[] = [
  { id: 'react', name: 'React.js', category: 'frontend', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'Components, Custom Hooks, Context, Suspense, Concurrent UI' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'App Router, Server Components, SSR/SSG, Dynamic Routing, API Routes' },
  { id: 'typescript', name: 'TypeScript', category: 'core', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'Strict typing, Generics, Interfaces, Type definitions' },
  { id: 'javascript', name: 'JavaScript (ES6+)', category: 'core', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'Async/Await, Closures, DOM manipulation, ESNext features' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'Utility-first CSS, Responsive design, Custom theme configurations' },
  { id: 'zustand', name: 'Zustand', category: 'state', isCurrentPrimary: true, yearsOrDepth: '2+ years', description: 'Lightweight atomic state management, Store creation, Persist' },
  { id: 'tanstack', name: 'TanStack Query', category: 'state', isCurrentPrimary: true, yearsOrDepth: '2+ years', description: 'Server state caching, Optimistic updates, Infinite queries' },
  { id: 'redux', name: 'Redux Toolkit (RTK)', category: 'state', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'Slices, Thunks, RTK Query, Centralized state stores' },
  { id: 'nodejs', name: 'Node.js & Express.js', category: 'backend', isCurrentPrimary: true, yearsOrDepth: '2.5+ years', description: 'RESTful API engineering, Middlewares, Routing, Microservices' },
  { id: 'mongodb', name: 'MongoDB & MySQL', category: 'database', isCurrentPrimary: true, yearsOrDepth: '2.5+ years', description: 'Document stores, Aggregation pipelines, Relational schemas' },
  { id: 'restapi', name: 'RESTful APIs', category: 'backend', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'API contract integration, JSON serialization, Error handling' },
  { id: 'performance', name: 'Core Web Vitals & Perf', category: 'tools', isCurrentPrimary: true, yearsOrDepth: '3+ years', description: 'Lighthouse scoring, Bundle splitting, Latency reduction' },
];

export const OTHER_TECH_STACK: SkillItem[] = [
  { id: 'html5', name: 'HTML5 & CSS3', category: 'core', yearsOrDepth: '3+ years', description: 'Semantic markup, Flexbox, CSS Grid, Responsive design' },
  { id: 'mui', name: 'Material UI (MUI)', category: 'frontend', yearsOrDepth: '2+ years', description: 'Theming, Accessible form controls, DataGrid components' },
  { id: 'styledcomponents', name: 'Styled Components', category: 'frontend', yearsOrDepth: '2+ years', description: 'CSS-in-JS, Dynamic props styling, Global style scopes' },
  { id: 'threejs', name: 'Three.js & Babylon.js', category: 'frontend', yearsOrDepth: '1.5+ years', description: 'Interactive 3D WebGL scenes, Lighting, Shaders, 60 FPS' },
  { id: 'gsap', name: 'GSAP & Framer Motion', category: 'frontend', yearsOrDepth: '2+ years', description: 'Timeline animations, ScrollTrigger, Smooth page transitions' },
  { id: 'vite', name: 'Vite', category: 'tools', yearsOrDepth: '2.5+ years', description: 'Fast HMR, Modern frontend bundling, Optimized build pipelines' },
  { id: 'git', name: 'Git & GitHub', category: 'tools', yearsOrDepth: '3+ years', description: 'Branching workflows, Pull requests, Merge conflict management' },
  { id: 'docker', name: 'Docker', category: 'devops', yearsOrDepth: '1.5+ years', description: 'Containerization, Dockerfile recipes, Multi-stage builds' },
  { id: 'postman', name: 'Postman', category: 'tools', yearsOrDepth: '3+ years', description: 'API endpoint testing, Collections, Environment variables' },
  { id: 'jira', name: 'JIRA', category: 'tools', yearsOrDepth: '3+ years', description: 'Agile sprints, Issue triage, Backlog management, QA tickets' },
  { id: 'veeva', name: 'Veeva Vault & Salesforce', category: 'tools', yearsOrDepth: '1.5+ years', description: 'e-Wizard modular templates, Digital asset management' },
];

export const WORK_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'dev-technosys',
    role: 'Full Stack Developer',
    company: 'Dev Technosys Pvt Ltd',
    location: 'Jaipur, India',
    period: 'May 2024 – Present',
    isCurrent: true,
    type: 'Full-time',
    badgeText: 'Current Role • MERN Stack',
    overview: 'Spearheading MERN / full-stack delivery for the high-traffic AIE South Africa university portal — Next.js, React, TypeScript on the client, with Node.js APIs and data integration across the stack.',
    responsibilities: [
      'Spearheaded core frontend modules and dynamic UI features for the AIE South Africa university portal using Next.js, React, and TypeScript.',
      'Engineered modular, reusable UI component libraries utilizing Tailwind CSS and TanStack Query, reducing redundant code and speeding up development cycles.',
      'Executed root-cause debugging and Core Web Vitals optimization, reducing page load latency and improving overall platform stability.',
      'Collaborated with backend engineers to integrate RESTful endpoints, ensure strict API contracts, and resolve critical production blockers.'
    ],
    techStack: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'Node.js', 'Express.js', 'RESTful APIs', 'Core Web Vitals'],
    projectLink: 'https://www.sutharinteriorstudio.in'
  },
  {
    id: 'rams-creative',
    role: 'React Developer',
    company: 'Rams Creative Technologies Pvt Ltd',
    location: 'Jaipur, India',
    period: 'Feb 2024 – May 2024',
    isCurrent: false,
    type: 'Client Engagement',
    badgeText: '3D Web Interfaces & Fluid Animations',
    overview: 'Engineered immersive, interactive 3D web interfaces and high-performance animation suites for Cretea Spa.',
    responsibilities: [
      'Engineered immersive, interactive 3D web interfaces for Cretea Spa using React.js, Three.js, and Babylon.js, enhancing client engagement.',
      'Implemented fluid UI animations and interactive transitions using GSAP and Framer Motion, maintaining a steady 60 FPS across desktop and mobile.',
      'Connected client-side application workflows with Node.js and MongoDB backend services via Redux and RESTful APIs.'
    ],
    techStack: ['React.js', 'Three.js', 'Babylon.js', 'GSAP', 'Framer Motion', 'Redux', 'Node.js', 'MongoDB', 'RESTful APIs', 'Tailwind CSS']
  },
  {
    id: 'viseven-india',
    role: 'Frontend Developer',
    company: 'Viseven India Pvt Ltd',
    location: 'Jaipur, India',
    period: 'Oct 2022 – Jan 2024',
    isCurrent: false,
    type: 'Full-time',
    badgeText: 'Accessible UI & Enterprise e-Wizard Modules',
    overview: 'Built responsive, accessible UI components and integrated modular e-Wizard templates across enterprise digital ecosystems.',
    responsibilities: [
      'Built responsive, accessible UI components and interactive modules using HTML5, CSS3, JavaScript, React.js',
      'Developed and maintained modular e-Wizard templates integrated with Salesforce and Veeva Vault digital ecosystems and maintained clean code standards, leveraged Git version control, and coordinated sprint deliverables within JIRA to ensure zero-defect releases.'
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Salesforce', 'Veeva Vault', 'Git', 'JIRA']
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'suthar-living',
    title: 'Suthar Living',
    subtitle: 'Full-Stack Interior Contracting & Renovation Platform',
    category: 'Full-Stack',
    timeframe: '2024 – 2025',
    status: 'Production',
    clientOrOrg: 'Suthar Living Interior Studio',
    overview: 'A production-ready enterprise web application engineered for a premium interior contracting, bespoke furniture, and home renovation business. Designed to provide homeowners with an inspiring digital showroom, dynamic project galleries, and real-time consultation enquiry workflows.',
    problemStatement: 'The interior studio relied on manual consultation bookings and static image portfolios that suffered from slow load times, poor SEO discoverability, and difficult content management.',
    solution: 'Engineered a modern, responsive web application using Next.js 16, React 19, TypeScript, Tailwind CSS, and Shadcn/ui. Integrated GSAP ScrollTrigger for smooth storytelling, a MongoDB backend for dynamic project galleries, blog publishing, and customer enquiry routing.',
    keyFeatures: [
      'Next.js 16 & React 19 server-side rendering for optimal Core Web Vitals and SEO rankings.',
      'Interactive project showcases with high-resolution image zoom, before/after renovation sliders, and category filtering.',
      'Smooth scroll animations and interactive spatial showcases using GSAP and ScrollTrigger.',
      'Dynamic enquiry and consultation booking workflow with validation and automated email notifications.',
      'Custom admin management APIs powered by Node.js, Express, and MongoDB for instant content updates.',
      'Containerized deployment with Docker ensuring consistent staging and production parity.'
    ],
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Shadcn/ui', 'MongoDB', 'Node.js', 'GSAP', 'Docker', 'REST APIs'],
    liveUrl: 'https://www.sutharinteriorstudio.in/',
    metrics: ['98+ Mobile Lighthouse Score', '<1.2s First Contentful Paint', '100% SEO Accessibility Rating']
  },
  {
    id: 'foliary-crm',
    title: 'Foliary',
    subtitle: 'Self-Updating Portfolio CRM & CMS Dashboard',
    category: 'Enterprise & Tools',
    timeframe: '2024 – Present',
    status: 'In Progress',
    clientOrOrg: 'Personal SaaS / Developer Tool',
    overview: 'A specialized portfolio and case study management software designed to solve the manual code-editing burden that developers and designers face when keeping their work current.',
    problemStatement: 'Updating digital portfolios traditionally requires modifying raw code, redeploying codebases, or wrestling with bloated generic CMS platforms that produce rigid, cookie-cutter layouts.',
    solution: 'Built a dynamic, self-updating portfolio dashboard where projects, case studies, technologies, and testimonials are managed via an intuitive Material-UI dashboard and served via high-speed RESTful APIs.',
    keyFeatures: [
      'Self-updating dashboard that dynamically syncs project data without requiring codebase recompilation.',
      'Responsive, component-driven Material-UI interface with dark/light theming.',
      'Drag-and-drop hierarchy and section ordering for effortless visual prioritization.',
      'Secure RESTful API endpoints powered by Express and MongoDB with schema validation.',
      'Instant preview sandbox allowing developers to view changes before publishing.'
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'RESTful API', 'MongoDB', 'Material UI (MUI)', 'JWT Auth'],
    metrics: ['Zero-code updates', 'Instant sync architecture', 'Dynamic schema mapping']
  },
  {
    id: 'poms',
    title: 'POMS — Purchase Order Management System',
    subtitle: 'Internal Enterprise Procurement & Tracking System',
    category: 'Enterprise & Tools',
    timeframe: '2023 – 2024',
    status: 'Production',
    clientOrOrg: 'Enterprise Procurement Client',
    overview: 'A custom-engineered purchase order management web application designed to streamline internal tool procurement, requisition approvals, and vendor inventory workflows for multi-department organizations.',
    problemStatement: 'Internal tool and item purchase requests were handled via fragmented email threads and paper requisitions, causing approval bottlenecks, lack of audit trails, and inventory discrepancies.',
    solution: 'Designed and deployed an integrated React & Node.js procurement portal offering role-based request submissions, tiered approval chains, automated itemized invoice generation, and real-time status tracking.',
    keyFeatures: [
      'Role-based submission workflows for department employees to request specialized equipment and tools.',
      'Executive approval dashboard with real-time status tracking (Pending, Approved, Dispatched, Fulfilled).',
      'Automated detailed billing engine with printable, compliant purchase order PDF generation.',
      'Robust backend APIs managing vendor databases, purchase order logs, and equipment inventory.',
      'Clean, responsive React frontend with data grids, instant search, and exportable financial summaries.'
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'RESTful API', 'MongoDB', 'Tailwind CSS', 'PDFKit'],
    metrics: ['70% reduction in approval cycle time', '100% digital audit compliance', 'Automated PDF bill generation']
  },
  {
    id: 'aie-south-africa',
    title: 'AIE South Africa Digital Ecosystem',
    subtitle: 'High-Volume Enterprise Academic & Enrollment Portal',
    category: 'Full-Stack',
    timeframe: '2023 – Present',
    status: 'Live',
    clientOrOrg: 'Dev Technosys / AIE',
    overview: 'A comprehensive educational web ecosystem serving thousands of active students and prospective applicants across South Africa, featuring course catalog discovery, dynamic application portals, and administrative tooling.',
    problemStatement: 'Managing thousands of prospective students across diverse qualifications required resilient, high-speed UI modules capable of handling surges during enrollment seasons.',
    solution: 'Maintained and architected scalable MERN stack frontend features, implemented TanStack Query for optimal client caching, integrated backend REST APIs, and resolved complex edge-case bottlenecks.',
    keyFeatures: [
      'Scalable multi-qualification course browsing and qualification filter matrices.',
      'Interactive student inquiry and multi-step application forms with client-side validation.',
      'Root-cause debugging and state performance refactoring across mission-critical web funnels.',
      'Modular TypeScript component library ensuring seamless branding across subsidiary portals.'
    ],
    techStack: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Docker'],
    metrics: ['2+ years continuous enhancement', '50,000+ monthly active interactions', 'Zero critical downtime during peak intakes']
  },
  {
    id: 'cretea-spa',
    title: 'Cretea Spa Interactive 3D Experience',
    subtitle: 'Immersive WebGL & Three.js Sensory Showcase',
    category: 'Frontend & 3D',
    timeframe: '2024',
    status: 'Live',
    clientOrOrg: 'Rams Creative Technologies / Cretea',
    overview: 'An experiential 3D website built for Cretea Spa that merges interactive WebGL graphics with soothing ambient micro-interactions, providing users with a digital taste of sensory relaxation.',
    problemStatement: 'Standard flat 2D spa websites failed to communicate the atmospheric ambiance and premium tactile luxury of physical spa facilities.',
    solution: 'Created an interactive 3D web experience utilizing Three.js, Babylon.js, and GSAP timeline choreography, featuring smooth camera movements, spatial particle effects, and touch-responsive 3D elements.',
    keyFeatures: [
      'Interactive 3D environments rendered in Three.js and Babylon.js with custom lighting and materials.',
      'Seamless GSAP ScrollTrigger timeline sync linking user scroll position to 3D camera sweeps.',
      'Mobile-optimized WebGL canvas with dynamic level-of-detail (LOD) downscaling for low-spec devices.',
      'Integrated treatment booking workflow with responsive state management.'
    ],
    techStack: ['React.js', 'Three.js', 'Babylon.js', 'GSAP', 'Framer Motion', 'WebGL', 'Tailwind CSS'],
    metrics: ['60 FPS smooth rendering on mobile', '40% increase in online appointment bookings']
  }
];

export const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'rec-1',
    author: 'Rajesh Sharma',
    role: 'Lead Project Architect',
    company: 'Dev Technosys Pvt Ltd.',
    relationship: 'Managed Shivkumar on AIE South Africa projects',
    date: 'January 2026',
    testimonial: 'Shivkumar is an exceptionally dependable full-stack engineer. Over the two years he worked on the AIE South Africa ecosystem, his deep understanding of React, Next.js, and Node.js was instrumental in scaling our modules and reducing production defects. He approaches development with a true problem-solving mindset, always considering maintainability, edge cases, and user experience. Any engineering team would be lucky to have him.',
    avatarInitials: 'RS'
  },
  {
    id: 'rec-2',
    author: 'Amitabh Verma',
    role: 'Creative Tech Lead',
    company: 'Rams Creative Technologies',
    relationship: 'Collaborated on 3D Web & GSAP interactive projects',
    date: 'June 2024',
    testimonial: 'Shivkumar possesses a rare and valuable blend of engineering rigor and creative aesthetic sense. When building the Cretea Spa 3D experience, he took our Three.js and GSAP concepts and turned them into silky-smooth 60fps web experiences that blew the client away. His command of modern React, performance profiling, and state management is outstanding.',
    avatarInitials: 'AV'
  },
  {
    id: 'rec-3',
    author: 'Elena Kovaleva',
    role: 'Senior Digital Delivery Manager',
    company: 'Viseven Global',
    relationship: 'Supervised Shivkumar on enterprise CLM & frontend projects',
    date: 'February 2024',
    testimonial: 'Working with Shivkumar at Viseven was a pleasure. He consistently delivered complex e-Wizard interactive templates across Veeva Vault and Salesforce with zero errors and exceptional speed. His attention to semantic code structure, responsive design, and cross-platform compatibility made him a go-to engineer on our multi-channel campaigns.',
    avatarInitials: 'EK'
  },
  {
    id: 'rec-4',
    author: 'Prakash Suthar',
    role: 'Managing Director',
    company: 'Suthar Living Studio',
    relationship: 'Client for Suthar Living Full-Stack Web App',
    date: 'November 2024',
    testimonial: 'Shivkumar transformed our entire business presence with the Suthar Living web application. From the smooth GSAP interior showcases to the dynamic quotation workflow, the platform has generated more qualified client enquiries in 3 months than we received all of last year. His communication and technical execution are second to none.',
    avatarInitials: 'PS'
  }
];

export const CODE_SAMPLES: CodeSampleItem[] = [
  {
    id: 'sample-nextjs-server-actions',
    title: 'Next.js App Router: Dynamic SSR & Server Actions',
    category: 'Full-Stack Architecture',
    language: 'typescript',
    description: 'Production pattern for secure Next.js Server Actions with Zod validation, optimistic UI feedback, and cache revalidation.',
    takeaways: [
      'Server-side validation eliminates client-side tampering',
      'Uses revalidatePath() for instant cache synchronization',
      'TypeScript strict typing guarantees type-safe request/response pipelines'
    ],
    code: `// app/actions/enquiry.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import { EnquiryModel } from '@/models/Enquiry';

const EnquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\\+?[0-9]{10,14}$/, 'Invalid phone number format'),
  serviceType: z.enum(['InteriorDesign', 'Renovation', 'CustomFurniture']),
  budgetEstimate: z.number().min(50000, 'Minimum project threshold is ₹50,000'),
  message: z.string().max(1000).optional(),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;

export async function submitClientEnquiry(formData: EnquiryInput) {
  try {
    const validated = EnquirySchema.parse(formData);
    await dbConnect();
    
    const record = await EnquiryModel.create({
      ...validated,
      status: 'PENDING_REVIEW',
      submittedAt: new Date(),
    });

    revalidatePath('/dashboard/enquiries');
    return { success: true, enquiryId: record._id.toString() };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, error: 'Database transaction failed. Please retry.' };
  }
}`
  },
  {
    id: 'sample-gsap-hook',
    title: 'Custom React Hook: GSAP ScrollTrigger Integration',
    category: 'Frontend & Animations',
    language: 'typescript',
    description: 'A production-tested React hook providing clean GSAP ScrollTrigger lifecycle management, preventing memory leaks and layout shifts.',
    takeaways: [
      'Uses gsap.context() for automatic cleanup on unmount',
      'Guarantees smooth performance without memory leaks',
      'Supports responsive matchMedia triggers for mobile vs desktop'
    ],
    code: `// hooks/useScrollAnimation.ts
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  triggerId: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

export function useScrollReveal(options: ScrollAnimationOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Isolate animations within a GSAP context for automatic cleanup
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: options.start ?? 'top 80%',
            end: options.end ?? 'bottom 20%',
            toggleActions: 'play none none reverse',
            scrub: options.scrub ?? false,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert(); // Essential: prevents memory leaks & duplicate triggers
  }, [options.start, options.end, options.scrub]);

  return containerRef;
}`
  },
  {
    id: 'sample-tanstack-cache',
    title: 'TanStack Query: Optimistic Updates & Cache Synchronizer',
    category: 'State & Data Management',
    language: 'typescript',
    description: 'High-performance API data mutation pattern with rollback on network failure, ensuring resilient real-time UI data integrity.',
    takeaways: [
      'Instantly updates UI before server response for zero-latency feel',
      'Auto-reverts state if the network request fails',
      'Automatically invalidates queries to fetch canonical server state'
    ],
    code: `// features/orders/useUpdateOrderStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UpdateStatusPayload {
  orderId: string;
  newStatus: 'Pending' | 'Approved' | 'Dispatched' | 'Completed';
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, newStatus }: UpdateStatusPayload) => {
      const { data } = await axios.patch(\`/api/poms/orders/\${orderId}\`, { status: newStatus });
      return data;
    },
    // Optimistic Update
    onMutate: async (updatedOrder) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData(['orders']);

      queryClient.setQueryData(['orders'], (old: any[] = []) =>
        old.map((order) =>
          order._id === updatedOrder.orderId ? { ...order, status: updatedOrder.newStatus } : order
        )
      );

      return { previousOrders };
    },
    // Rollback on error
    onError: (err, newOrder, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
    },
    // Re-sync with canonical DB
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}`
  }
];
