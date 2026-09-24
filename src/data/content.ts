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

export type SkillIcon = "frontend" | "backend" | "data" | "tools" | "core";

export interface SkillGroup {
  icon: SkillIcon;
  title: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  /** Location / work arrangement tag. */
  location: string;
  period: string;
  /** Marks the ongoing role (shows the "Current" badge). */
  current?: boolean;
  points: string[];
  /** Optional tech/domain chips shown at the bottom of the card. */
  tags?: string[];
}

export interface Project {
  /** Stable id (details dialog + shared-layout animations). */
  slug: string;
  title: string;
  /** One-line summary shown on the card. */
  summary: string;
  /** Full description shown in the details dialog. */
  description: string;
  /** "What I built" bullets for the details dialog. */
  built: string[];
  /** The first tag is treated as the main technology. */
  tags: string[];
  repo?: string;
  live?: string;
  /** Shown when the project has no public links. */
  note?: string;
  /** Empty string = hidden in the UI. */
  year: string;
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
    icon: "frontend",
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
    icon: "backend",
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "MongoDB", "SQL"],
  },
  {
    icon: "data",
    title: "Data",
    items: ["Python", "Tableau", "Looker Studio", "Excel", "Google Sheets"],
  },
  {
    icon: "tools",
    title: "Tools",
    items: ["Git & GitHub", "VS Code", "Postman", "Vercel", "Render"],
  },
  {
    icon: "core",
    title: "Core",
    items: ["DSA (C++)"],
  },
];

export const experience: Experience[] = [
  {
    role: "Full-Stack Developer",
    company: "The Trexa (Private) Limited",
    location: "Remote · Contract",
    period: "Sep 2026 – Present",
    current: true,
    points: [
      "Develop, maintain, test and optimize responsive front-end interfaces and back-end services.",
      "Design and integrate APIs, databases, authentication flows and third-party services.",
      "Write maintainable code with Git and support debugging, deployment and documentation.",
      "Collaborate with management and team members to deliver secure, reliable solutions.",
    ],
    tags: ["Full-Stack", "APIs", "Databases", "Auth"],
  },
  {
    role: "Frontend Developer Intern",
    company: "App Aura",
    location: "Lahore · Remote",
    period: "Jun 2026 – Sep 2026",
    points: [
      "Built a pharmacy management frontend with React 19, Vite and React Router.",
      "Integrated the login flow with the company's REST API using token-based authentication.",
      "Deployed the app on Render and managed source code on GitHub.",
      "Researched Next.js vs React 19 and prepared a step-by-step migration plan for the production frontend.",
    ],
    tags: ["React 19", "Vite", "REST API", "Render"],
  },
  {
    role: "Frontend Development Intern",
    company: "CodeAlpha",
    location: "Remote",
    period: "May 2026",
    points: [
      "Built responsive web pages and UI components with HTML5, CSS3 and JavaScript (ES6+).",
      "Focused on clean layouts, interactivity and cross-browser compatibility.",
    ],
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    role: "Data Analyst",
    company: "E-Bay",
    location: "Remote · Project-based",
    period: "Aug 2025 – Oct 2025",
    points: [
      "Analyzed e-commerce sales data to find trends, customer behavior and product performance.",
      "Used SQL for extraction and Python for cleaning and exploratory analysis.",
      "Built interactive Tableau dashboards for key KPIs.",
    ],
    tags: ["SQL", "Python", "Tableau"],
  },
];

