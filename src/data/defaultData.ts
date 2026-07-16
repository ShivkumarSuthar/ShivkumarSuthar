/** * @license * SPDX-License-Identifier: Apache-2.0 */ 
import { PortfolioData } from '../types';

export const defaultPortfolioData: PortfolioData = {
  personal: {
    name: "Shivkumar Suthar",
    role: "React & Full-Stack Developer",
    bio: "React Developer with 3+ years of experience building scalable, high-performance web applications using React.js, Next.js, TypeScript, Node.js, and MongoDB. Passionate about creating responsive user interfaces, modern full-stack applications, AI-powered experiences, and interactive 3D web solutions.",
    location: "Jaipur, Rajasthan, India",
    email: "shiv.str21@gmail.com",
    phone: "+91 6377290604",
    github: "https://github.com/your-github-username",
    linkedin: "https://linkedin.com/in/your-linkedin",
    twitter: "",
    avatar: "/images/profile.jpg",
    resume: "/resume.pdf",
  },

  experiences: [
    {
      id: "exp-1",
      role: "MERN Stack Developer",
      company: "Dev Technosys Pvt. Ltd.",
      period: "May 2024 - Present",
      description:
        "Developing and maintaining South Africa's University AIE Admin & Student Portals using React.js and Next.js. Built course management, assessments, attendance, and result modules while contributing to backend architecture with SQL/MySQL. Focused on scalable, high-performance applications using Redux and Next.js."
    },
    {
      id: "exp-2",
      role: "React Developer",
      company: "Rams Creative Technologies Pvt. Ltd.",
      period: "Jan 2024 - May 2024",
      description:
        "Built immersive 3D web experiences using Three.js, Babylon.js, React.js, GSAP, and Framer Motion. Worked on MERN applications while improving UI/UX, responsiveness, and overall application performance."
    },
    {
      id: "exp-3",
      role: "Frontend Developer",
      company: "Viseven India Pvt. Ltd.",
      period: "Oct 2022 - Jan 2024",
      description:
        "Developed responsive and accessible interfaces using React.js, Vue.js, JavaScript, HTML, and CSS. Built email templates with eWizard and integrated solutions for Veeva Vault, Salesforce, and Email on Acid."
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "AI-Powered 3D Virtual Try-On Platform",
      description:
        "An AI-powered virtual try-on platform that generates personalized 3D avatars from user images. Integrated Three.js, WebGL, TensorFlow, PyTorch, and WebXR for realistic clothing visualization and interactive AR experiences.",
      tags: [
        "Next.js",
        "Three.js",
        "WebGL",
        "Node.js",
        "MongoDB",
        "TensorFlow",
        "PyTorch",
        "WebXR"
      ],
      link: "https://try-on-platform.vercel.app/",
      image: "/projects/tryon.jpg"
    },
    {
      id: "proj-2",
      title: "Foliary - Portfolio CRM",
      description:
        "A dynamic portfolio CMS with a responsive Material UI dashboard, REST APIs, MongoDB backend, and drag-and-drop content management for effortless portfolio updates.",
      tags: [
        "React",
        "Material UI",
        "Node.js",
        "Express",
        "MongoDB"
      ],
      link: "https://foliary.vercel.app/",
      image: "/projects/foliary.jpg"
    },
    {
      id: "proj-3",
      title: "Personal Portfolio CMS",
      description:
        "A full-stack portfolio built with Next.js featuring a CMS, Tiptap rich-text editor, Learning Materials module, Redux, MongoDB, and Node.js for dynamic content management.",
      tags: [
        "Next.js",
        "React",
        "Node.js",
        "MongoDB",
        "Tailwind CSS",
        "Redux",
        "Tiptap"
      ],
      link: "https://shivkumar-suthar.vercel.app/",
      image: "/projects/portfolio.jpg"
    }
  ],

  skills: [
    {
      category: "Frontend",
      list: [
        "React.js",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Redux",
        "React Query",
        "Tailwind CSS",
        "Material UI",
        "SCSS"
      ]
    },
    {
      category: "Backend",
      list: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "MySQL",
        "REST APIs"
      ]
    },
    {
      category: "3D & AI",
      list: [
        "Three.js",
        "Babylon.js",
        "GSAP",
        "Framer Motion",
        "WebXR",
        "TensorFlow",
        "PyTorch"
      ]
    },
    {
      category: "Tools",
      list: [
        "Git",
        "GitHub",
        "Vite",
        "Webpack",
        "Postman",
        "Figma",
        "Shopify"
      ]
    }
  ],

  theme: "emerald"
};