// Single source of truth for all site text. Components must not hardcode copy.

export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  /** Empty string = hidden in the UI. */
  linkedin: string;
  cv: string;
  photo: string;
  photoWidth: number;
  photoHeight: number;
  photoAlt: string;
  tagline: string;
  about: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  live?: string;
  repo?: string;
  /** Shown when the project has no public links. */
  note?: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  detail: string;
}

export interface Certification {
  title: string;
  issuer: string;
  period: string;
}

export interface NavLink {
  id: SectionId;
  label: string;
}

export const profile: Profile = {
  name: "Syeda Eeman Zahra",
  shortName: "Eeman Zahra",
  role: "Full-Stack Developer",
  location: "Islamabad, Pakistan",
  email: "eemanzahra2005@gmail.com",
  phone: "+92 347-5456857",
  github: "https://github.com/eemanzahra2005-hash",
  linkedin: "",
  cv: "/Syeda-Eeman-Zahra-CV.pdf",
  photo: "/eeman.jpg",
  photoWidth: 800,
  photoHeight: 1000,
  photoAlt: "Syeda Eeman Zahra",
  tagline:
    "I build fast, reliable web applications — from clean React interfaces to the APIs behind them.",
  about:
    "Full-Stack Developer at The Trexa and 5th-semester Computer Science student at Air University, Islamabad. I build responsive React and Next.js interfaces, integrate REST APIs and authentication flows, and ship production web apps. My background in data analytics helps me understand the data behind the features I build.",
};

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      "HTML & CSS",
      "JavaScript ES6+",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "MongoDB", "SQL"],
  },
  {
    title: "Data",
    items: ["Python", "Tableau", "Looker Studio", "Excel", "Google Sheets"],
  },
  {
    title: "Tools",
    items: ["Git & GitHub", "VS Code", "Postman", "Vercel", "Render"],
  },
  {
    title: "Core",
    items: ["DSA (C++)"],
  },
];

export const experience: Experience[] = [
  {
    role: "Full-Stack Developer (Remote, Contract)",
    company: "The Trexa (Private) Limited",
    period: "Sep 2026 – Present",
    points: [
      "Develop, maintain, test and optimize responsive front-end interfaces and back-end services.",
      "Design and integrate APIs, databases, authentication flows and third-party services.",
      "Write maintainable code with Git and support debugging, deployment and documentation.",
      "Collaborate with management and team members to deliver secure, reliable solutions.",
    ],
  },
  {
    role: "Frontend Developer Intern (Remote)",
    company: "App Aura, Lahore",
    period: "Jun 2026 – Sep 2026",
    points: [
      "Built a pharmacy management frontend with React 19, Vite and React Router.",
      "Integrated the login flow with the company's REST API using token-based authentication.",
      "Deployed the app on Render and managed source code on GitHub.",
      "Researched Next.js vs React 19 and prepared a step-by-step migration plan for the production frontend.",
    ],
  },
  {
    role: "Frontend Development Intern (Remote)",
    company: "CodeAlpha",
    period: "May 2026",
    points: [
      "Built responsive web pages and UI components with HTML5, CSS3 and JavaScript (ES6+).",
      "Focused on clean layouts, interactivity and cross-browser compatibility.",
    ],
  },
  {
    role: "Data Analyst (Remote)",
    company: "E-Bay Project-based",
    period: "Aug 2025 – Oct 2025",
    points: [
      "Analyzed e-commerce sales data to find trends, customer behavior and product performance.",
      "Used SQL for extraction and Python for cleaning and exploratory analysis.",
      "Built interactive Tableau dashboards for key KPIs.",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "NEHRI — Smart Irrigation & MLOps Platform",
    description:
      "Irrigation decision-support platform for 107 districts of Pakistan: RandomForest model with SHAP explanations, live weather, flood and soil-moisture data, a bilingual (Urdu/English) AI assistant, MLflow model registry with quality gates, drift monitoring and Prometheus + Grafana.",
    tags: [
      "Python",
      "FastAPI",
      "scikit-learn",
      "SHAP",
      "MLflow",
      "Docker",
      "PostgreSQL",
    ],
    note: "Private repository",
  },
  {
    title: "AppAura Pharmacy Frontend",
    description:
      "Pharmacy management web app with landing, pricing, medicines and auth pages; login connected to a real REST API with token-based authentication.",
    tags: ["React 19", "Vite", "React Router", "REST API", "Render"],
    live: "https://appaura-pharmacy-frontend.onrender.com",
    repo: "https://github.com/eemanzahra2005-hash/appaura-pharmacy-frontend",
  },
  {
    title: "Next.js 16 vs React 19 — R&D",
    description:
      "Demo app with 9 routes, each showing a Next.js / React 19 feature, plus a full comparison report and a migration plan for a production React codebase.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    repo: "https://github.com/eemanzahra2005-hash/nextjs-react19-rnd",
  },
  {
    title: "E-commerce Sales Analytics",
    description:
      "Analysis of eBay sales data to identify top products, customer segments and seasonal patterns, presented in interactive Tableau dashboards.",
    tags: ["SQL", "Python", "Tableau"],
  },
];

export const education: Education[] = [
  {
    degree: "BSCS",
    school: "Air University, Islamabad",
    period: "Sep 2024 – Present",
    detail: "5th Semester",
  },
];

export const certifications: Certification[] = [
  {
    title: "Full Stack Web Development",
    issuer: "Board Infinity via Coursera",
    period: "Oct 2025 – Jan 2026",
  },
  {
    title: "Data Analyst",
    issuer: "Levrify",
    period: "Sep 2023 – Dec 2023",
  },
];

export const navLinks: NavLink[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

/** Section headings (placeholders until each phase builds the real section). */
export const sectionTitles: Record<SectionId, string> = {
  hero: profile.name,
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  contact: "Contact",
};

/** UI labels and accessible names. */
export const ui = {
  skipToContent: "Skip to content",
  downloadCv: "Download CV",
  downloadCvFile: "Download CV as PDF",
  openCvNewTab: "Open CV (PDF) in a new tab",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  mainNav: "Main navigation",
  mobileNav: "Mobile navigation",
  homeLink: "Back to top",
} as const;

export const site = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Portfolio of Syeda Eeman Zahra, a Full-Stack Developer in Islamabad, Pakistan, building fast, reliable web apps with React, Next.js, TypeScript, Node.js and REST APIs.",
} as const;