/** Featured projects, strongest first. Descriptions are based on each repo's README. */
export const projects: Project[] = [
  {
    slug: "nehri",
    title: "NEHRI — Smart Irrigation & MLOps Platform",
    summary: "Irrigation decision support with an end-to-end MLOps pipeline.",
    description:
      "Irrigation decision-support platform for 107 districts of Pakistan, combining a RandomForest model with SHAP explanations and live weather, flood and soil-moisture data. It adds a bilingual (Urdu/English) AI assistant, an MLflow model registry with quality gates, drift monitoring and Prometheus + Grafana.",
    built: [
      "RandomForest irrigation model with per-prediction SHAP explanations",
      "Live weather, flood and soil-moisture data plus a bilingual AI assistant",
      "MLflow registry with quality gates, drift monitoring and Prometheus + Grafana",
    ],
    tags: ["Python", "FastAPI", "scikit-learn", "SHAP", "MLflow", "Docker", "PostgreSQL"],
    note: "Private repository",
    year: "",
  },
  {
    slug: "lehar",
    title: "LEHAR — Hydrological & Agricultural Early Warning",
    summary: "Flood watch and irrigation advice, built on top of NEHRI.",
    description:
      "LEHAR extends my NEHRI prototype with a five-level, multi-channel early-warning system and a new console. It pairs daily irrigation recommendations and SHAP explanations with a Flood Risk Index built from GloFAS river-discharge data across 107 districts.",
    built: [
      "Flood Risk Index blending river discharge and rainfall that overrides irrigation advice at high risk",
      "Staged training pipeline with a quality gate, promote/rollback and PSI drift monitoring",
      "FastAPI backend with JWT auth, Excel/PDF reports and a Docker Compose stack",
    ],
    tags: ["Python", "FastAPI", "scikit-learn", "MLflow", "Docker", "PostgreSQL"],
    repo: "https://github.com/eemanzahra2005-hash/lehar-early-warning",
    year: "2026",
  },
  {
    slug: "appaura",
    title: "AppAura Pharmacy Frontend",
    summary: "Public-facing React frontend for a pharmacy management platform.",
    description:
      "The React frontend for AppAura, with a marketing landing page, a medicines catalog and a sign-in page. A small service layer runs on local mock data by default and calls the real REST API when a base URL is configured.",
    built: [
      "Landing page with stats, features, live preview, pricing and FAQ",
      "Medicines catalog with search, form and stock filters",
      "Validated sign-in page backed by an API layer for medicines and login",
    ],
    tags: ["React 19", "Vite", "React Router", "JavaScript"],
    live: "https://appaura-pharmacy-frontend.onrender.com",
    repo: "https://github.com/eemanzahra2005-hash/appaura-pharmacy-frontend",
    year: "2026",
  },
  {
    slug: "nextjs-rnd",
    title: "Next.js 16 vs React 19 — R&D",
    summary: "A hands-on comparison of Next.js 16 and plain React 19.",
    description:
      "A working demo app where each App Router feature — Server Components, streaming, Server Actions, dynamic routes, Route Handlers and error boundaries — lives in its own route. It comes with a written report on how Next.js relates to and differs from plain React 19.",
    built: [
      "Demo routes for Server and Client Components, Suspense streaming and Server Actions",
      "React 19 hooks in practice: useActionState, useFormStatus and useOptimistic",
      "A written report comparing Next.js 16 with React 19 + Vite",
    ],
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    repo: "https://github.com/eemanzahra2005-hash/nextjs-react19-rnd",
    year: "2026",
  },
  {
    slug: "smart-library",
    title: "Smart Library Management System",
    summary: "Full-stack library system with roles, loans and automatic fines.",
    description:
      "A web-based library management system built with Blazor Server and .NET 8, with Admin and User roles, book management and a guided issue-and-return workflow. Built as a university group project, where I designed and developed the frontend, application logic and backend.",
    built: [
      "Role-based cookie authentication with BCrypt password hashing",
      "Issue and return workflow with automatic, configurable overdue fines",
      "Dashboard with stat cards and Chart.js trend and category charts",
    ],
    tags: ["C#", ".NET 8", "Blazor Server", "EF Core", "SQL Server"],
    repo: "https://github.com/eemanzahra2005-hash/smart-library-management-system",
    year: "2026",
  },
  {
    slug: "codealpha-store",
    title: "CodeAlpha Store — E-Commerce",
    summary: "Full-stack e-commerce store with a cart and user accounts.",
    description:
      "An e-commerce web app built during my CodeAlpha internship, with a product catalog loaded from Supabase, a shopping cart and user accounts. A Node.js and Express backend exposes REST endpoints for products and authentication.",
    built: [
      "Express REST API for products, signup, login, logout and the current user",
      "Supabase Auth sign-up and login with persistent sessions",
      "Shopping cart with quantity updates, live totals and tax",
    ],
    tags: ["Node.js", "Express.js", "Supabase", "JavaScript"],
    repo: "https://github.com/eemanzahra2005-hash/CodeAlpha_Ecommerce",
    year: "2026",
  },
];

