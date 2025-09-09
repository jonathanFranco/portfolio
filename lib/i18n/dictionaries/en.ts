import type { Dictionary } from "./pt";

const en: Dictionary = {
  meta: {
    title: "Jonathan Franco — Senior Front-End Developer",
    description:
      "Education, logistics, support and government platforms in Vue, React, Angular and Flutter. Portfolio of Jonathan Franco, senior front-end developer based in Fortaleza, Brazil.",
    keywords: [
      "Jonathan Franco",
      "Front-End Developer",
      "Senior Front-End",
      "Portfolio",
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "Angular",
      "TypeScript",
      "Design System",
      "Accessibility",
      "Web Performance",
      "Fortaleza",
      "Brazil",
    ],
  },
  skipLink: "Skip to content",
  loader: {
    label: "Loading the page",
    status: "stacking layers",
  },
  available: "Available for new projects",
  whatsappHello: "Hi Jonathan, I found you through your portfolio",
  backdrops: {
    about: "About",
    experience: "Experience",
    stacks: "Stacks",
    education: "Certificates",
    projects: "Projects",
    process: "Process",
    services: "Services",
    proposal: "Proposal",
    contact: "Contact",
  },
  header: {
    nav: {
      inicio: { label: "Home", hint: "back to the start" },
      about: { label: "About", hint: "who I am and how I work" },
      experience: { label: "Experience", hint: "where I've worked and what I shipped" },
      stacks: { label: "Stacks", hint: "tools I use every day" },
      projects: { label: "Projects", hint: "what I've shipped" },
      services: { label: "Services", hint: "how I can help you" },
      contact: { label: "Contact", hint: "let's talk" },
    },
    sections: "Site sections",
    brand: "Jonathan Franco, back to the top",
    language: "Language",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navigation: "Navigation",
    goTo: "Go to",
  },
  hero: {
    role: "Senior front-end developer",
    location: "Fortaleza, Brazil",
    taglineStart: "I turn complicated systems into screens that are",
    taglineHighlight: "easy to use",
    taglineEnd: ".",
    summary:
      "6 years building education, logistics, support and government platforms in Vue, React, Angular and Flutter — from design system to deploy.",
    viewProjects: "See projects",
    talkToMe: "Get in touch",
    domCaption: "DOM tree in layers",
    domHint: "move the cursor · scroll over it to flatten",
  },
  about: {
    eyebrow: "About",
    title:
      "I build the front end of portals people use to get something done.",
    paragraphs: [
      "Opening a support ticket, finding government information, watching a class. That shapes how I decide: a component nobody understands, an animation that gets in the way and a heavy bundle are bugs, not details.",
      "In practice, that means building the design system alongside the first screen, measuring what loads, testing with the keyboard before calling it pretty, and leaving the code readable for whoever comes after me.",
    ],
    spec: [
      { key: "experience", value: "6 years · front end and mobile" },
      { key: "main stack", value: "Vue · React · Angular · TypeScript" },
      { key: "also ship in", value: "Nuxt (SSR) · Next.js" },
      { key: "mobile", value: "Flutter (Android and iOS)" },
      { key: "integration", value: "Keycloak · WebSocket/STOMP · RabbitMQ" },
      { key: "focus", value: "design systems, accessibility, performance" },
      { key: "domains", value: "education · logistics · support · government" },
      { key: "based in", value: "Fortaleza, Brazil · remote" },
      { key: "availability", value: "open to new projects" },
    ],
  },
  stacks: {
    eyebrow: "Stacks",
    title: "Tools by role",
    note: "What I use in production, grouped by the job it does.",
    groups: {
      interface: { category: "Interface", note: "where the screen is born" },
      state: { category: "State and data", note: "what the screen knows" },
      style: { category: "Style and system", note: "visual consistency" },
      quality: { category: "Quality and security", note: "what must not break" },
      flow: { category: "Delivery", note: "from commit to live" },
      ai: { category: "AI and 3D", note: "AI in the workflow · three.js on this site" },
    },
  },
  experience: {
    eyebrow: "Experience",
    title: "Where I've worked",
    note: "6 years of front end, with mobile since 2025.",
    items: [
      {
        role: "Senior Front-end Developer",
        company: "iREDE – Institute of Management, Technology Networks and Energy",
        period: "02/2022 – 11/2026",
        location: "Fortaleza, Brazil",
        highlights: [
          "Lead front-end contributor to Homero, an adaptive e-learning platform with 100+ screens (~730 commits, ~49% of the repository).",
          "In-browser attention and emotion detection with TensorFlow.js, HLS player, quizzes, H5P, forum and ApexCharts dashboards.",
          "Internal design system (Atomic Design), Keycloak (OAuth2/OIDC, RBAC), accessibility with VLibras and PT/EN i18n.",
          "Grupo Multi portals in Nuxt SSR and the IFCE LMS; Moodle plugins in PHP; AI skills for Claude Code (code review, visual QA, release notes).",
        ],
        tech: ["Vue 3", "Nuxt", "TypeScript", "PrimeVue", "Pinia", "Docker"],
      },
      {
        role: "Front-end and Mobile Developer (Freelance)",
        company: "Juraboy / Vai Boy – Delivery logistics platform",
        period: "04/2025 – 10/2026",
        location: "Remote",
        highlights: [
          "Courier app in Flutter (Android and iOS): 18 MVVM screens, GPS check-in, Firebase push and iFood and Saipos integration.",
          "Angular admin panel: ~58% of commits, 99 components, Angular 18→19 and PrimeNG 17→18 migration.",
          "Real-time delivery tracking with React 19, MapLibre and WebSocket/STOMP over RabbitMQ.",
        ],
        tech: ["Flutter", "Angular", "PrimeNG", "React", "RabbitMQ", "Firebase"],
      },
      {
        role: "Front-end Developer",
        company: "LDS – Research, Development & Innovation",
        period: "08/2021 – 01/2022",
        location: "Fortaleza, Brazil",
        highlights: [
          "Angular and React applications with TypeScript, SOLID and componentization; improved Web Vitals on critical screens.",
        ],
        tech: ["Angular", "React", "TypeScript", "Angular Material", "SCSS"],
      },
      {
        role: "Front-end Developer",
        company: "Softbuilder",
        period: "10/2020 – 07/2021",
        location: "Fortaleza, Brazil",
        highlights: [
          "Internal React systems from prototype to production and a mobile-first component library.",
        ],
        tech: ["React", "JavaScript", "Git"],
      },
    ],
    education: {
      label: "Education",
      degree: "Associate degree in Systems Analysis and Development",
      school: "Estácio",
      period: "2017 – 2020",
    },
  },
  certificates: {
    eyebrow: "Certificates",
    title: "Continuous learning",
    count: (n: number) => `${n} certificates · verifiable credentials`,
    months: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
  },
  projects: {
    eyebrow: "Projects",
    title: "Live right now",
    note: "Eight projects online. Open any of them.",
    open: (domain: string) => `Open ${domain}`,
    more: "See more projects on LinkedIn",
    items: {
      homero: {
        context: "Education · Adaptive AI",
        description:
          "Adaptive e-learning platform with 100+ screens for students, teachers and admins. I was the lead front-end contributor: quizzes, H5P, interactive book, attention detection with TensorFlow.js and accessibility with VLibras.",
        tech: ["Vue 3", "TypeScript", "Tailwind", "Pinia", "PrimeVue", "TensorFlow.js"],
      },
      avaIfce: {
        context: "Education · Government",
        description:
          "LMS for IFCE's Young Digital Entrepreneurs program. Geographic dashboard with a map of Brazil by region, state and city, PDF, Excel and CSV export, 5 access roles and sign language with Hand Talk.",
        tech: ["Vue 3", "TypeScript", "PrimeVue", "Tailwind", "Pinia", "Leaflet"],
      },
      vaiBoy: {
        context: "Logistics · Delivery",
        description:
          "Delivery platform with a web panel for businesses and an app for couriers. I was the lead contributor to the Angular panel (~58% of commits) and the Flutter app, and built real-time tracking with React, MapLibre and WebSocket/STOMP.",
        tech: ["Angular", "PrimeNG", "Flutter", "React", "RabbitMQ", "Firebase"],
      },
      multiSupport: {
        context: "Support · B2C",
        description:
          "Support portal with manuals and drivers, repair tracking by protocol, a map of service centers and ZIP code search. I was the lead developer (~63% of commits), with 32 test files and Kubernetes deploys.",
        tech: ["Nuxt 3 (SSR)", "TypeScript", "Vuetify", "Pinia", "Vitest", "Docker"],
      },
      multiGov: {
        context: "Government · Institutional",
        description:
          "Institutional portal for the public sector, with official information and communication in one place. Any citizen must find what they need without help.",
        tech: ["Nuxt 3 (SSR)", "TypeScript", "Vuetify", "Pinia", "i18n"],
      },
      fortalConnect: {
        context: "Technology · Institutional",
        description:
          "Website for an IT and electronic security company in Fortaleza, with an interactive 3D network globe in the hero. Services, maintenance contracts and camera kits all lead straight to a WhatsApp quote, in light or dark theme.",
        tech: ["Next.js", "React", "Tailwind", "Three.js", "Light and dark theme"],
      },
      boraAssistir: {
        context: "Side project · Randomizer",
        description:
          "Picks something to watch from IMDb's Top 250, with optional filters by streaming service, genre and decade. Born from spending half an hour choosing and watching nothing.",
        tech: ["Next.js", "TypeScript", "Tailwind", "i18n PT/EN", "Vercel"],
      },
      pirataflix: {
        context: "Side project · Streaming",
        description:
          "Movie and TV catalog with TMDB data, trailers, search, a randomizer and a favorites list. The same codebase runs in the browser and as an Android TV app.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind", "Firebase", "TMDB API"],
      },
    },
  },
  services: {
    eyebrow: "Services",
    title: "From first chat to a PDF quote",
    note: "Every project starts with a document. Price, scope and timeline in writing before the first line of code.",
    steps: [
      {
        title: "Conversation",
        description:
          "You tell me the problem, who it's for and your deadline. I ask whatever is missing for the scope to hold up.",
      },
      {
        title: "Category",
        description:
          "I fit the request into one of the categories below. That defines deliverables, phases and price range.",
      },
      {
        title: "PDF quote",
        description:
          "You get a document with scope, deliverables, phases, timeline, price and what's left out. No surprises later.",
      },
      {
        title: "Execution",
        description:
          "I deliver in phases, with a live link for each one. You follow it running, not in presentation screenshots.",
      },
      {
        title: "Handoff",
        description:
          "Code, deploy and a step-by-step guide to maintain it. Out-of-scope changes become a new PDF, never silent debt.",
      },
    ],
    catalog: {
      eyebrow: "Categories",
      title: "What I do",
      count: (n: number) => `${n} categories · combinable in one project`,
      items: [
        {
          name: "Business website and landing page",
          summary:
            "A presence that loads fast, shows up in search and turns visits into contacts.",
          deliverables: ["Responsive design", "Technical SEO", "Forms and analytics"],
        },
        {
          name: "Portal and web system",
          summary:
            "Logged-in area, dashboard and service flows on top of the API you already have.",
          deliverables: ["Authentication", "CRUD screens", "API integration"],
        },
        {
          name: "Mobile app",
          summary: "Flutter app for Android and iOS from a single codebase.",
          deliverables: ["Builds for both stores", "Push and offline", "Store release"],
        },
        {
          name: "Design system",
          summary:
            "A component library so many screens look alike without coordinating over chat.",
          deliverables: ["Tokens and theme", "Components", "Usage docs"],
        },
        {
          name: "Legacy front-end redesign",
          summary:
            "I modernize the existing interface without stopping the product or rewriting everything at once.",
          deliverables: ["Assessment", "Phased migration", "Feature parity"],
        },
        {
          name: "Performance and accessibility",
          summary:
            "A heavy site, or one that blocks keyboard and screen reader users, is a bug. I measure before and after.",
          deliverables: ["Audit", "Fixes", "Impact report"],
        },
        {
          name: "3D and visualization on the web",
          summary:
            "A scene, product or dataset in three.js when the Z axis explains better than an image.",
          deliverables: ["Optimized scene", "Interaction", "2D fallback"],
        },
        {
          name: "Monthly retainer",
          summary:
            "Hours reserved each month for tweaks, fixes and continuous improvement.",
          deliverables: ["Prioritized queue", "Bug fixes", "Monthly report"],
        },
      ],
    },
    proposal: {
      eyebrow: "Document",
      title: "What's in the PDF",
      body: "A proposal is there for you to compare and decide. That's why it arrives complete, with what's out of scope written as clearly as what's in.",
      items: [
        { title: "Scope", detail: "The problem and the solution in contract language" },
        { title: "Deliverables", detail: "Item-by-item list of what gets done" },
        { title: "Phases and timeline", detail: "Each phase with a delivery date" },
        { title: "Price", detail: "Fixed price and payment terms" },
        { title: "Out of scope", detail: "What isn't included, in writing" },
        { title: "Validity", detail: "How long the proposal holds, and signature" },
      ],
      hint: "hover over an item to find it on the sheet",
      cta: "Request a quote",
      whatsappText: "Hi Jonathan, I'd like a quote",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk",
    body: "Tell me what needs to get off the ground and how soon. I'll reply with what I'd do first.",
    locationKey: "where I am",
    locationValue: "Fortaleza, Brazil · remote",
  },
  footer: {
    backToTop: "Back to top ↑",
  },
  chat: {
    assistantName: "Project assistant",
    open: "Talk about your project",
    close: "Close chat",
    closeShort: "Close",
    restart: "Restart chat",
    typing: "typing",
    typingLabel: "Writing a reply",
    preview: "message preview",
    back: "go back one step",
    continueWith: (n: number) => `Continue with ${n}`,
    continueNone: "None of these, continue",
    send: "Send answer",
    skip: "skip this step →",
    sendWhatsapp: "Send via WhatsApp",
    copy: "copy message",
    copied: "copied",
    restartShort: "start over",
  },
  chatScript: {
    services: {
      site: {
        label: "Website or landing page",
        reaction: "Nice! A fast, well-built site is a company's business card.",
        goalQuestion: "What's the site's main job?",
        goalOptions: [
          "Present the company",
          "Capture leads from campaigns",
          "Sell a product or course",
          "Show my portfolio",
        ],
        featureOptions: [
          "Contact form",
          "WhatsApp button",
          "Blog",
          "Google SEO",
          "Multiple pages",
          "Portuguese version",
        ],
      },
      system: {
        label: "Web system",
        reaction: "Great. Custom systems are where I work the most.",
        goalQuestion: "Which process will the system organize?",
        goalOptions: [
          "Customers and records",
          "Service orders",
          "Inventory and sales",
          "Finance",
          "Scheduling",
        ],
        featureOptions: [
          "User login",
          "Admin dashboard",
          "Reports and charts",
          "Permission levels",
          "Email or WhatsApp alerts",
          "Integration with another system",
        ],
      },
      store: {
        label: "Online store",
        reaction: "Cool! Let's get your store selling.",
        goalQuestion: "What do you sell?",
        goalOptions: [
          "Physical products",
          "Digital products",
          "Services",
          "I have a store and want to migrate",
        ],
        featureOptions: [
          "Pix and card payments",
          "Shipping calculation",
          "Discount coupons",
          "Orders dashboard",
          "ERP integration",
        ],
      },
      app: {
        label: "Mobile app",
        reaction: "Awesome. A Flutter app ships to Android and iOS at once.",
        goalQuestion: "Who is the app for?",
        goalOptions: ["My customers", "My internal team", "Both"],
        featureOptions: [
          "Login and sign-up",
          "Push notifications",
          "In-app payments",
          "Works offline",
          "App store release",
        ],
      },
      dashboard: {
        label: "Dashboard / data panel",
        reaction: "Nice! Well-presented data leads to faster decisions.",
        goalQuestion: "Where does the data come from today?",
        goalOptions: [
          "Spreadsheets",
          "A system I already use",
          "Our own database",
          "Not sure yet",
        ],
        featureOptions: [
          "Charts and KPIs",
          "Date range filters",
          "Export to PDF or Excel",
          "Per-user access",
          "Automatic updates",
        ],
      },
      improve: {
        label: "Improve an existing site or system",
        reaction: "Got it. We can evolve it without stopping what already works.",
        goalQuestion: "What bothers you most today?",
        goalOptions: [
          "It's slow",
          "Outdated look",
          "Hard to use on mobile",
          "Accessibility issues",
          "Old tech that needs migrating",
        ],
        featureOptions: [
          "Audit with report",
          "Screen redesign",
          "Phased migration",
          "Bug fixes",
        ],
      },
      design_system: {
        label: "Design system",
        reaction: "Great. Standardizing early saves a lot of rework.",
        goalQuestion: "How are things today?",
        goalOptions: [
          "Screens don't follow a pattern",
          "Several products, each its own way",
          "It's in Figma, the code is missing",
        ],
        featureOptions: [
          "Colors and typography (tokens)",
          "Component library",
          "Usage docs",
          "Light and dark theme",
        ],
      },
      support: {
        label: "Monthly maintenance",
        reaction: "Deal. Monthly hours keep the project always up to date.",
        goalQuestion: "What kind of support do you need?",
        goalOptions: [
          "Fixes and tweaks",
          "New features",
          "Updates and security",
          "A bit of everything",
        ],
        featureOptions: [],
      },
      other: {
        label: "Something else",
        reaction: "No problem, tell me in your own words.",
        goalQuestion: "In one sentence: what do you need?",
        goalOptions: [],
        featureOptions: [],
      },
    },
    intro: (developer) => [
      `Hi! 👋 I'm ${developer}'s assistant.`,
      "In under a minute we'll put together your quote request, ready to send to his WhatsApp.",
      "What do you need?",
    ],
    goalPlaceholder: "E.g.: a system to schedule classes",
    featuresQuestion: "Which of these features do you have in mind? Pick as many as you like.",
    stageQuestion: "Noted. And where is the project right now?",
    stageOptions: [
      "Just the idea",
      "The design is ready",
      "Something is already live",
      "Everything is written down",
    ],
    deadlineQuestion: "When do you need it?",
    deadlineOptions: [
      "As soon as possible",
      "Within 1 month",
      "1 to 3 months",
      "No set date",
    ],
    budgetQuestion:
      "Do you have a budget range in mind? It helps me propose the right scope.",
    budgetOptions: [
      "Up to R$ 2k",
      "R$ 2k to 5k",
      "R$ 5k to 10k",
      "Over R$ 10k",
      "I'd rather get a proposal",
    ],
    detailsQuestion:
      "Almost there. Want to add any detail? A reference site, a business rule…",
    detailsPlaceholder: "Optional: add a detail",
    nameQuestion:
      "Last one: what should I call you? Add your company too if you like.",
    namePlaceholder: "E.g.: Ana, from Smile Clinic",
    noneSelected: "None of these",
    skipped: "Skip",
    done: (developer) => [
      `Done! This is the message that goes to ${developer}'s WhatsApp.`,
      "Check it and tap send: WhatsApp opens with everything already written.",
    ],
    message: {
      greeting: (developer) =>
        `Hi, ${developer}! I came from your portfolio and would like a quote.`,
      service: "Service",
      goal: "Goal",
      features: "Features",
      stage: "Current stage",
      deadline: "Timeline",
      budget: "Budget",
      details: "Details",
      closing: "Can we talk about the project?",
      closingWithName: (name) => `I'm ${name}. Can we talk about the project?`,
    },
  },
};

export default en;