/** GitHub repo names to leave out of the automatic "More on GitHub" list. */
export const hiddenRepos: string[] = [];

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

export interface HeroBadge {
  icon: "briefcase" | "graduation";
  label: string;
  value: string;
}

const heroBadges: HeroBadge[] = [
  { icon: "briefcase", label: "Currently", value: "Full-Stack Dev @ The Trexa" },
  { icon: "graduation", label: "BSCS · 5th Semester", value: "Air University" },
];

/** Hero section copy. */
export const hero = {
  eyebrow: `${profile.role} · ${profile.location}`,
  /** Word of the name rendered in italic accent. */
  highlight: "Zahra",
  primaryCta: { label: "View my work", href: "#projects" },
  badges: heroBadges,
  scrollCue: "Scroll",
  contactLinks: "Contact links",
  githubLabel: "GitHub profile (opens in a new tab)",
  emailLabel: `Email ${profile.email}`,
  phoneLabel: `Call ${profile.phone}`,
} as const;

export interface SectionHeadingContent {
  index: string;
  label: string;
  title: string;
  /** Word of the title rendered in italic accent. */
  highlight?: string;
  subtitle?: string;
}

export const sectionHeadings = {
  about: {
    index: "01",
    label: "About",
    title: "Turning ideas into reliable web products",
    highlight: "reliable",
  },
  skills: {
    index: "02",
    label: "Skills",
    title: "My toolkit",
    highlight: "toolkit",
    subtitle: "Technologies I use to design, build and ship.",
  },
  experience: {
    index: "03",
    label: "Experience",
    title: "Where I've worked",
    highlight: "worked",
    subtitle: "From data analysis to full-stack development.",
  },
  projects: {
    index: "04",
    label: "Projects",
    title: "Things I've built",
    highlight: "built",
    subtitle: "A selection of my recent work.",
  },
  contact: {
    index: "05",
    label: "Contact",
    title: "Let's build something together",
    highlight: "together",
    subtitle: "Have a role, project or idea? My inbox is always open.",
  },
} satisfies Partial<Record<SectionId, SectionHeadingContent>>;

/** About section copy. Stat values are derived in the component from the data above. */
export const aboutSection = {
  currently:
    "Currently working at The Trexa while studying Computer Science at Air University.",
  statsLabel: "At a glance",
  stats: {
    roles: "Roles",
    projects: "Projects",
    technologies: "Technologies",
    semester: "Semester · BSCS",
  },
  educationLabel: "Education",
  certificationLabel: "Certification",
} as const;

export const skillsSection = {
  countLabel: (n: number) => `${n} ${n === 1 ? "skill" : "skills"}`,
} as const;

export const experienceSection = {
  current: "Current",
  showMore: "Show more",
  showLess: "Show less",
  /** Accessible name suffix so each toggle is distinguishable. */
  toggleContext: (role: string, company: string) => `details for ${role} at ${company}`,
  tagsLabel: (company: string) => `Focus areas at ${company}`,
  /** Bullets visible before "Show more". */
  collapsedCount: 2,
} as const;

export const projectsSection = {
  /** Filter chips, in order; a chip only shows if a featured project's tags match it. */
  filters: ["React", "Next.js", "Node.js", "Python", ".NET"],
  allFilter: "All",
  filterLabel: "Filter projects by technology",
  details: "Details",
  detailsLabel: (title: string) => `Details: ${title}`,
  closeLabel: "Close project details",
  builtHeading: "What I built",
  techHeading: "Tech stack",
  github: "GitHub",
  githubLabel: (title: string) => `${title} source code on GitHub (opens in a new tab)`,
  live: "Live",
  liveLabel: (title: string) => `${title} live site (opens in a new tab)`,
  moreHeading: "More on GitHub",
  moreSubtitle: "Other public repositories, updated automatically.",
  noDescription: "No description",
  stars: (n: number) => `${n} ${n === 1 ? "star" : "stars"}`,
  updated: "Updated",
  viewAll: "View all on GitHub",
  /** Max repos shown in "More on GitHub". */
  moreLimit: 9,
} as const;

/** Contact section copy. Field rules live in `src/lib/contact.ts`. */
export const contactSection = {
  cardsLabel: "Contact details",
  cards: {
    email: "Email",
    phone: "Phone",
    location: "Location",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
  emailLabel: `Email ${profile.email}`,
  phoneLabel: `Call ${profile.phone}`,
  githubLabel: "GitHub profile (opens in a new tab)",
  linkedinLabel: "LinkedIn profile (opens in a new tab)",
  copy: "Copy",
  copied: "Copied",
  copyLabel: "Copy email address",
  copiedToast: "Email copied",
  copyFailedToast: "Couldn't copy — select the address instead",
  /** IANA zone for the live clock, plus the label shown after it. */
  timeZone: "Asia/Karachi",
  localTime: (time: string) => `My local time: ${time} (PKT)`,
  form: {
    label: "Contact form",
    fields: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
    },
    honeypot: "Leave this field empty",
    errors: {
      required: (field: string) => `${field} is required.`,
      email: "Enter a valid email address.",
      tooShort: (field: string, min: number) =>
        `${field} must be at least ${min} characters.`,
      tooLong: (field: string, max: number) =>
        `${field} must be at most ${max} characters.`,
    },
    submit: "Send message",
    pending: "Sending…",
    success: "Message sent!",
    retry: "Try again",
    successTitle: "Thanks for reaching out!",
    successBody: "Your message is on its way. I'll reply as soon as I can.",
    errorText: "Something went wrong —",
    errorLink: "email me directly",
  },
  /** Sender name on the Web3Forms notification email. */
  fromName: "Portfolio contact",
} as const;

export const footer = {
  closing: "Open to new opportunities",
  /** Word of the closing line rendered in italic accent. */
  highlight: "opportunities",
  emailLabel: `Email ${profile.email}`,
  copyright: (year: number) => `© ${year} ${profile.name}`,
  builtWith: "Built with Next.js, Tailwind CSS & Motion",
  navLabel: "Footer navigation",
  socialLabel: "Social links",
  githubLabel: "GitHub (opens in a new tab)",
  linkedinLabel: "LinkedIn (opens in a new tab)",
  backToTop: "Back to top",
} as const;

/** UI labels and accessible names. */
export const ui = {
  skipToContent: "Skip to content",
  downloadCv: "Download CV",
  downloadCvFile: "Download CV as PDF",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  mainNav: "Main navigation",
  mobileNav: "Mobile navigation",
  homeLink: "Back to top",
  opensInNewTab: "(opens in a new tab)",
} as const;

export const site = {
  title: `${profile.name} — ${profile.role}`,
  /** Page titles become "Page — Syeda Eeman Zahra". */
  titleTemplate: `%s — ${profile.name}`,
  description:
    "Portfolio of Syeda Eeman Zahra, a Full-Stack Developer in Islamabad, Pakistan, building fast, reliable web apps with React, Next.js, TypeScript, Node.js and REST APIs.",
  keywords: [
    profile.name,
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Islamabad",
    "Pakistan",
  ],
  locale: "en_US",
  /** Social preview card (Open Graph / Twitter image). */
  ogImage: {
    alt: `${profile.name} — ${profile.role} · React, Next.js, Node.js`,
    stack: "React · Next.js · Node.js",
  },
  /** Web app manifest. */
  manifest: {
    shortName: profile.shortName,
    backgroundColor: "#fafaf9",
    themeColor: "#2563eb",
  },
} as const;

/** Structured data (JSON-LD Person) — organisation names as they're publicly known. */
export const personSchema = {
  alumniOf: "Air University",
  worksFor: "The Trexa",
  addressLocality: "Islamabad",
  addressCountry: "PK",
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "REST APIs",
    "MongoDB",
    "SQL",
    "Tailwind CSS",
    "Python",
  ],
} as const;

export const notFoundPage = {
  title: "Page not found",
  code: "404",
  message: "This page wandered off.",
  cta: "Back home",
} as const;
