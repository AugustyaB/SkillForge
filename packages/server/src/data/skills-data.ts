import type { Skill } from '@skillforge/shared';

export const DEFAULT_SKILLS_DATA: Skill[] = ([
  {
    "id": "react",
    "name": "React",
    "category": "frontend-framework",
    "difficulty": "beginner",
    "description": "A JavaScript library for building component-driven user interfaces with a declarative mental model.",
    "whyUseIt": "The most popular frontend library in the industry with an enormous ecosystem and massive job market.",
    "tags": [
      "react",
      "ui",
      "frontend",
      "components",
      "spa",
      "jsx",
      "javascript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://react.dev",
    "learnResources": [
      {
        "label": "Official Tutorial",
        "url": "https://react.dev/learn",
        "type": "docs"
      },
      {
        "label": "React Handbook",
        "url": "https://react.dev/reference/react",
        "type": "docs"
      }
    ],
    "alternatives": [
      "vue",
      "svelte",
      "angular",
      "solidjs"
    ],
    "worksWellWith": [
      "nextjs",
      "tailwind-css",
      "zustand",
      "tanstack-query"
    ],
    "prerequisites": [
      "javascript",
      "html",
      "css"
    ],
    "stackIndicators": [
      "react",
      "react-dom"
    ]
  },
  {
    "id": "vue",
    "name": "Vue.js",
    "category": "frontend-framework",
    "difficulty": "beginner",
    "description": "Progressive JavaScript framework that is approachable, performant, and versatile.",
    "whyUseIt": "Gentle learning curve with clean template syntax and first-party routing and state tools.",
    "tags": [
      "vue",
      "frontend",
      "components",
      "spa",
      "templates",
      "javascript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://vuejs.org",
    "learnResources": [
      {
        "label": "Vue Guide",
        "url": "https://vuejs.org/guide/introduction.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "react",
      "svelte",
      "angular"
    ],
    "worksWellWith": [
      "pinia",
      "nuxt",
      "tailwind-css"
    ],
    "prerequisites": [
      "javascript",
      "html",
      "css"
    ],
    "stackIndicators": [
      "vue"
    ]
  },
  {
    "id": "svelte",
    "name": "Svelte",
    "category": "frontend-framework",
    "difficulty": "beginner",
    "description": "Cybernetically enhanced web apps that compile away into tiny, reactive vanilla JavaScript.",
    "whyUseIt": "Zero virtual DOM overhead, concise syntax, and exceptional developer satisfaction.",
    "tags": [
      "svelte",
      "frontend",
      "compiler",
      "reactive",
      "performance",
      "spa"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://svelte.dev",
    "learnResources": [
      {
        "label": "Interactive Tutorial",
        "url": "https://svelte.dev/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react",
      "vue",
      "solidjs"
    ],
    "worksWellWith": [
      "sveltekit",
      "tailwind-css"
    ],
    "prerequisites": [
      "javascript",
      "html",
      "css"
    ],
    "stackIndicators": [
      "svelte"
    ]
  },
  {
    "id": "angular",
    "name": "Angular",
    "category": "frontend-framework",
    "difficulty": "advanced",
    "description": "Opinionated enterprise web framework with built-in dependency injection, routing, and forms.",
    "whyUseIt": "Batteries-included enterprise standard for large engineering teams requiring strict conventions.",
    "tags": [
      "angular",
      "frontend",
      "enterprise",
      "typescript",
      "di",
      "spa"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://angular.dev",
    "learnResources": [
      {
        "label": "Angular Docs",
        "url": "https://angular.dev/overview",
        "type": "docs"
      }
    ],
    "alternatives": [
      "react",
      "vue"
    ],
    "worksWellWith": [
      "rxjs",
      "tailwind-css",
      "ngrx"
    ],
    "prerequisites": [
      "typescript",
      "javascript",
      "html",
      "css"
    ],
    "stackIndicators": [
      "@angular/core"
    ]
  },
  {
    "id": "solidjs",
    "name": "SolidJS",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "Simple and performant reactivity for building user interfaces without a Virtual DOM.",
    "whyUseIt": "Combines the familiar JSX syntax of React with ultra-fast fine-grained reactivity.",
    "tags": [
      "solidjs",
      "solid",
      "reactive",
      "jsx",
      "performance",
      "frontend"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.solidjs.com",
    "learnResources": [
      {
        "label": "SolidJS Tutorial",
        "url": "https://www.solidjs.com/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react",
      "svelte"
    ],
    "worksWellWith": [
      "tailwind-css",
      "vite"
    ],
    "prerequisites": [
      "javascript",
      "jsx"
    ],
    "stackIndicators": [
      "solid-js"
    ]
  },
  {
    "id": "nextjs",
    "name": "Next.js",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "The React framework for the web enabling hybrid static and server-rendered applications.",
    "whyUseIt": "Industry standard for production React apps with App Router, SSR, and API routes.",
    "tags": [
      "nextjs",
      "next",
      "react",
      "ssr",
      "fullstack",
      "server-components"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://nextjs.org",
    "learnResources": [
      {
        "label": "Next.js Learn Course",
        "url": "https://nextjs.org/learn",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "remix",
      "astro",
      "nuxt"
    ],
    "worksWellWith": [
      "react",
      "tailwind-css",
      "prisma",
      "next-auth"
    ],
    "prerequisites": [
      "react",
      "javascript",
      "nodejs"
    ],
    "stackIndicators": [
      "next"
    ]
  },
  {
    "id": "nuxt",
    "name": "Nuxt",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "The intuitive Vue framework providing universal rendering, file-system routing, and SEO optimization.",
    "whyUseIt": "The premier full-stack solution for Vue.js developers with automatic imports and SSR.",
    "tags": [
      "nuxt",
      "vue",
      "ssr",
      "fullstack",
      "seo"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://nuxt.com",
    "learnResources": [
      {
        "label": "Nuxt Documentation",
        "url": "https://nuxt.com/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "nextjs",
      "sveltekit"
    ],
    "worksWellWith": [
      "vue",
      "pinia",
      "tailwind-css"
    ],
    "prerequisites": [
      "vue",
      "javascript"
    ],
    "stackIndicators": [
      "nuxt"
    ]
  },
  {
    "id": "sveltekit",
    "name": "SvelteKit",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "The official application framework for Svelte offering server-side rendering and routing.",
    "whyUseIt": "Blazing fast full-stack framework with zero-effort build step and minimal boilerplate.",
    "tags": [
      "sveltekit",
      "svelte",
      "ssr",
      "fullstack",
      "router"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://kit.svelte.dev",
    "learnResources": [
      {
        "label": "SvelteKit Docs",
        "url": "https://kit.svelte.dev/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "nextjs",
      "nuxt"
    ],
    "worksWellWith": [
      "svelte",
      "tailwind-css"
    ],
    "prerequisites": [
      "svelte",
      "javascript"
    ],
    "stackIndicators": [
      "@sveltejs/kit"
    ]
  },
  {
    "id": "remix",
    "name": "Remix",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "Full-stack web framework focused on web standards, resilient routing, and fast transitions.",
    "whyUseIt": "Superb data loading and mutation model that leans into native HTTP forms and browser standards.",
    "tags": [
      "remix",
      "react",
      "ssr",
      "fullstack",
      "web-standards"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://remix.run",
    "learnResources": [
      {
        "label": "Remix Quickstart",
        "url": "https://remix.run/docs/en/main/start/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nextjs",
      "astro"
    ],
    "worksWellWith": [
      "react",
      "tailwind-css",
      "prisma"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "@remix-run/react",
      "@remix-run/node"
    ]
  },
  {
    "id": "astro",
    "name": "Astro",
    "category": "frontend-framework",
    "difficulty": "beginner",
    "description": "Content-driven web framework with Islands architecture delivering zero client-side JavaScript by default.",
    "whyUseIt": "Best-in-class performance for blogs, documentation, portfolios, and content websites.",
    "tags": [
      "astro",
      "ssg",
      "islands",
      "content",
      "performance",
      "markdown"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://astro.build",
    "learnResources": [
      {
        "label": "Astro Tutorial",
        "url": "https://docs.astro.build/en/tutorial/0-introduction/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nextjs",
      "remix"
    ],
    "worksWellWith": [
      "tailwind-css",
      "react",
      "vue",
      "svelte"
    ],
    "prerequisites": [
      "html",
      "css",
      "javascript"
    ],
    "stackIndicators": [
      "astro"
    ]
  },
  {
    "id": "tailwind-css",
    "name": "Tailwind CSS",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "A utility-first CSS framework for rapid and responsive UI development without leaving your markup.",
    "whyUseIt": "Dominant modern CSS standard eliminating naming fatigue and ensuring high design consistency.",
    "tags": [
      "css",
      "styling",
      "utility-first",
      "design",
      "tailwind",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tailwindcss.com",
    "learnResources": [
      {
        "label": "Tailwind Docs",
        "url": "https://tailwindcss.com/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "chakra-ui",
      "bootstrap"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "nextjs",
      "shadcn-ui"
    ],
    "prerequisites": [
      "html",
      "css"
    ],
    "stackIndicators": [
      "tailwindcss"
    ]
  },
  {
    "id": "chakra-ui",
    "name": "Chakra UI",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Simple, modular and accessible component library that gives you the building blocks for React applications.",
    "whyUseIt": "Accessible by default (WAI-ARIA compliant) with intuitive style props.",
    "tags": [
      "chakra",
      "ui",
      "components",
      "react",
      "accessible"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://chakra-ui.com",
    "learnResources": [
      {
        "label": "Getting Started",
        "url": "https://chakra-ui.com/docs/get-started/overview",
        "type": "docs"
      }
    ],
    "alternatives": [
      "material-ui",
      "shadcn-ui",
      "tailwind-css"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "@chakra-ui/react"
    ]
  },
  {
    "id": "shadcn-ui",
    "name": "shadcn/ui",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Beautifully designed, accessible components that you copy and paste into your applications.",
    "whyUseIt": "Complete source ownership without lock-in, built on Radix UI and styled with Tailwind CSS.",
    "tags": [
      "shadcn",
      "components",
      "tailwind",
      "radix",
      "react",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://ui.shadcn.com",
    "learnResources": [
      {
        "label": "Component Library",
        "url": "https://ui.shadcn.com/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "chakra-ui",
      "material-ui"
    ],
    "worksWellWith": [
      "tailwind-css",
      "radix-ui",
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "react",
      "tailwind-css"
    ],
    "stackIndicators": [
      "clsx",
      "tailwind-merge"
    ]
  },
  {
    "id": "material-ui",
    "name": "Material UI (MUI)",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Comprehensive library of foundational and advanced components implementing Google Material Design.",
    "whyUseIt": "Vast enterprise ecosystem, battle-tested components, rich data grid and charts.",
    "tags": [
      "mui",
      "material-design",
      "react",
      "components",
      "enterprise"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://mui.com",
    "learnResources": [
      {
        "label": "MUI Core Docs",
        "url": "https://mui.com/material-ui/getting-started/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "chakra-ui",
      "ant-design"
    ],
    "worksWellWith": [
      "react",
      "emotion"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "@mui/material"
    ]
  },
  {
    "id": "radix-ui",
    "name": "Radix UI",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Unstyled, accessible component primitives for high-quality design systems and web apps.",
    "whyUseIt": "Handles complex keyboard navigation, focus management, and ARIA attributes with zero styling constraints.",
    "tags": [
      "radix",
      "primitives",
      "headless",
      "accessible",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.radix-ui.com",
    "learnResources": [
      {
        "label": "Radix Primitives",
        "url": "https://www.radix-ui.com/primitives/docs/overview/introduction",
        "type": "docs"
      }
    ],
    "alternatives": [
      "headless-ui"
    ],
    "worksWellWith": [
      "tailwind-css",
      "shadcn-ui",
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "@radix-ui/react-primitive",
      "@radix-ui/react-dialog"
    ]
  },
  {
    "id": "ant-design",
    "name": "Ant Design",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "An enterprise-class UI design language and React component library.",
    "whyUseIt": "Extremely rich set of complex tables, forms, and widgets tailored for internal enterprise tooling.",
    "tags": [
      "antd",
      "enterprise",
      "table",
      "forms",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://ant.design",
    "learnResources": [
      {
        "label": "Ant Design Docs",
        "url": "https://ant.design/docs/react/introduce",
        "type": "docs"
      }
    ],
    "alternatives": [
      "material-ui",
      "chakra-ui"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "antd"
    ]
  },
  {
    "id": "styled-components",
    "name": "styled-components",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Visual primitives for the component age using tagged template literals in JavaScript.",
    "whyUseIt": "Pioneered CSS-in-JS, encapsulating component styles alongside component logic.",
    "tags": [
      "css-in-js",
      "styling",
      "components",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://styled-components.com",
    "learnResources": [
      {
        "label": "Official Guide",
        "url": "https://styled-components.com/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "emotion",
      "tailwind-css"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react",
      "css"
    ],
    "stackIndicators": [
      "styled-components"
    ]
  },
  {
    "id": "emotion",
    "name": "Emotion",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Performant and flexible CSS-in-JS library supporting string and object styles.",
    "whyUseIt": "Predictable styling engine with great source maps and SSR support, powers MUI.",
    "tags": [
      "emotion",
      "css-in-js",
      "styling",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://emotion.sh",
    "learnResources": [
      {
        "label": "Emotion Docs",
        "url": "https://emotion.sh/docs/introduction",
        "type": "docs"
      }
    ],
    "alternatives": [
      "styled-components",
      "tailwind-css"
    ],
    "worksWellWith": [
      "react",
      "material-ui"
    ],
    "prerequisites": [
      "css",
      "javascript"
    ],
    "stackIndicators": [
      "@emotion/react",
      "@emotion/styled"
    ]
  },
  {
    "id": "daisyui",
    "name": "daisyUI",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "The most popular component library for Tailwind CSS with clean semantic class names.",
    "whyUseIt": "Saves time by providing semantic classes (btn, card, modal) on top of pure Tailwind.",
    "tags": [
      "daisyui",
      "tailwind",
      "components",
      "css"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://daisyui.com",
    "learnResources": [
      {
        "label": "daisyUI Docs",
        "url": "https://daisyui.com/docs/use/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "shadcn-ui",
      "bootstrap"
    ],
    "worksWellWith": [
      "tailwind-css",
      "react",
      "vue",
      "svelte"
    ],
    "prerequisites": [
      "tailwind-css"
    ],
    "stackIndicators": [
      "daisyui"
    ]
  },
  {
    "id": "bootstrap",
    "name": "Bootstrap",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "The world’s most famous front-end open source toolkit for responsive web interfaces.",
    "whyUseIt": "Reliable, battle-tested responsive grid system requiring zero CSS setup.",
    "tags": [
      "bootstrap",
      "css",
      "grid",
      "responsive",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://getbootstrap.com",
    "learnResources": [
      {
        "label": "Bootstrap Getting Started",
        "url": "https://getbootstrap.com/docs/5.3/getting-started/introduction/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "tailwind-css",
      "chakra-ui"
    ],
    "worksWellWith": [
      "html",
      "javascript"
    ],
    "prerequisites": [
      "html",
      "css"
    ],
    "stackIndicators": [
      "bootstrap"
    ]
  },
  {
    "id": "redux-toolkit",
    "name": "Redux Toolkit (RTK)",
    "category": "state-management",
    "difficulty": "intermediate",
    "description": "The official, opinionated, batteries-included toolset for efficient Redux development.",
    "whyUseIt": "Eliminates traditional Redux boilerplate with createSlice, RTK Query, and Immer built-in.",
    "tags": [
      "redux",
      "rtk",
      "state",
      "store",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://redux-toolkit.js.org",
    "learnResources": [
      {
        "label": "RTK Quickstart",
        "url": "https://redux-toolkit.js.org/tutorials/quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "zustand",
      "pinia"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "@reduxjs/toolkit",
      "react-redux"
    ]
  },
  {
    "id": "zustand",
    "name": "Zustand",
    "category": "state-management",
    "difficulty": "beginner",
    "description": "A small, fast, and scalable bearbones state-management solution using simplified flux principles.",
    "whyUseIt": "Tiny bundle footprint, zero boilerplate, hook-based, and no context providers required.",
    "tags": [
      "zustand",
      "state",
      "store",
      "hooks",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://zustand-demo.pmnd.rs",
    "learnResources": [
      {
        "label": "Zustand Documentation",
        "url": "https://github.com/pmndrs/zustand",
        "type": "docs"
      }
    ],
    "alternatives": [
      "redux-toolkit",
      "jotai"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "zustand"
    ]
  },
  {
    "id": "pinia",
    "name": "Pinia",
    "category": "state-management",
    "difficulty": "beginner",
    "description": "The intuitive, type-safe, and light store for Vue with Devtools support.",
    "whyUseIt": "The official state management library for Vue 3, replacing Vuex with seamless TypeScript support.",
    "tags": [
      "pinia",
      "vue",
      "state",
      "store"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://pinia.vuejs.org",
    "learnResources": [
      {
        "label": "Pinia Getting Started",
        "url": "https://pinia.vuejs.org/getting-started.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "vuex"
    ],
    "worksWellWith": [
      "vue",
      "nuxt"
    ],
    "prerequisites": [
      "vue"
    ],
    "stackIndicators": [
      "pinia"
    ]
  },
  {
    "id": "mobx",
    "name": "MobX",
    "category": "state-management",
    "difficulty": "intermediate",
    "description": "Simple, scalable state management powered by transparent functional reactive programming.",
    "whyUseIt": "Automatic dependency tracking allows updating observable state directly without action dispatches.",
    "tags": [
      "mobx",
      "reactive",
      "observables",
      "state"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://mobx.js.org",
    "learnResources": [
      {
        "label": "MobX Ten Minute Intro",
        "url": "https://mobx.js.org/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "redux-toolkit",
      "zustand"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "mobx",
      "mobx-react-lite"
    ]
  },
  {
    "id": "recoil",
    "name": "Recoil",
    "category": "state-management",
    "difficulty": "intermediate",
    "description": "Experimental state management library for React providing atomic state definitions.",
    "whyUseIt": "Allows managing fine-grained derived data with atoms and selectors alongside React concurrent features.",
    "tags": [
      "recoil",
      "atoms",
      "state",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://recoiljs.org",
    "learnResources": [
      {
        "label": "Recoil Docs",
        "url": "https://recoiljs.org/docs/introduction/getting-started",
        "type": "docs"
      }
    ],
    "alternatives": [
      "jotai",
      "zustand"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "recoil"
    ]
  },
  {
    "id": "jotai",
    "name": "Jotai",
    "category": "state-management",
    "difficulty": "beginner",
    "description": "Primitive and flexible atomic state management for React.",
    "whyUseIt": "Bottom-up atomic approach inspired by Recoil but with a minimal, unopinionated API.",
    "tags": [
      "jotai",
      "atomic",
      "state",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://jotai.org",
    "learnResources": [
      {
        "label": "Jotai Documentation",
        "url": "https://jotai.org/docs/basics/introduction",
        "type": "docs"
      }
    ],
    "alternatives": [
      "recoil",
      "zustand"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "jotai"
    ]
  },
  {
    "id": "tanstack-query",
    "name": "TanStack Query (React Query)",
    "category": "state-management",
    "difficulty": "intermediate",
    "description": "Powerful asynchronous state management for server state, data fetching, and caching.",
    "whyUseIt": "Solves complex server state synchronization, background refetching, and pagination out of the box.",
    "tags": [
      "react-query",
      "tanstack-query",
      "fetching",
      "caching",
      "server-state"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tanstack.com/query/latest",
    "learnResources": [
      {
        "label": "Query Overview",
        "url": "https://tanstack.com/query/latest/docs/framework/react/overview",
        "type": "docs"
      }
    ],
    "alternatives": [
      "swr"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "nextjs",
      "axios"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "@tanstack/react-query",
      "react-query"
    ]
  },
  {
    "id": "swr",
    "name": "SWR",
    "category": "state-management",
    "difficulty": "beginner",
    "description": "React Hooks for Data Fetching using the Stale-While-Revalidate caching strategy.",
    "whyUseIt": "Created by Vercel; lightweight, straightforward data fetching with instant cache presentation.",
    "tags": [
      "swr",
      "fetching",
      "cache",
      "react",
      "hooks"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://swr.vercel.app",
    "learnResources": [
      {
        "label": "SWR Documentation",
        "url": "https://swr.vercel.app/docs/getting-started",
        "type": "docs"
      }
    ],
    "alternatives": [
      "tanstack-query"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "swr"
    ]
  },
  {
    "id": "express",
    "name": "Express.js",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "Fast, unopinionated, minimalist web framework for Node.js.",
    "whyUseIt": "The baseline standard for building REST APIs in Node.js with millions of compatible middlewares.",
    "tags": [
      "express",
      "backend",
      "rest",
      "api",
      "http",
      "node"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://expressjs.com",
    "learnResources": [
      {
        "label": "Express Getting Started",
        "url": "https://expressjs.com/en/starter/installing.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "fastify",
      "koa",
      "nestjs",
      "hono"
    ],
    "worksWellWith": [
      "passport",
      "prisma",
      "cors",
      "helmet"
    ],
    "prerequisites": [
      "javascript",
      "nodejs"
    ],
    "stackIndicators": [
      "express"
    ]
  },
  {
    "id": "fastify",
    "name": "Fastify",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Fast and low overhead web framework for Node.js with built-in schema validation.",
    "whyUseIt": "Significantly higher throughput than Express, built-in JSON schema validation, and first-class TypeScript support.",
    "tags": [
      "fastify",
      "backend",
      "performance",
      "rest",
      "api",
      "node"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://fastify.dev",
    "learnResources": [
      {
        "label": "Fastify Getting Started",
        "url": "https://fastify.dev/docs/latest/Guides/Getting-Started/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "express",
      "hono"
    ],
    "worksWellWith": [
      "pino",
      "prisma",
      "zod"
    ],
    "prerequisites": [
      "javascript",
      "nodejs"
    ],
    "stackIndicators": [
      "fastify"
    ]
  },
  {
    "id": "nestjs",
    "name": "NestJS",
    "category": "backend-framework",
    "difficulty": "advanced",
    "description": "A progressive Node.js framework for building efficient, reliable and scalable enterprise server-side applications.",
    "whyUseIt": "Angular-inspired modular architecture with decorators, dependency injection, and enterprise structure.",
    "tags": [
      "nestjs",
      "typescript",
      "backend",
      "enterprise",
      "di"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://nestjs.com",
    "learnResources": [
      {
        "label": "NestJS First Steps",
        "url": "https://docs.nestjs.com/first-steps",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "express",
      "fastify",
      "spring-boot"
    ],
    "worksWellWith": [
      "typeorm",
      "prisma",
      "class-validator"
    ],
    "prerequisites": [
      "typescript",
      "nodejs"
    ],
    "stackIndicators": [
      "@nestjs/core"
    ]
  },
  {
    "id": "koa",
    "name": "Koa",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Next generation web framework designed by the team behind Express, leveraging async functions.",
    "whyUseIt": "Ultra-lean core where middleware execution operates in a stack-like cascade.",
    "tags": [
      "koa",
      "backend",
      "middleware",
      "node",
      "async"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://koajs.com",
    "learnResources": [
      {
        "label": "Koa Guide",
        "url": "https://github.com/koajs/koa/blob/master/docs/guide.md",
        "type": "docs"
      }
    ],
    "alternatives": [
      "express",
      "fastify"
    ],
    "worksWellWith": [
      "koa-router"
    ],
    "prerequisites": [
      "javascript",
      "nodejs"
    ],
    "stackIndicators": [
      "koa"
    ]
  },
  {
    "id": "hono",
    "name": "Hono",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "Ultrafast, lightweight web framework built on Web Standards that runs anywhere (Cloudflare, Deno, Bun, Node).",
    "whyUseIt": "Edge-native, tiny bundle size, superb TypeScript types, and zero dependencies.",
    "tags": [
      "hono",
      "edge",
      "serverless",
      "web-standards",
      "cloudflare"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://hono.dev",
    "learnResources": [
      {
        "label": "Hono Getting Started",
        "url": "https://hono.dev/docs/getting-started/basic",
        "type": "docs"
      }
    ],
    "alternatives": [
      "express",
      "fastify"
    ],
    "worksWellWith": [
      "cloudflare-workers",
      "zod",
      "drizzle-orm"
    ],
    "prerequisites": [
      "typescript",
      "javascript"
    ],
    "stackIndicators": [
      "hono"
    ]
  },
  {
    "id": "django",
    "name": "Django",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "The high-level Python web framework that encourages rapid development and clean, pragmatic design.",
    "whyUseIt": "Batteries-included with built-in ORM, admin dashboard, user authentication, and CSRF protection.",
    "tags": [
      "django",
      "python",
      "backend",
      "orm",
      "admin",
      "batteries-included"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.djangoproject.com",
    "learnResources": [
      {
        "label": "Official Django Tutorial",
        "url": "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "fastapi",
      "flask",
      "rails"
    ],
    "worksWellWith": [
      "postgresql",
      "celery"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "django"
    ]
  },
  {
    "id": "fastapi",
    "name": "FastAPI",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "Modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints.",
    "whyUseIt": "Automatic OpenAPI (Swagger) documentation, fast execution, and data validation with Pydantic.",
    "tags": [
      "fastapi",
      "python",
      "api",
      "rest",
      "pydantic",
      "openapi"
    ],
    "ecosystem": "python",
    "officialUrl": "https://fastapi.tiangolo.com",
    "learnResources": [
      {
        "label": "FastAPI Tutorial",
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "django",
      "flask"
    ],
    "worksWellWith": [
      "sqlalchemy",
      "pydantic",
      "uvicorn"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "fastapi"
    ]
  },
  {
    "id": "flask",
    "name": "Flask",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "A lightweight WSGI micro web framework for Python with minimal dependencies.",
    "whyUseIt": "Maximum flexibility for small web applications, microservices, and AI model inference servers.",
    "tags": [
      "flask",
      "python",
      "microframework",
      "api",
      "rest"
    ],
    "ecosystem": "python",
    "officialUrl": "https://flask.palletsprojects.com",
    "learnResources": [
      {
        "label": "Flask Quickstart",
        "url": "https://flask.palletsprojects.com/en/stable/quickstart/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "fastapi",
      "django"
    ],
    "worksWellWith": [
      "sqlalchemy",
      "jinja2"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "flask"
    ]
  },
  {
    "id": "spring-boot",
    "name": "Spring Boot",
    "category": "backend-framework",
    "difficulty": "advanced",
    "description": "Enterprise Java framework that simplifies building stand-alone, production-grade Spring applications.",
    "whyUseIt": "The backbone of enterprise Java engineering, providing unmatched scalability and integrations.",
    "tags": [
      "java",
      "spring",
      "spring-boot",
      "enterprise",
      "backend",
      "microservices"
    ],
    "ecosystem": "java",
    "officialUrl": "https://spring.io/projects/spring-boot",
    "learnResources": [
      {
        "label": "Spring Quickstart",
        "url": "https://spring.io/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nestjs",
      "aspnet-core"
    ],
    "worksWellWith": [
      "postgresql",
      "hibernate",
      "docker"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "spring-boot-starter-web"
    ]
  },
  {
    "id": "gin",
    "name": "Gin Web Framework",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "High-performance HTTP web framework written in Go (Golang) featuring a Martini-like API with fast routing.",
    "whyUseIt": "Radix tree routing delivers extreme request performance and minimal memory usage in Go.",
    "tags": [
      "go",
      "golang",
      "gin",
      "backend",
      "api",
      "performance"
    ],
    "ecosystem": "go",
    "officialUrl": "https://gin-gonic.com",
    "learnResources": [
      {
        "label": "Gin Quickstart",
        "url": "https://gin-gonic.com/docs/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "go-chi"
    ],
    "worksWellWith": [
      "gorm",
      "docker"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/gin-gonic/gin"
    ]
  },
  {
    "id": "go-chi",
    "name": "Chi",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "Lightweight, idiomatic and composable router for building Go HTTP services.",
    "whyUseIt": "100% compatible with standard library net/http while adding structured routing and middleware.",
    "tags": [
      "go",
      "golang",
      "router",
      "net-http",
      "rest"
    ],
    "ecosystem": "go",
    "officialUrl": "https://github.com/go-chi/chi",
    "learnResources": [
      {
        "label": "Chi Documentation",
        "url": "https://github.com/go-chi/chi#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "gin"
    ],
    "worksWellWith": [
      "sqlx",
      "net/http"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/go-chi/chi"
    ]
  },
  {
    "id": "actix-web",
    "name": "Actix Web",
    "category": "backend-framework",
    "difficulty": "advanced",
    "description": "A powerful, pragmatic, and extremely fast web framework for Rust.",
    "whyUseIt": "Consistently ranks at the absolute top of web benchmarks with compile-time memory safety.",
    "tags": [
      "rust",
      "actix",
      "performance",
      "backend",
      "web"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://actix.rs",
    "learnResources": [
      {
        "label": "Actix Getting Started",
        "url": "https://actix.rs/docs/getting-started",
        "type": "docs"
      }
    ],
    "alternatives": [
      "axum"
    ],
    "worksWellWith": [
      "diesel",
      "tokio"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "actix-web"
    ]
  },
  {
    "id": "axum",
    "name": "Axum",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Ergonomic and modular web application framework built with Tokio, Tower, and Hyper in Rust.",
    "whyUseIt": "Official Tokio project web framework offering seamless async Rust patterns without macros.",
    "tags": [
      "rust",
      "tokio",
      "axum",
      "async",
      "backend"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://github.com/tokio-rs/axum",
    "learnResources": [
      {
        "label": "Axum Docs",
        "url": "https://docs.rs/axum/latest/axum/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "actix-web"
    ],
    "worksWellWith": [
      "tokio",
      "tower",
      "sqlx"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "axum"
    ]
  },
  {
    "id": "aspnet-core",
    "name": "ASP.NET Core",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Cross-platform, high-performance, open-source framework for building modern, cloud-enabled web applications.",
    "whyUseIt": "World-class throughput, exceptional tooling in C#, and first-party enterprise support from Microsoft.",
    "tags": [
      "dotnet",
      "csharp",
      "aspnet",
      "backend",
      "microsoft"
    ],
    "ecosystem": "dotnet",
    "officialUrl": "https://dotnet.microsoft.com/apps/aspnet",
    "learnResources": [
      {
        "label": "ASP.NET Core Tutorial",
        "url": "https://learn.microsoft.com/en-us/aspnet/core/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "spring-boot",
      "nestjs"
    ],
    "worksWellWith": [
      "entity-framework",
      "sql-server"
    ],
    "prerequisites": [
      "csharp"
    ],
    "stackIndicators": [
      "Microsoft.AspNetCore.App"
    ]
  },
  {
    "id": "ruby-on-rails",
    "name": "Ruby on Rails",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "A web-application framework that includes everything needed to create database-backed web applications.",
    "whyUseIt": "Convention over configuration philosophy enabling unparalleled startup prototyping speed.",
    "tags": [
      "rails",
      "ruby",
      "fullstack",
      "mvc",
      "convention-over-configuration"
    ],
    "ecosystem": "ruby",
    "officialUrl": "https://rubyonrails.org",
    "learnResources": [
      {
        "label": "Rails Guides",
        "url": "https://guides.rubyonrails.org/getting_started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "django",
      "laravel"
    ],
    "worksWellWith": [
      "postgresql",
      "redis"
    ],
    "prerequisites": [
      "ruby"
    ],
    "stackIndicators": [
      "rails"
    ]
  },
  {
    "id": "postgresql",
    "name": "PostgreSQL",
    "category": "database",
    "difficulty": "beginner",
    "description": "A powerful, open source object-relational database system with over 35 years of active development.",
    "whyUseIt": "The undisputed default relational database with JSON support, ACID guarantees, and rich extensions (pgvector).",
    "tags": [
      "postgres",
      "sql",
      "database",
      "rdbms",
      "acid",
      "relational"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.postgresql.org",
    "learnResources": [
      {
        "label": "PostgreSQL Tutorial",
        "url": "https://www.postgresql.org/docs/current/tutorial.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "mysql",
      "sqlite"
    ],
    "worksWellWith": [
      "prisma",
      "drizzle-orm",
      "docker"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "pg",
      "postgres"
    ]
  },
  {
    "id": "mysql",
    "name": "MySQL",
    "category": "database",
    "difficulty": "beginner",
    "description": "The world’s most popular open-source relational database management system.",
    "whyUseIt": "Proven reliability, broad hosting availability, and powers major platforms like WordPress and GitHub.",
    "tags": [
      "mysql",
      "sql",
      "database",
      "rdbms"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.mysql.com",
    "learnResources": [
      {
        "label": "MySQL Tutorial",
        "url": "https://dev.mysql.com/doc/refman/8.0/en/tutorial.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "postgresql",
      "mariadb"
    ],
    "worksWellWith": [
      "prisma",
      "typeorm"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "mysql2",
      "mysql"
    ]
  },
  {
    "id": "sqlite",
    "name": "SQLite",
    "category": "database",
    "difficulty": "beginner",
    "description": "A small, fast, self-contained, high-reliability, full-featured SQL database engine.",
    "whyUseIt": "Zero configuration, serverless file-based database ideal for mobile apps, CLI tools, and development.",
    "tags": [
      "sqlite",
      "embedded",
      "sql",
      "database",
      "lightweight"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.sqlite.org",
    "learnResources": [
      {
        "label": "SQLite Tutorial",
        "url": "https://www.sqlite.org/quickstart.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "postgresql"
    ],
    "worksWellWith": [
      "better-sqlite3",
      "prisma"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "better-sqlite3",
      "sqlite3"
    ]
  },
  {
    "id": "mongodb",
    "name": "MongoDB",
    "category": "database",
    "difficulty": "beginner",
    "description": "Source-available, cross-platform, document-oriented database program storing data in flexible BSON.",
    "whyUseIt": "Flexible schema allows rapid prototyping with nested JSON structures without migration overhead.",
    "tags": [
      "mongodb",
      "nosql",
      "document-store",
      "json",
      "database"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.mongodb.com",
    "learnResources": [
      {
        "label": "MongoDB University",
        "url": "https://www.mongodb.com/docs/manual/tutorial/getting-started/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "postgresql",
      "dynamodb"
    ],
    "worksWellWith": [
      "mongoose",
      "express"
    ],
    "prerequisites": [
      "json"
    ],
    "stackIndicators": [
      "mongodb",
      "mongoose"
    ]
  },
  {
    "id": "redis",
    "name": "Redis",
    "category": "database",
    "difficulty": "intermediate",
    "description": "In-memory data structure store used as a distributed, in-memory key-value database, cache, and message broker.",
    "whyUseIt": "Sub-millisecond latency for caching, session stores, rate limiting, and Pub/Sub queues.",
    "tags": [
      "redis",
      "cache",
      "in-memory",
      "pubsub",
      "key-value"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://redis.io",
    "learnResources": [
      {
        "label": "Redis Quickstart",
        "url": "https://redis.io/docs/latest/get-started/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "memcached"
    ],
    "worksWellWith": [
      "express",
      "socket-io",
      "bullmq"
    ],
    "prerequisites": [
      "networking"
    ],
    "stackIndicators": [
      "ioredis",
      "redis"
    ]
  },
  {
    "id": "dynamodb",
    "name": "Amazon DynamoDB",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Fast, flexible NoSQL database service for single-digit millisecond performance at any scale.",
    "whyUseIt": "Fully managed serverless database with automatic scaling in the AWS ecosystem.",
    "tags": [
      "aws",
      "dynamodb",
      "nosql",
      "serverless",
      "cloud"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://aws.amazon.com/dynamodb/",
    "learnResources": [
      {
        "label": "DynamoDB Getting Started",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "mongodb",
      "cassandra"
    ],
    "worksWellWith": [
      "aws-sdk"
    ],
    "prerequisites": [
      "aws"
    ],
    "stackIndicators": [
      "@aws-sdk/client-dynamodb"
    ]
  },
  {
    "id": "cassandra",
    "name": "Apache Cassandra",
    "category": "database",
    "difficulty": "advanced",
    "description": "Open source distributed NoSQL database designed to handle large amounts of data across many commodity servers.",
    "whyUseIt": "Linear horizontal scalability with zero single point of failure for massive write-heavy applications.",
    "tags": [
      "cassandra",
      "nosql",
      "distributed",
      "big-data"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://cassandra.apache.org",
    "learnResources": [
      {
        "label": "Cassandra Quickstart",
        "url": "https://cassandra.apache.org/doc/latest/cassandra/getting_started/index.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "dynamodb"
    ],
    "worksWellWith": [
      "docker"
    ],
    "prerequisites": [
      "distributed-systems"
    ],
    "stackIndicators": [
      "cassandra-driver"
    ]
  },
  {
    "id": "supabase",
    "name": "Supabase",
    "category": "database",
    "difficulty": "beginner",
    "description": "An open source Firebase alternative providing Postgres database, Authentication, instant APIs, and Realtime.",
    "whyUseIt": "Instant backend with a real Postgres DB under the hood, Row-Level Security, and instant auth.",
    "tags": [
      "supabase",
      "baas",
      "postgres",
      "auth",
      "serverless"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://supabase.com",
    "learnResources": [
      {
        "label": "Supabase Quickstart",
        "url": "https://supabase.com/docs/guides/getting-started",
        "type": "docs"
      }
    ],
    "alternatives": [
      "firebase-auth",
      "neon"
    ],
    "worksWellWith": [
      "nextjs",
      "react",
      "tailwind-css"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "@supabase/supabase-js"
    ]
  },
  {
    "id": "neon",
    "name": "Neon",
    "category": "database",
    "difficulty": "beginner",
    "description": "Serverless, fault-tolerant open-source Postgres designed for the cloud with instant branching.",
    "whyUseIt": "Scale-to-zero serverless PostgreSQL with database branching identical to Git branches.",
    "tags": [
      "neon",
      "serverless",
      "postgres",
      "database",
      "cloud"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://neon.tech",
    "learnResources": [
      {
        "label": "Neon Docs",
        "url": "https://neon.tech/docs/introduction",
        "type": "docs"
      }
    ],
    "alternatives": [
      "supabase",
      "postgresql"
    ],
    "worksWellWith": [
      "prisma",
      "drizzle-orm",
      "nextjs"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "@neondatabase/serverless"
    ]
  },
  {
    "id": "elasticsearch",
    "name": "Elasticsearch",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Distributed, RESTful search and analytics engine capable of addressing a growing number of use cases.",
    "whyUseIt": "Full-text search, complex log aggregation, and real-time analytical indexing.",
    "tags": [
      "elasticsearch",
      "search",
      "fulltext",
      "analytics",
      "elk"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.elastic.co/elasticsearch",
    "learnResources": [
      {
        "label": "Elasticsearch Quickstart",
        "url": "https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "meilisearch"
    ],
    "worksWellWith": [
      "docker",
      "kibana"
    ],
    "prerequisites": [
      "json"
    ],
    "stackIndicators": [
      "@elastic/elasticsearch"
    ]
  },
  {
    "id": "meilisearch",
    "name": "Meilisearch",
    "category": "database",
    "difficulty": "beginner",
    "description": "A lightning-fast, ultra relevant, and typo-tolerant search engine that fits into any application.",
    "whyUseIt": "Instant search-as-you-type with zero complex configuration compared to Elasticsearch.",
    "tags": [
      "search",
      "meilisearch",
      "fulltext",
      "typo-tolerance"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.meilisearch.com",
    "learnResources": [
      {
        "label": "Meilisearch Getting Started",
        "url": "https://www.meilisearch.com/docs/learn/getting_started/quick_start",
        "type": "docs"
      }
    ],
    "alternatives": [
      "elasticsearch"
    ],
    "worksWellWith": [
      "react",
      "nextjs",
      "vue"
    ],
    "prerequisites": [
      "json"
    ],
    "stackIndicators": [
      "meilisearch"
    ]
  },
  {
    "id": "chromadb",
    "name": "ChromaDB",
    "category": "database",
    "difficulty": "beginner",
    "description": "The AI-native open-source embedding database designed to make it easy to build LLM apps.",
    "whyUseIt": "Simple, lightweight vector store for semantic search and retrieval-augmented generation (RAG).",
    "tags": [
      "chromadb",
      "vector",
      "embeddings",
      "ai",
      "rag"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.trychroma.com",
    "learnResources": [
      {
        "label": "Chroma Getting Started",
        "url": "https://docs.trychroma.com/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pinecone"
    ],
    "worksWellWith": [
      "langchain",
      "openai-sdk"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "chromadb"
    ]
  },
  {
    "id": "pinecone",
    "name": "Pinecone",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Managed, cloud-native vector database with ultra-low latency for production machine learning.",
    "whyUseIt": "Handles billions of vectors with high throughput without managing vector infrastructure.",
    "tags": [
      "pinecone",
      "vector",
      "database",
      "embeddings",
      "ai"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.pinecone.io",
    "learnResources": [
      {
        "label": "Pinecone Docs",
        "url": "https://docs.pinecone.io/guides/get-started/quickstart",
        "type": "docs"
      }
    ],
    "alternatives": [
      "chromadb"
    ],
    "worksWellWith": [
      "langchain",
      "openai-sdk"
    ],
    "prerequisites": [
      "ai-concepts"
    ],
    "stackIndicators": [
      "@pinecone-database/pinecone",
      "pinecone-client"
    ]
  },
  {
    "id": "prisma",
    "name": "Prisma",
    "category": "orm",
    "difficulty": "beginner",
    "description": "Next-generation Node.js and TypeScript ORM with an intuitive data model and automated migrations.",
    "whyUseIt": "Exceptional developer experience with auto-generated typesafe database client and visual schema file.",
    "tags": [
      "prisma",
      "orm",
      "database",
      "typescript",
      "migrations"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.prisma.io",
    "learnResources": [
      {
        "label": "Prisma Quickstart",
        "url": "https://www.prisma.io/docs/getting-started/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "drizzle-orm",
      "typeorm"
    ],
    "worksWellWith": [
      "postgresql",
      "mysql",
      "nextjs",
      "express"
    ],
    "prerequisites": [
      "typescript",
      "sql"
    ],
    "stackIndicators": [
      "@prisma/client",
      "prisma"
    ]
  },
  {
    "id": "drizzle-orm",
    "name": "Drizzle ORM",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Lightweight and performant TypeScript ORM that feels like writing type-safe SQL.",
    "whyUseIt": "Zero dependencies, maximum query speed, serverless-ready, and SQL-like syntax without abstraction magic.",
    "tags": [
      "drizzle",
      "orm",
      "sql",
      "typescript",
      "serverless"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://orm.drizzle.team",
    "learnResources": [
      {
        "label": "Drizzle Quickstart",
        "url": "https://orm.drizzle.team/docs/quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "prisma",
      "typeorm"
    ],
    "worksWellWith": [
      "postgresql",
      "sqlite",
      "neon",
      "nextjs"
    ],
    "prerequisites": [
      "sql",
      "typescript"
    ],
    "stackIndicators": [
      "drizzle-orm"
    ]
  },
  {
    "id": "typeorm",
    "name": "TypeORM",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "ORM that can run in NodeJS, Browser, Cordova, and supports both Active Record and Data Mapper patterns.",
    "whyUseIt": "Familiar decorator-based syntax for developers coming from Java (Hibernate) or C#.",
    "tags": [
      "typeorm",
      "orm",
      "decorators",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://typeorm.io",
    "learnResources": [
      {
        "label": "TypeORM Guide",
        "url": "https://typeorm.io/#/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "prisma",
      "drizzle-orm"
    ],
    "worksWellWith": [
      "nestjs",
      "postgresql"
    ],
    "prerequisites": [
      "typescript",
      "decorators"
    ],
    "stackIndicators": [
      "typeorm"
    ]
  },
  {
    "id": "mongoose",
    "name": "Mongoose",
    "category": "orm",
    "difficulty": "beginner",
    "description": "Elegant MongoDB object modeling for Node.js with built-in type casting and validation.",
    "whyUseIt": "The standard ODM for managing MongoDB relationships and schema validations in Node.js.",
    "tags": [
      "mongoose",
      "mongodb",
      "odm",
      "nosql",
      "schemas"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://mongoosejs.com",
    "learnResources": [
      {
        "label": "Mongoose Quickstart",
        "url": "https://mongoosejs.com/docs/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "prisma"
    ],
    "worksWellWith": [
      "mongodb",
      "express"
    ],
    "prerequisites": [
      "javascript",
      "mongodb"
    ],
    "stackIndicators": [
      "mongoose"
    ]
  },
  {
    "id": "sqlalchemy",
    "name": "SQLAlchemy",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "The Python SQL Toolkit and Object Relational Mapper that gives application developers the full power of SQL.",
    "whyUseIt": "The gold standard ORM in Python combining high-level abstractions with raw SQL execution power.",
    "tags": [
      "sqlalchemy",
      "python",
      "orm",
      "sql",
      "database"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.sqlalchemy.org",
    "learnResources": [
      {
        "label": "SQLAlchemy Unified Tutorial",
        "url": "https://docs.sqlalchemy.org/en/20/tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tortoise-orm"
    ],
    "worksWellWith": [
      "fastapi",
      "flask",
      "alembic"
    ],
    "prerequisites": [
      "python",
      "sql"
    ],
    "stackIndicators": [
      "sqlalchemy"
    ]
  },
  {
    "id": "tortoise-orm",
    "name": "Tortoise ORM",
    "category": "orm",
    "difficulty": "beginner",
    "description": "An easy-to-use asyncio ORM for Python inspired by Django.",
    "whyUseIt": "Built from ground up for async Python (FastAPI / Sanic) with clean Django-like model syntax.",
    "tags": [
      "tortoise",
      "python",
      "async",
      "orm"
    ],
    "ecosystem": "python",
    "officialUrl": "https://tortoise.github.io",
    "learnResources": [
      {
        "label": "Tortoise Getting Started",
        "url": "https://tortoise.github.io/getting_started.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "sqlalchemy"
    ],
    "worksWellWith": [
      "fastapi",
      "postgresql"
    ],
    "prerequisites": [
      "python",
      "asyncio"
    ],
    "stackIndicators": [
      "tortoise-orm"
    ]
  },
  {
    "id": "gorm",
    "name": "GORM",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "The fantastic ORM library for Golang aiming to be developer friendly.",
    "whyUseIt": "Full-featured Go ORM supporting associations, hooks, preloading, and transactions.",
    "tags": [
      "gorm",
      "go",
      "golang",
      "orm",
      "database"
    ],
    "ecosystem": "go",
    "officialUrl": "https://gorm.io",
    "learnResources": [
      {
        "label": "GORM Quickstart",
        "url": "https://gorm.io/docs/index.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "sqlx"
    ],
    "worksWellWith": [
      "gin",
      "postgresql"
    ],
    "prerequisites": [
      "go",
      "sql"
    ],
    "stackIndicators": [
      "gorm.io/gorm"
    ]
  },
  {
    "id": "diesel",
    "name": "Diesel",
    "category": "orm",
    "difficulty": "advanced",
    "description": "A Safe, Extensible ORM and Query Builder for Rust.",
    "whyUseIt": "Eliminates runtime database errors by enforcing SQL correctness and schema validation at compile time.",
    "tags": [
      "diesel",
      "rust",
      "orm",
      "typesafe",
      "database"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://diesel.rs",
    "learnResources": [
      {
        "label": "Diesel Getting Started",
        "url": "https://diesel.rs/guides/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sqlx"
    ],
    "worksWellWith": [
      "actix-web",
      "postgresql"
    ],
    "prerequisites": [
      "rust",
      "sql"
    ],
    "stackIndicators": [
      "diesel"
    ]
  },
  {
    "id": "flyway",
    "name": "Flyway",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Open source database migration tool strongly favoring simplicity and convention over configuration.",
    "whyUseIt": "Database migrations using plain SQL scripts across CI/CD and production environments.",
    "tags": [
      "flyway",
      "migrations",
      "sql",
      "database",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://flywaydb.org",
    "learnResources": [
      {
        "label": "Flyway Quickstart",
        "url": "https://documentation.red-gate.com/fd/quickstart-184127404.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "liquibase"
    ],
    "worksWellWith": [
      "postgresql",
      "mysql",
      "spring-boot"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "flyway-core"
    ]
  },
  {
    "id": "liquibase",
    "name": "Liquibase",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Database change management solution that tracks, versions, and deploys database code changes.",
    "whyUseIt": "Supports declaring database migrations in YAML, XML, JSON, or SQL with rollbacks.",
    "tags": [
      "liquibase",
      "migrations",
      "database",
      "ci-cd"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.liquibase.com",
    "learnResources": [
      {
        "label": "Liquibase Getting Started",
        "url": "https://docs.liquibase.com/start/home.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "flyway"
    ],
    "worksWellWith": [
      "spring-boot",
      "postgresql"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "liquibase-core"
    ]
  },
  {
    "id": "passport",
    "name": "Passport.js",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "Simple, unobtrusive authentication middleware for Node.js supporting 500+ strategies.",
    "whyUseIt": "Extensive strategy ecosystem covering username/password, Google, GitHub, OAuth, and SAML.",
    "tags": [
      "passport",
      "auth",
      "authentication",
      "oauth",
      "middleware"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.passportjs.org",
    "learnResources": [
      {
        "label": "Passport Guide",
        "url": "https://www.passportjs.org/docs/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "next-auth",
      "lucia"
    ],
    "worksWellWith": [
      "express",
      "bcrypt",
      "express-session"
    ],
    "prerequisites": [
      "express",
      "javascript"
    ],
    "stackIndicators": [
      "passport"
    ]
  },
  {
    "id": "next-auth",
    "name": "Auth.js (NextAuth)",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "Complete open-source authentication solution for Next.js and modern web frameworks.",
    "whyUseIt": "Zero-configuration social OAuth providers, email magic links, and JWT session handling for Next.js.",
    "tags": [
      "auth",
      "nextauth",
      "oauth",
      "nextjs",
      "security"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://authjs.dev",
    "learnResources": [
      {
        "label": "Auth.js Getting Started",
        "url": "https://authjs.dev/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "clerk",
      "lucia"
    ],
    "worksWellWith": [
      "nextjs",
      "prisma"
    ],
    "prerequisites": [
      "nextjs"
    ],
    "stackIndicators": [
      "next-auth",
      "@auth/core"
    ]
  },
  {
    "id": "lucia",
    "name": "Lucia Auth",
    "category": "authentication",
    "difficulty": "intermediate",
    "description": "An open-source library that handles session-based authentication in modern full-stack web frameworks.",
    "whyUseIt": "Teaches and implements clear, unbloated session management without magical blackbox layers.",
    "tags": [
      "lucia",
      "sessions",
      "auth",
      "security",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://lucia-auth.com",
    "learnResources": [
      {
        "label": "Lucia Getting Started",
        "url": "https://lucia-auth.com/getting-started/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "next-auth",
      "passport"
    ],
    "worksWellWith": [
      "drizzle-orm",
      "prisma",
      "sveltekit"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "lucia"
    ]
  },
  {
    "id": "firebase-auth",
    "name": "Firebase Authentication",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "Complete backend service for authenticating users using passwords, phone numbers, and popular OAuth providers.",
    "whyUseIt": "Drop-in authentication requiring zero server maintenance with built-in email verification and password reset.",
    "tags": [
      "firebase",
      "auth",
      "google",
      "oauth",
      "serverless"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://firebase.google.com/products/auth",
    "learnResources": [
      {
        "label": "Firebase Auth Guide",
        "url": "https://firebase.google.com/docs/auth",
        "type": "docs"
      }
    ],
    "alternatives": [
      "clerk",
      "supabase"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "firebase",
      "firebase-admin"
    ]
  },
  {
    "id": "clerk",
    "name": "Clerk",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "Complete user management platform offering pre-built UI components and authentication for React/Next.js.",
    "whyUseIt": "Beautiful pre-built Sign-In and User-Profile UI components ready in 5 minutes.",
    "tags": [
      "clerk",
      "auth",
      "components",
      "user-management",
      "saas"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://clerk.com",
    "learnResources": [
      {
        "label": "Clerk Quickstart",
        "url": "https://clerk.com/docs/quickstarts/nextjs",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "next-auth",
      "auth0"
    ],
    "worksWellWith": [
      "nextjs",
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "@clerk/nextjs",
      "@clerk/clerk-react"
    ]
  },
  {
    "id": "auth0",
    "name": "Auth0 by Okta",
    "category": "authentication",
    "difficulty": "intermediate",
    "description": "Enterprise identity platform for web, mobile, and legacy applications with universal login.",
    "whyUseIt": "Enterprise compliance, single sign-on (SSO), MFA, and federated identity out of the box.",
    "tags": [
      "auth0",
      "sso",
      "identity",
      "enterprise",
      "oauth"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://auth0.com",
    "learnResources": [
      {
        "label": "Auth0 Quickstart",
        "url": "https://auth0.com/docs/quickstarts",
        "type": "docs"
      }
    ],
    "alternatives": [
      "clerk",
      "firebase-auth"
    ],
    "worksWellWith": [
      "express",
      "nextjs",
      "react"
    ],
    "prerequisites": [
      "oauth"
    ],
    "stackIndicators": [
      "@auth0/nextjs-auth0",
      "auth0"
    ]
  },
  {
    "id": "jose",
    "name": "jose",
    "category": "authentication",
    "difficulty": "intermediate",
    "description": "Universal JSON Web Tokens (JWT), JWS, JWE, and JWK library with zero external dependencies.",
    "whyUseIt": "Lightweight, modern replacement for jsonwebtoken that runs in Node, browsers, and Edge runtimes.",
    "tags": [
      "jwt",
      "jose",
      "crypto",
      "token",
      "security"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/panva/jose",
    "learnResources": [
      {
        "label": "jose Documentation",
        "url": "https://github.com/panva/jose#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "jsonwebtoken"
    ],
    "worksWellWith": [
      "hono",
      "nextjs",
      "express"
    ],
    "prerequisites": [
      "crypto-basics"
    ],
    "stackIndicators": [
      "jose"
    ]
  },
  {
    "id": "bcrypt",
    "name": "bcrypt",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "A library to help you hash passwords using the adaptive bcrypt key derivation function.",
    "whyUseIt": "Essential security practice: prevents credential theft via salted, work-factor controlled hashes.",
    "tags": [
      "bcrypt",
      "password",
      "hashing",
      "security",
      "crypto"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/kelektiv/node.bcrypt.js",
    "learnResources": [
      {
        "label": "bcrypt Guide",
        "url": "https://github.com/kelektiv/node.bcrypt.js#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "argon2"
    ],
    "worksWellWith": [
      "express",
      "passport",
      "prisma"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "bcrypt",
      "bcryptjs"
    ]
  },
  {
    "id": "helmet",
    "name": "Helmet",
    "category": "security",
    "difficulty": "beginner",
    "description": "Secures Express and Connect apps by setting various HTTP headers.",
    "whyUseIt": "Single-line middleware preventing XSS, clickjacking, and MIME-sniffing by setting standard HTTP headers.",
    "tags": [
      "helmet",
      "security",
      "http-headers",
      "xss",
      "express"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://helmetjs.github.io",
    "learnResources": [
      {
        "label": "Helmet Documentation",
        "url": "https://helmetjs.github.io/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "cors"
    ],
    "worksWellWith": [
      "express",
      "cors"
    ],
    "prerequisites": [
      "express"
    ],
    "stackIndicators": [
      "helmet"
    ]
  },
  {
    "id": "cors",
    "name": "CORS Middleware",
    "category": "security",
    "difficulty": "beginner",
    "description": "Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.",
    "whyUseIt": "Solves Cross-Origin Resource Sharing browser errors when frontend and backend run on different domains.",
    "tags": [
      "cors",
      "security",
      "http",
      "express",
      "browser"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/expressjs/cors",
    "learnResources": [
      {
        "label": "CORS Documentation",
        "url": "https://github.com/expressjs/cors#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "helmet"
    ],
    "worksWellWith": [
      "express",
      "fastify"
    ],
    "prerequisites": [
      "http-basics"
    ],
    "stackIndicators": [
      "cors"
    ]
  },
  {
    "id": "socket-io",
    "name": "Socket.io",
    "category": "api-protocol",
    "difficulty": "beginner",
    "description": "Bidirectional, low-latency, event-based communication between client and server.",
    "whyUseIt": "Simplest way to build real-time chat, collaborative cursors, and live alerts with fallback transports.",
    "tags": [
      "socketio",
      "websocket",
      "realtime",
      "chat",
      "events"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://socket.io",
    "learnResources": [
      {
        "label": "Socket.io Tutorial",
        "url": "https://socket.io/get-started/chat",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "ws",
      "pusher"
    ],
    "worksWellWith": [
      "express",
      "react",
      "redis"
    ],
    "prerequisites": [
      "javascript",
      "nodejs"
    ],
    "stackIndicators": [
      "socket.io",
      "socket.io-client"
    ]
  },
  {
    "id": "ws",
    "name": "ws (WebSocket)",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "Simple to use, blazing fast and thoroughly tested WebSocket client and server for Node.js.",
    "whyUseIt": "Standard RFC-compliant WebSocket server without Socket.io’s extra protocol overhead.",
    "tags": [
      "ws",
      "websocket",
      "realtime",
      "protocol"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/websockets/ws",
    "learnResources": [
      {
        "label": "ws Documentation",
        "url": "https://github.com/websockets/ws#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "socket-io"
    ],
    "worksWellWith": [
      "express",
      "fastify"
    ],
    "prerequisites": [
      "websockets"
    ],
    "stackIndicators": [
      "ws"
    ]
  },
  {
    "id": "apollo-graphql",
    "name": "Apollo GraphQL",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "Industry-standard GraphQL platform unifying APIs into a strongly typed graph.",
    "whyUseIt": "Eliminates over-fetching and under-fetching by letting clients query exact fields needed.",
    "tags": [
      "graphql",
      "apollo",
      "api",
      "schema"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.apollographql.com",
    "learnResources": [
      {
        "label": "Apollo Odyssey",
        "url": "https://www.apollographql.com/tutorials",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "trpc"
    ],
    "worksWellWith": [
      "react",
      "express"
    ],
    "prerequisites": [
      "graphql"
    ],
    "stackIndicators": [
      "@apollo/client",
      "@apollo/server"
    ]
  },
  {
    "id": "trpc",
    "name": "tRPC",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "End-to-end typesafe APIs made easy without code generation or schemas.",
    "whyUseIt": "Share TypeScript types between client and server for instant full-stack autocomplete and type safety.",
    "tags": [
      "trpc",
      "typescript",
      "typesafe",
      "api",
      "rpc"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://trpc.io",
    "learnResources": [
      {
        "label": "tRPC Quickstart",
        "url": "https://trpc.io/docs/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "apollo-graphql"
    ],
    "worksWellWith": [
      "nextjs",
      "zod",
      "tanstack-query"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "@trpc/server",
      "@trpc/client"
    ]
  },
  {
    "id": "grpc",
    "name": "gRPC",
    "category": "api-protocol",
    "difficulty": "advanced",
    "description": "A high performance, open source universal RPC framework based on HTTP/2 and Protocol Buffers.",
    "whyUseIt": "Microservice inter-process communication with strict contract definitions and low binary serialization overhead.",
    "tags": [
      "grpc",
      "protobuf",
      "rpc",
      "microservices",
      "performance"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://grpc.io",
    "learnResources": [
      {
        "label": "gRPC Basics",
        "url": "https://grpc.io/docs/what-is-grpc/introduction/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "trpc"
    ],
    "worksWellWith": [
      "go",
      "java",
      "docker"
    ],
    "prerequisites": [
      "protobuf"
    ],
    "stackIndicators": [
      "@grpc/grpc-js"
    ]
  },
  {
    "id": "pusher",
    "name": "Pusher Channels",
    "category": "api-protocol",
    "difficulty": "beginner",
    "description": "Hosted real-time WebSocket messaging service with client SDKs for every major platform.",
    "whyUseIt": "Real-time notifications and chat without hosting, maintaining, or scaling WebSocket infrastructure.",
    "tags": [
      "pusher",
      "realtime",
      "websockets",
      "saas",
      "notifications"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pusher.com",
    "learnResources": [
      {
        "label": "Pusher Docs",
        "url": "https://pusher.com/docs/channels",
        "type": "docs"
      }
    ],
    "alternatives": [
      "socket-io",
      "ably"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "pusher-js",
      "pusher"
    ]
  },
  {
    "id": "webrtc",
    "name": "WebRTC",
    "category": "api-protocol",
    "difficulty": "advanced",
    "description": "Web Real-Time Communication technology enabling peer-to-peer audio, video, and data transmission in browsers.",
    "whyUseIt": "The fundamental standard for in-browser video calling, voice conferencing, and P2P data channels.",
    "tags": [
      "webrtc",
      "p2p",
      "video",
      "audio",
      "streaming"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://webrtc.org",
    "learnResources": [
      {
        "label": "WebRTC Getting Started",
        "url": "https://webrtc.org/getting-started/overview",
        "type": "docs"
      }
    ],
    "alternatives": [
      "socket-io"
    ],
    "worksWellWith": [
      "socket-io",
      "javascript"
    ],
    "prerequisites": [
      "networking"
    ],
    "stackIndicators": [
      "simple-peer",
      "peerjs"
    ]
  },
  {
    "id": "axios",
    "name": "Axios",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Promise based HTTP client for the browser and node.js with automatic JSON transformation.",
    "whyUseIt": "The most popular HTTP client with request/response interceptors, timeout handling, and auto error rejection.",
    "tags": [
      "axios",
      "http",
      "fetching",
      "rest",
      "client"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://axios-http.com",
    "learnResources": [
      {
        "label": "Axios Getting Started",
        "url": "https://axios-http.com/docs/intro",
        "type": "docs"
      }
    ],
    "alternatives": [
      "ky",
      "got"
    ],
    "worksWellWith": [
      "react",
      "tanstack-query"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "axios"
    ]
  },
  {
    "id": "ky",
    "name": "Ky",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Tiny and elegant HTTP client based on the browser Fetch API.",
    "whyUseIt": "Modern alternative to Axios that is smaller, uses native Fetch, and handles retries gracefully.",
    "tags": [
      "ky",
      "fetch",
      "http",
      "client",
      "lightweight"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/sindresorhus/ky",
    "learnResources": [
      {
        "label": "Ky Documentation",
        "url": "https://github.com/sindresorhus/ky#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "axios",
      "got"
    ],
    "worksWellWith": [
      "react",
      "typescript"
    ],
    "prerequisites": [
      "fetch"
    ],
    "stackIndicators": [
      "ky"
    ]
  },
  {
    "id": "got",
    "name": "Got",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Human-friendly and powerful HTTP request library for Node.js.",
    "whyUseIt": "Feature-complete Node.js HTTP client supporting HTTP/2, pagination, and stream piping.",
    "tags": [
      "got",
      "http",
      "node",
      "client",
      "streams"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/sindresorhus/got",
    "learnResources": [
      {
        "label": "Got Docs",
        "url": "https://github.com/sindresorhus/got#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "axios",
      "ky"
    ],
    "worksWellWith": [
      "nodejs"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "got"
    ]
  },
  {
    "id": "docker",
    "name": "Docker",
    "category": "devops-container",
    "difficulty": "beginner",
    "description": "Platform for developing, shipping, and running applications inside isolated lightweight containers.",
    "whyUseIt": "Eliminates \"works on my machine\" issues by packaging apps with all dependencies and system binaries.",
    "tags": [
      "docker",
      "containers",
      "devops",
      "deployment"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.docker.com",
    "learnResources": [
      {
        "label": "Docker 101 Tutorial",
        "url": "https://www.docker.com/101-tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "kubernetes"
    ],
    "worksWellWith": [
      "docker-compose",
      "github-actions"
    ],
    "prerequisites": [
      "cli"
    ],
    "stackIndicators": [
      "Dockerfile",
      "docker-compose.yml"
    ]
  },
  {
    "id": "docker-compose",
    "name": "Docker Compose",
    "category": "devops-container",
    "difficulty": "beginner",
    "description": "Tool for defining and running multi-container Docker applications via a single YAML file.",
    "whyUseIt": "Spins up your entire local development stack (app, Postgres, Redis, frontend) with one command.",
    "tags": [
      "docker-compose",
      "containers",
      "multi-container",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://docs.docker.com/compose/",
    "learnResources": [
      {
        "label": "Compose Getting Started",
        "url": "https://docs.docker.com/compose/gettingstarted/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "kubernetes"
    ],
    "worksWellWith": [
      "docker",
      "postgresql",
      "redis"
    ],
    "prerequisites": [
      "docker"
    ],
    "stackIndicators": [
      "docker-compose.yml",
      "compose.yaml"
    ]
  },
  {
    "id": "kubernetes",
    "name": "Kubernetes (K8s)",
    "category": "devops-container",
    "difficulty": "advanced",
    "description": "Automated container orchestration platform for deploying, scaling, and managing containerized applications.",
    "whyUseIt": "The industry standard for orchestrating massive distributed services across cloud clusters.",
    "tags": [
      "kubernetes",
      "k8s",
      "orchestration",
      "cloud",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://kubernetes.io",
    "learnResources": [
      {
        "label": "Kubernetes Basics",
        "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "docker-compose"
    ],
    "worksWellWith": [
      "docker",
      "terraform"
    ],
    "prerequisites": [
      "docker",
      "networking"
    ],
    "stackIndicators": [
      "k8s",
      "deployment.yaml"
    ]
  },
  {
    "id": "terraform",
    "name": "Terraform",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "Infrastructure as Code (IaC) tool that lets you build, change, and version cloud infrastructure safely.",
    "whyUseIt": "Declarative configuration of AWS, GCP, Azure, and Cloudflare resources committed to Git.",
    "tags": [
      "terraform",
      "iac",
      "cloud",
      "infrastructure",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.terraform.io",
    "learnResources": [
      {
        "label": "Terraform Tutorials",
        "url": "https://developer.hashicorp.com/terraform/tutorials",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "aws-cdk"
    ],
    "worksWellWith": [
      "aws-cdk",
      "docker"
    ],
    "prerequisites": [
      "cloud-concepts"
    ],
    "stackIndicators": [
      "main.tf"
    ]
  },
  {
    "id": "github-actions",
    "name": "GitHub Actions",
    "category": "devops-container",
    "difficulty": "beginner",
    "description": "Continuous integration and continuous delivery (CI/CD) platform integrated natively into GitHub repositories.",
    "whyUseIt": "Automates testing, linting, Docker builds, and deployment workflows directly on git push.",
    "tags": [
      "github-actions",
      "ci-cd",
      "automation",
      "devops",
      "testing"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://github.com/features/actions",
    "learnResources": [
      {
        "label": "Actions Quickstart",
        "url": "https://docs.github.com/en/actions/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gitlab-ci"
    ],
    "worksWellWith": [
      "docker",
      "vitest"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      ".github/workflows"
    ]
  },
  {
    "id": "aws-cdk",
    "name": "AWS CDK",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "Cloud Development Kit to define cloud infrastructure using familiar programming languages like TypeScript.",
    "whyUseIt": "Write real code (types, loops, functions) to generate CloudFormation templates on AWS.",
    "tags": [
      "aws",
      "cdk",
      "iac",
      "cloud",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://aws.amazon.com/cdk/",
    "learnResources": [
      {
        "label": "AWS CDK Workshop",
        "url": "https://cdkworkshop.com",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "terraform"
    ],
    "worksWellWith": [
      "typescript",
      "docker"
    ],
    "prerequisites": [
      "aws"
    ],
    "stackIndicators": [
      "aws-cdk-lib"
    ]
  },
  {
    "id": "vercel",
    "name": "Vercel",
    "category": "cloud-hosting",
    "difficulty": "beginner",
    "description": "Frontend cloud platform delivering speed and reliability for modern web applications.",
    "whyUseIt": "The absolute easiest deployment path for Next.js, React, and Svelte apps with instant preview URLs.",
    "tags": [
      "vercel",
      "hosting",
      "serverless",
      "frontend",
      "cloud"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://vercel.com",
    "learnResources": [
      {
        "label": "Vercel Docs",
        "url": "https://vercel.com/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "railway",
      "render"
    ],
    "worksWellWith": [
      "nextjs",
      "react"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "vercel.json"
    ]
  },
  {
    "id": "railway",
    "name": "Railway",
    "category": "cloud-hosting",
    "difficulty": "beginner",
    "description": "Infrastructure platform where you can provision databases, microservices, and web servers effortlessly.",
    "whyUseIt": "Modern PaaS alternative to Heroku for deploying backend code, databases, and cron workers.",
    "tags": [
      "railway",
      "paas",
      "hosting",
      "backend",
      "cloud"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://railway.app",
    "learnResources": [
      {
        "label": "Railway Docs",
        "url": "https://docs.railway.app",
        "type": "docs"
      }
    ],
    "alternatives": [
      "render",
      "fly-io"
    ],
    "worksWellWith": [
      "docker",
      "postgresql"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "railway.json"
    ]
  },
  {
    "id": "render",
    "name": "Render",
    "category": "cloud-hosting",
    "difficulty": "beginner",
    "description": "Unified cloud to build and run all your apps and websites with free SSL, global CDN, and auto git deploys.",
    "whyUseIt": "Zero-fuss hosting with generous free tiers for static sites, web services, and managed Postgres.",
    "tags": [
      "render",
      "hosting",
      "paas",
      "backend",
      "cloud"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://render.com",
    "learnResources": [
      {
        "label": "Render Quickstarts",
        "url": "https://render.com/docs/quickstarts",
        "type": "docs"
      }
    ],
    "alternatives": [
      "railway",
      "fly-io"
    ],
    "worksWellWith": [
      "postgresql",
      "docker"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "render.yaml"
    ]
  },
  {
    "id": "fly-io",
    "name": "Fly.io",
    "category": "cloud-hosting",
    "difficulty": "intermediate",
    "description": "Deploy app servers close to your users globally on physical hardware with Firecracker microVMs.",
    "whyUseIt": "Runs Docker apps right at the network edge with real full-stack capabilities and persistent volumes.",
    "tags": [
      "flyio",
      "edge",
      "vms",
      "hosting",
      "cloud"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://fly.io",
    "learnResources": [
      {
        "label": "Fly.io Hands-on",
        "url": "https://fly.io/docs/hands-on/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "railway",
      "render"
    ],
    "worksWellWith": [
      "docker"
    ],
    "prerequisites": [
      "docker"
    ],
    "stackIndicators": [
      "fly.toml"
    ]
  },
  {
    "id": "cloudflare-workers",
    "name": "Cloudflare Workers",
    "category": "cloud-hosting",
    "difficulty": "intermediate",
    "description": "Serverless execution environment that allows you to create entirely new applications at the edge.",
    "whyUseIt": "0ms cold starts across hundreds of global data centers with built-in key-value and D1 SQL storage.",
    "tags": [
      "cloudflare",
      "workers",
      "edge",
      "serverless"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://workers.cloudflare.com",
    "learnResources": [
      {
        "label": "Workers Getting Started",
        "url": "https://developers.cloudflare.com/workers/get-started/guide/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "vercel"
    ],
    "worksWellWith": [
      "hono",
      "typescript"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "wrangler.toml"
    ]
  },
  {
    "id": "nginx",
    "name": "Nginx",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "High-performance HTTP server, reverse proxy, and load balancer powering a third of the web.",
    "whyUseIt": "Industry standard for reverse proxying traffic to backend ports, SSL termination, and static caching.",
    "tags": [
      "nginx",
      "reverse-proxy",
      "web-server",
      "load-balancer"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://nginx.org",
    "learnResources": [
      {
        "label": "Nginx Beginner’s Guide",
        "url": "https://nginx.org/en/docs/beginners_guide.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "caddy"
    ],
    "worksWellWith": [
      "docker",
      "express"
    ],
    "prerequisites": [
      "linux-networking"
    ],
    "stackIndicators": [
      "nginx.conf"
    ]
  },
  {
    "id": "vitest",
    "name": "Vitest",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Next-generation testing framework powered by Vite with out-of-the-box ESM and TypeScript support.",
    "whyUseIt": "Blazing fast test execution, compatible with Jest assertions, and instant watch mode re-runs.",
    "tags": [
      "vitest",
      "testing",
      "unit-test",
      "vite",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://vitest.dev",
    "learnResources": [
      {
        "label": "Vitest Getting Started",
        "url": "https://vitest.dev/guide/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "jest"
    ],
    "worksWellWith": [
      "vite",
      "react",
      "typescript"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "vitest"
    ]
  },
  {
    "id": "jest",
    "name": "Jest",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Delightful JavaScript testing framework with a focus on simplicity and comprehensive mocking.",
    "whyUseIt": "Massive adoption, zero-config for standard React projects, and integrated snapshot testing.",
    "tags": [
      "jest",
      "testing",
      "unit-test",
      "mocking",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://jestjs.io",
    "learnResources": [
      {
        "label": "Getting Started with Jest",
        "url": "https://jestjs.io/docs/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "vitest"
    ],
    "worksWellWith": [
      "react",
      "testing-library"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "jest"
    ]
  },
  {
    "id": "playwright",
    "name": "Playwright",
    "category": "testing",
    "difficulty": "intermediate",
    "description": "Fast, reliable end-to-end testing for modern web apps across Chromium, Firefox, and WebKit.",
    "whyUseIt": "Superior auto-waiting, parallel test execution, multi-browser engine support, and trace viewer.",
    "tags": [
      "playwright",
      "e2e",
      "testing",
      "browser-automation",
      "qa"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://playwright.dev",
    "learnResources": [
      {
        "label": "Playwright Getting Started",
        "url": "https://playwright.dev/docs/intro",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "cypress"
    ],
    "worksWellWith": [
      "react",
      "nextjs",
      "github-actions"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "@playwright/test"
    ]
  },
  {
    "id": "cypress",
    "name": "Cypress",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Fast, easy and reliable testing for anything that runs in a browser with real-time test runner UI.",
    "whyUseIt": "Interactive time-travel debugging and visual runner that simplifies E2E tests for beginners.",
    "tags": [
      "cypress",
      "e2e",
      "testing",
      "browser",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.cypress.io",
    "learnResources": [
      {
        "label": "Cypress Tutorial",
        "url": "https://docs.cypress.io/guides/getting-started/opening-the-app",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "playwright"
    ],
    "worksWellWith": [
      "react",
      "vue"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "cypress"
    ]
  },
  {
    "id": "supertest",
    "name": "Supertest",
    "category": "testing",
    "difficulty": "beginner",
    "description": "High-level abstraction for testing HTTP servers using fluent API assertions.",
    "whyUseIt": "The standard library for testing Node.js Express/Fastify REST endpoints without manual port listening.",
    "tags": [
      "supertest",
      "api-testing",
      "http",
      "integration-testing"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/ladjs/supertest",
    "learnResources": [
      {
        "label": "Supertest Guide",
        "url": "https://github.com/ladjs/supertest#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "playwright"
    ],
    "worksWellWith": [
      "express",
      "vitest",
      "jest"
    ],
    "prerequisites": [
      "express"
    ],
    "stackIndicators": [
      "supertest"
    ]
  },
  {
    "id": "pytest",
    "name": "Pytest",
    "category": "testing",
    "difficulty": "beginner",
    "description": "The pytest framework makes it easy to write small, readable tests, and can scale to support complex testing.",
    "whyUseIt": "Simple assert statements without boilerplate self.assert, powerful fixtures, and rich plugins.",
    "tags": [
      "pytest",
      "python",
      "testing",
      "unit-test"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.pytest.org",
    "learnResources": [
      {
        "label": "Pytest Getting Started",
        "url": "https://docs.pytest.org/en/stable/getting-started.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "unittest"
    ],
    "worksWellWith": [
      "fastapi",
      "django"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "pytest"
    ]
  },
  {
    "id": "mockito",
    "name": "Mockito",
    "category": "testing",
    "difficulty": "intermediate",
    "description": "Most popular Mocking framework for unit tests written in Java.",
    "whyUseIt": "Clean, readable API for isolating and mocking dependencies in Java unit and integration tests.",
    "tags": [
      "mockito",
      "java",
      "mocking",
      "testing"
    ],
    "ecosystem": "java",
    "officialUrl": "https://site.mockito.org",
    "learnResources": [
      {
        "label": "Mockito Docs",
        "url": "https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "easymock"
    ],
    "worksWellWith": [
      "spring-boot",
      "junit"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "mockito-core"
    ]
  },
  {
    "id": "testing-library",
    "name": "Testing Library",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Simple and complete testing utilities that encourage good testing practices by querying DOM as users do.",
    "whyUseIt": "Prevents brittle implementation-detail testing by targeting accessible user-visible elements.",
    "tags": [
      "testing-library",
      "dom",
      "react",
      "accessible-testing"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://testing-library.com",
    "learnResources": [
      {
        "label": "Testing Library Intro",
        "url": "https://testing-library.com/docs/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "enzyme"
    ],
    "worksWellWith": [
      "react",
      "vitest",
      "jest"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "@testing-library/react"
    ]
  },
  {
    "id": "langchain",
    "name": "LangChain",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Framework for developing applications powered by large language models (LLMs) with chains and agents.",
    "whyUseIt": "Connects LLMs to data sources, tools, memory, and multi-step agentic workflows.",
    "tags": [
      "langchain",
      "ai",
      "llm",
      "agents",
      "rag"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.langchain.com",
    "learnResources": [
      {
        "label": "LangChain Quickstart",
        "url": "https://js.langchain.com/docs/introduction/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "llamaindex"
    ],
    "worksWellWith": [
      "openai-sdk",
      "chromadb"
    ],
    "prerequisites": [
      "python-or-typescript"
    ],
    "stackIndicators": [
      "langchain",
      "@langchain/core"
    ]
  },
  {
    "id": "llamaindex",
    "name": "LlamaIndex",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Data framework for LLM applications to ingest, structure, and query private or domain-specific data.",
    "whyUseIt": "The specialized standard for Retrieval-Augmented Generation (RAG) and document indexing.",
    "tags": [
      "llamaindex",
      "rag",
      "embeddings",
      "ai",
      "data"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.llamaindex.ai",
    "learnResources": [
      {
        "label": "LlamaIndex Docs",
        "url": "https://docs.llamaindex.ai/en/stable/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "langchain"
    ],
    "worksWellWith": [
      "chromadb",
      "openai-sdk"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "llamaindex",
      "llama-index"
    ]
  },
  {
    "id": "openai-sdk",
    "name": "OpenAI SDK",
    "category": "ai-ml",
    "difficulty": "beginner",
    "description": "Official library providing convenient access to the OpenAI REST API from TypeScript and Python.",
    "whyUseIt": "Direct access to GPT-4o, embeddings, audio, and function calling without wrapper frameworks.",
    "tags": [
      "openai",
      "gpt",
      "ai",
      "llm",
      "api"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://platform.openai.com/docs",
    "learnResources": [
      {
        "label": "OpenAI API Quickstart",
        "url": "https://platform.openai.com/docs/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "anthropic-sdk",
      "google-genai"
    ],
    "worksWellWith": [
      "zod",
      "nextjs"
    ],
    "prerequisites": [
      "api-keys"
    ],
    "stackIndicators": [
      "openai"
    ]
  },
  {
    "id": "zod",
    "name": "Zod",
    "category": "utility",
    "difficulty": "beginner",
    "description": "TypeScript-first schema declaration and validation library with static type inference.",
    "whyUseIt": "Single source of truth for runtime validation that automatically exports TypeScript types.",
    "tags": [
      "zod",
      "validation",
      "typescript",
      "schema",
      "type-safety"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://zod.dev",
    "learnResources": [
      {
        "label": "Zod Basic Usage",
        "url": "https://zod.dev/?id=basic-usage",
        "type": "docs"
      }
    ],
    "alternatives": [
      "yup",
      "joi",
      "valibot"
    ],
    "worksWellWith": [
      "react-hook-form",
      "trpc",
      "fastify"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "zod"
    ]
  },
  {
    "id": "lodash",
    "name": "Lodash",
    "category": "utility",
    "difficulty": "beginner",
    "description": "A modern JavaScript utility library delivering modularity, performance, & extras.",
    "whyUseIt": "Convenient helpers for deep cloning, debouncing, throttling, and nested object manipulation.",
    "tags": [
      "lodash",
      "utility",
      "javascript",
      "debounce",
      "helpers"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://lodash.com",
    "learnResources": [
      {
        "label": "Lodash Docs",
        "url": "https://lodash.com/docs/4.17.15",
        "type": "docs"
      }
    ],
    "alternatives": [
      "ramda"
    ],
    "worksWellWith": [
      "javascript"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "lodash",
      "lodash-es"
    ]
  },
  {
    "id": "date-fns",
    "name": "date-fns",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Modern JavaScript date utility library with modular functions and immutable parsing.",
    "whyUseIt": "Lightweight alternative to Moment.js with tree-shakable functions and full timezone support.",
    "tags": [
      "date-fns",
      "dates",
      "utility",
      "time",
      "formatting"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://date-fns.org",
    "learnResources": [
      {
        "label": "date-fns Getting Started",
        "url": "https://date-fns.org/docs/Getting-Started",
        "type": "docs"
      }
    ],
    "alternatives": [
      "dayjs",
      "luxon"
    ],
    "worksWellWith": [
      "typescript"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "date-fns"
    ]
  },
  {
    "id": "sharp",
    "name": "Sharp",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "High performance Node.js image processing using the libvips library.",
    "whyUseIt": "Resizes, converts (WebP/AVIF), and optimizes images 4x-5x faster than ImageMagick in Node.js.",
    "tags": [
      "sharp",
      "image-processing",
      "resize",
      "performance",
      "node"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://sharp.pixelplumbing.com",
    "learnResources": [
      {
        "label": "Sharp Documentation",
        "url": "https://sharp.pixelplumbing.com/install",
        "type": "docs"
      }
    ],
    "alternatives": [
      "jimp"
    ],
    "worksWellWith": [
      "express",
      "nextjs"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "sharp"
    ]
  },
  {
    "id": "winston",
    "name": "Winston",
    "category": "utility",
    "difficulty": "beginner",
    "description": "A versatile logging library for Node.js with multiple transport and formatting options.",
    "whyUseIt": "Structured JSON logging for microservices with file, console, and remote log rotation.",
    "tags": [
      "winston",
      "logging",
      "logger",
      "node",
      "monitoring"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/winstonjs/winston",
    "learnResources": [
      {
        "label": "Winston Guide",
        "url": "https://github.com/winstonjs/winston#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "pino"
    ],
    "worksWellWith": [
      "express"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "winston"
    ]
  },
  {
    "id": "pino",
    "name": "Pino",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Extremely fast Node.js logger, inspired by Bunyan, with low overhead.",
    "whyUseIt": "5x faster than Winston, designed for high-concurrency microservices and Fastify.",
    "tags": [
      "pino",
      "logger",
      "logging",
      "performance",
      "fastify"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://getpino.io",
    "learnResources": [
      {
        "label": "Pino Documentation",
        "url": "https://getpino.io/#/docs/quickstart",
        "type": "docs"
      }
    ],
    "alternatives": [
      "winston"
    ],
    "worksWellWith": [
      "fastify",
      "express"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "pino"
    ]
  },
  {
    "id": "dotenv",
    "name": "dotenv",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Zero-dependency module that loads environment variables from a .env file into process.env.",
    "whyUseIt": "The universal convention for managing API keys and secrets in local development.",
    "tags": [
      "dotenv",
      "env",
      "config",
      "secrets",
      "environment"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/motdotla/dotenv",
    "learnResources": [
      {
        "label": "dotenv Readme",
        "url": "https://github.com/motdotla/dotenv#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "env-cmd"
    ],
    "worksWellWith": [
      "nodejs",
      "express"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "dotenv"
    ]
  },
  {
    "id": "uuid",
    "name": "uuid",
    "category": "utility",
    "difficulty": "beginner",
    "description": "RFC4122 UUID generator for JavaScript with cryptographically strong pseudo-random IDs.",
    "whyUseIt": "Generates universal unique identifiers (v4 random, v7 time-sorted) with zero dependencies.",
    "tags": [
      "uuid",
      "id",
      "crypto",
      "utility"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/uuidjs/uuid",
    "learnResources": [
      {
        "label": "uuid Guide",
        "url": "https://github.com/uuidjs/uuid#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "nanoid"
    ],
    "worksWellWith": [
      "javascript"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "uuid"
    ]
  },
  {
    "id": "prettier",
    "name": "Prettier",
    "category": "utility",
    "difficulty": "beginner",
    "description": "An opinionated code formatter supporting JavaScript, TypeScript, CSS, HTML, and more.",
    "whyUseIt": "Completely ends code formatting debates on teams by automatically styling code on save.",
    "tags": [
      "prettier",
      "formatter",
      "code-quality",
      "dx",
      "tooling"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://prettier.io",
    "learnResources": [
      {
        "label": "Prettier Docs",
        "url": "https://prettier.io/docs/en/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "biome"
    ],
    "worksWellWith": [
      "eslint",
      "typescript"
    ],
    "prerequisites": [
      "tooling"
    ],
    "stackIndicators": [
      "prettier"
    ]
  },
  {
    "id": "pandas",
    "name": "Pandas",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Fast, powerful, and flexible open source data analysis and manipulation library for Python.",
    "whyUseIt": "The industry standard for tabular data manipulation, statistical analysis, and data cleaning in Python.",
    "tags": [
      "pandas",
      "data-science",
      "data-analysis",
      "dataframe",
      "python",
      "analytics"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pandas.pydata.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pandas.pydata.org/docs/",
        "type": "docs"
      },
      {
        "label": "10 Minutes to Pandas Tutorial",
        "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "polars",
      "duckdb"
    ],
    "worksWellWith": [
      "numpy",
      "matplotlib",
      "scikit-learn",
      "jupyter"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "pandas"
    ]
  },
  {
    "id": "numpy",
    "name": "NumPy",
    "category": "utility",
    "difficulty": "beginner",
    "description": "The fundamental package for scientific computing with Python, providing high-performance multidimensional arrays.",
    "whyUseIt": "Essential foundation for numerical computation in Python with C-speed vectorized mathematical operations.",
    "tags": [
      "numpy",
      "math",
      "matrices",
      "arrays",
      "python",
      "scientific-computing"
    ],
    "ecosystem": "python",
    "officialUrl": "https://numpy.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://numpy.org/doc/stable/",
        "type": "docs"
      },
      {
        "label": "NumPy Absolute Beginners Guide",
        "url": "https://numpy.org/doc/stable/user/absolute_beginners.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "scipy",
      "pytorch"
    ],
    "worksWellWith": [
      "pandas",
      "matplotlib",
      "scikit-learn"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "numpy"
    ]
  },
  {
    "id": "scikit-learn",
    "name": "scikit-learn",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Simple and efficient tools for predictive data analysis, machine learning modeling, and statistical algorithms in Python.",
    "whyUseIt": "The gold standard Python library for classical machine learning algorithms including classification, regression, and clustering.",
    "tags": [
      "scikit-learn",
      "machine-learning",
      "ml",
      "statistics",
      "python",
      "ai"
    ],
    "ecosystem": "python",
    "officialUrl": "https://scikit-learn.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://scikit-learn.org/stable/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://scikit-learn.org/stable/getting_started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pytorch",
      "tensorflow"
    ],
    "worksWellWith": [
      "numpy",
      "pandas",
      "matplotlib"
    ],
    "prerequisites": [
      "python",
      "numpy"
    ],
    "stackIndicators": [
      "scikit-learn",
      "sklearn"
    ]
  },
  {
    "id": "matplotlib",
    "name": "Matplotlib",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Comprehensive library for creating static, animated, and interactive visual data representations in Python.",
    "whyUseIt": "Core plotting engine in the Python scientific stack capable of rendering publication-quality charts and graphs.",
    "tags": [
      "matplotlib",
      "charts",
      "plotting",
      "visualization",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://matplotlib.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://matplotlib.org/stable/index.html",
        "type": "docs"
      },
      {
        "label": "Matplotlib Quickstart Guide",
        "url": "https://matplotlib.org/stable/users/explain/quick_start.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "seaborn",
      "plotly"
    ],
    "worksWellWith": [
      "numpy",
      "pandas"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "matplotlib"
    ]
  },
  {
    "id": "seaborn",
    "name": "Seaborn",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Statistical data visualization library based on matplotlib providing high-level interfaces for drawing attractive graphics.",
    "whyUseIt": "Drastically simplifies statistical data exploration with beautiful themes and built-in categorical aggregations.",
    "tags": [
      "seaborn",
      "visualization",
      "statistics",
      "plotting",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://seaborn.pydata.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://seaborn.pydata.org/",
        "type": "docs"
      },
      {
        "label": "Seaborn Tutorial",
        "url": "https://seaborn.pydata.org/tutorial.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "matplotlib",
      "plotly"
    ],
    "worksWellWith": [
      "pandas",
      "matplotlib",
      "numpy"
    ],
    "prerequisites": [
      "python",
      "matplotlib"
    ],
    "stackIndicators": [
      "seaborn"
    ]
  },
  {
    "id": "polars",
    "name": "Polars",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Lightning-fast DataFrame library implemented in Rust using Apache Arrow memory model for Python and Rust.",
    "whyUseIt": "Delivers 10x-50x faster data processing than Pandas by utilizing all CPU cores and vectorized Rust query execution.",
    "tags": [
      "polars",
      "dataframe",
      "data-science",
      "fast",
      "rust",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pola.rs",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.pola.rs/",
        "type": "docs"
      },
      {
        "label": "Getting Started with Polars",
        "url": "https://docs.pola.rs/user-guide/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pandas",
      "duckdb"
    ],
    "worksWellWith": [
      "numpy",
      "pyarrow"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "polars"
    ]
  },
  {
    "id": "duckdb",
    "name": "DuckDB",
    "category": "database",
    "difficulty": "intermediate",
    "description": "In-process SQL OLAP database management system designed for fast analytical queries on local tabular files.",
    "whyUseIt": "The SQLite for analytics: queries CSVs, Parquet, and JSON files directly with blazingly fast vectorized SQL execution.",
    "tags": [
      "duckdb",
      "olap",
      "sql",
      "database",
      "parquet",
      "analytics"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://duckdb.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://duckdb.org/docs/",
        "type": "docs"
      },
      {
        "label": "DuckDB Quickstart Guide",
        "url": "https://duckdb.org/docs/guides/index",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sqlite",
      "clickhouse"
    ],
    "worksWellWith": [
      "pandas",
      "polars",
      "python"
    ],
    "prerequisites": [
      "sql"
    ],
    "stackIndicators": [
      "duckdb"
    ]
  },
  {
    "id": "uvicorn",
    "name": "Uvicorn",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Lightning-fast ASGI web server implementation for Python using uvloop and httptools.",
    "whyUseIt": "Standard production ASGI server powering high-concurrency FastAPI, Starlette, and Quart Python applications.",
    "tags": [
      "uvicorn",
      "asgi",
      "web-server",
      "async",
      "python",
      "fastapi"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.uvicorn.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.uvicorn.org/",
        "type": "docs"
      },
      {
        "label": "Uvicorn Deployment Guide",
        "url": "https://www.uvicorn.org/deployment/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "gunicorn",
      "hypercorn"
    ],
    "worksWellWith": [
      "fastapi",
      "starlette"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "uvicorn"
    ]
  },
  {
    "id": "gunicorn",
    "name": "Gunicorn",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Python WSGI HTTP Server for UNIX ported from Ruby Unicorn with a robust pre-fork worker model.",
    "whyUseIt": "Battle-tested process manager and WSGI server for deploying Django and Flask applications to production.",
    "tags": [
      "gunicorn",
      "wsgi",
      "server",
      "deploy",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://gunicorn.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.gunicorn.org/",
        "type": "docs"
      },
      {
        "label": "Gunicorn Configuration Guide",
        "url": "https://docs.gunicorn.org/en/latest/configure.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "uvicorn",
      "uwsgi"
    ],
    "worksWellWith": [
      "django",
      "flask",
      "nginx"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "gunicorn"
    ]
  },
  {
    "id": "httpx",
    "name": "HTTPX",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Next-generation HTTP client for Python with sync and async APIs, HTTP/2 support, and strict typing.",
    "whyUseIt": "Direct async-capable successor to Requests with identical familiar ergonomics and modern HTTP/2 support.",
    "tags": [
      "httpx",
      "http",
      "client",
      "async",
      "api",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.python-httpx.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.python-httpx.org/",
        "type": "docs"
      },
      {
        "label": "HTTPX Quickstart",
        "url": "https://www.python-httpx.org/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "requests",
      "aiohttp"
    ],
    "worksWellWith": [
      "fastapi",
      "asyncio"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "httpx"
    ]
  },
  {
    "id": "requests",
    "name": "Requests",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Elegant and simple HTTP library for Python, built for human beings with intuitive sessions and JSON parsing.",
    "whyUseIt": "The most popular Python HTTP library with billions of downloads, ideal for scripts, automation, and synchronous APIs.",
    "tags": [
      "requests",
      "http",
      "client",
      "rest",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://requests.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://requests.readthedocs.io/",
        "type": "docs"
      },
      {
        "label": "Requests Quickstart",
        "url": "https://requests.readthedocs.io/en/latest/user/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "httpx",
      "urllib3"
    ],
    "worksWellWith": [
      "beautifulsoup4",
      "pytest"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "requests"
    ]
  },
  {
    "id": "pydantic",
    "name": "Pydantic",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Data validation and settings management using Python type annotations with a high-speed Rust core.",
    "whyUseIt": "Guarantees typed data parsing and input validation without writing manual validation assertions.",
    "tags": [
      "pydantic",
      "validation",
      "typing",
      "schemas",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.pydantic.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.pydantic.dev/latest/",
        "type": "docs"
      },
      {
        "label": "Pydantic Tutorial",
        "url": "https://docs.pydantic.dev/latest/concepts/models/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "marshmallow",
      "attrs"
    ],
    "worksWellWith": [
      "fastapi",
      "sqlmodel"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "pydantic"
    ]
  },
  {
    "id": "marshmallow",
    "name": "Marshmallow",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Simplified object serialization and deserialization library for converting complex datatypes to and from native Python types.",
    "whyUseIt": "Decoupled schema validation and serialization layer widely used with Flask, SQLAlchemy, and legacy Python backends.",
    "tags": [
      "marshmallow",
      "serialization",
      "validation",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://marshmallow.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://marshmallow.readthedocs.io/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://marshmallow.readthedocs.io/en/stable/quickstart.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pydantic",
      "attrs"
    ],
    "worksWellWith": [
      "flask",
      "sqlalchemy"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "marshmallow"
    ]
  },
  {
    "id": "celery",
    "name": "Celery",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Distributed asynchronous task queue and job scheduler based on distributed message passing.",
    "whyUseIt": "Industry standard for running long background jobs, periodic crons, email sends, and async processing in Python.",
    "tags": [
      "celery",
      "tasks",
      "async",
      "queue",
      "redis",
      "rabbitmq",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.celeryq.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.celeryq.dev/en/stable/",
        "type": "docs"
      },
      {
        "label": "First Steps with Celery",
        "url": "https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "rq",
      "dramatiq"
    ],
    "worksWellWith": [
      "redis",
      "rabbitmq",
      "django",
      "fastapi"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "celery"
    ]
  },
  {
    "id": "alembic",
    "name": "Alembic",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Lightweight database migration tool for usage with the SQLAlchemy Database Toolkit for Python.",
    "whyUseIt": "Automates relational schema migrations with rollback support, auto-generating migration scripts from models.",
    "tags": [
      "alembic",
      "migrations",
      "database",
      "sql",
      "sqlalchemy",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://alembic.sqlalchemy.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://alembic.sqlalchemy.org/en/latest/",
        "type": "docs"
      },
      {
        "label": "Alembic Tutorial",
        "url": "https://alembic.sqlalchemy.org/en/latest/tutorial.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "django-migrations",
      "flyway"
    ],
    "worksWellWith": [
      "sqlalchemy",
      "fastapi",
      "postgresql"
    ],
    "prerequisites": [
      "python",
      "sqlalchemy"
    ],
    "stackIndicators": [
      "alembic"
    ]
  },
  {
    "id": "sqlmodel",
    "name": "SQLModel",
    "category": "orm",
    "difficulty": "beginner",
    "description": "Library for interacting with SQL databases from Python code using Python objects, combining Pydantic and SQLAlchemy.",
    "whyUseIt": "Eliminates duplication between Pydantic validation schemas and SQLAlchemy database models into single class definitions.",
    "tags": [
      "sqlmodel",
      "orm",
      "sql",
      "database",
      "fastapi",
      "pydantic",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://sqlmodel.tiangolo.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://sqlmodel.tiangolo.com/",
        "type": "docs"
      },
      {
        "label": "SQLModel Tutorial",
        "url": "https://sqlmodel.tiangolo.com/tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sqlalchemy",
      "tortoise-orm",
      "peewee"
    ],
    "worksWellWith": [
      "fastapi",
      "pydantic"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "sqlmodel"
    ]
  },
  {
    "id": "ruff",
    "name": "Ruff",
    "category": "utility",
    "difficulty": "beginner",
    "description": "An extremely fast Python linter and code formatter written in Rust, designed as a drop-in replacement for Flake8 and Black.",
    "whyUseIt": "Replaces Black, Flake8, and isort with 10x-100x faster execution speed, instant IDE feedback, and zero config pain.",
    "tags": [
      "ruff",
      "linter",
      "formatter",
      "rust",
      "python",
      "quality"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.astral.sh/ruff/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.astral.sh/ruff/",
        "type": "docs"
      },
      {
        "label": "Tutorial & Getting Started",
        "url": "https://docs.astral.sh/ruff/tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "black",
      "flake8",
      "pylint"
    ],
    "worksWellWith": [
      "pytest",
      "mypy"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "ruff"
    ]
  },
  {
    "id": "black",
    "name": "Black",
    "category": "utility",
    "difficulty": "beginner",
    "description": "The uncompromising Python code formatter delivering deterministic formatting and zero manual code style debate.",
    "whyUseIt": "Standardizes Python formatting across engineering teams with zero bikeshedding over style preferences.",
    "tags": [
      "black",
      "formatter",
      "style",
      "code-quality",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://black.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://black.readthedocs.io/",
        "type": "docs"
      },
      {
        "label": "Getting Started with Black",
        "url": "https://black.readthedocs.io/en/stable/getting_started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "ruff",
      "autopep8"
    ],
    "worksWellWith": [
      "flake8",
      "mypy",
      "pytest"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "black"
    ]
  },
  {
    "id": "mypy",
    "name": "Mypy",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Optional static type checker for Python that aims to combine the benefits of dynamic and static typing.",
    "whyUseIt": "Finds bugs and type inconsistencies before runtime by analyzing Python type annotations in CI and IDEs.",
    "tags": [
      "mypy",
      "types",
      "type-checking",
      "static-analysis",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://mypy-lang.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://mypy.readthedocs.io/",
        "type": "docs"
      },
      {
        "label": "Mypy Type Hints Cheat Sheet",
        "url": "https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "pyright",
      "pyre"
    ],
    "worksWellWith": [
      "pydantic",
      "pytest",
      "ruff"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "mypy"
    ]
  },
  {
    "id": "poetry",
    "name": "Poetry",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Python packaging and dependency management made easy with deterministic lockfiles and build isolated virtualenvs.",
    "whyUseIt": "Resolves Python dependency hell with pyproject.toml standards, deterministic lockfiles, and 1-command publishing.",
    "tags": [
      "poetry",
      "packaging",
      "dependencies",
      "virtualenv",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://python-poetry.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://python-poetry.org/docs/",
        "type": "docs"
      },
      {
        "label": "Basic Usage Tutorial",
        "url": "https://python-poetry.org/docs/basic-usage/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "uv",
      "pipenv",
      "pdm"
    ],
    "worksWellWith": [
      "pytest",
      "ruff"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "poetry"
    ]
  },
  {
    "id": "uv-pkg",
    "name": "uv",
    "category": "utility",
    "difficulty": "beginner",
    "description": "An extremely fast Python package and project manager written in Rust, 10x-100x faster than pip and virtualenv.",
    "whyUseIt": "Installs Python packages in milliseconds using global disk caching and parallel resolver written in Rust.",
    "tags": [
      "uv",
      "pip",
      "package-manager",
      "fast",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.astral.sh/uv/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.astral.sh/uv/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.astral.sh/uv/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "poetry",
      "pipenv",
      "pip"
    ],
    "worksWellWith": [
      "ruff",
      "pytest",
      "python"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "uv"
    ]
  },
  {
    "id": "react-native",
    "name": "React Native",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Framework for building native mobile applications for iOS and Android using React and JavaScript.",
    "whyUseIt": "Build native iOS and Android apps with a single React codebase, native performance, and huge component ecosystem.",
    "tags": [
      "react-native",
      "mobile",
      "ios",
      "android",
      "cross-platform",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://reactnative.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://reactnative.dev/docs/getting-started",
        "type": "docs"
      },
      {
        "label": "Tutorial Basics",
        "url": "https://reactnative.dev/docs/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "flutter",
      "expo",
      "ionic"
    ],
    "worksWellWith": [
      "expo",
      "react-navigation",
      "typescript"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "react-native"
    ]
  },
  {
    "id": "flutter",
    "name": "Flutter",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Google multi-platform UI toolkit for building natively compiled mobile, web, and desktop apps from a single Dart codebase.",
    "whyUseIt": "Delivers 60/120fps hardware-accelerated graphics using Skia/Impeller and rich customizable widget sets across all platforms.",
    "tags": [
      "flutter",
      "dart",
      "mobile",
      "ios",
      "android",
      "cross-platform",
      "ui"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://flutter.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.flutter.dev/",
        "type": "docs"
      },
      {
        "label": "Building Your First Flutter App",
        "url": "https://docs.flutter.dev/get-started/codelab",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native",
      "expo"
    ],
    "worksWellWith": [
      "dart",
      "firebase"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "flutter"
    ]
  },
  {
    "id": "expo",
    "name": "Expo",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Open-source framework and platform for universal native apps for Android, iOS, and the web with React Native.",
    "whyUseIt": "The recommended way to start React Native apps without configuring native Xcode/Android Studio toolchains.",
    "tags": [
      "expo",
      "react-native",
      "mobile",
      "ios",
      "android",
      "cross-platform"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://expo.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.expo.dev/",
        "type": "docs"
      },
      {
        "label": "Get Started with Expo Tutorial",
        "url": "https://docs.expo.dev/tutorial/introduction/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native",
      "flutter"
    ],
    "worksWellWith": [
      "react-native",
      "typescript",
      "expo-router"
    ],
    "prerequisites": [
      "react",
      "javascript"
    ],
    "stackIndicators": [
      "expo"
    ]
  },
  {
    "id": "react-navigation",
    "name": "React Navigation",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Routing and navigation for React Native apps with smooth stack, tab, and drawer transitions.",
    "whyUseIt": "Standard routing solution for React Native applications providing native gesture animations and history management.",
    "tags": [
      "react-navigation",
      "mobile",
      "navigation",
      "routing",
      "react-native"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://reactnavigation.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://reactnavigation.org/docs/getting-started",
        "type": "docs"
      },
      {
        "label": "Fundamentals Tutorial",
        "url": "https://reactnavigation.org/docs/hello-react-navigation",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "expo-router"
    ],
    "worksWellWith": [
      "react-native",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "@react-navigation/native",
      "react-navigation"
    ]
  },
  {
    "id": "expo-router",
    "name": "Expo Router",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "File-based routing framework for React Native and web apps built on top of Expo and React Navigation.",
    "whyUseIt": "Brings Next.js style file-based routing and deep linking to native iOS and Android apps with zero configuration.",
    "tags": [
      "expo-router",
      "routing",
      "mobile",
      "react-native",
      "expo"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://docs.expo.dev/router/introduction/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.expo.dev/router/introduction/",
        "type": "docs"
      },
      {
        "label": "Quickstart Tutorial",
        "url": "https://docs.expo.dev/router/create-pages/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-navigation"
    ],
    "worksWellWith": [
      "expo",
      "react-native"
    ],
    "prerequisites": [
      "expo",
      "react-native"
    ],
    "stackIndicators": [
      "expo-router"
    ]
  },
  {
    "id": "ionic",
    "name": "Ionic",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Mobile app toolkit for building cross-platform native iOS, Android, and Progressive Web Apps with web technologies.",
    "whyUseIt": "Lets web developers build hybrid mobile apps using familiar HTML, CSS, JavaScript, and framework components.",
    "tags": [
      "ionic",
      "mobile",
      "pwa",
      "hybrid",
      "capacitor"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://ionicframework.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://ionicframework.com/docs",
        "type": "docs"
      },
      {
        "label": "First App Tutorial",
        "url": "https://ionicframework.com/docs/intro/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native",
      "flutter"
    ],
    "worksWellWith": [
      "capacitor",
      "angular",
      "react",
      "vue"
    ],
    "prerequisites": [
      "javascript",
      "html",
      "css"
    ],
    "stackIndicators": [
      "@ionic/core",
      "@ionic/react",
      "@ionic/angular"
    ]
  },
  {
    "id": "capacitor",
    "name": "Capacitor",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Cross-platform native runtime that deploys web apps natively to iOS, Android, and Desktop with access to native APIs.",
    "whyUseIt": "Modern alternative to Cordova: wraps standard web applications into production iOS and Android native apps.",
    "tags": [
      "capacitor",
      "mobile",
      "hybrid",
      "native-bridge",
      "ios",
      "android"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://capacitorjs.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://capacitorjs.com/docs",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://capacitorjs.com/docs/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "cordova",
      "react-native"
    ],
    "worksWellWith": [
      "ionic",
      "vite",
      "react",
      "vue"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "@capacitor/core",
      "@capacitor/cli"
    ]
  },
  {
    "id": "pytorch",
    "name": "PyTorch",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Leading open source machine learning framework with dynamic computation graphs and GPU acceleration.",
    "whyUseIt": "The primary deep learning framework in modern research and generative AI with intuitive Pythonic debugging.",
    "tags": [
      "pytorch",
      "deep-learning",
      "neural-networks",
      "gpu",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pytorch.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pytorch.org/docs/stable/index.html",
        "type": "docs"
      },
      {
        "label": "Deep Learning with PyTorch 60min Blitz",
        "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tensorflow",
      "jax"
    ],
    "worksWellWith": [
      "numpy",
      "huggingface-transformers",
      "cuda"
    ],
    "prerequisites": [
      "python",
      "numpy"
    ],
    "stackIndicators": [
      "torch",
      "torchvision"
    ]
  },
  {
    "id": "tensorflow",
    "name": "TensorFlow",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Comprehensive open source platform for machine learning, end-to-end model training, and production deployment.",
    "whyUseIt": "Industry-scale platform for training and serving machine learning models with robust mobile (TF Lite) and web (TF.js) support.",
    "tags": [
      "tensorflow",
      "deep-learning",
      "keras",
      "ai",
      "machine-learning"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.tensorflow.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.tensorflow.org/api_docs",
        "type": "docs"
      },
      {
        "label": "TensorFlow Quickstart for Beginners",
        "url": "https://www.tensorflow.org/tutorials/quickstart/beginner",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pytorch",
      "jax"
    ],
    "worksWellWith": [
      "keras",
      "numpy"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "tensorflow"
    ]
  },
  {
    "id": "huggingface-transformers",
    "name": "Transformers",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "State-of-the-art machine learning library providing thousands of pretrained models for NLP, vision, and audio.",
    "whyUseIt": "The standard gateway to run BERT, GPT, Llama, Whisper, and Stable Diffusion models in 3 lines of code.",
    "tags": [
      "transformers",
      "huggingface",
      "nlp",
      "llm",
      "genai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://huggingface.co/docs/transformers",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://huggingface.co/docs/transformers/index",
        "type": "docs"
      },
      {
        "label": "Transformers Quickstart",
        "url": "https://huggingface.co/docs/transformers/quicktour",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "langchain",
      "ollama"
    ],
    "worksWellWith": [
      "pytorch",
      "tensorflow",
      "tokenizers"
    ],
    "prerequisites": [
      "python",
      "pytorch"
    ],
    "stackIndicators": [
      "transformers"
    ]
  },
  {
    "id": "keras",
    "name": "Keras",
    "category": "ai-ml",
    "difficulty": "beginner",
    "description": "High-level deep learning API designed for human beings, running on top of JAX, PyTorch, or TensorFlow.",
    "whyUseIt": "The most beginner-friendly interface to build, train, and evaluate deep neural networks without low-level tensor plumbing.",
    "tags": [
      "keras",
      "neural-networks",
      "deep-learning",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://keras.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://keras.io/",
        "type": "docs"
      },
      {
        "label": "Keras for Beginners",
        "url": "https://keras.io/getting_started/intro_to_keras_for_engineers/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pytorch",
      "fastai"
    ],
    "worksWellWith": [
      "tensorflow",
      "numpy"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "keras"
    ]
  },
  {
    "id": "vllm",
    "name": "vLLM",
    "category": "ai-ml",
    "difficulty": "advanced",
    "description": "High-throughput and low-latency LLM inference and serving engine with PagedAttention memory management.",
    "whyUseIt": "Enables 2x-4x higher token serving throughput for self-hosted LLMs compared to naive Hugging Face pipelines.",
    "tags": [
      "vllm",
      "llm",
      "serving",
      "inference",
      "cuda",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.vllm.ai",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.vllm.ai/en/latest/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://docs.vllm.ai/en/latest/getting_started/quickstart.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "ollama",
      "tgi"
    ],
    "worksWellWith": [
      "pytorch",
      "huggingface-transformers"
    ],
    "prerequisites": [
      "python",
      "cuda"
    ],
    "stackIndicators": [
      "vllm"
    ]
  },
  {
    "id": "ollama",
    "name": "Ollama",
    "category": "ai-ml",
    "difficulty": "beginner",
    "description": "Tool to get up and running with large language models locally on macOS, Linux, and Windows.",
    "whyUseIt": "Run open-weight models (Llama 3, Mistral, DeepSeek, Gemma) locally on your GPU/CPU with 1 terminal command and OpenAI-compatible API.",
    "tags": [
      "ollama",
      "local-llm",
      "ai",
      "offline",
      "privacy"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://ollama.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/ollama/ollama/tree/main/docs",
        "type": "docs"
      },
      {
        "label": "Ollama Quickstart",
        "url": "https://ollama.com/download",
        "type": "docs"
      }
    ],
    "alternatives": [
      "vllm",
      "lmstudio",
      "llamacpp"
    ],
    "worksWellWith": [
      "langchain",
      "llamaindex",
      "python"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "ollama"
    ]
  },
  {
    "id": "qdrant",
    "name": "Qdrant",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Open-source vector similarity search engine and vector database written in Rust with extended payload filtering.",
    "whyUseIt": "Provides ultra-fast vector search with production ACID payload filtering and minimal memory overhead.",
    "tags": [
      "qdrant",
      "vector-database",
      "embeddings",
      "similarity-search",
      "ai",
      "rag"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://qdrant.tech",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://qdrant.tech/documentation/",
        "type": "docs"
      },
      {
        "label": "Quickstart Tutorial",
        "url": "https://qdrant.tech/documentation/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pinecone",
      "chromadb",
      "weaviate"
    ],
    "worksWellWith": [
      "langchain",
      "llamaindex",
      "openai-sdk"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "@qdrant/js-client-rest",
      "qdrant-client"
    ]
  },
  {
    "id": "weaviate",
    "name": "Weaviate",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Open-source AI-native vector database storing both objects and vectors, combining keyword search with vector search.",
    "whyUseIt": "Built-in hybrid search (BM25 + vector embeddings) and native integrations with Hugging Face and OpenAI.",
    "tags": [
      "weaviate",
      "vector-database",
      "hybrid-search",
      "rag",
      "embeddings"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://weaviate.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://weaviate.io/developers/weaviate",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://weaviate.io/developers/weaviate/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "qdrant",
      "pinecone",
      "chromadb"
    ],
    "worksWellWith": [
      "langchain",
      "llamaindex"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "weaviate-ts-client",
      "weaviate-client"
    ]
  },
  {
    "id": "mlflow",
    "name": "MLflow",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Open-source platform to manage the ML lifecycle including experimentation, reproducibility, and deployment.",
    "whyUseIt": "Standard platform to log training parameters, model metrics, evaluation artifacts, and deploy model registries.",
    "tags": [
      "mlflow",
      "mlops",
      "experiment-tracking",
      "model-registry",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://mlflow.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://mlflow.org/docs/latest/index.html",
        "type": "docs"
      },
      {
        "label": "Quickstart Tutorial",
        "url": "https://mlflow.org/docs/latest/getting-started/intro-quickstart/index.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "wandb",
      "dvc"
    ],
    "worksWellWith": [
      "scikit-learn",
      "pytorch",
      "tensorflow"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "mlflow"
    ]
  },
  {
    "id": "wandb",
    "name": "Weights & Biases",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Developer platform for machine learning practitioners to track experiments, optimize hyperparameters, and monitor models.",
    "whyUseIt": "Visual real-time loss dashboards, model versioning, and collaborative experiment tracking for ML teams.",
    "tags": [
      "wandb",
      "experiment-tracking",
      "mlops",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://wandb.ai",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.wandb.ai/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://docs.wandb.ai/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "mlflow",
      "tensorboard"
    ],
    "worksWellWith": [
      "pytorch",
      "huggingface-transformers"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "wandb"
    ]
  },
  {
    "id": "tokio",
    "name": "Tokio",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Event-driven, non-blocking I/O platform for writing asynchronous applications with the Rust programming language.",
    "whyUseIt": "The bedrock async runtime in the Rust ecosystem delivering high-throughput concurrency and network sockets.",
    "tags": [
      "tokio",
      "async",
      "concurrency",
      "networking",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://tokio.rs",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tokio.rs/tokio/tutorial",
        "type": "docs"
      },
      {
        "label": "Tokio Tutorial",
        "url": "https://tokio.rs/tokio/tutorial/hello-tokio",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "async-std"
    ],
    "worksWellWith": [
      "axum",
      "reqwest",
      "serde"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "tokio"
    ]
  },
  {
    "id": "serde",
    "name": "Serde",
    "category": "utility",
    "difficulty": "beginner",
    "description": "High-performance generic framework for serializing and deserializing Rust data structures efficiently.",
    "whyUseIt": "Universal serialization framework in Rust compiling zero-copy parsers for JSON, YAML, TOML, and binary formats.",
    "tags": [
      "serde",
      "serialization",
      "json",
      "deserialization",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://serde.rs",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://serde.rs/",
        "type": "docs"
      },
      {
        "label": "Overview & Macros Guide",
        "url": "https://serde.rs/derive.html",
        "type": "docs"
      }
    ],
    "alternatives": [
      "bincode",
      "rkyv"
    ],
    "worksWellWith": [
      "tokio",
      "axum",
      "serde_json"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "serde"
    ]
  },
  {
    "id": "serde-json",
    "name": "serde_json",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Strongly-typed JSON serialization and deserialization library for Rust built on Serde.",
    "whyUseIt": "Fast, type-safe JSON parsing for Rust with compile-time schema checking and zero-copy slicing.",
    "tags": [
      "serde-json",
      "json",
      "serde",
      "parsing",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/serde_json",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/serde_json/latest/serde_json/",
        "type": "docs"
      },
      {
        "label": "Getting Started with serde_json",
        "url": "https://docs.rs/serde_json/latest/serde_json/#getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "simd-json"
    ],
    "worksWellWith": [
      "serde",
      "axum",
      "tokio"
    ],
    "prerequisites": [
      "rust",
      "serde"
    ],
    "stackIndicators": [
      "serde_json"
    ]
  },
  {
    "id": "clap",
    "name": "Clap",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Full featured, fast Command Line Argument Parser for Rust with derive macros and help generation.",
    "whyUseIt": "Build professional, self-documenting CLI tools in Rust with automatic shell completions and typed argument validation.",
    "tags": [
      "clap",
      "cli",
      "arguments",
      "flags",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/clap",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/clap/latest/clap/",
        "type": "docs"
      },
      {
        "label": "Clap Tutorial",
        "url": "https://docs.rs/clap/latest/clap/_tutorial/index.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "argh",
      "lexopt"
    ],
    "worksWellWith": [
      "anyhow",
      "tokio"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "clap"
    ]
  },
  {
    "id": "reqwest",
    "name": "Reqwest",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Ergonomic, batteries-included HTTP client for Rust supporting async, connection pooling, and JSON deserialization.",
    "whyUseIt": "The standard HTTP client in Rust for calling REST APIs with built-in connection pooling, TLS, and Serde integration.",
    "tags": [
      "reqwest",
      "http",
      "client",
      "rest",
      "async",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/reqwest",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/reqwest/latest/reqwest/",
        "type": "docs"
      },
      {
        "label": "Reqwest Examples",
        "url": "https://github.com/seanmonstar/reqwest/tree/master/examples",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "hyper",
      "ureq"
    ],
    "worksWellWith": [
      "tokio",
      "serde",
      "serde_json"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "reqwest"
    ]
  },
  {
    "id": "sqlx-rust",
    "name": "SQLx",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Truly asynchronous, pure Rust SQL crate featuring compile-time checked queries without a DSL.",
    "whyUseIt": "Checks your SQL queries against a real database at compile time, catching SQL syntax and type errors during build.",
    "tags": [
      "sqlx",
      "sql",
      "database",
      "async",
      "postgres",
      "mysql",
      "sqlite",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://github.com/launchbadge/sqlx",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/sqlx/latest/sqlx/",
        "type": "docs"
      },
      {
        "label": "SQLx Getting Started",
        "url": "https://github.com/launchbadge/sqlx#getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "diesel",
      "sea-orm"
    ],
    "worksWellWith": [
      "tokio",
      "axum"
    ],
    "prerequisites": [
      "rust",
      "sql"
    ],
    "stackIndicators": [
      "sqlx"
    ]
  },
  {
    "id": "sea-orm",
    "name": "SeaORM",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "An async & dynamic Object Relational Mapping (ORM) framework for Rust inspired by ActiveRecord.",
    "whyUseIt": "Provides familiar ActiveRecord-style typed model querying and relation navigation in Rust without writing raw SQL.",
    "tags": [
      "sea-orm",
      "orm",
      "database",
      "async",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://www.sea-ql.org/SeaORM/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.sea-ql.org/SeaORM/docs/index/",
        "type": "docs"
      },
      {
        "label": "SeaORM Tutorial",
        "url": "https://www.sea-ql.org/SeaORM/docs/tutorial/index/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "diesel",
      "sqlx-rust"
    ],
    "worksWellWith": [
      "tokio",
      "actix-web",
      "axum"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "sea-orm"
    ]
  },
  {
    "id": "tracing-rust",
    "name": "Tracing",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Scoped, structured, and async-aware diagnostics and logging framework for Rust applications.",
    "whyUseIt": "Essential logging and distributed tracing library for async Rust programs with contextual span tracking.",
    "tags": [
      "tracing",
      "logging",
      "observability",
      "diagnostics",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://tokio.rs/tokio/topics/tracing",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/tracing/latest/tracing/",
        "type": "docs"
      },
      {
        "label": "Getting Started with Tracing",
        "url": "https://tokio.rs/tokio/topics/tracing",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "env_logger",
      "log"
    ],
    "worksWellWith": [
      "tokio",
      "axum"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "tracing"
    ]
  },
  {
    "id": "echo-go",
    "name": "Echo",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "High performance, extensible, minimalist web framework for Go with an optimized HTTP router.",
    "whyUseIt": "Fast, developer-friendly web framework in Go with clean middleware chaining, data binding, and low memory usage.",
    "tags": [
      "echo",
      "web-framework",
      "rest",
      "api",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://echo.labstack.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://echo.labstack.com/docs",
        "type": "docs"
      },
      {
        "label": "Echo Quickstart",
        "url": "https://echo.labstack.com/docs/quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gin",
      "fiber-go",
      "go-chi"
    ],
    "worksWellWith": [
      "gorm",
      "sqlx-go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/labstack/echo/v4"
    ]
  },
  {
    "id": "fiber-go",
    "name": "Fiber",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "Express-inspired web framework written in Go built on top of Fasthttp, the fastest HTTP engine for Go.",
    "whyUseIt": "Feels identical to Express.js but runs at blazing Go speed with zero memory allocation routing.",
    "tags": [
      "fiber",
      "express",
      "web-framework",
      "fast",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://gofiber.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.gofiber.io/",
        "type": "docs"
      },
      {
        "label": "Fiber Quickstart Guide",
        "url": "https://docs.gofiber.io/welcome/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gin",
      "echo-go"
    ],
    "worksWellWith": [
      "gorm"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/gofiber/fiber/v2"
    ]
  },
  {
    "id": "cobra-go",
    "name": "Cobra",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Library for creating powerful modern CLI applications in Go, powering Kubernetes, Hugo, and GitHub CLI.",
    "whyUseIt": "The industry standard for building command line applications in Go with nested subcommands and flag parsing.",
    "tags": [
      "cobra",
      "cli",
      "flags",
      "commands",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://cobra.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://cobra.dev/",
        "type": "docs"
      },
      {
        "label": "Cobra User Guide",
        "url": "https://github.com/spf13/cobra/blob/main/site/content/user_guide.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "urfave-cli"
    ],
    "worksWellWith": [
      "viper-go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/spf13/cobra"
    ]
  },
  {
    "id": "viper-go",
    "name": "Viper",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Complete configuration solution for Go applications handling JSON, TOML, YAML, environment variables, and flags.",
    "whyUseIt": "Unified configuration loader reading defaults, config files, remote keys, and ENV overrides into Go structs.",
    "tags": [
      "viper",
      "config",
      "environment",
      "yaml",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://github.com/spf13/viper",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/spf13/viper#readme",
        "type": "docs"
      },
      {
        "label": "Viper Configuration Guide",
        "url": "https://github.com/spf13/viper#getting-started",
        "type": "docs"
      }
    ],
    "alternatives": [
      "godotenv",
      "envconfig"
    ],
    "worksWellWith": [
      "cobra-go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/spf13/viper"
    ]
  },
  {
    "id": "zap-go",
    "name": "Zap",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Blazing fast, structured, leveled logging in Go with zero allocations in critical logging paths.",
    "whyUseIt": "Production logging standard in high-throughput Go services producing structured JSON logs with near-zero overhead.",
    "tags": [
      "zap",
      "logging",
      "structured-logging",
      "fast",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://github.com/uber-go/zap",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pkg.go.dev/go.uber.org/zap",
        "type": "docs"
      },
      {
        "label": "Zap Getting Started",
        "url": "https://github.com/uber-go/zap#installation",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "zerolog",
      "logrus"
    ],
    "worksWellWith": [
      "gin",
      "echo-go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "go.uber.org/zap"
    ]
  },
  {
    "id": "testify-go",
    "name": "Testify",
    "category": "testing",
    "difficulty": "beginner",
    "description": "A sacred set of packages that provide many tools for testifying that your Go code will behave as you intend.",
    "whyUseIt": "Adds readable assertions, mocking, and test suites to standard Go testing, cutting test boilerplate by 60%.",
    "tags": [
      "testify",
      "testing",
      "assertions",
      "mocking",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://github.com/stretchr/testify",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pkg.go.dev/github.com/stretchr/testify",
        "type": "docs"
      },
      {
        "label": "Testify Assertions Guide",
        "url": "https://github.com/stretchr/testify#assert-package",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gomock"
    ],
    "worksWellWith": [
      "go-test"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/stretchr/testify"
    ]
  },
  {
    "id": "micronaut",
    "name": "Micronaut",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Modern, JVM-based, full-stack framework for building modular, easily testable microservice applications.",
    "whyUseIt": "Eliminates runtime reflection through ahead-of-time (AOT) compilation, delivering lightning boot time and minimal memory.",
    "tags": [
      "micronaut",
      "jvm",
      "java",
      "kotlin",
      "microservices",
      "cloud-native"
    ],
    "ecosystem": "java",
    "officialUrl": "https://micronaut.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.micronaut.io/latest/guide/",
        "type": "docs"
      },
      {
        "label": "Creating Your First Micronaut App",
        "url": "https://guides.micronaut.io/latest/creating-your-first-micronaut-app.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "spring-boot",
      "quarkus"
    ],
    "worksWellWith": [
      "graalvm",
      "gradle",
      "maven"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "io.micronaut"
    ]
  },
  {
    "id": "quarkus",
    "name": "Quarkus",
    "category": "backend-framework",
    "difficulty": "intermediate",
    "description": "Kubernetes Native Java stack tailored for OpenJDK and GraalVM, crafted from best-of-breed Java libraries.",
    "whyUseIt": "Supersonic Subatomic Java: boots in tens of milliseconds with tiny memory footprint for serverless and Kubernetes.",
    "tags": [
      "quarkus",
      "kubernetes",
      "graalvm",
      "cloud-native",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://quarkus.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://quarkus.io/guides/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://quarkus.io/guides/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "spring-boot",
      "micronaut"
    ],
    "worksWellWith": [
      "kubernetes",
      "graalvm",
      "maven"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "io.quarkus"
    ]
  },
  {
    "id": "gradle",
    "name": "Gradle",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Enterprise-grade build automation tool for multi-project JVM, Android, and native software.",
    "whyUseIt": "Standard build system for Android and modern JVM projects with incremental compilation and build caching.",
    "tags": [
      "gradle",
      "build",
      "jvm",
      "android",
      "java",
      "kotlin"
    ],
    "ecosystem": "java",
    "officialUrl": "https://gradle.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.gradle.org/current/userguide/userguide.html",
        "type": "docs"
      },
      {
        "label": "Building Java Applications with Gradle",
        "url": "https://docs.gradle.org/current/samples/sample_building_java_applications.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "maven"
    ],
    "worksWellWith": [
      "spring-boot",
      "kotlin",
      "java"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "build.gradle",
      "build.gradle.kts"
    ]
  },
  {
    "id": "maven",
    "name": "Maven",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Declarative project management and build comprehension tool based on the Project Object Model (POM).",
    "whyUseIt": "The bedrock dependency management and build tool for enterprise Java with standardized lifecycle phases.",
    "tags": [
      "maven",
      "build",
      "dependencies",
      "pom",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://maven.apache.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://maven.apache.org/guides/index.html",
        "type": "docs"
      },
      {
        "label": "Maven in 5 Minutes",
        "url": "https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gradle"
    ],
    "worksWellWith": [
      "spring-boot",
      "java"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "pom.xml"
    ]
  },
  {
    "id": "hibernate",
    "name": "Hibernate",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Idiomatic object-relational mapping (ORM) framework for Java enterprise applications implementing Jakarta Persistence (JPA).",
    "whyUseIt": "The definitive JPA ORM in Java enterprise systems handling caching, complex relationships, and database independence.",
    "tags": [
      "hibernate",
      "jpa",
      "orm",
      "database",
      "sql",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://hibernate.org/orm/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://hibernate.org/orm/documentation/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.jboss.org/hibernate/orm/current/quickstart/html_single/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "jooq",
      "mybatis"
    ],
    "worksWellWith": [
      "spring-boot",
      "postgresql"
    ],
    "prerequisites": [
      "java",
      "sql"
    ],
    "stackIndicators": [
      "org.hibernate.orm"
    ]
  },
  {
    "id": "junit",
    "name": "JUnit 5",
    "category": "testing",
    "difficulty": "beginner",
    "description": "The standard programmer-oriented testing framework for Java, foundational for automated unit and integration tests.",
    "whyUseIt": "The universal unit testing framework in the Java world featuring parameterized tests, extensions, and IDE integration.",
    "tags": [
      "junit",
      "testing",
      "unit-tests",
      "tdd",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://junit.org/junit5/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://junit.org/junit5/docs/current/user-guide/",
        "type": "docs"
      },
      {
        "label": "JUnit 5 Basics Tutorial",
        "url": "https://junit.org/junit5/docs/current/user-guide/#writing-tests",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "testng"
    ],
    "worksWellWith": [
      "mockito",
      "assertj",
      "maven",
      "gradle"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "org.junit.jupiter"
    ]
  },
  {
    "id": "helm",
    "name": "Helm",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "The package manager for Kubernetes simplifying deployment and configuration of complex container applications.",
    "whyUseIt": "Packages complex Kubernetes manifests into versioned, reproducible templates with 1-command install and rollback.",
    "tags": [
      "helm",
      "kubernetes",
      "k8s",
      "devops",
      "cloud"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://helm.sh",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://helm.sh/docs/",
        "type": "docs"
      },
      {
        "label": "Helm Quickstart Guide",
        "url": "https://helm.sh/docs/intro/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "kustomize"
    ],
    "worksWellWith": [
      "kubernetes",
      "docker"
    ],
    "prerequisites": [
      "kubernetes"
    ],
    "stackIndicators": [
      "Chart.yaml"
    ]
  },
  {
    "id": "pulumi",
    "name": "Pulumi",
    "category": "cloud-hosting",
    "difficulty": "intermediate",
    "description": "Infrastructure as Code (IaC) SDK using real programming languages (TypeScript, Python, Go, C#) instead of domain DSLs.",
    "whyUseIt": "Declare and deploy cloud infrastructure (AWS, GCP, Azure) using full TypeScript or Python with IDE autocompletion.",
    "tags": [
      "pulumi",
      "iac",
      "cloud",
      "infrastructure",
      "terraform",
      "aws",
      "gcp"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.pulumi.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.pulumi.com/docs/",
        "type": "docs"
      },
      {
        "label": "Pulumi Getting Started",
        "url": "https://www.pulumi.com/docs/get-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "terraform",
      "aws-cdk"
    ],
    "worksWellWith": [
      "aws",
      "gcp",
      "azure",
      "typescript"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "@pulumi/pulumi",
      "pulumi"
    ]
  },
  {
    "id": "ansible",
    "name": "Ansible",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "Simple, agentless IT automation system for configuration management, application deployment, and task automation.",
    "whyUseIt": "Automates server provisioning and configuration over SSH using readable YAML playbooks without installing client agents.",
    "tags": [
      "ansible",
      "devops",
      "automation",
      "ssh",
      "linux",
      "sysadmin"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.ansible.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.ansible.com/",
        "type": "docs"
      },
      {
        "label": "Ansible Getting Started",
        "url": "https://docs.ansible.com/ansible/latest/getting_started/index.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "terraform",
      "puppet",
      "chef"
    ],
    "worksWellWith": [
      "docker",
      "linux"
    ],
    "prerequisites": [
      "linux"
    ],
    "stackIndicators": [
      "ansible"
    ]
  },
  {
    "id": "prometheus",
    "name": "Prometheus",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Open-source systems monitoring and alerting toolkit with a multi-dimensional time series data model and PromQL.",
    "whyUseIt": "Industry standard for metrics scraping and alerting across cloud-native microservices and Kubernetes clusters.",
    "tags": [
      "prometheus",
      "monitoring",
      "metrics",
      "observability",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://prometheus.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://prometheus.io/docs/introduction/overview/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://prometheus.io/docs/prometheus/latest/getting_started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "datadog",
      "cloudwatch"
    ],
    "worksWellWith": [
      "grafana",
      "kubernetes",
      "docker"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "prom-client",
      "prometheus"
    ]
  },
  {
    "id": "grafana",
    "name": "Grafana",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Open-source analytics and interactive data visualization platform for metrics, logs, and traces from any source.",
    "whyUseIt": "Builds beautiful, real-time operational monitoring dashboards combining Prometheus metrics, Loki logs, and SQL data.",
    "tags": [
      "grafana",
      "dashboards",
      "visualization",
      "observability",
      "monitoring"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://grafana.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://grafana.com/docs/grafana/latest/",
        "type": "docs"
      },
      {
        "label": "Grafana Fundamentals Tutorial",
        "url": "https://grafana.com/tutorials/grafana-fundamentals/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "datadog",
      "kibana"
    ],
    "worksWellWith": [
      "prometheus",
      "loki"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "grafana"
    ]
  },
  {
    "id": "opentelemetry",
    "name": "OpenTelemetry",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Vendor-neutral open-source observability framework for instrumenting, generating, and exporting telemetry data.",
    "whyUseIt": "Single vendor-agnostic SDK for traces, metrics, and logs, preventing vendor lock-in to Datadog, New Relic, or Honeycomb.",
    "tags": [
      "opentelemetry",
      "tracing",
      "metrics",
      "observability",
      "telemetry"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://opentelemetry.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://opentelemetry.io/docs/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://opentelemetry.io/docs/languages/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "datadog",
      "sentry"
    ],
    "worksWellWith": [
      "prometheus",
      "jaeger"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "@opentelemetry/api",
      "opentelemetry-api"
    ]
  },
  {
    "id": "snyk",
    "name": "Snyk",
    "category": "security",
    "difficulty": "beginner",
    "description": "Developer security platform that automatically finds and fixes vulnerabilities in open source dependencies and containers.",
    "whyUseIt": "Scans npm, pip, and Cargo lockfiles directly in Git CI/CD to prevent shipping CVE vulnerabilities into production.",
    "tags": [
      "snyk",
      "security",
      "vulnerabilities",
      "cve",
      "dependencies"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://snyk.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.snyk.io/",
        "type": "docs"
      },
      {
        "label": "Snyk CLI Quickstart",
        "url": "https://docs.snyk.io/snyk-cli/getting-started-with-the-cli",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "trivy",
      "dependabot"
    ],
    "worksWellWith": [
      "github-actions",
      "docker"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "snyk"
    ]
  },
  {
    "id": "trivy",
    "name": "Trivy",
    "category": "security",
    "difficulty": "beginner",
    "description": "Comprehensive and versatile security scanner finding vulnerabilities, misconfigurations, and secrets in containers and code.",
    "whyUseIt": "Fast, open-source container and repository scanner requiring zero API keys or external SaaS registrations.",
    "tags": [
      "trivy",
      "security",
      "scanner",
      "docker",
      "containers",
      "cve"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://trivy.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://trivy.dev/latest/",
        "type": "docs"
      },
      {
        "label": "Trivy Quickstart",
        "url": "https://trivy.dev/latest/getting-started/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "snyk",
      "grype"
    ],
    "worksWellWith": [
      "docker",
      "kubernetes",
      "github-actions"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "trivy"
    ]
  },
  {
    "id": "vault",
    "name": "HashiCorp Vault",
    "category": "security",
    "difficulty": "intermediate",
    "description": "Secure, store and tightly control access to tokens, passwords, certificates, and encryption keys for protecting sensitive data.",
    "whyUseIt": "Centralized enterprise secret management with dynamic short-lived credentials and programmatic encryption as a service.",
    "tags": [
      "vault",
      "secrets",
      "security",
      "encryption",
      "credentials"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.vaultproject.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://developer.hashicorp.com/vault/docs",
        "type": "docs"
      },
      {
        "label": "Vault Getting Started",
        "url": "https://developer.hashicorp.com/vault/tutorials/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "aws-secrets-manager",
      "doppler"
    ],
    "worksWellWith": [
      "kubernetes",
      "terraform"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "vault"
    ]
  },
  {
    "id": "sass",
    "name": "Sass",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "CSS extension language providing variables, nested rules, mixins, and mathematical functions.",
    "whyUseIt": "The most popular CSS preprocessor, bringing clean nesting, partial files, and reusable variables to stylesheets.",
    "tags": [
      "sass",
      "scss",
      "css",
      "styling",
      "frontend"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://sass-lang.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://sass-lang.com/documentation/",
        "type": "docs"
      },
      {
        "label": "Sass Basics Tutorial",
        "url": "https://sass-lang.com/guide/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tailwind-css",
      "postcss",
      "less"
    ],
    "worksWellWith": [
      "vite",
      "webpack"
    ],
    "prerequisites": [
      "css"
    ],
    "stackIndicators": [
      "sass"
    ]
  },
  {
    "id": "postcss",
    "name": "PostCSS",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "A tool for transforming CSS with JavaScript plugins supporting Autoprefixer, modern polyfills, and nesting.",
    "whyUseIt": "Core engine powering Tailwind CSS, automatic browser vendor prefixing, and modern CSS compilation.",
    "tags": [
      "postcss",
      "css",
      "build",
      "autoprefixer",
      "tailwind"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://postcss.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://postcss.org/docs/",
        "type": "docs"
      },
      {
        "label": "Getting Started with PostCSS",
        "url": "https://postcss.org/docs/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sass"
    ],
    "worksWellWith": [
      "tailwind-css",
      "vite"
    ],
    "prerequisites": [
      "css"
    ],
    "stackIndicators": [
      "postcss"
    ]
  },
  {
    "id": "framer-motion",
    "name": "Framer Motion",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "A production-ready motion library for React that makes creating animations intuitive and declarative.",
    "whyUseIt": "The definitive UI animation library for React: physics springs, gesture tracking, layout morphing, and exit transitions.",
    "tags": [
      "framer-motion",
      "animation",
      "react",
      "ui",
      "motion"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://motion.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://motion.dev/docs",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://motion.dev/docs/quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gsap",
      "react-spring"
    ],
    "worksWellWith": [
      "react",
      "tailwind-css",
      "nextjs"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "framer-motion",
      "motion"
    ]
  },
  {
    "id": "gsap",
    "name": "GSAP",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "High-performance JavaScript animation library for creating ultra-smooth web animations and timeline sequences.",
    "whyUseIt": "The industry standard for complex interactive web animations, SVG morphing, and scroll-triggered canvas experiences.",
    "tags": [
      "gsap",
      "animation",
      "scrolltrigger",
      "timeline",
      "javascript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://gsap.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://gsap.com/docs/v3/",
        "type": "docs"
      },
      {
        "label": "GSAP Getting Started Guide",
        "url": "https://gsap.com/resources/get-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "framer-motion",
      "animejs"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "threejs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "gsap"
    ]
  },
  {
    "id": "lucide-react",
    "name": "Lucide React",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Beautiful & consistent icon library for React with 1000+ clean SVG icons and zero runtime styling dependencies.",
    "whyUseIt": "The modern successor to Feather Icons used by shadcn/ui: clean, tree-shakeable icons with customizable stroke width.",
    "tags": [
      "lucide",
      "icons",
      "react",
      "svg",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://lucide.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://lucide.dev/guide/packages/lucide-react",
        "type": "docs"
      },
      {
        "label": "Icon Directory",
        "url": "https://lucide.dev/icons/",
        "type": "docs"
      }
    ],
    "alternatives": [
      "react-icons",
      "heroicons"
    ],
    "worksWellWith": [
      "shadcn-ui",
      "tailwind-css",
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "lucide-react"
    ]
  },
  {
    "id": "cmdk",
    "name": "cmdk",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Fast, unstyled command menu React component primitive with keyboard navigation and fuzzy search.",
    "whyUseIt": "Powers modern Command-K dialogs (like Raycast and Linear) with accessible arrow navigation and instant filtering.",
    "tags": [
      "cmdk",
      "command-palette",
      "dialog",
      "react",
      "accessible"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://cmdk.paco.me",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/pacocoursey/cmdk#readme",
        "type": "docs"
      },
      {
        "label": "Live Examples",
        "url": "https://cmdk.paco.me/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "kbar"
    ],
    "worksWellWith": [
      "shadcn-ui",
      "radix-ui",
      "tailwind-css"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "cmdk"
    ]
  },
  {
    "id": "sonner",
    "name": "Sonner",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "An opinionated toast component for React with sleek stacked animations and zero layout shifts.",
    "whyUseIt": "The cleanest, most aesthetic toast notification library for React apps with stacked cards and promise states.",
    "tags": [
      "sonner",
      "toast",
      "notifications",
      "react",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://sonner.emilkowal.ski",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://sonner.emilkowal.ski/",
        "type": "docs"
      },
      {
        "label": "GitHub Usage Guide",
        "url": "https://github.com/emilkowalski/sonner#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "react-hot-toast",
      "react-toastify"
    ],
    "worksWellWith": [
      "shadcn-ui",
      "tailwind-css",
      "nextjs"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "sonner"
    ]
  },
  {
    "id": "recharts",
    "name": "Recharts",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Redefined chart library built with React and D3 for composable and declarative data visualization.",
    "whyUseIt": "Easily draw bar charts, line graphs, and pie charts in React applications using declarative JSX components.",
    "tags": [
      "recharts",
      "charts",
      "data-viz",
      "d3",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://recharts.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://recharts.org/en-US/guide/getting-started",
        "type": "docs"
      },
      {
        "label": "Recharts Examples",
        "url": "https://recharts.org/en-US/examples",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "chartjs",
      "visx"
    ],
    "worksWellWith": [
      "react",
      "nextjs"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "recharts"
    ]
  },
  {
    "id": "chartjs",
    "name": "Chart.js",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Simple yet flexible JavaScript charting for designers and developers using HTML5 canvas.",
    "whyUseIt": "Lightweight, responsive HTML5 canvas charts that work with vanilla JavaScript and any frontend framework.",
    "tags": [
      "chartjs",
      "charts",
      "canvas",
      "visualization",
      "javascript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.chartjs.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.chartjs.org/docs/latest/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://www.chartjs.org/docs/latest/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "recharts",
      "d3"
    ],
    "worksWellWith": [
      "react-chartjs-2",
      "vue-chartjs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "chart.js"
    ]
  },
  {
    "id": "react-hook-form",
    "name": "React Hook Form",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Performant, flexible and extensible forms with easy-to-use validation for React.",
    "whyUseIt": "Reduces form re-renders to near zero using uncontrolled inputs while integrating seamlessly with Zod validation.",
    "tags": [
      "react-hook-form",
      "forms",
      "validation",
      "react",
      "zod"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://react-hook-form.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://react-hook-form.com/get-started",
        "type": "docs"
      },
      {
        "label": "API Reference",
        "url": "https://react-hook-form.com/docs",
        "type": "docs"
      }
    ],
    "alternatives": [
      "formik"
    ],
    "worksWellWith": [
      "zod",
      "shadcn-ui",
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "react-hook-form"
    ]
  },
  {
    "id": "typer",
    "name": "Typer",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Library for building CLI applications in Python that users will love using and developers will love creating.",
    "whyUseIt": "Builds beautiful, type-safe command-line tools in Python using the exact same type-hint ergonomics as FastAPI.",
    "tags": [
      "typer",
      "cli",
      "click",
      "terminal",
      "python",
      "fastapi"
    ],
    "ecosystem": "python",
    "officialUrl": "https://typer.tiangolo.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://typer.tiangolo.com/",
        "type": "docs"
      },
      {
        "label": "Typer Tutorial",
        "url": "https://typer.tiangolo.com/tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "click",
      "argparse"
    ],
    "worksWellWith": [
      "rich",
      "pydantic",
      "fastapi"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "typer"
    ]
  },
  {
    "id": "click",
    "name": "Click",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Python package for creating beautiful command line interfaces in a composable way with as little code as necessary.",
    "whyUseIt": "The rock-solid foundation powering Flask and Typer CLI commands with automatic help pages and nesting.",
    "tags": [
      "click",
      "cli",
      "commands",
      "terminal",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://click.palletsprojects.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://click.palletsprojects.com/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://click.palletsprojects.com/en/latest/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "typer",
      "argparse"
    ],
    "worksWellWith": [
      "flask",
      "rich"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "click"
    ]
  },
  {
    "id": "rich",
    "name": "Rich",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Python library for rich text and beautiful formatting in the terminal including syntax highlighting, tables, and progress bars.",
    "whyUseIt": "Instantly elevates Python CLI developer experience with colored logs, styled tables, spin animations, and markdown rendering.",
    "tags": [
      "rich",
      "terminal",
      "ui",
      "formatting",
      "cli",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://rich.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://rich.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Introduction to Rich",
        "url": "https://rich.readthedocs.io/en/latest/introduction.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "textual",
      "colorama"
    ],
    "worksWellWith": [
      "typer",
      "click",
      "logging"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "rich"
    ]
  },
  {
    "id": "textual",
    "name": "Textual",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Rapid Application Development framework for building sophisticated terminal user interfaces (TUIs) in Python.",
    "whyUseIt": "Build complex, reactive terminal applications with mouse support, CSS layout flexbox, and widget components in Python.",
    "tags": [
      "textual",
      "tui",
      "terminal",
      "gui",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://textual.textualize.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://textual.textualize.io/",
        "type": "docs"
      },
      {
        "label": "Textual Tutorial",
        "url": "https://textual.textualize.io/tutorial/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "curses",
      "blessed"
    ],
    "worksWellWith": [
      "rich",
      "python"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "textual"
    ]
  },
  {
    "id": "beautifulsoup4",
    "name": "Beautiful Soup",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Python library for pulling data out of HTML and XML files using idiomatic tree navigation and searching.",
    "whyUseIt": "The beginner standard for web scraping and HTML parsing, gracefully tolerating broken or unclosed HTML tags.",
    "tags": [
      "beautifulsoup",
      "scraping",
      "html",
      "parsing",
      "crawler",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.crummy.com/software/BeautifulSoup/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.crummy.com/software/BeautifulSoup/bs4/doc/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://www.crummy.com/software/BeautifulSoup/bs4/doc/#quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "scrapy",
      "playwright-python"
    ],
    "worksWellWith": [
      "requests",
      "httpx"
    ],
    "prerequisites": [
      "python",
      "html"
    ],
    "stackIndicators": [
      "beautifulsoup4",
      "bs4"
    ]
  },
  {
    "id": "scrapy",
    "name": "Scrapy",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Fast high-level web crawling and web scraping framework for Python to crawl websites and extract structured data.",
    "whyUseIt": "Full-featured web scraping pipeline with asynchronous concurrency, automatic rate limiting, and export pipelines.",
    "tags": [
      "scrapy",
      "crawler",
      "scraping",
      "spider",
      "data",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://scrapy.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.scrapy.org/en/latest/",
        "type": "docs"
      },
      {
        "label": "Scrapy Tutorial",
        "url": "https://docs.scrapy.org/en/latest/intro/tutorial.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "beautifulsoup4",
      "playwright-python"
    ],
    "worksWellWith": [
      "twisted",
      "itemloaders"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "scrapy"
    ]
  },
  {
    "id": "streamlit",
    "name": "Streamlit",
    "category": "frontend-framework",
    "difficulty": "beginner",
    "description": "Open-source Python framework for building and sharing beautiful, custom web apps for machine learning and data science.",
    "whyUseIt": "Turns Python data scripts into shareable web apps in minutes with zero frontend, HTML, or JavaScript required.",
    "tags": [
      "streamlit",
      "data-science",
      "dashboard",
      "python",
      "ui",
      "ai"
    ],
    "ecosystem": "python",
    "officialUrl": "https://streamlit.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.streamlit.io/",
        "type": "docs"
      },
      {
        "label": "Get Started with Streamlit",
        "url": "https://docs.streamlit.io/get-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gradio",
      "dash"
    ],
    "worksWellWith": [
      "pandas",
      "numpy",
      "matplotlib",
      "scikit-learn"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "streamlit"
    ]
  },
  {
    "id": "gradio",
    "name": "Gradio",
    "category": "frontend-framework",
    "difficulty": "beginner",
    "description": "Fastest way to demo your machine learning model with a friendly web interface so anyone can use it anywhere.",
    "whyUseIt": "The standard UI toolkit for Hugging Face demos: wraps machine learning prediction functions into web interfaces in 5 lines.",
    "tags": [
      "gradio",
      "ai",
      "demo",
      "machine-learning",
      "ui",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.gradio.app",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.gradio.app/docs",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://www.gradio.app/guides/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "streamlit",
      "dash"
    ],
    "worksWellWith": [
      "huggingface-transformers",
      "pytorch"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "gradio"
    ]
  },
  {
    "id": "scipy",
    "name": "SciPy",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Fundamental algorithms for scientific computing in Python including optimization, integration, and linear algebra.",
    "whyUseIt": "Provides verified numerical routines for scientific engineering: curve fitting, differential equations, and signal processing.",
    "tags": [
      "scipy",
      "math",
      "algorithms",
      "scientific",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://scipy.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.scipy.org/doc/scipy/",
        "type": "docs"
      },
      {
        "label": "SciPy User Guide",
        "url": "https://docs.scipy.org/doc/scipy/tutorial/index.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "numpy",
      "sympy"
    ],
    "worksWellWith": [
      "numpy",
      "matplotlib"
    ],
    "prerequisites": [
      "python",
      "numpy"
    ],
    "stackIndicators": [
      "scipy"
    ]
  },
  {
    "id": "pillow",
    "name": "Pillow",
    "category": "utility",
    "difficulty": "beginner",
    "description": "The friendly Python Imaging Library (PIL) fork for opening, manipulating, and saving many different image file formats.",
    "whyUseIt": "The foundational image processing library in Python for resizing, cropping, converting formats, and thumbnail generation.",
    "tags": [
      "pillow",
      "image",
      "imaging",
      "graphics",
      "png",
      "jpeg",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://python-pillow.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pillow.readthedocs.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "Pillow Tutorial",
        "url": "https://pillow.readthedocs.io/en/stable/handbook/tutorial.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "opencv-python"
    ],
    "worksWellWith": [
      "numpy",
      "torchvision"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "pillow",
      "PIL"
    ]
  },
  {
    "id": "opencv-python",
    "name": "OpenCV (Python)",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Open source computer vision and machine learning software library with real-time image and video processing.",
    "whyUseIt": "The global standard for computer vision: face detection, object tracking, edge detection, and real-time camera processing.",
    "tags": [
      "opencv",
      "computer-vision",
      "video",
      "image-processing",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://opencv.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
        "type": "docs"
      },
      {
        "label": "OpenCV Python Tutorials",
        "url": "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pillow"
    ],
    "worksWellWith": [
      "numpy",
      "pytorch"
    ],
    "prerequisites": [
      "python",
      "numpy"
    ],
    "stackIndicators": [
      "opencv-python",
      "cv2"
    ]
  },
  {
    "id": "asyncpg",
    "name": "asyncpg",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Fast, pure-Python asynchronous PostgreSQL database client library for Python and asyncio.",
    "whyUseIt": "Delivers 3x faster query performance than psycopg2 by implementing PostgreSQL binary protocol directly for asyncio.",
    "tags": [
      "asyncpg",
      "postgresql",
      "async",
      "database",
      "driver",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://magicstack.github.io/asyncpg/current/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://magicstack.github.io/asyncpg/current/",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://magicstack.github.io/asyncpg/current/usage.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "psycopg2"
    ],
    "worksWellWith": [
      "fastapi",
      "sqlalchemy",
      "postgresql"
    ],
    "prerequisites": [
      "python",
      "postgresql"
    ],
    "stackIndicators": [
      "asyncpg"
    ]
  },
  {
    "id": "psycopg2",
    "name": "psycopg2",
    "category": "database",
    "difficulty": "beginner",
    "description": "The most popular PostgreSQL database adapter for the Python programming language.",
    "whyUseIt": "The battle-tested standard PostgreSQL driver powering Django, SQLAlchemy, and enterprise Python applications.",
    "tags": [
      "psycopg2",
      "postgresql",
      "sql",
      "database",
      "driver",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.psycopg.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.psycopg.org/docs/",
        "type": "docs"
      },
      {
        "label": "Basic Module Usage",
        "url": "https://www.psycopg.org/docs/usage.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "asyncpg",
      "psycopg"
    ],
    "worksWellWith": [
      "django",
      "sqlalchemy",
      "postgresql"
    ],
    "prerequisites": [
      "python",
      "postgresql"
    ],
    "stackIndicators": [
      "psycopg2",
      "psycopg2-binary"
    ]
  },
  {
    "id": "nativewind",
    "name": "NativeWind",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Universal styling system for React Native using Tailwind CSS with compile-time styling compilation.",
    "whyUseIt": "Write identical Tailwind CSS utility classes across React Native and web with native performance.",
    "tags": [
      "nativewind",
      "tailwind",
      "styling",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.nativewind.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.nativewind.dev/docs/getting-started",
        "type": "docs"
      },
      {
        "label": "Expo Setup Guide",
        "url": "https://www.nativewind.dev/docs/guides/frameworks/expo",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native-stylesheet"
    ],
    "worksWellWith": [
      "expo",
      "react-native",
      "tailwind-css"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "nativewind"
    ]
  },
  {
    "id": "react-native-reanimated",
    "name": "React Native Reanimated",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Powerful React Native animation library that runs animations directly on the native UI thread at 60/120 FPS.",
    "whyUseIt": "Eliminates animation stutter in React Native by executing gesture and physics animations natively on the UI thread.",
    "tags": [
      "reanimated",
      "animation",
      "gesture",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://docs.swmansion.com/react-native-reanimated/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started",
        "type": "docs"
      },
      {
        "label": "Reanimated Tutorial",
        "url": "https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native-animated"
    ],
    "worksWellWith": [
      "react-native-gesture-handler",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-reanimated"
    ]
  },
  {
    "id": "react-native-mmkv",
    "name": "react-native-mmkv",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Extremely fast, synchronous key-value storage framework for React Native based on WeChat MMKV.",
    "whyUseIt": "Up to 30x faster than AsyncStorage with synchronous read/writes and encryption support in React Native.",
    "tags": [
      "mmkv",
      "storage",
      "key-value",
      "sqlite",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/mrousavy/react-native-mmkv",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/mrousavy/react-native-mmkv#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/mrousavy/react-native-mmkv#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "async-storage"
    ],
    "worksWellWith": [
      "react-native",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-mmkv"
    ]
  },
  {
    "id": "flutter-bloc",
    "name": "flutter_bloc",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Predictable state management library for Flutter that helps implement the BLoC (Business Logic Component) pattern.",
    "whyUseIt": "Industry enterprise standard for Flutter state management separating presentation from business logic.",
    "tags": [
      "bloc",
      "state-management",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://bloclibrary.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://bloclibrary.dev/",
        "type": "docs"
      },
      {
        "label": "Flutter Bloc Tutorial",
        "url": "https://bloclibrary.dev/tutorials/flutter-counter/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "riverpod",
      "provider-flutter"
    ],
    "worksWellWith": [
      "flutter",
      "dart"
    ],
    "prerequisites": [
      "flutter"
    ],
    "stackIndicators": [
      "flutter_bloc",
      "bloc"
    ]
  },
  {
    "id": "riverpod",
    "name": "Riverpod",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "A reactive caching and state-management framework for Dart and Flutter with compile-time safety.",
    "whyUseIt": "Catches state management bugs at compile time without BuildContext dependencies, offering async state caching.",
    "tags": [
      "riverpod",
      "state-management",
      "reactive",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://riverpod.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://riverpod.dev/docs/introduction/getting_started",
        "type": "docs"
      },
      {
        "label": "Riverpod Getting Started",
        "url": "https://riverpod.dev/docs/getting_started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "flutter-bloc",
      "provider-flutter"
    ],
    "worksWellWith": [
      "flutter",
      "dart"
    ],
    "prerequisites": [
      "flutter"
    ],
    "stackIndicators": [
      "flutter_riverpod",
      "riverpod"
    ]
  },
  {
    "id": "tanstack-table",
    "name": "TanStack Table",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Headless UI for building powerful tables & datagrids with sorting, filtering, grouping, and virtualization.",
    "whyUseIt": "Provides complete 100% control over table UI markup and styling while handling complex multi-column sorting and filtering logic.",
    "tags": [
      "tanstack-table",
      "tables",
      "datagrid",
      "sorting",
      "react",
      "vue",
      "svelte"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tanstack.com/table/latest",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tanstack.com/table/latest/docs/introduction",
        "type": "docs"
      },
      {
        "label": "Table Quick Start",
        "url": "https://tanstack.com/table/latest/docs/guide/introduction",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "ag-grid"
    ],
    "worksWellWith": [
      "react",
      "shadcn-ui",
      "tailwind-css"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "@tanstack/react-table",
      "@tanstack/table-core"
    ]
  },
  {
    "id": "tanstack-virtual",
    "name": "TanStack Virtual",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Headless UI for virtualizing large element lists, grids, and dynamic windows with 60 FPS scrolling performance.",
    "whyUseIt": "Renders 100,000+ items smoothly in the DOM by only mounting elements currently visible inside the viewport.",
    "tags": [
      "tanstack-virtual",
      "virtualization",
      "infinite-scroll",
      "performance",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tanstack.com/virtual/latest",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tanstack.com/virtual/latest/docs/introduction",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://tanstack.com/virtual/latest/docs/guide/introduction",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-window",
      "react-virtualized"
    ],
    "worksWellWith": [
      "react",
      "tanstack-table"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "@tanstack/react-virtual",
      "@tanstack/virtual-core"
    ]
  },
  {
    "id": "floating-ui",
    "name": "Floating UI",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Low-level positioning library for creating tooltips, popovers, dropdown menus, and hover cards.",
    "whyUseIt": "The mathematical positioning engine behind Radix UI and Shadcn: automatically flips, shifts, and anchors popups.",
    "tags": [
      "floating-ui",
      "popper",
      "tooltips",
      "popovers",
      "dropdowns",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://floating-ui.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://floating-ui.com/docs/getting-started",
        "type": "docs"
      },
      {
        "label": "Tutorial Guide",
        "url": "https://floating-ui.com/docs/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "popperjs"
    ],
    "worksWellWith": [
      "react",
      "radix-ui"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "@floating-ui/react",
      "@floating-ui/dom"
    ]
  },
  {
    "id": "tailwind-merge",
    "name": "tailwind-merge",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts or cascade bugs.",
    "whyUseIt": "Resolves conflicting Tailwind utility classes cleanly (e.g. px-2 vs px-4), essential for reusable UI component libraries.",
    "tags": [
      "tailwind-merge",
      "tailwind",
      "classes",
      "css",
      "utility"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/dcastil/tailwind-merge",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/dcastil/tailwind-merge#readme",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://github.com/dcastil/tailwind-merge/blob/v2.5.2/docs/features.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "clsx"
    ],
    "worksWellWith": [
      "clsx",
      "tailwind-css",
      "shadcn-ui"
    ],
    "prerequisites": [
      "tailwind-css"
    ],
    "stackIndicators": [
      "tailwind-merge"
    ]
  },
  {
    "id": "clsx",
    "name": "clsx",
    "category": "utility",
    "difficulty": "beginner",
    "description": "A tiny (239B) utility for constructing className strings conditionally in JavaScript and TypeScript.",
    "whyUseIt": "Constructs dynamic class strings with objects, arrays, and booleans without messy string template interpolations.",
    "tags": [
      "clsx",
      "classname",
      "css",
      "utility",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/lukeed/clsx",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/lukeed/clsx#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/lukeed/clsx#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "classnames"
    ],
    "worksWellWith": [
      "tailwind-merge",
      "react"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "clsx"
    ]
  },
  {
    "id": "cva",
    "name": "Class Variance Authority (CVA)",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Declarative variant-driven styling utility for creating design system components with type-safe props.",
    "whyUseIt": "Defines button variants (primary, destructive, outline), sizes, and states cleanly with TypeScript prop safety.",
    "tags": [
      "cva",
      "design-system",
      "variants",
      "tailwind",
      "components"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://cva.style/docs",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://cva.style/docs",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://cva.style/docs/getting-started/installation",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tailwind-variants"
    ],
    "worksWellWith": [
      "tailwind-merge",
      "clsx",
      "shadcn-ui"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "class-variance-authority"
    ]
  },
  {
    "id": "shiki",
    "name": "Shiki",
    "category": "utility",
    "difficulty": "beginner",
    "description": "A beautiful yet powerful syntax highlighter based on TextMate grammar and VS Code themes.",
    "whyUseIt": "Renders exact 1-to-1 code syntax highlighting identical to VS Code with token caching and light/dark theme dual support.",
    "tags": [
      "shiki",
      "syntax-highlighter",
      "code",
      "markdown",
      "vscode"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://shiki.style",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://shiki.style/guide/",
        "type": "docs"
      },
      {
        "label": "Shiki Quick Start",
        "url": "https://shiki.style/guide/install",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "prismjs",
      "highlightjs"
    ],
    "worksWellWith": [
      "nextjs",
      "astro",
      "markdown"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "shiki"
    ]
  },
  {
    "id": "bullmq",
    "name": "BullMQ",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "The fastest, most resilient NodeJS message queue and batch job scheduler powered by Redis.",
    "whyUseIt": "Production standard for background job processing in Node.js: rate limiting, retries, parent-child flows, and worker clustering.",
    "tags": [
      "bullmq",
      "queue",
      "redis",
      "jobs",
      "worker",
      "async",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://bullmq.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.bullmq.io/",
        "type": "docs"
      },
      {
        "label": "BullMQ Tutorial",
        "url": "https://docs.bullmq.io/guide/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "agenda",
      "bee-queue"
    ],
    "worksWellWith": [
      "redis",
      "ioredis",
      "nestjs"
    ],
    "prerequisites": [
      "redis",
      "nodejs"
    ],
    "stackIndicators": [
      "bullmq"
    ]
  },
  {
    "id": "ioredis",
    "name": "ioredis",
    "category": "database",
    "difficulty": "beginner",
    "description": "A robust, performance-focused and full-featured Redis client for Node.js with Cluster and Sentinel support.",
    "whyUseIt": "The preferred Redis client for Node.js featuring automatic reconnects, Redis Cluster support, and pipeline transactions.",
    "tags": [
      "ioredis",
      "redis",
      "cache",
      "key-value",
      "database",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/redis/ioredis",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://ioredis.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://github.com/redis/ioredis#basic-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "redis"
    ],
    "worksWellWith": [
      "bullmq",
      "express",
      "nestjs"
    ],
    "prerequisites": [
      "redis",
      "javascript"
    ],
    "stackIndicators": [
      "ioredis"
    ]
  },
  {
    "id": "msw",
    "name": "Mock Service Worker (MSW)",
    "category": "testing",
    "difficulty": "intermediate",
    "description": "API mocking library for browser and Node.js that intercepts requests at the network level using Service Worker.",
    "whyUseIt": "Mock API requests seamlessly across unit tests, Storybook, and development without modifying application code.",
    "tags": [
      "msw",
      "mocking",
      "api",
      "testing",
      "network",
      "fetch"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://mswjs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://mswjs.io/docs/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://mswjs.io/docs/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nock"
    ],
    "worksWellWith": [
      "vitest",
      "jest",
      "playwright"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "msw"
    ]
  },
  {
    "id": "faker-js",
    "name": "Faker",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Generate massive amounts of fake (but realistic) data for testing, development, and seeding databases.",
    "whyUseIt": "Generates realistic names, addresses, emails, avatars, commerce products, and dates for test fixtures.",
    "tags": [
      "faker",
      "mock",
      "fake-data",
      "testing",
      "fixtures"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://fakerjs.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://fakerjs.dev/guide/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://fakerjs.dev/guide/usage.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "chance"
    ],
    "worksWellWith": [
      "vitest",
      "prisma",
      "drizzle-orm"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "@faker-js/faker"
    ]
  },
  {
    "id": "k6",
    "name": "Grafana k6",
    "category": "testing",
    "difficulty": "intermediate",
    "description": "Developer-centric open-source load testing tool for testing the performance of APIs, microservices, and websites.",
    "whyUseIt": "Write load tests in modern JavaScript with CLI automation, metrics thresholds, and CI/CD performance regression gates.",
    "tags": [
      "k6",
      "load-testing",
      "performance",
      "stress-testing",
      "benchmarking"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://k6.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://k6.io/docs/",
        "type": "docs"
      },
      {
        "label": "k6 Quickstart",
        "url": "https://k6.io/docs/get-started/running-k6/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "artillery",
      "locust",
      "autocannon"
    ],
    "worksWellWith": [
      "grafana",
      "prometheus",
      "github-actions"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "k6"
    ]
  },
  {
    "id": "biome",
    "name": "Biome",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Fast formatter, linter, and more for JavaScript, TypeScript, JSON, and CSS written in Rust.",
    "whyUseIt": "Single Rust binary replacing both ESLint and Prettier with sub-10ms formatting and instant zero-config linter.",
    "tags": [
      "biome",
      "linter",
      "formatter",
      "fast",
      "rust",
      "tooling"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://biomejs.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://biomejs.dev/guides/getting-started/",
        "type": "docs"
      },
      {
        "label": "Biome Tutorial",
        "url": "https://biomejs.dev/guides/first-party-rules/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "prettier",
      "eslint"
    ],
    "worksWellWith": [
      "typescript",
      "vscode"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "@biomejs/biome"
    ]
  },
  {
    "id": "turborepo",
    "name": "Turborepo",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "High-performance build system for JavaScript and TypeScript codebases with remote caching and parallel execution.",
    "whyUseIt": "Drastically accelerates monorepo build and test times by caching computation and running tasks concurrently.",
    "tags": [
      "turborepo",
      "monorepo",
      "build-system",
      "caching",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://turbo.build/repo",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://turbo.build/repo/docs",
        "type": "docs"
      },
      {
        "label": "Turborepo Getting Started",
        "url": "https://turbo.build/repo/docs/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nx",
      "lerna"
    ],
    "worksWellWith": [
      "pnpm",
      "nextjs",
      "typescript"
    ],
    "prerequisites": [
      "monorepo"
    ],
    "stackIndicators": [
      "turbo"
    ]
  },
  {
    "id": "tsup",
    "name": "tsup",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Bundle your TypeScript library with no config, powered by esbuild for blazing fast build times.",
    "whyUseIt": "The fastest way to bundle TypeScript libraries into ESM and CommonJS with zero rollup/webpack boilerplate.",
    "tags": [
      "tsup",
      "bundler",
      "typescript",
      "esbuild",
      "packaging"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tsup.egoist.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tsup.egoist.dev/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://github.com/egoist/tsup#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "esbuild",
      "unbuild",
      "rollup"
    ],
    "worksWellWith": [
      "typescript",
      "esbuild"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "tsup"
    ]
  },
  {
    "id": "husky",
    "name": "Husky",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Modern Git hooks made easy to lint commit messages, run tests, and format code before pushing.",
    "whyUseIt": "Prevents bad commits and broken code from ever reaching Git by enforcing automated pre-commit and pre-push hooks.",
    "tags": [
      "husky",
      "git",
      "git-hooks",
      "pre-commit",
      "developer-tools"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://typicode.github.io/husky/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://typicode.github.io/husky/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://typicode.github.io/husky/get-started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "lefthook",
      "pre-commit"
    ],
    "worksWellWith": [
      "lint-staged",
      "commitlint"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "husky"
    ]
  },
  {
    "id": "lint-staged",
    "name": "lint-staged",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Run linters against staged git files and don’t let slipped formatting errors slip into your code base.",
    "whyUseIt": "Lints and formats only the specific files you have modified in git rather than re-running over the entire codebase.",
    "tags": [
      "lint-staged",
      "git",
      "linter",
      "prettier",
      "eslint"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/lint-staged/lint-staged",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/lint-staged/lint-staged#readme",
        "type": "docs"
      },
      {
        "label": "Setup Guide",
        "url": "https://github.com/lint-staged/lint-staged#examples",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "husky"
    ],
    "worksWellWith": [
      "husky",
      "prettier",
      "eslint"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "lint-staged"
    ]
  },
  {
    "id": "tauri",
    "name": "Tauri",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "Framework for building tiny, blazingly fast binaries for all major desktop and mobile platforms using web frontend and Rust backend.",
    "whyUseIt": "Replaces resource-heavy Electron apps with 10x smaller file sizes (<5MB) and native OS webview rendering backed by secure Rust.",
    "tags": [
      "tauri",
      "desktop",
      "rust",
      "electron-alternative",
      "cross-platform",
      "gui"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://tauri.app",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tauri.app/start/",
        "type": "docs"
      },
      {
        "label": "Tauri Quickstart",
        "url": "https://tauri.app/start/create-project/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "electron"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "svelte",
      "rust"
    ],
    "prerequisites": [
      "rust",
      "javascript"
    ],
    "stackIndicators": [
      "@tauri-apps/api",
      "@tauri-apps/cli"
    ]
  },
  {
    "id": "leptos",
    "name": "Leptos",
    "category": "frontend-framework",
    "difficulty": "intermediate",
    "description": "Full-stack, isomorphic WebAssembly web framework for Rust leveraging fine-grained reactivity.",
    "whyUseIt": "Builds full-stack web applications entirely in Rust compiled to WebAssembly with zero virtual DOM overhead.",
    "tags": [
      "leptos",
      "wasm",
      "webassembly",
      "rust",
      "frontend"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://leptos.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://leptos-rs.github.io/leptos/",
        "type": "docs"
      },
      {
        "label": "Leptos Book Tutorial",
        "url": "https://book.leptos.dev/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "yew"
    ],
    "worksWellWith": [
      "rust",
      "axum"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "leptos"
    ]
  },
  {
    "id": "tonic-grpc",
    "name": "Tonic",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "A native gRPC over HTTP/2 implementation focused on high performance, flexibility, and ergonomics in Rust.",
    "whyUseIt": "The production standard for microservice communication in Rust with compile-time Protocol Buffer code generation.",
    "tags": [
      "tonic",
      "grpc",
      "protobuf",
      "rpc",
      "microservices",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://github.com/hyperium/tonic",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/tonic/latest/tonic/",
        "type": "docs"
      },
      {
        "label": "Tonic Tutorial",
        "url": "https://github.com/hyperium/tonic/blob/master/examples/routeguide-tutorial.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tarpc"
    ],
    "worksWellWith": [
      "tokio",
      "prost"
    ],
    "prerequisites": [
      "rust",
      "protobuf"
    ],
    "stackIndicators": [
      "tonic"
    ]
  },
  {
    "id": "elysia",
    "name": "ElysiaJS",
    "category": "backend-framework",
    "difficulty": "beginner",
    "description": "Ergonomic web framework for Bun with end-to-end type safety, Unified Schema, and blazingly fast HTTP routing.",
    "whyUseIt": "Delivers 18x faster throughput than Express on the Bun runtime with instant TypeScript type inference for route handlers.",
    "tags": [
      "elysia",
      "bun",
      "fast",
      "type-safe",
      "backend",
      "api"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://elysiajs.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://elysiajs.com/essential/overview.html",
        "type": "docs"
      },
      {
        "label": "Quick Start Guide",
        "url": "https://elysiajs.com/at-glance.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "hono",
      "fastify"
    ],
    "worksWellWith": [
      "bun",
      "typescript"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "elysia"
    ]
  },
  {
    "id": "valibot",
    "name": "Valibot",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Modular and type-safe schema library for validating structural data with an ultra-small bundle footprint (<1KB).",
    "whyUseIt": "Up to 98% smaller bundle size than Zod via modular tree-shakeable functions, perfect for client-side forms and edge runtimes.",
    "tags": [
      "valibot",
      "validation",
      "schema",
      "type-safe",
      "tiny",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://valibot.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://valibot.dev/guides/introduction/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://valibot.dev/guides/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "zod",
      "arktype"
    ],
    "worksWellWith": [
      "react-hook-form",
      "typescript"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "valibot"
    ]
  },
  {
    "id": "arktype",
    "name": "ArkType",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "TypeScript runtime validation library with 1:1 syntax compatibility with TypeScript types and sub-microsecond validation.",
    "whyUseIt": "Validates 100x faster than Zod by compiling runtime validators into optimized JIT functions directly from type strings.",
    "tags": [
      "arktype",
      "validation",
      "type-safe",
      "fast",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://arktype.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://arktype.io/docs/",
        "type": "docs"
      },
      {
        "label": "Tutorial & Syntax",
        "url": "https://arktype.io/docs/intro",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "zod",
      "valibot"
    ],
    "worksWellWith": [
      "typescript"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "arktype"
    ]
  },
  {
    "id": "xstate",
    "name": "XState",
    "category": "state-management",
    "difficulty": "intermediate",
    "description": "Actor model and finite state machine library for orchestrating complex application logic and asynchronous flows.",
    "whyUseIt": "Eliminates impossible UI states and bugs by mathematically modeling application flows as formal statecharts.",
    "tags": [
      "xstate",
      "state-machine",
      "statecharts",
      "actors",
      "react",
      "typescript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://stately.ai/docs/xstate",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://stately.ai/docs/xstate",
        "type": "docs"
      },
      {
        "label": "XState Tutorial",
        "url": "https://stately.ai/docs/quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "zustand",
      "redux-toolkit"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "typescript"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "xstate"
    ]
  },
  {
    "id": "immer",
    "name": "Immer",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Create the next immutable state tree by simply modifying the current tree using standard JavaScript object mutations.",
    "whyUseIt": "Allows writing standard mutable code (state.user.name = \"Alice\") while safely producing strictly immutable state updates.",
    "tags": [
      "immer",
      "immutable",
      "state",
      "copy-on-write",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://immerjs.github.io/immer/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://immerjs.github.io/immer/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://immerjs.github.io/immer/example-setstate",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "immutable-js"
    ],
    "worksWellWith": [
      "redux-toolkit",
      "zustand",
      "react"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "immer"
    ]
  },
  {
    "id": "dayjs",
    "name": "Day.js",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Fast 2kB alternative to Moment.js with the same modern Moment-compatible API for parsing and formatting dates.",
    "whyUseIt": "Replaces bloated Moment.js with a tiny 2KB immutable library supporting formatting, relative time, and timezone plugins.",
    "tags": [
      "dayjs",
      "date",
      "time",
      "moment-alternative",
      "utility"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://day.js.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://day.js.org/docs/en/installation/installation",
        "type": "docs"
      },
      {
        "label": "Parse & Format Guide",
        "url": "https://day.js.org/docs/en/display/format",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "date-fns",
      "luxon"
    ],
    "worksWellWith": [
      "react",
      "typescript"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "dayjs"
    ]
  },
  {
    "id": "fusejs",
    "name": "Fuse.js",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Lightweight client-side fuzzy-search library with zero dependencies for filtering collections by approximate matches.",
    "whyUseIt": "Adds instant client-side autocomplete and typo-tolerant search across arrays of objects in less than 5KB.",
    "tags": [
      "fusejs",
      "search",
      "fuzzy-search",
      "filter",
      "autocomplete"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.fusejs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.fusejs.io/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://www.fusejs.io/getting-started/different-ways-that-fusejs-can-be-used.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "flexsearch"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "cmdk"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "fuse.js"
    ]
  },
  {
    "id": "tiptap",
    "name": "Tiptap",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "The headless, framework-agnostic rich text editor framework built on top of ProseMirror with full extension support.",
    "whyUseIt": "The modern standard for building Notion-style and Slack-style collaborative rich text editors in React, Vue, and vanilla JS.",
    "tags": [
      "tiptap",
      "rich-text",
      "editor",
      "wysiwyg",
      "prosemirror",
      "markdown"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tiptap.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tiptap.dev/docs/editor/introduction",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://tiptap.dev/docs/editor/getting-started/overview",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "lexical",
      "quill",
      "slate"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "tailwind-css"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "@tiptap/core",
      "@tiptap/react"
    ]
  },
  {
    "id": "lexical",
    "name": "Lexical",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "An extensible JavaScript web text-editor framework by Meta focused on reliability, accessibility, and performance.",
    "whyUseIt": "Powers Facebook and Instagram web text inputs with optimal DOM performance, accessible keyboard shortcuts, and plugins.",
    "tags": [
      "lexical",
      "editor",
      "meta",
      "react",
      "accessible"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://lexical.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://lexical.dev/docs/intro",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://lexical.dev/docs/getting-started/react",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tiptap",
      "slate"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "lexical",
      "@lexical/react"
    ]
  },
  {
    "id": "react-markdown",
    "name": "react-markdown",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Markdown component for React using remark that securely parses markdown into React elements without dangerouslySetInnerHTML.",
    "whyUseIt": "Safely renders Markdown and AI chat responses into native React components with code highlighting and GFM tables.",
    "tags": [
      "react-markdown",
      "markdown",
      "react",
      "remark",
      "gfm"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/remarkjs/react-markdown",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/remarkjs/react-markdown#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/remarkjs/react-markdown#use",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "mdx"
    ],
    "worksWellWith": [
      "remark-gfm",
      "rehype-highlight",
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "react-markdown"
    ]
  },
  {
    "id": "express-rate-limit",
    "name": "express-rate-limit",
    "category": "security",
    "difficulty": "beginner",
    "description": "Basic rate-limiting middleware for Express used to limit repeated requests to public APIs and endpoints.",
    "whyUseIt": "Protects login and API routes against brute-force attacks and denial-of-service abuse in 2 lines of middleware.",
    "tags": [
      "express-rate-limit",
      "rate-limit",
      "security",
      "express",
      "ddos"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://express-rate-limit.mintlify.app",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://express-rate-limit.mintlify.app/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://express-rate-limit.mintlify.app/quickstart/usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "rate-limiter-flexible"
    ],
    "worksWellWith": [
      "express",
      "helmet"
    ],
    "prerequisites": [
      "express"
    ],
    "stackIndicators": [
      "express-rate-limit"
    ]
  },
  {
    "id": "dompurify",
    "name": "DOMPurify",
    "category": "security",
    "difficulty": "beginner",
    "description": "DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG in the browser and Node.js.",
    "whyUseIt": "Strips malicious script tags, onerror payloads, and JavaScript URIs from user-submitted HTML to prevent XSS attacks.",
    "tags": [
      "dompurify",
      "xss",
      "sanitization",
      "security",
      "html"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/cure53/DOMPurify",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/cure53/DOMPurify#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/cure53/DOMPurify#how-do-i-use-it",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sanitize-html"
    ],
    "worksWellWith": [
      "react",
      "vue",
      "nodejs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "dompurify"
    ]
  },
  {
    "id": "jsonwebtoken",
    "name": "jsonwebtoken",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "An implementation of JSON Web Tokens (JWT) for Node.js to sign and verify claims securely.",
    "whyUseIt": "Industry standard for stateless user authentication, session verification, and bearer tokens in Node.js APIs.",
    "tags": [
      "jwt",
      "jsonwebtoken",
      "auth",
      "tokens",
      "security",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/auth0/node-jsonwebtoken",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/auth0/node-jsonwebtoken#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/auth0/node-jsonwebtoken#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "jose"
    ],
    "worksWellWith": [
      "express",
      "passport",
      "bcrypt"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "jsonwebtoken"
    ]
  },
  {
    "id": "argon2",
    "name": "Argon2",
    "category": "security",
    "difficulty": "beginner",
    "description": "An Node.js binding for Argon2, the password-hashing algorithm that won the Password Hashing Competition.",
    "whyUseIt": "Provides the highest standard of password hashing resistance against GPU-accelerated cracking and ASIC attacks.",
    "tags": [
      "argon2",
      "passwords",
      "hash",
      "crypto",
      "security"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/ranisalt/node-argon2",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/ranisalt/node-argon2#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/ranisalt/node-argon2#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "bcrypt"
    ],
    "worksWellWith": [
      "express",
      "passport"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "argon2"
    ]
  },
  {
    "id": "react-dropzone",
    "name": "react-dropzone",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Simple React hook to create HTML5-compliant drag’n’drop zones for file uploads with MIME filtering.",
    "whyUseIt": "Handles drag-and-drop file upload UX in React with visual active states, file size limits, and multi-file queues.",
    "tags": [
      "react-dropzone",
      "file-upload",
      "drag-and-drop",
      "react",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://react-dropzone.js.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://react-dropzone.js.org/",
        "type": "docs"
      },
      {
        "label": "Basic Examples",
        "url": "https://react-dropzone.js.org/#section-basic-example",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "uppy"
    ],
    "worksWellWith": [
      "react",
      "tailwind-css"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "react-dropzone"
    ]
  },
  {
    "id": "fast-glob",
    "name": "fast-glob",
    "category": "utility",
    "difficulty": "beginner",
    "description": "It is a very fast and efficient glob library for Node.js to match file paths using wildcard patterns.",
    "whyUseIt": "Scans thousands of directory paths matching patterns like **/*.ts in milliseconds without blocking the event loop.",
    "tags": [
      "fast-glob",
      "glob",
      "files",
      "filesystem",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/mrmlnc/fast-glob",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/mrmlnc/fast-glob#readme",
        "type": "docs"
      },
      {
        "label": "API Reference",
        "url": "https://github.com/mrmlnc/fast-glob#api",
        "type": "docs"
      }
    ],
    "alternatives": [
      "glob"
    ],
    "worksWellWith": [
      "nodejs",
      "typescript"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "fast-glob"
    ]
  },
  {
    "id": "execa",
    "name": "Execa",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Process execution for Node.js built on top of child_process with promise support and clean error outputs.",
    "whyUseIt": "Executes terminal commands and CLI scripts from Node.js with automated piping, timeouts, and structured error reporting.",
    "tags": [
      "execa",
      "child-process",
      "cli",
      "process",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/sindresorhus/execa",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/sindresorhus/execa#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/sindresorhus/execa#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "child_process"
    ],
    "worksWellWith": [
      "nodejs"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "execa"
    ]
  },
  {
    "id": "chokidar",
    "name": "Chokidar",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Minimal and efficient cross-platform file watching library for Node.js wrapping fs.watch and fs.watchFile.",
    "whyUseIt": "Powers Vite, Webpack, and Karma hot-reloading by reliably watching filesystem changes across OS platforms.",
    "tags": [
      "chokidar",
      "file-watcher",
      "watch",
      "hot-reload",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/paulmillr/chokidar",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/paulmillr/chokidar#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/paulmillr/chokidar#getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "fs.watch"
    ],
    "worksWellWith": [
      "vite",
      "nodejs"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "chokidar"
    ]
  },
  {
    "id": "commitlint",
    "name": "commitlint",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Lint commit messages to ensure they adhere to Conventional Commits standards (feat:, fix:, docs:).",
    "whyUseIt": "Guarantees clean, standardized Git history across teams and enables automatic changelog generation.",
    "tags": [
      "commitlint",
      "git",
      "commits",
      "conventional-commits",
      "tooling"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://commitlint.js.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://commitlint.js.org/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://commitlint.js.org/guides/getting-started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "cz-cli"
    ],
    "worksWellWith": [
      "husky",
      "semantic-release"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "@commitlint/cli",
      "@commitlint/config-conventional"
    ]
  },
  {
    "id": "changesets",
    "name": "Changesets",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "A tool to manage versioning and changelogs with a focus on multi-package monorepositories.",
    "whyUseIt": "The monorepo standard for versioning: allows each PR to declare its version impact and automates package publishing.",
    "tags": [
      "changesets",
      "versioning",
      "monorepo",
      "changelog",
      "npm-publish"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/changesets/changesets",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/changesets/changesets#readme",
        "type": "docs"
      },
      {
        "label": "Introduction Guide",
        "url": "https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "semantic-release",
      "lerna"
    ],
    "worksWellWith": [
      "pnpm",
      "turborepo",
      "github-actions"
    ],
    "prerequisites": [
      "monorepo"
    ],
    "stackIndicators": [
      "@changesets/cli"
    ]
  },
  {
    "id": "loguru",
    "name": "Loguru",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Python logging library that aims to bring enjoyable logging by providing zero-boilerplate handlers.",
    "whyUseIt": "Replaces confusing Python standard logging setup with intuitive colored output, automatic file rotation, and backtraces.",
    "tags": [
      "loguru",
      "logging",
      "logger",
      "python",
      "developer-experience"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/Delgan/loguru",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://loguru.readthedocs.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://loguru.readthedocs.io/en/stable/overview.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "structlog",
      "logging"
    ],
    "worksWellWith": [
      "fastapi",
      "rich"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "loguru"
    ]
  },
  {
    "id": "tenacity",
    "name": "Tenacity",
    "category": "utility",
    "difficulty": "beginner",
    "description": "General-purpose retrying library in Python to simplify the task of adding retry behavior to anything.",
    "whyUseIt": "Decorates functions with robust exponential backoff, retry conditions, and jitter to handle transient network errors.",
    "tags": [
      "tenacity",
      "retry",
      "resilience",
      "backoff",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://tenacity.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tenacity.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://tenacity.readthedocs.io/en/latest/#basic-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "retrying"
    ],
    "worksWellWith": [
      "httpx",
      "requests"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "tenacity"
    ]
  },
  {
    "id": "orjson",
    "name": "orjson",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Fast, correct Python JSON library backing serialization of dataclasses, datetimes, and numpy arrays.",
    "whyUseIt": "Serializes and deserializes JSON up to 6x faster than standard json and ujson, natively handling UUIDs and datetimes.",
    "tags": [
      "orjson",
      "json",
      "fast",
      "serialization",
      "python",
      "rust"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/ijl/orjson",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/ijl/orjson#readme",
        "type": "docs"
      },
      {
        "label": "Quick Reference",
        "url": "https://github.com/ijl/orjson#quickstart",
        "type": "docs"
      }
    ],
    "alternatives": [
      "ujson",
      "json"
    ],
    "worksWellWith": [
      "fastapi",
      "pydantic"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "orjson"
    ]
  },
  {
    "id": "motor",
    "name": "Motor",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Asynchronous Python driver for MongoDB designed specifically for asyncio and Tornado web frameworks.",
    "whyUseIt": "The official async MongoDB driver for Python, non-blocking and ideal for high-concurrency FastAPI applications.",
    "tags": [
      "motor",
      "mongodb",
      "async",
      "database",
      "nosql",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://motor.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://motor.readthedocs.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "Tutorial with asyncio",
        "url": "https://motor.readthedocs.io/en/stable/tutorial-asyncio.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pymongo"
    ],
    "worksWellWith": [
      "fastapi",
      "mongodb"
    ],
    "prerequisites": [
      "python",
      "mongodb"
    ],
    "stackIndicators": [
      "motor"
    ]
  },
  {
    "id": "pymongo",
    "name": "PyMongo",
    "category": "database",
    "difficulty": "beginner",
    "description": "The official Python distribution containing tools for interacting with MongoDB database server.",
    "whyUseIt": "Standard synchronous driver for MongoDB with comprehensive aggregation pipeline builders and BSON handling.",
    "tags": [
      "pymongo",
      "mongodb",
      "database",
      "nosql",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pymongo.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pymongo.readthedocs.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "PyMongo Tutorial",
        "url": "https://pymongo.readthedocs.io/en/stable/tutorial.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "motor"
    ],
    "worksWellWith": [
      "django",
      "flask",
      "mongodb"
    ],
    "prerequisites": [
      "python",
      "mongodb"
    ],
    "stackIndicators": [
      "pymongo"
    ]
  },
  {
    "id": "strawberry-graphql",
    "name": "Strawberry GraphQL",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "Python GraphQL library based on standard dataclasses and type hints with code-first schema generation.",
    "whyUseIt": "Creates typed GraphQL APIs in Python without schema duplicate boilerplate using native Python dataclasses.",
    "tags": [
      "strawberry",
      "graphql",
      "api",
      "dataclasses",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://strawberry.rocks",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://strawberry.rocks/docs",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://strawberry.rocks/docs/general/quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "graphene"
    ],
    "worksWellWith": [
      "fastapi",
      "django"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "strawberry-graphql"
    ]
  },
  {
    "id": "pytest-asyncio",
    "name": "pytest-asyncio",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Pytest support for asyncio, allowing tests to be coroutines and providing async fixtures.",
    "whyUseIt": "Enables writing async def test functions and async fixtures seamlessly in Pytest without manual loop management.",
    "tags": [
      "pytest-asyncio",
      "testing",
      "async",
      "pytest",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pytest-asyncio.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pytest-asyncio.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://pytest-asyncio.readthedocs.io/en/latest/how-to-guides/run_session_tests.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "anyio"
    ],
    "worksWellWith": [
      "pytest",
      "httpx",
      "fastapi"
    ],
    "prerequisites": [
      "python",
      "pytest"
    ],
    "stackIndicators": [
      "pytest-asyncio"
    ]
  },
  {
    "id": "hypothesis-py",
    "name": "Hypothesis",
    "category": "testing",
    "difficulty": "advanced",
    "description": "Advanced property-based testing library for Python that finds edge cases by automatically generating hostile inputs.",
    "whyUseIt": "Discovers subtle bugs and security edge cases that humans forget by automatically generating hundreds of test inputs.",
    "tags": [
      "hypothesis",
      "property-based-testing",
      "fuzzing",
      "testing",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://hypothesis.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://hypothesis.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://hypothesis.readthedocs.io/en/latest/quickstart.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pytest"
    ],
    "worksWellWith": [
      "pytest",
      "pydantic"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "hypothesis"
    ]
  },
  {
    "id": "mkdocs",
    "name": "MkDocs",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Fast, simple project documentation generator written in Python that builds static HTML from Markdown files.",
    "whyUseIt": "Creates beautiful documentation websites (like Material for MkDocs) in minutes with hot-reloading and search.",
    "tags": [
      "mkdocs",
      "documentation",
      "markdown",
      "static-site",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.mkdocs.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.mkdocs.org/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://www.mkdocs.org/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sphinx",
      "docusaurus"
    ],
    "worksWellWith": [
      "markdown",
      "github-pages"
    ],
    "prerequisites": [
      "markdown"
    ],
    "stackIndicators": [
      "mkdocs",
      "mkdocs-material"
    ]
  },
  {
    "id": "tamagui",
    "name": "Tamagui",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Style system and component suite for React Native and Web with an optimizing compiler.",
    "whyUseIt": "Delivers zero-runtime compiled CSS styles for web and typed React Native components with responsive themes.",
    "tags": [
      "tamagui",
      "ui",
      "components",
      "react-native",
      "web",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://tamagui.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tamagui.dev/docs/intro/introduction",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://tamagui.dev/docs/intro/installation",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nativewind"
    ],
    "worksWellWith": [
      "react-native",
      "expo",
      "nextjs"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "tamagui"
    ]
  },
  {
    "id": "react-native-svg",
    "name": "react-native-svg",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "SVG library for React Native providing SVG support on iOS, Android, and macOS.",
    "whyUseIt": "The universal standard for rendering vector icons, logos, and custom SVG paths in native mobile apps.",
    "tags": [
      "react-native-svg",
      "svg",
      "graphics",
      "icons",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/software-mansion/react-native-svg",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/software-mansion/react-native-svg#readme",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://github.com/software-mansion/react-native-svg#getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native-vector-icons"
    ],
    "worksWellWith": [
      "expo",
      "react-native"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-svg"
    ]
  },
  {
    "id": "dio-flutter",
    "name": "Dio",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "A powerful HTTP networking package for Dart/Flutter supporting Interceptors, Global configuration, and FormData.",
    "whyUseIt": "The premier HTTP client for Flutter apps featuring request interceptors, file download progress, and request cancellation.",
    "tags": [
      "dio",
      "http",
      "client",
      "flutter",
      "dart",
      "networking",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/dio",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/dio",
        "type": "docs"
      },
      {
        "label": "Dio Getting Started",
        "url": "https://github.com/cfug/dio/blob/main/dio/README.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "http-dart"
    ],
    "worksWellWith": [
      "flutter",
      "flutter-bloc"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "dio"
    ]
  },
  {
    "id": "sqflite-flutter",
    "name": "sqflite",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "SQLite plugin for Flutter supporting transactions, batches, and automatic schema version migration.",
    "whyUseIt": "Reliable embedded relational database engine for offline-first Flutter applications on iOS and Android.",
    "tags": [
      "sqflite",
      "sqlite",
      "database",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/sqflite",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/sqflite",
        "type": "docs"
      },
      {
        "label": "Flutter SQLite Tutorial",
        "url": "https://docs.flutter.dev/cookbook/persistence/sqlite",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "hive-flutter"
    ],
    "worksWellWith": [
      "flutter"
    ],
    "prerequisites": [
      "flutter",
      "sql"
    ],
    "stackIndicators": [
      "sqflite"
    ]
  },
  {
    "id": "sqlc-go",
    "name": "sqlc",
    "category": "orm",
    "difficulty": "intermediate",
    "description": "Compiles SQL queries into type-safe Go code with zero reflection and zero boilerplate.",
    "whyUseIt": "Write pure SQL queries and let sqlc generate 100% type-safe Go structs and database methods automatically.",
    "tags": [
      "sqlc",
      "sql",
      "type-safe",
      "database",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://sqlc.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.sqlc.dev/en/stable/",
        "type": "docs"
      },
      {
        "label": "Getting Started with Go",
        "url": "https://docs.sqlc.dev/en/stable/tutorials/getting-started-postgresql.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gorm",
      "ent-go"
    ],
    "worksWellWith": [
      "pgx",
      "postgresql",
      "go"
    ],
    "prerequisites": [
      "go",
      "sql"
    ],
    "stackIndicators": [
      "github.com/sqlc-dev/sqlc"
    ]
  },
  {
    "id": "ent-go",
    "name": "Ent",
    "category": "orm",
    "difficulty": "advanced",
    "description": "An entity framework for Go that makes it easy to build and maintain applications with large data-models.",
    "whyUseIt": "Schema-as-code entity framework from Meta providing type-safe graph traversals and declarative migrations.",
    "tags": [
      "ent",
      "orm",
      "graph",
      "database",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://entgo.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://entgo.io/docs/getting-started/",
        "type": "docs"
      },
      {
        "label": "Ent Quick Start",
        "url": "https://entgo.io/docs/quick-walkthrough",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "gorm",
      "sqlc-go"
    ],
    "worksWellWith": [
      "go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "entgo.io/ent"
    ]
  },
  {
    "id": "go-redis-pkg",
    "name": "go-redis",
    "category": "database",
    "difficulty": "beginner",
    "description": "Redis client for Golang supporting Redis Sentinel, Cluster, and pipelined transactions.",
    "whyUseIt": "The definitive Redis client in the Go ecosystem featuring connection pooling, pub/sub, and streaming.",
    "tags": [
      "go-redis",
      "redis",
      "cache",
      "key-value",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://redis.uptrace.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://redis.uptrace.dev/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://redis.uptrace.dev/guide/go-redis.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "redigo"
    ],
    "worksWellWith": [
      "gin",
      "echo-go"
    ],
    "prerequisites": [
      "go",
      "redis"
    ],
    "stackIndicators": [
      "github.com/redis/go-redis/v9"
    ]
  },
  {
    "id": "temporal-go",
    "name": "Temporal Go SDK",
    "category": "utility",
    "difficulty": "advanced",
    "description": "Resilient durable execution platform to build fault-tolerant, stateful microservice workflows.",
    "whyUseIt": "Write mission-critical async workflows in standard Go code that survive server restarts, network crashes, and timeouts.",
    "tags": [
      "temporal",
      "workflows",
      "orchestration",
      "microservices",
      "distributed",
      "go"
    ],
    "ecosystem": "go",
    "officialUrl": "https://temporal.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.temporal.io/dev-guide/go",
        "type": "docs"
      },
      {
        "label": "Go SDK Quickstart",
        "url": "https://learn.temporal.io/getting_started/go/hello_world_in_go/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "cadence",
      "asynq"
    ],
    "worksWellWith": [
      "go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "go.temporal.io/sdk"
    ]
  },
  {
    "id": "rayon-rust",
    "name": "Rayon",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Data-parallelism library for Rust making it extremely easy to convert sequential computations into parallel.",
    "whyUseIt": "Converts single-threaded Rust iterators into parallel work-stealing multi-core iterators with par_iter() in 1 line.",
    "tags": [
      "rayon",
      "concurrency",
      "parallel",
      "multithreading",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/rayon",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/rayon/latest/rayon/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://github.com/rayon-rs/rayon#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "crossbeam"
    ],
    "worksWellWith": [
      "rust"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "rayon"
    ]
  },
  {
    "id": "crossbeam-rust",
    "name": "Crossbeam",
    "category": "utility",
    "difficulty": "advanced",
    "description": "Tools for concurrent programming in Rust, providing lock-free data structures, channels, and epoch-based memory reclamation.",
    "whyUseIt": "Provides ultra-high performance lock-free queues, multi-producer multi-consumer channels, and scoped threads.",
    "tags": [
      "crossbeam",
      "lock-free",
      "concurrency",
      "multithreading",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/crossbeam",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/crossbeam/latest/crossbeam/",
        "type": "docs"
      },
      {
        "label": "Crossbeam Guide",
        "url": "https://github.com/crossbeam-rs/crossbeam#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "parking_lot"
    ],
    "worksWellWith": [
      "tokio",
      "rayon-rust"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "crossbeam"
    ]
  },
  {
    "id": "chrono-rust",
    "name": "Chrono",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Date and time library for Rust with full timezone awareness, ISO 8601 parsing, and formatting.",
    "whyUseIt": "The standard Rust crate for handling timestamps, calendar dates, intervals, and UTC time calculations safely.",
    "tags": [
      "chrono",
      "datetime",
      "time",
      "timezone",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/chrono",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/chrono/latest/chrono/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://github.com/chronotope/chrono#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "time-rust"
    ],
    "worksWellWith": [
      "serde",
      "tokio"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "chrono"
    ]
  },
  {
    "id": "spring-security",
    "name": "Spring Security",
    "category": "authentication",
    "difficulty": "intermediate",
    "description": "Powerful and highly customizable authentication and access-control framework for Spring applications.",
    "whyUseIt": "Enterprise standard authentication layer in Java supporting OAuth2, JWT, CSRF protection, and role authorization.",
    "tags": [
      "spring-security",
      "auth",
      "security",
      "oauth2",
      "jwt",
      "spring",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://spring.io/projects/spring-security",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.spring.io/spring-security/reference/index.html",
        "type": "docs"
      },
      {
        "label": "Spring Security Tutorial",
        "url": "https://spring.io/guides/gs/securing-web/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "apache-shiro"
    ],
    "worksWellWith": [
      "spring-boot",
      "hibernate"
    ],
    "prerequisites": [
      "java",
      "spring-boot"
    ],
    "stackIndicators": [
      "spring-boot-starter-security"
    ]
  },
  {
    "id": "spring-data-jpa",
    "name": "Spring Data JPA",
    "category": "orm",
    "difficulty": "beginner",
    "description": "Simplifies database repository creation by writing interface methods without boilerplate SQL implementations.",
    "whyUseIt": "Generates complex SQL queries automatically from method names (findByEmailAndActive) with built-in pagination.",
    "tags": [
      "spring-data",
      "jpa",
      "orm",
      "database",
      "spring-boot",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://spring.io/projects/spring-data-jpa",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.spring.io/spring-data/jpa/reference/",
        "type": "docs"
      },
      {
        "label": "Spring Data JPA Guide",
        "url": "https://spring.io/guides/gs/accessing-data-jpa/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "hibernate",
      "jooq"
    ],
    "worksWellWith": [
      "spring-boot",
      "postgresql"
    ],
    "prerequisites": [
      "java",
      "spring-boot"
    ],
    "stackIndicators": [
      "spring-boot-starter-data-jpa"
    ]
  },
  {
    "id": "lombok",
    "name": "Project Lombok",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Java library that automatically plugs into your editor and build tool, spicing up your java with automated getters/setters.",
    "whyUseIt": "Eliminates 70% of boilerplate Java code using annotations like @Data, @Builder, and @AllArgsConstructor.",
    "tags": [
      "lombok",
      "boilerplate",
      "annotations",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://projectlombok.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://projectlombok.org/features/",
        "type": "docs"
      },
      {
        "label": "Setup Guide",
        "url": "https://projectlombok.org/setup/overview",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "records"
    ],
    "worksWellWith": [
      "spring-boot",
      "java"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "org.projectlombok:lombok"
    ]
  },
  {
    "id": "kotlinx-coroutines",
    "name": "Kotlin Coroutines",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Library support for Kotlin coroutines with runBlocking, Flow, and async primitives for structured concurrency.",
    "whyUseIt": "Write asynchronous, non-blocking code in Kotlin that reads sequentially with structured lifecycle cancellation.",
    "tags": [
      "coroutines",
      "async",
      "kotlin",
      "flow",
      "concurrency",
      "android"
    ],
    "ecosystem": "java",
    "officialUrl": "https://kotlinlang.org/docs/coroutines-overview.html",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://kotlinlang.org/docs/coroutines-guide.html",
        "type": "docs"
      },
      {
        "label": "Coroutines Tutorial",
        "url": "https://kotlinlang.org/docs/coroutines-basics.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "rxjava"
    ],
    "worksWellWith": [
      "ktor",
      "spring-boot",
      "android"
    ],
    "prerequisites": [
      "kotlin"
    ],
    "stackIndicators": [
      "kotlinx-coroutines-core"
    ]
  },
  {
    "id": "knip",
    "name": "Knip",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Finds unused files, unused dependencies, and unused exports in TypeScript and JavaScript projects.",
    "whyUseIt": "Cleans up code rot by identifying dead code, unreferenced NPM packages, and dangling type exports automatically.",
    "tags": [
      "knip",
      "dead-code",
      "unused-files",
      "clean-code",
      "typescript",
      "tooling"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://knip.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://knip.dev/overview/getting-started",
        "type": "docs"
      },
      {
        "label": "Quick Start Guide",
        "url": "https://knip.dev/overview/getting-started#quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "depcheck",
      "ts-prune"
    ],
    "worksWellWith": [
      "typescript",
      "eslint"
    ],
    "prerequisites": [
      "typescript"
    ],
    "stackIndicators": [
      "knip"
    ]
  },
  {
    "id": "node-cron",
    "name": "node-cron",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Pure JavaScript cron job scheduler for Node.js based on GNU crontab syntax.",
    "whyUseIt": "Schedules recurring background tasks and daily cron maintenance jobs in Node.js in 4 lines of code.",
    "tags": [
      "node-cron",
      "cron",
      "scheduler",
      "jobs",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/kelektiv/node-cron",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/kelektiv/node-cron#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/kelektiv/node-cron#basic-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "bullmq",
      "agenda"
    ],
    "worksWellWith": [
      "express",
      "nestjs"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "node-cron"
    ]
  },
  {
    "id": "piscina",
    "name": "Piscina",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Fast, efficient Node.js worker thread pool implementation with minimal overhead and cancellation support.",
    "whyUseIt": "Executes CPU-intensive tasks (image processing, crypto, heavy parsing) on background worker threads without blocking Node event loop.",
    "tags": [
      "piscina",
      "worker-threads",
      "multithreading",
      "cpu",
      "performance",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/piscinajs/piscina",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/piscinajs/piscina#readme",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://github.com/piscinajs/piscina#quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "workerpool"
    ],
    "worksWellWith": [
      "nodejs"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "piscina"
    ]
  },
  {
    "id": "semantic-release-pkg",
    "name": "semantic-release",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Fully automated version management and package publishing determined by commit messages.",
    "whyUseIt": "Automates semantic version bumping, CHANGELOG generation, git tag creation, and NPM publishing in CI/CD.",
    "tags": [
      "semantic-release",
      "versioning",
      "automation",
      "npm-publish",
      "ci-cd"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://semantic-release.gitbook.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://semantic-release.gitbook.io/semantic-release",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://semantic-release.gitbook.io/semantic-release/usage/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "changesets"
    ],
    "worksWellWith": [
      "github-actions",
      "commitlint"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "semantic-release"
    ]
  },
  {
    "id": "pydantic-settings",
    "name": "pydantic-settings",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Settings management using Pydantic, reading configuration from environment variables, dotenv files, and secrets.",
    "whyUseIt": "Loads application configuration from ENV variables and .env files with automatic type casting and Pydantic validation.",
    "tags": [
      "pydantic-settings",
      "config",
      "environment",
      "dotenv",
      "python",
      "fastapi"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "python-dotenv"
    ],
    "worksWellWith": [
      "pydantic",
      "fastapi"
    ],
    "prerequisites": [
      "python",
      "pydantic"
    ],
    "stackIndicators": [
      "pydantic-settings"
    ]
  },
  {
    "id": "apscheduler",
    "name": "APScheduler",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "In-process task scheduling library for Python that lets you schedule Python code to be executed periodically or at specific times.",
    "whyUseIt": "Lightweight cron scheduler running directly inside your Python process without requiring an external Redis or Celery worker.",
    "tags": [
      "apscheduler",
      "cron",
      "scheduler",
      "async",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://apscheduler.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://apscheduler.readthedocs.io/en/master/",
        "type": "docs"
      },
      {
        "label": "User Guide",
        "url": "https://apscheduler.readthedocs.io/en/master/userguide.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "celery",
      "rq"
    ],
    "worksWellWith": [
      "fastapi",
      "flask"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "apscheduler"
    ]
  },
  {
    "id": "slowapi",
    "name": "SlowAPI",
    "category": "security",
    "difficulty": "beginner",
    "description": "A rate limiting library for Starlette and FastAPI applications based on the limits Python package.",
    "whyUseIt": "Adds IP-based and user-based API rate limiting decorators directly to FastAPI routes to prevent endpoint abuse.",
    "tags": [
      "slowapi",
      "rate-limit",
      "fastapi",
      "security",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://slowapi.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://slowapi.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://slowapi.readthedocs.io/en/latest/#quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "limits"
    ],
    "worksWellWith": [
      "fastapi",
      "redis"
    ],
    "prerequisites": [
      "python",
      "fastapi"
    ],
    "stackIndicators": [
      "slowapi"
    ]
  },
  {
    "id": "beanie",
    "name": "Beanie",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Asynchronous Object-Document Mapper (ODM) for MongoDB based on Motor and Pydantic.",
    "whyUseIt": "Type-safe async MongoDB models in Python that combine Pydantic validation directly with native MongoDB collections.",
    "tags": [
      "beanie",
      "mongodb",
      "odm",
      "pydantic",
      "async",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://beanie-odm.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://beanie-odm.dev/",
        "type": "docs"
      },
      {
        "label": "Tutorial Guide",
        "url": "https://beanie-odm.dev/tutorial/defining-a-document/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "motor",
      "mongoengine"
    ],
    "worksWellWith": [
      "fastapi",
      "pydantic",
      "motor"
    ],
    "prerequisites": [
      "python",
      "mongodb"
    ],
    "stackIndicators": [
      "beanie"
    ]
  },
  {
    "id": "dramatiq",
    "name": "Dramatiq",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "A fast and reliable background task processing library for Python with an actor-based architecture.",
    "whyUseIt": "A modern, simpler alternative to Celery with lower resource consumption, thread workers, and reliable message brokers.",
    "tags": [
      "dramatiq",
      "tasks",
      "queue",
      "redis",
      "rabbitmq",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://dramatiq.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://dramatiq.io/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://dramatiq.io/guide.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "celery",
      "rq"
    ],
    "worksWellWith": [
      "redis",
      "rabbitmq",
      "fastapi"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "dramatiq"
    ]
  },
  {
    "id": "structlog",
    "name": "structlog",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Structured Logging for Python that makes logs machine-readable and developer-friendly.",
    "whyUseIt": "Turns unstructured string print logs into structured JSON key-value events with automated context binding.",
    "tags": [
      "structlog",
      "logging",
      "json-logging",
      "observability",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.structlog.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.structlog.org/en/stable/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://www.structlog.org/en/stable/getting-started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "loguru"
    ],
    "worksWellWith": [
      "fastapi",
      "django"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "structlog"
    ]
  },
  {
    "id": "cryptography-py",
    "name": "cryptography",
    "category": "security",
    "difficulty": "intermediate",
    "description": "A package designed to expose cryptographic primitives and recipes to Python developers.",
    "whyUseIt": "The standard cryptographic engine in Python providing AES encryption, RSA keys, X.509 certificates, and SHA hashing.",
    "tags": [
      "cryptography",
      "security",
      "encryption",
      "aes",
      "rsa",
      "crypto",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://cryptography.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://cryptography.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Fernet Encryption Tutorial",
        "url": "https://cryptography.io/en/latest/fernet/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pycryptodome"
    ],
    "worksWellWith": [
      "python"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "cryptography"
    ]
  },
  {
    "id": "passlib",
    "name": "Passlib",
    "category": "security",
    "difficulty": "beginner",
    "description": "Comprehensive password hashing framework for Python supporting over 30 password hash algorithms.",
    "whyUseIt": "Safely hashes passwords with modern algorithms (Bcrypt, Argon2, PBKDF2) with automatic salt generation.",
    "tags": [
      "passlib",
      "passwords",
      "hash",
      "bcrypt",
      "argon2",
      "security",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://passlib.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://passlib.readthedocs.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://passlib.readthedocs.io/en/stable/narr/quickstart.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "bcrypt"
    ],
    "worksWellWith": [
      "fastapi",
      "bcrypt"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "passlib"
    ]
  },
  {
    "id": "locust-load",
    "name": "Locust",
    "category": "testing",
    "difficulty": "beginner",
    "description": "An easy to use, scriptable and scalable performance testing tool for HTTP and systems in Python.",
    "whyUseIt": "Define realistic user load testing behaviors using standard Python code, complete with real-time web UI graphs.",
    "tags": [
      "locust",
      "load-testing",
      "performance",
      "benchmarking",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://locust.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.locust.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "Quickstart Tutorial",
        "url": "https://docs.locust.io/en/stable/quickstart.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "k6",
      "artillery"
    ],
    "worksWellWith": [
      "python",
      "fastapi"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "locust"
    ]
  },
  {
    "id": "jupyterlab",
    "name": "JupyterLab",
    "category": "utility",
    "difficulty": "beginner",
    "description": "The latest web-based interactive development environment for notebooks, code, and data.",
    "whyUseIt": "The quintessential notebook workspace for interactive data exploration, machine learning experiments, and visualization.",
    "tags": [
      "jupyter",
      "jupyterlab",
      "notebooks",
      "data-science",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://jupyterlab.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://jupyterlab.readthedocs.io/en/stable/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://jupyterlab.readthedocs.io/en/stable/getting_started/overview.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "google-colab",
      "marimo"
    ],
    "worksWellWith": [
      "pandas",
      "numpy",
      "matplotlib"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "jupyterlab",
      "notebook"
    ]
  },
  {
    "id": "networkx",
    "name": "NetworkX",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Python package for the creation, manipulation, and study of the structure, dynamics, and functions of complex networks.",
    "whyUseIt": "Provides graph data structures and graph algorithms (shortest path, centrality, clustering) for connected data.",
    "tags": [
      "networkx",
      "graphs",
      "network-analysis",
      "algorithms",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://networkx.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://networkx.org/documentation/stable/",
        "type": "docs"
      },
      {
        "label": "NetworkX Tutorial",
        "url": "https://networkx.org/documentation/stable/tutorial.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "igraph"
    ],
    "worksWellWith": [
      "matplotlib",
      "scipy",
      "numpy"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "networkx"
    ]
  },
  {
    "id": "react-native-keychain",
    "name": "react-native-keychain",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Keychain and Keystore access for React Native applications providing secure hardware-backed credential storage.",
    "whyUseIt": "Safely stores access tokens, passwords, and biometric auth keys in iOS Keychain and Android Keystore.",
    "tags": [
      "keychain",
      "security",
      "keystore",
      "tokens",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/oblador/react-native-keychain",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/oblador/react-native-keychain#readme",
        "type": "docs"
      },
      {
        "label": "Basic Usage Guide",
        "url": "https://github.com/oblador/react-native-keychain#basic-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "expo-secure-store"
    ],
    "worksWellWith": [
      "react-native",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-keychain"
    ]
  },
  {
    "id": "react-native-gesture-handler",
    "name": "React Native Gesture Handler",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Declarative native gesture management system for React Native executing on native UI touch threads.",
    "whyUseIt": "Replaces React Native touch responder with high-performance native pan, pinch, swipe, and fling gesture detectors.",
    "tags": [
      "gesture-handler",
      "gestures",
      "touch",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://docs.swmansion.com/react-native-gesture-handler/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.swmansion.com/react-native-gesture-handler/docs/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "panresponder"
    ],
    "worksWellWith": [
      "react-native-reanimated",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-gesture-handler"
    ]
  },
  {
    "id": "flutter-secure-storage",
    "name": "flutter_secure_storage",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Flutter plugin to store data in secure storage: Keychain for iOS and AES-encrypted KeyStore for Android.",
    "whyUseIt": "Protects user auth tokens and sensitive app secrets on mobile devices using native hardware security modules.",
    "tags": [
      "secure-storage",
      "keychain",
      "flutter",
      "dart",
      "security",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/flutter_secure_storage",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/flutter_secure_storage",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/mogol/flutter_secure_storage#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "shared-preferences"
    ],
    "worksWellWith": [
      "flutter"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "flutter_secure_storage"
    ]
  },
  {
    "id": "go-router-flutter",
    "name": "go_router",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "A declarative routing package for Flutter that uses the Router API to provide a convenient, URL-based API.",
    "whyUseIt": "The official declarative routing standard for Flutter apps supporting deep links, route guards, and nested navigation.",
    "tags": [
      "go-router",
      "routing",
      "navigation",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/go_router",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/go_router",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.flutter.dev/ui/navigation",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "auto-route"
    ],
    "worksWellWith": [
      "flutter",
      "flutter-bloc"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "go_router"
    ]
  },
  {
    "id": "hive-flutter",
    "name": "hive",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Lightweight and blazing fast key-value database written in pure Dart with zero native dependencies.",
    "whyUseIt": "Instant synchronous data reads/writes in Flutter without SQLite overhead, ideal for caching and offline settings.",
    "tags": [
      "hive",
      "nosql",
      "key-value",
      "database",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/hive",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.hivedb.dev/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.hivedb.dev/#/basics/boxes",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sqflite-flutter"
    ],
    "worksWellWith": [
      "flutter"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "hive",
      "hive_flutter"
    ]
  },
  {
    "id": "tower-rust",
    "name": "Tower",
    "category": "utility",
    "difficulty": "advanced",
    "description": "A library of modular and reusable components for building robust networking clients and servers in Rust.",
    "whyUseIt": "Provides composable Service and Layer abstractions for rate limiting, load balancing, timeouts, and middleware in Rust.",
    "tags": [
      "tower",
      "middleware",
      "networking",
      "http",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/tower",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/tower/latest/tower/",
        "type": "docs"
      },
      {
        "label": "Tower Guide",
        "url": "https://github.com/tower-rs/tower#readme",
        "type": "docs"
      }
    ],
    "alternatives": [
      "hyper"
    ],
    "worksWellWith": [
      "axum",
      "tokio",
      "tonic-grpc"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "tower"
    ]
  },
  {
    "id": "wasm-bindgen",
    "name": "wasm-bindgen",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Facilitating high-level interactions between WebAssembly modules and JavaScript in Rust.",
    "whyUseIt": "The bridge crate allowing Rust code compiled to WebAssembly to directly import and call JavaScript APIs.",
    "tags": [
      "wasm-bindgen",
      "wasm",
      "webassembly",
      "interop",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://rustwasm.github.io/wasm-bindgen/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://rustwasm.github.io/wasm-bindgen/",
        "type": "docs"
      },
      {
        "label": "wasm-bindgen Guide",
        "url": "https://rustwasm.github.io/docs/wasm-bindgen/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "yew"
    ],
    "worksWellWith": [
      "tauri",
      "rust"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "wasm-bindgen"
    ]
  },
  {
    "id": "dashmap-rust",
    "name": "DashMap",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Blazing fast concurrent HashMap implementation for Rust providing fine-grained sharding.",
    "whyUseIt": "Eliminates global lock contention in multi-threaded Rust services by splitting hash maps into concurrent shards.",
    "tags": [
      "dashmap",
      "concurrency",
      "hashmap",
      "lock-free",
      "rust"
    ],
    "ecosystem": "rust",
    "officialUrl": "https://docs.rs/dashmap",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.rs/dashmap/latest/dashmap/",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://github.com/xacrimon/dashmap#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "parking_lot"
    ],
    "worksWellWith": [
      "tokio",
      "rust"
    ],
    "prerequisites": [
      "rust"
    ],
    "stackIndicators": [
      "dashmap"
    ]
  },
  {
    "id": "asynq-go",
    "name": "Asynq",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Simple, reliable, and efficient distributed task queue in Go powered by Redis.",
    "whyUseIt": "Production background task processing in Go with guaranteed at-least-once delivery, periodic tasks, and retries.",
    "tags": [
      "asynq",
      "queue",
      "redis",
      "background-jobs",
      "go",
      "golang"
    ],
    "ecosystem": "go",
    "officialUrl": "https://github.com/hibiken/asynq",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/hibiken/asynq/wiki",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://github.com/hibiken/asynq/wiki/Getting-Started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "temporal-go"
    ],
    "worksWellWith": [
      "go-redis-pkg",
      "go"
    ],
    "prerequisites": [
      "go",
      "redis"
    ],
    "stackIndicators": [
      "github.com/hibiken/asynq"
    ]
  },
  {
    "id": "casbin-go",
    "name": "Casbin",
    "category": "security",
    "difficulty": "intermediate",
    "description": "An authorization library that supports access control models like ACL, RBAC, ABAC in Go.",
    "whyUseIt": "Declarative authorization engine supporting role-based and attribute-based permissions across microservices.",
    "tags": [
      "casbin",
      "rbac",
      "authorization",
      "permissions",
      "security",
      "go"
    ],
    "ecosystem": "go",
    "officialUrl": "https://casbin.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://casbin.org/docs/overview",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://casbin.org/docs/get-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "keto"
    ],
    "worksWellWith": [
      "gin",
      "echo-go"
    ],
    "prerequisites": [
      "go"
    ],
    "stackIndicators": [
      "github.com/casbin/casbin/v2"
    ]
  },
  {
    "id": "mapstruct-java",
    "name": "MapStruct",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Code generator that greatly simplifies the implementation of mappings between Java bean types.",
    "whyUseIt": "Generates compile-time, zero-reflection DTO-to-entity mapping code with fast type safety and clear errors.",
    "tags": [
      "mapstruct",
      "dto",
      "mapping",
      "code-generation",
      "java"
    ],
    "ecosystem": "java",
    "officialUrl": "https://mapstruct.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://mapstruct.org/documentation/stable/reference/html/",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://mapstruct.org/documentation/installation/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "modelmapper"
    ],
    "worksWellWith": [
      "spring-boot",
      "lombok"
    ],
    "prerequisites": [
      "java"
    ],
    "stackIndicators": [
      "org.mapstruct:mapstruct"
    ]
  },
  {
    "id": "ktor-client-jvm",
    "name": "Ktor Client",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Multiplatform asynchronous HTTP client for Kotlin and JVM with coroutine integration.",
    "whyUseIt": "Type-safe, non-blocking HTTP client for Kotlin applications and Android with native serialization support.",
    "tags": [
      "ktor",
      "http",
      "client",
      "kotlin",
      "async",
      "android"
    ],
    "ecosystem": "java",
    "officialUrl": "https://ktor.io/docs/client.html",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://ktor.io/docs/client-create-and-configure.html",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://ktor.io/docs/client-quick-start.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "okhttp"
    ],
    "worksWellWith": [
      "kotlin",
      "kotlinx-coroutines"
    ],
    "prerequisites": [
      "kotlin"
    ],
    "stackIndicators": [
      "io.ktor:ktor-client-core"
    ]
  },
  {
    "id": "headless-ui",
    "name": "Headless UI",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Completely unstyled, fully accessible UI components by Tailwind Labs, designed to integrate with Tailwind CSS.",
    "whyUseIt": "Provides production-grade accessibility and focus trapping for dialogs, dropdowns, and tabs with zero CSS lock-in.",
    "tags": [
      "headless-ui",
      "accessible",
      "tailwind",
      "ui",
      "components",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://headlessui.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://headlessui.com/react/menu",
        "type": "docs"
      },
      {
        "label": "Examples & Guide",
        "url": "https://headlessui.com/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "radix-ui",
      "react-aria"
    ],
    "worksWellWith": [
      "tailwind-css",
      "react",
      "vue"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "@headlessui/react",
      "@headlessui/vue"
    ]
  },
  {
    "id": "react-aria",
    "name": "React Aria",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "A library of React hooks that provides accessible UI primitives for your design system across all devices.",
    "whyUseIt": "Adobe enterprise-grade accessibility engine providing WAI-ARIA behavior, screen reader announcements, and keyboard control.",
    "tags": [
      "react-aria",
      "accessibility",
      "a11y",
      "design-system",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://react-spectrum.adobe.com/react-aria/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://react-spectrum.adobe.com/react-aria/getting-started.html",
        "type": "docs"
      },
      {
        "label": "Component Guide",
        "url": "https://react-spectrum.adobe.com/react-aria/components.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "radix-ui",
      "headless-ui"
    ],
    "worksWellWith": [
      "tailwind-css",
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "react-aria",
      "react-aria-components"
    ]
  },
  {
    "id": "mdx-js",
    "name": "MDX",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Markdown for the component era, allowing you to write JSX directly embedded inside Markdown documents.",
    "whyUseIt": "Enables embedding interactive React components, charts, and sandbox demos directly inside documentation files.",
    "tags": [
      "mdx",
      "markdown",
      "jsx",
      "documentation",
      "nextjs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://mdxjs.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://mdxjs.com/docs/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://mdxjs.com/docs/getting-started/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-markdown"
    ],
    "worksWellWith": [
      "nextjs",
      "astro",
      "react"
    ],
    "prerequisites": [
      "react",
      "markdown"
    ],
    "stackIndicators": [
      "@mdx-js/react",
      "@mdx-js/mdx"
    ]
  },
  {
    "id": "katex-math",
    "name": "KaTeX",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "The fastest math typesetting library for the web, rendering TeX formulas into accessible HTML and MathML.",
    "whyUseIt": "Renders complex mathematical formulas on websites up to 10x faster than MathJax with zero layout reflows.",
    "tags": [
      "katex",
      "math",
      "latex",
      "formula",
      "typesetting",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://katex.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://katex.org/docs/",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://katex.org/docs/browser.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "mathjax"
    ],
    "worksWellWith": [
      "react",
      "markdown"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "katex"
    ]
  },
  {
    "id": "validator-js",
    "name": "validator",
    "category": "utility",
    "difficulty": "beginner",
    "description": "A library of string validators and sanitizers for Node.js and browsers (isEmail, isURL, isUUID).",
    "whyUseIt": "Lightweight utility for validating and sanitizing emails, credit cards, alphanumeric strings, and URLs in JS.",
    "tags": [
      "validator",
      "validation",
      "sanitization",
      "strings",
      "utility"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/validatorjs/validator.js",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/validatorjs/validator.js#readme",
        "type": "docs"
      },
      {
        "label": "Validators List",
        "url": "https://github.com/validatorjs/validator.js#validators",
        "type": "docs"
      }
    ],
    "alternatives": [
      "zod"
    ],
    "worksWellWith": [
      "express",
      "nodejs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "validator"
    ]
  },
  {
    "id": "kind-k8s",
    "name": "kind",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "Tool for running local Kubernetes clusters using Docker container nodes for local testing and CI.",
    "whyUseIt": "Spins up disposable multi-node Kubernetes clusters in seconds inside Docker without cloud VM costs.",
    "tags": [
      "kind",
      "kubernetes",
      "docker",
      "devops",
      "local-cluster"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://kind.sigs.k8s.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://kind.sigs.k8s.io/docs/user/quick-start/",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://kind.sigs.k8s.io/docs/user/quick-start/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "minikube",
      "k3d"
    ],
    "worksWellWith": [
      "docker",
      "kubernetes",
      "helm"
    ],
    "prerequisites": [
      "docker"
    ],
    "stackIndicators": [
      "kind"
    ]
  },
  {
    "id": "act-ci",
    "name": "act",
    "category": "devops-container",
    "difficulty": "beginner",
    "description": "Run your GitHub Actions locally on your machine with Docker to test workflow changes before pushing.",
    "whyUseIt": "Test and debug your .github/workflows CI/CD pipelines locally on your machine in seconds without blind git commits.",
    "tags": [
      "act",
      "github-actions",
      "ci-cd",
      "docker",
      "testing"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://github.com/nektos/act",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://nektos-act.github.io/act/",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/nektos/act#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "circleci-cli"
    ],
    "worksWellWith": [
      "docker",
      "github-actions"
    ],
    "prerequisites": [
      "docker"
    ],
    "stackIndicators": [
      "act"
    ]
  },
  {
    "id": "renovate-bot",
    "name": "Renovate",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Automated multi-platform dependency update tool that opens PRs with changelogs and test verification.",
    "whyUseIt": "Automates dependency updates across 30+ package managers (npm, pip, cargo, go) with automated grouping and scheduling.",
    "tags": [
      "renovate",
      "dependencies",
      "automation",
      "security",
      "github"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://docs.renovatebot.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.renovatebot.com/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.renovatebot.com/getting-started/installing-onboarding/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "dependabot"
    ],
    "worksWellWith": [
      "github-actions",
      "gitlab-ci"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "renovate"
    ]
  },
  {
    "id": "pytest-cov",
    "name": "pytest-cov",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Pytest plugin for measuring code coverage with support for terminal reports, HTML, and branch coverage.",
    "whyUseIt": "Integrates coverage.py with Pytest to automatically generate detailed coverage reports in local dev and CI/CD.",
    "tags": [
      "pytest-cov",
      "coverage",
      "testing",
      "code-quality",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pytest-cov.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pytest-cov.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Coverage Configuration Guide",
        "url": "https://pytest-cov.readthedocs.io/en/latest/config.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "coverage"
    ],
    "worksWellWith": [
      "pytest",
      "github-actions"
    ],
    "prerequisites": [
      "python",
      "pytest"
    ],
    "stackIndicators": [
      "pytest-cov"
    ]
  },
  {
    "id": "pytest-mock",
    "name": "pytest-mock",
    "category": "testing",
    "difficulty": "beginner",
    "description": "Thin-wrapper around the mock package for easier and safer mocking with pytest fixtures.",
    "whyUseIt": "Provides a clean mocker fixture in Pytest that automatically un-mocks patched functions after every test run.",
    "tags": [
      "pytest-mock",
      "mocking",
      "fixtures",
      "testing",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pytest-mock.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pytest-mock.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://pytest-mock.readthedocs.io/en/latest/usage.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "unittest.mock"
    ],
    "worksWellWith": [
      "pytest"
    ],
    "prerequisites": [
      "python",
      "pytest"
    ],
    "stackIndicators": [
      "pytest-mock"
    ]
  },
  {
    "id": "sphinx-doc",
    "name": "Sphinx",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Tool that makes it easy to create intelligent and beautiful documentation for Python software.",
    "whyUseIt": "The official documentation engine for Python itself and major open-source libraries with autodoc docstring extraction.",
    "tags": [
      "sphinx",
      "documentation",
      "autodoc",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.sphinx-doc.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.sphinx-doc.org/en/master/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://www.sphinx-doc.org/en/master/tutorial/index.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "mkdocs"
    ],
    "worksWellWith": [
      "read-the-docs",
      "python"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "sphinx"
    ]
  },
  {
    "id": "altair-viz",
    "name": "Altair",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Declarative statistical visualization library for Python based on Vega and Vega-Lite grammar of graphics.",
    "whyUseIt": "Build interactive statistical charts in Python with clean syntax, automatic tooltips, and interactive pan/zoom.",
    "tags": [
      "altair",
      "charts",
      "visualization",
      "vega",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://altair-viz.github.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://altair-viz.github.io/",
        "type": "docs"
      },
      {
        "label": "Altair Tutorial",
        "url": "https://altair-viz.github.io/getting_started/overview.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "matplotlib",
      "seaborn",
      "plotly"
    ],
    "worksWellWith": [
      "pandas",
      "jupyterlab"
    ],
    "prerequisites": [
      "python",
      "pandas"
    ],
    "stackIndicators": [
      "altair"
    ]
  },
  {
    "id": "authlib-py",
    "name": "Authlib",
    "category": "authentication",
    "difficulty": "intermediate",
    "description": "The ultimate Python library in building OAuth and OpenID Connect servers and clients.",
    "whyUseIt": "Universal OAuth 1/2 and OIDC client and provider implementation for FastAPI, Django, and Flask apps.",
    "tags": [
      "authlib",
      "oauth2",
      "oidc",
      "auth",
      "security",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://authlib.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.authlib.org/en/latest/",
        "type": "docs"
      },
      {
        "label": "FastAPI OAuth Client Guide",
        "url": "https://docs.authlib.org/en/latest/client/starlette.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "python-social-auth"
    ],
    "worksWellWith": [
      "fastapi",
      "django",
      "flask"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "authlib"
    ]
  },
  {
    "id": "tox-py",
    "name": "Tox",
    "category": "testing",
    "difficulty": "intermediate",
    "description": "Generic virtualenv management and test command line tool for checking multi-version Python compatibility.",
    "whyUseIt": "Tests your Python library across multiple Python versions (3.10, 3.11, 3.12) automatically in isolated environments.",
    "tags": [
      "tox",
      "matrix-testing",
      "virtualenv",
      "ci",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://tox.wiki",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://tox.wiki/en/latest/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://tox.wiki/en/latest/installation.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nox"
    ],
    "worksWellWith": [
      "pytest",
      "github-actions"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "tox"
    ]
  },
  {
    "id": "react-native-screens",
    "name": "react-native-screens",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "Native navigation container primitives for React Native reducing memory footprint of background screens.",
    "whyUseIt": "Uses native UIViewController on iOS and Fragment on Android, releasing off-screen view memory in navigation stacks.",
    "tags": [
      "screens",
      "navigation",
      "performance",
      "memory",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/software-mansion/react-native-screens",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/software-mansion/react-native-screens#readme",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://github.com/software-mansion/react-native-screens#getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-native"
    ],
    "worksWellWith": [
      "react-navigation",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-screens"
    ]
  },
  {
    "id": "react-native-fast-image",
    "name": "react-native-fast-image",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Performant React Native image component with aggressive disk caching, preload support, and priority queuing.",
    "whyUseIt": "Fixes flickering, slow loading, and cache misses for images in React Native list feeds using SDWebImage and Glide.",
    "tags": [
      "fast-image",
      "images",
      "caching",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/DylanVann/react-native-fast-image",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/DylanVann/react-native-fast-image#readme",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://github.com/DylanVann/react-native-fast-image#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "expo-image"
    ],
    "worksWellWith": [
      "react-native",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-fast-image"
    ]
  },
  {
    "id": "react-native-safe-area-context",
    "name": "react-native-safe-area-context",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Flexible way to handle safe area insets in React Native across notched iPhone, iPad, and Android devices.",
    "whyUseIt": "Prevents mobile UI content from being hidden behind iPhone camera notches, home indicator bars, and status bars.",
    "tags": [
      "safe-area",
      "layout",
      "notch",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/th3rdwave/react-native-safe-area-context",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/th3rdwave/react-native-safe-area-context#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/th3rdwave/react-native-safe-area-context#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "safeareaview"
    ],
    "worksWellWith": [
      "react-navigation",
      "nativewind",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-safe-area-context"
    ]
  },
  {
    "id": "flutter-hooks",
    "name": "flutter_hooks",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "A React-style hooks implementation for Flutter to increase code-sharing and remove widget boilerplate.",
    "whyUseIt": "Eliminates repetitive StatefulWidget lifecycle methods (initState, dispose) using clean useState and useEffect hooks.",
    "tags": [
      "flutter-hooks",
      "hooks",
      "flutter",
      "dart",
      "state",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/flutter_hooks",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/flutter_hooks",
        "type": "docs"
      },
      {
        "label": "Tutorial Guide",
        "url": "https://github.com/rrousselGit/flutter_hooks#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "flutter-bloc",
      "riverpod"
    ],
    "worksWellWith": [
      "flutter"
    ],
    "prerequisites": [
      "flutter"
    ],
    "stackIndicators": [
      "flutter_hooks"
    ]
  },
  {
    "id": "colyseus",
    "name": "Colyseus",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "Multiplayer framework for Node.js with state synchronization and matchmaking for web games and realtime apps.",
    "whyUseIt": "Authoritative server multiplayer engine with automated binary state delta compression and room matchmaking.",
    "tags": [
      "colyseus",
      "multiplayer",
      "realtime",
      "websockets",
      "games",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://colyseus.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.colyseus.io/",
        "type": "docs"
      },
      {
        "label": "Getting Started Tutorial",
        "url": "https://docs.colyseus.io/getting-started/overview/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "socket-io"
    ],
    "worksWellWith": [
      "nodejs",
      "react",
      "threejs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "colyseus",
      "colyseus.js"
    ]
  },
  {
    "id": "peerjs",
    "name": "PeerJS",
    "category": "api-protocol",
    "difficulty": "beginner",
    "description": "Simple, peer-to-peer WebRTC data and media connections in the browser with signaling server support.",
    "whyUseIt": "Build peer-to-peer video calls, voice chat, and real-time multiplayer data sharing without complex WebRTC SDP negotiation.",
    "tags": [
      "peerjs",
      "webrtc",
      "p2p",
      "video-call",
      "audio",
      "realtime"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://peerjs.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://peerjs.com/docs/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://peerjs.com/#quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "simple-peer"
    ],
    "worksWellWith": [
      "react",
      "webrtc"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "peerjs"
    ]
  },
  {
    "id": "fast-json-stringify",
    "name": "fast-json-stringify",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Significantly faster than JSON.stringify() by compiling stringifiers directly from JSON Schema definitions.",
    "whyUseIt": "Serializes JSON responses up to 2x-5x faster than JSON.stringify, powering the blazingly fast Fastify web framework.",
    "tags": [
      "fast-json-stringify",
      "json",
      "fast",
      "serialization",
      "fastify",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/fastify/fast-json-stringify",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/fastify/fast-json-stringify#readme",
        "type": "docs"
      },
      {
        "label": "Benchmark & Guide",
        "url": "https://github.com/fastify/fast-json-stringify#example",
        "type": "docs"
      }
    ],
    "alternatives": [
      "json-stringify-safe"
    ],
    "worksWellWith": [
      "fastify",
      "nodejs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "fast-json-stringify"
    ]
  },
  {
    "id": "sst-dev",
    "name": "SST (Serverless Stack)",
    "category": "cloud-hosting",
    "difficulty": "intermediate",
    "description": "Framework that makes it easy to build modern full-stack serverless applications on AWS with Live Lambda Development.",
    "whyUseIt": "Test serverless AWS Lambdas locally with instant breakpoint debugging and zero deployment delays.",
    "tags": [
      "sst",
      "serverless",
      "aws",
      "cloud",
      "iac",
      "lambda",
      "nextjs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://sst.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://ion.sst.dev/docs/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://ion.sst.dev/docs/start/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "serverless-framework",
      "aws-cdk"
    ],
    "worksWellWith": [
      "aws",
      "nextjs",
      "typescript"
    ],
    "prerequisites": [
      "aws",
      "typescript"
    ],
    "stackIndicators": [
      "sst"
    ]
  },
  {
    "id": "serverless-framework",
    "name": "Serverless Framework",
    "category": "cloud-hosting",
    "difficulty": "beginner",
    "description": "Zero-friction serverless platform to build and deploy auto-scaling apps on AWS Lambda, Cloud Run, and Azure Functions.",
    "whyUseIt": "Industry standard declarative YAML framework for packaging and deploying microservices and Lambdas.",
    "tags": [
      "serverless",
      "lambda",
      "aws",
      "cloud",
      "microservices"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://www.serverless.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.serverless.com/framework/docs",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://www.serverless.com/framework/docs/getting-started",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "sst-dev",
      "aws-cdk"
    ],
    "worksWellWith": [
      "aws",
      "nodejs",
      "python"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "serverless"
    ]
  },
  {
    "id": "sanitize-html",
    "name": "sanitize-html",
    "category": "security",
    "difficulty": "beginner",
    "description": "Clean HTML fragments with an allowlist of tags and attributes to prevent XSS attacks in Node.js and the browser.",
    "whyUseIt": "Safely strips unapproved script tags, iframes, and malicious attributes from user-submitted rich text content.",
    "tags": [
      "sanitize-html",
      "xss",
      "security",
      "html",
      "sanitization"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/apostrophecms/sanitize-html",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/apostrophecms/sanitize-html#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/apostrophecms/sanitize-html#how-to-use",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "dompurify"
    ],
    "worksWellWith": [
      "express",
      "nodejs",
      "tiptap"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "sanitize-html"
    ]
  },
  {
    "id": "minikube-k8s",
    "name": "minikube",
    "category": "devops-container",
    "difficulty": "beginner",
    "description": "Local Kubernetes engine focusing on making it easy to learn and develop for Kubernetes on your computer.",
    "whyUseIt": "The beginner standard for learning Kubernetes locally with 1-command startup, dashboard UI, and ingress plugins.",
    "tags": [
      "minikube",
      "kubernetes",
      "k8s",
      "containers",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://minikube.sigs.k8s.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://minikube.sigs.k8s.io/docs/",
        "type": "docs"
      },
      {
        "label": "Minikube Start Tutorial",
        "url": "https://minikube.sigs.k8s.io/docs/start/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "kind-k8s",
      "k3d"
    ],
    "worksWellWith": [
      "docker",
      "kubernetes",
      "kubectl"
    ],
    "prerequisites": [
      "docker"
    ],
    "stackIndicators": [
      "minikube"
    ]
  },
  {
    "id": "skaffold-k8s",
    "name": "Skaffold",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "Easy and repeatable Kubernetes development tool that automates building, pushing, and deploying apps to your cluster.",
    "whyUseIt": "Provides instant continuous development hot-reloading for Kubernetes: saves code $\\to$ rebuilds container $\\to$ syncs to cluster.",
    "tags": [
      "skaffold",
      "kubernetes",
      "k8s",
      "hot-reload",
      "ci-cd"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://skaffold.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://skaffold.dev/docs/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://skaffold.dev/docs/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tilt-dev"
    ],
    "worksWellWith": [
      "kubernetes",
      "docker",
      "helm"
    ],
    "prerequisites": [
      "kubernetes",
      "docker"
    ],
    "stackIndicators": [
      "skaffold.yaml"
    ]
  },
  {
    "id": "tilt-dev",
    "name": "Tilt",
    "category": "devops-container",
    "difficulty": "intermediate",
    "description": "Multi-service development environment that automates container building and live cluster reloading with a web dashboard.",
    "whyUseIt": "Unifies multi-container microservice development with instant live file synchronization and web status dashboards.",
    "tags": [
      "tilt",
      "microservices",
      "kubernetes",
      "docker",
      "devops"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://tilt.dev",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.tilt.dev/",
        "type": "docs"
      },
      {
        "label": "Tilt Tutorial",
        "url": "https://docs.tilt.dev/tutorial",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "skaffold-k8s"
    ],
    "worksWellWith": [
      "kubernetes",
      "docker-compose"
    ],
    "prerequisites": [
      "docker"
    ],
    "stackIndicators": [
      "Tiltfile"
    ]
  },
  {
    "id": "dependabot-tool",
    "name": "Dependabot",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Automated dependency updates built into GitHub that monitors repositories and automatically opens upgrade PRs.",
    "whyUseIt": "Keeps project dependencies up-to-date and patches zero-day security vulnerabilities automatically in GitHub.",
    "tags": [
      "dependabot",
      "security",
      "dependencies",
      "github",
      "automation"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://docs.github.com/en/code-security/dependabot",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.github.com/en/code-security/dependabot",
        "type": "docs"
      },
      {
        "label": "Configuring Dependabot",
        "url": "https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "renovate-bot",
      "snyk"
    ],
    "worksWellWith": [
      "github-actions"
    ],
    "prerequisites": [
      "git"
    ],
    "stackIndicators": [
      "dependabot.yml"
    ]
  },
  {
    "id": "oxc-tool",
    "name": "Oxc",
    "category": "utility",
    "difficulty": "beginner",
    "description": "The JavaScript Oxidation Compiler: suite of high-performance tools written in Rust (parser, linter, resolver).",
    "whyUseIt": "Parses and lints JavaScript/TypeScript code 50x-100x faster than ESLint, forming the foundation of next-gen tools.",
    "tags": [
      "oxc",
      "rust",
      "linter",
      "parser",
      "fast",
      "javascript"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://oxc.rs",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://oxc.rs/docs/guide/introduction.html",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://oxc.rs/docs/guide/usage/linter.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "biome",
      "eslint"
    ],
    "worksWellWith": [
      "typescript",
      "vite"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "oxlint"
    ]
  },
  {
    "id": "depcheck-tool",
    "name": "depcheck",
    "category": "utility",
    "difficulty": "beginner",
    "description": "Tool for analyzing the dependencies in your project to see: which are unused, and which are missing from package.json.",
    "whyUseIt": "Audits package.json to identify ghost dependencies and remove obsolete packages to shrink node_modules size.",
    "tags": [
      "depcheck",
      "dependencies",
      "clean",
      "node_modules",
      "tooling"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/depcheck/depcheck",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/depcheck/depcheck#readme",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/depcheck/depcheck#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "knip"
    ],
    "worksWellWith": [
      "nodejs",
      "npm"
    ],
    "prerequisites": [
      "nodejs"
    ],
    "stackIndicators": [
      "depcheck"
    ]
  },
  {
    "id": "prismjs",
    "name": "Prism.js",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Lightweight, robust, elegant syntax highlighter built with modern web standards and extensible CSS plugins.",
    "whyUseIt": "Ultra-lightweight syntax highlighting for blog posts and code samples with hundreds of CSS themes and zero bundle bloat.",
    "tags": [
      "prism",
      "syntax-highlighter",
      "code",
      "css",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://prismjs.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://prismjs.com/",
        "type": "docs"
      },
      {
        "label": "Basic Usage Tutorial",
        "url": "https://prismjs.com/#basic-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "shiki",
      "highlightjs"
    ],
    "worksWellWith": [
      "react-markdown",
      "markdown"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "prismjs"
    ]
  },
  {
    "id": "quill-editor",
    "name": "Quill",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "Modern rich text editor built for compatibility and extensibility with an expressive API and clean DOM output.",
    "whyUseIt": "The beginner standard for drop-in WYSIWYG rich text editing in web apps with toolbars, image embedding, and delta formats.",
    "tags": [
      "quill",
      "rich-text",
      "editor",
      "wysiwyg",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://quilljs.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://quilljs.com/docs/quickstart",
        "type": "docs"
      },
      {
        "label": "Interactive Tutorial",
        "url": "https://quilljs.com/docs/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tiptap",
      "lexical"
    ],
    "worksWellWith": [
      "react",
      "vue"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "quill"
    ]
  },
  {
    "id": "downshift-pkg",
    "name": "Downshift",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Primitives to build simple, flexible, WAI-ARIA compliant React autocomplete, combobox or select dropdown components.",
    "whyUseIt": "The robust accessible hook engine for building search dropdowns, comboboxes, and multi-select menus in React.",
    "tags": [
      "downshift",
      "combobox",
      "autocomplete",
      "select",
      "accessibility",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://www.downshift-js.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.downshift-js.com/",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://github.com/downshift-js/downshift#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "radix-ui",
      "cmdk"
    ],
    "worksWellWith": [
      "react",
      "tailwind-css"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "downshift"
    ]
  },
  {
    "id": "react-datepicker-pkg",
    "name": "react-datepicker",
    "category": "ui-library",
    "difficulty": "beginner",
    "description": "A simple and reusable Datepicker component for React with time selection, range picking, and localization.",
    "whyUseIt": "The standard calendar and date-range selection component in React applications with keyboard navigation support.",
    "tags": [
      "react-datepicker",
      "calendar",
      "date",
      "datepicker",
      "react",
      "ui"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://reactdatepicker.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://reactdatepicker.com/",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://reactdatepicker.com/#example-default",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "react-day-picker"
    ],
    "worksWellWith": [
      "react",
      "date-fns",
      "dayjs"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "react-datepicker"
    ]
  },
  {
    "id": "react-pdf-pkg",
    "name": "react-pdf",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Display PDFs in your React app as easily as if they were images using Mozilla pdf.js under the hood.",
    "whyUseIt": "Renders PDF documents directly inside web pages with page navigation, zoom, text selection, and annotation layers.",
    "tags": [
      "react-pdf",
      "pdf",
      "viewer",
      "document",
      "react"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://projects.wojtekmaj.pl/react-pdf/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/wojtekmaj/react-pdf#readme",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://github.com/wojtekmaj/react-pdf#user-content-sample-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pdfjs-dist"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "react-pdf"
    ]
  },
  {
    "id": "react-native-maps",
    "name": "react-native-maps",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "React Native Mapview component for iOS and Android using Apple Maps and Google Maps natively.",
    "whyUseIt": "The definitive mapping component in React Native featuring custom markers, polygon overlays, and callouts.",
    "tags": [
      "maps",
      "geolocation",
      "google-maps",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/react-native-maps/react-native-maps",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/react-native-maps/react-native-maps#readme",
        "type": "docs"
      },
      {
        "label": "Installation Guide",
        "url": "https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "mapbox"
    ],
    "worksWellWith": [
      "react-native",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-maps"
    ]
  },
  {
    "id": "react-native-video",
    "name": "react-native-video",
    "category": "mobile",
    "difficulty": "intermediate",
    "description": "A video player component for React Native supporting streaming, local playback, and background audio.",
    "whyUseIt": "The battle-tested video playback component for React Native supporting HLS streaming, DRM, and controls.",
    "tags": [
      "video",
      "player",
      "streaming",
      "react-native",
      "mobile"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/react-native-video/react-native-video",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/react-native-video/react-native-video#readme",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://github.com/react-native-video/react-native-video/blob/master/README.md#examples",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "expo-av"
    ],
    "worksWellWith": [
      "react-native",
      "expo"
    ],
    "prerequisites": [
      "react-native"
    ],
    "stackIndicators": [
      "react-native-video"
    ]
  },
  {
    "id": "pyjwt-pkg",
    "name": "PyJWT",
    "category": "authentication",
    "difficulty": "beginner",
    "description": "JSON Web Token implementation in Python for signing, encoding, and decoding claims securely.",
    "whyUseIt": "Standard library for issuing and verifying JWT auth bearer tokens in Python with RSA, HMAC, and ECDSA cryptography.",
    "tags": [
      "pyjwt",
      "jwt",
      "auth",
      "tokens",
      "security",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://pyjwt.readthedocs.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pyjwt.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Usage Guide",
        "url": "https://pyjwt.readthedocs.io/en/latest/usage.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "authlib-py"
    ],
    "worksWellWith": [
      "fastapi",
      "flask"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "pyjwt"
    ]
  },
  {
    "id": "fastapi-users-pkg",
    "name": "FastAPI Users",
    "category": "authentication",
    "difficulty": "intermediate",
    "description": "Ready-to-use and customizable user management and authentication system for FastAPI.",
    "whyUseIt": "Adds user registration, email verification, password reset, and OAuth logins to FastAPI apps in 10 minutes.",
    "tags": [
      "fastapi-users",
      "auth",
      "users",
      "fastapi",
      "oauth2",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://fastapi-users.github.io/fastapi-users/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://fastapi-users.github.io/fastapi-users/latest/",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://fastapi-users.github.io/fastapi-users/latest/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "authlib-py"
    ],
    "worksWellWith": [
      "fastapi",
      "sqlalchemy",
      "pydantic"
    ],
    "prerequisites": [
      "python",
      "fastapi"
    ],
    "stackIndicators": [
      "fastapi-users"
    ]
  },
  {
    "id": "statsmodels",
    "name": "Statsmodels",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Python module that provides classes and functions for the estimation of many different statistical models.",
    "whyUseIt": "Essential for econometrics and rigorous statistical inference: ordinary least squares, ARIMA, and hypothesis tests.",
    "tags": [
      "statsmodels",
      "statistics",
      "regression",
      "time-series",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://www.statsmodels.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://www.statsmodels.org/stable/index.html",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://www.statsmodels.org/stable/gettingstarted.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "scipy",
      "scikit-learn"
    ],
    "worksWellWith": [
      "pandas",
      "numpy",
      "matplotlib"
    ],
    "prerequisites": [
      "python",
      "numpy"
    ],
    "stackIndicators": [
      "statsmodels"
    ]
  },
  {
    "id": "workerpool-js",
    "name": "workerpool",
    "category": "utility",
    "difficulty": "intermediate",
    "description": "Offload tasks to a pool of workers in Node.js and the browser with promise-based API and task timeouts.",
    "whyUseIt": "Easy worker thread pooling in Node.js and Web Workers with automatic serialization and worker crash recovery.",
    "tags": [
      "workerpool",
      "workers",
      "threads",
      "concurrency",
      "nodejs"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://github.com/josdejong/workerpool",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/josdejong/workerpool#readme",
        "type": "docs"
      },
      {
        "label": "Examples & Guide",
        "url": "https://github.com/josdejong/workerpool#example",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "piscina"
    ],
    "worksWellWith": [
      "nodejs"
    ],
    "prerequisites": [
      "javascript"
    ],
    "stackIndicators": [
      "workerpool"
    ]
  },
  {
    "id": "slate-editor",
    "name": "Slate",
    "category": "ui-library",
    "difficulty": "intermediate",
    "description": "Completely customizable framework for building rich text editors in React with schema and plugin models.",
    "whyUseIt": "Provides maximum control for building custom Notion-style block editors in React with immutable document trees.",
    "tags": [
      "slate",
      "editor",
      "rich-text",
      "react",
      "wysiwyg"
    ],
    "ecosystem": "javascript",
    "officialUrl": "https://docs.slatejs.org",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.slatejs.org/",
        "type": "docs"
      },
      {
        "label": "Walkthrough Tutorial",
        "url": "https://docs.slatejs.org/walkthroughs/01-installing-slate",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "tiptap",
      "lexical"
    ],
    "worksWellWith": [
      "react"
    ],
    "prerequisites": [
      "react"
    ],
    "stackIndicators": [
      "slate",
      "slate-react"
    ]
  },
  {
    "id": "amplify-aws",
    "name": "AWS Amplify",
    "category": "cloud-hosting",
    "difficulty": "intermediate",
    "description": "A set of purpose-built tools and features that lets frontend web and mobile developers build full-stack apps on AWS.",
    "whyUseIt": "Connects React and mobile apps to AWS services (Cognito auth, DynamoDB, S3 storage, AppSync) with client SDKs.",
    "tags": [
      "amplify",
      "aws",
      "cloud",
      "backend-as-a-service",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://aws.amazon.com/amplify/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.amplify.aws/",
        "type": "docs"
      },
      {
        "label": "Quickstart Guide",
        "url": "https://docs.amplify.aws/gen2/start/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "firebase",
      "supabase"
    ],
    "worksWellWith": [
      "react",
      "react-native"
    ],
    "prerequisites": [
      "aws"
    ],
    "stackIndicators": [
      "aws-amplify",
      "@aws-amplify/core"
    ]
  },
  {
    "id": "redis-om-py",
    "name": "Redis OM (Python)",
    "category": "database",
    "difficulty": "intermediate",
    "description": "Object mapping, validation, and JSON querying for Redis in Python based on Pydantic.",
    "whyUseIt": "Builds indexed JSON document stores and vector search queries directly inside Redis using familiar Pydantic models.",
    "tags": [
      "redis-om",
      "redis",
      "orm",
      "odm",
      "pydantic",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/redis/redis-om-python",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://redis-om-python.readthedocs.io/en/latest/",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://redis-om-python.readthedocs.io/en/latest/getting_started.html",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "redis-py"
    ],
    "worksWellWith": [
      "fastapi",
      "redis",
      "pydantic"
    ],
    "prerequisites": [
      "python",
      "redis"
    ],
    "stackIndicators": [
      "redis-om"
    ]
  },
  {
    "id": "fastapi-cache2",
    "name": "fastapi-cache2",
    "category": "utility",
    "difficulty": "beginner",
    "description": "A tool for caching FastAPI response endpoints with Redis, Memcached, or in-memory backends.",
    "whyUseIt": "One-line decorator (@cache(expire=60)) caching entire FastAPI route responses in Redis to slash latency.",
    "tags": [
      "fastapi-cache",
      "cache",
      "fastapi",
      "redis",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/long2ice/fastapi-cache",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://github.com/long2ice/fastapi-cache#readme",
        "type": "docs"
      },
      {
        "label": "Usage Examples",
        "url": "https://github.com/long2ice/fastapi-cache#usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "cachetools"
    ],
    "worksWellWith": [
      "fastapi",
      "redis"
    ],
    "prerequisites": [
      "python",
      "fastapi"
    ],
    "stackIndicators": [
      "fastapi-cache2"
    ]
  },
  {
    "id": "provider-flutter",
    "name": "provider",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "A wrapper around InheritedWidget to make them easier to use and more reusable in Flutter apps.",
    "whyUseIt": "The beginner-friendly official recommended state management approach in Flutter for small-to-medium apps.",
    "tags": [
      "provider",
      "state-management",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/provider",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/provider",
        "type": "docs"
      },
      {
        "label": "Flutter Provider Guide",
        "url": "https://docs.flutter.dev/data-and-backend/state-mgmt/simple",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "riverpod",
      "flutter-bloc"
    ],
    "worksWellWith": [
      "flutter"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "provider"
    ]
  },
  {
    "id": "intl-flutter",
    "name": "intl",
    "category": "mobile",
    "difficulty": "beginner",
    "description": "Internationalization and localization support for Dart and Flutter, including message translation and plurals.",
    "whyUseIt": "The standard framework for localizing Flutter apps into multiple languages with localized dates and numbers.",
    "tags": [
      "intl",
      "i18n",
      "localization",
      "flutter",
      "dart",
      "mobile"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://pub.dev/packages/intl",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://pub.dev/packages/intl",
        "type": "docs"
      },
      {
        "label": "Flutter Internationalization Tutorial",
        "url": "https://docs.flutter.dev/ui/accessibility-and-internationalization/internationalization",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "easy_localization"
    ],
    "worksWellWith": [
      "flutter"
    ],
    "prerequisites": [
      "dart"
    ],
    "stackIndicators": [
      "intl"
    ]
  },
  {
    "id": "jev",
    "name": "Jev",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "System One typed decision model framework that turns complex agentic workflows into structured probabilistic decisions.",
    "whyUseIt": "Replaces slow, free-form LLM text generation in agent loops with ultra-fast, typed decision routing and safety guardrails.",
    "tags": [
      "jev",
      "decision-model",
      "system-one",
      "agents",
      "ai",
      "routing"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/yibie/awesome-jev",
    "learnResources": [
      {
        "label": "Awesome Jev Ecosystem",
        "url": "https://github.com/yibie/awesome-jev#readme",
        "type": "docs"
      },
      {
        "label": "Jev Fast Browser Agent",
        "url": "https://github.com/browser-use/jev-ultrafast",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "outlines",
      "instructor"
    ],
    "worksWellWith": [
      "browser-use",
      "pydantic",
      "fastapi"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "jev",
      "jev-ai"
    ]
  },
  {
    "id": "rea-re",
    "name": "REA (Reverse Engineer Anything)",
    "category": "utility",
    "difficulty": "advanced",
    "description": "Open-source reverse engineering framework connecting AI coding agents to Ghidra, Hopper, and IDA Pro for decompilation.",
    "whyUseIt": "Enables AI agents to decompile binaries, trace execution paths, and recreate software features directly in your target stack.",
    "tags": [
      "rea",
      "reverse-engineering",
      "decompilation",
      "ghidra",
      "binary-analysis",
      "ai-agent"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://github.com/morluto/rea",
    "learnResources": [
      {
        "label": "Official GitHub Repository",
        "url": "https://github.com/morluto/rea#readme",
        "type": "docs"
      },
      {
        "label": "REA Agent Workflow Guide",
        "url": "https://github.com/morluto/rea/blob/main/docs/guide.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "ghidra",
      "radare2"
    ],
    "worksWellWith": [
      "mcp-sdk",
      "python"
    ],
    "prerequisites": [
      "c",
      "assembly"
    ],
    "stackIndicators": [
      "rea-cli",
      "rea"
    ]
  },
  {
    "id": "llm-c",
    "name": "llm.c (Andrej Karpathy)",
    "category": "ai-ml",
    "difficulty": "advanced",
    "description": "LLM training in simple, pure C and CUDA without needing heavy PyTorch or 245MB runtime dependencies.",
    "whyUseIt": "The ultimate educational and bare-metal reference for training GPT-2 and modern transformers directly on raw GPUs.",
    "tags": [
      "llm-c",
      "karpathy",
      "cuda",
      "c",
      "transformers",
      "gpt-2",
      "deep-learning"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://github.com/karpathy/llm.c",
    "learnResources": [
      {
        "label": "Official GitHub Repository",
        "url": "https://github.com/karpathy/llm.c#readme",
        "type": "docs"
      },
      {
        "label": "llm.c Architecture Walkthrough",
        "url": "https://github.com/karpathy/llm.c/blob/master/doc/layernorm.md",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "nanogpt",
      "pytorch"
    ],
    "worksWellWith": [
      "cuda",
      "c"
    ],
    "prerequisites": [
      "c",
      "cuda"
    ],
    "stackIndicators": [
      "llm.c"
    ]
  },
  {
    "id": "nanogpt",
    "name": "nanoGPT (Andrej Karpathy)",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "The simplest, fastest repository for training and fine-tuning medium-sized GPT models with PyTorch.",
    "whyUseIt": "The cleanest, most readable 300-line implementation of a GPT transformer training loop, ideal for learning and prototyping.",
    "tags": [
      "nanogpt",
      "karpathy",
      "transformers",
      "gpt",
      "pytorch",
      "ai",
      "deep-learning"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/karpathy/nanoGPT",
    "learnResources": [
      {
        "label": "Official GitHub Repository",
        "url": "https://github.com/karpathy/nanoGPT#readme",
        "type": "docs"
      },
      {
        "label": "nanoGPT Video Lecture & Code",
        "url": "https://github.com/karpathy/nanoGPT#quick-start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "llm-c",
      "huggingface-transformers"
    ],
    "worksWellWith": [
      "pytorch",
      "numpy"
    ],
    "prerequisites": [
      "python",
      "pytorch"
    ],
    "stackIndicators": [
      "nanogpt"
    ]
  },
  {
    "id": "micrograd",
    "name": "micrograd (Andrej Karpathy)",
    "category": "ai-ml",
    "difficulty": "beginner",
    "description": "A tiny scalar-valued autograd engine and neural network implementation in 100 lines of pure Python.",
    "whyUseIt": "Demystifies backpropagation and gradient descent by implementing dynamic computation graphs from absolute first principles.",
    "tags": [
      "micrograd",
      "karpathy",
      "autograd",
      "backprop",
      "neural-networks",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/karpathy/micrograd",
    "learnResources": [
      {
        "label": "Official GitHub Repository",
        "url": "https://github.com/karpathy/micrograd#readme",
        "type": "docs"
      },
      {
        "label": "Micrograd Video Walkthrough",
        "url": "https://github.com/karpathy/micrograd#example-usage",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "pytorch"
    ],
    "worksWellWith": [
      "numpy",
      "jupyterlab"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "micrograd"
    ]
  },
  {
    "id": "autoresearch",
    "name": "autoresearch (Andrej Karpathy)",
    "category": "ai-ml",
    "difficulty": "advanced",
    "description": "Autonomous AI research agent framework exploring automated iterative experiment loops on single-GPU setups.",
    "whyUseIt": "Automates deep learning research by letting LLM agents formulate hypotheses, edit training scripts, and analyze metrics.",
    "tags": [
      "autoresearch",
      "karpathy",
      "autonomous-agents",
      "ml-research",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/karpathy/autoresearch",
    "learnResources": [
      {
        "label": "Official GitHub Repository",
        "url": "https://github.com/karpathy/autoresearch#readme",
        "type": "docs"
      },
      {
        "label": "Program the Program Guide",
        "url": "https://github.com/karpathy/autoresearch#readme",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "mlflow",
      "wandb"
    ],
    "worksWellWith": [
      "pytorch",
      "nanogpt"
    ],
    "prerequisites": [
      "python",
      "cuda"
    ],
    "stackIndicators": [
      "autoresearch"
    ]
  },
  {
    "id": "browser-use",
    "name": "Browser Use",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Open-source web automation library making websites accessible for AI agents using Playwright and computer vision.",
    "whyUseIt": "Enables LLM agents to interact with any website: click buttons, fill multi-step forms, and extract live data autonomously.",
    "tags": [
      "browser-use",
      "web-agent",
      "playwright",
      "automation",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://github.com/browser-use/browser-use",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.browser-use.com",
        "type": "docs"
      },
      {
        "label": "Quick Start Tutorial",
        "url": "https://docs.browser-use.com/quickstart",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "playwright"
    ],
    "worksWellWith": [
      "playwright",
      "pydantic",
      "langchain"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "browser-use"
    ]
  },
  {
    "id": "mcp-sdk",
    "name": "Model Context Protocol (MCP)",
    "category": "api-protocol",
    "difficulty": "intermediate",
    "description": "Open standard by Anthropic connecting AI assistants to local development tools, databases, and APIs securely.",
    "whyUseIt": "The universal USB-C standard for AI: write one tool server that integrates seamlessly with Claude, Cursor, and IDE agents.",
    "tags": [
      "mcp",
      "anthropic",
      "context-protocol",
      "ai-tools",
      "agent-protocol"
    ],
    "ecosystem": "multi",
    "officialUrl": "https://modelcontextprotocol.io",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://modelcontextprotocol.io/introduction",
        "type": "docs"
      },
      {
        "label": "Building MCP Servers Tutorial",
        "url": "https://modelcontextprotocol.io/quickstart/server",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "langchain"
    ],
    "worksWellWith": [
      "typescript",
      "python",
      "fastapi"
    ],
    "prerequisites": [],
    "stackIndicators": [
      "@modelcontextprotocol/sdk",
      "mcp"
    ]
  },
  {
    "id": "unsloth",
    "name": "Unsloth",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Ultra-fast, memory-efficient fine-tuning for LLMs (Llama 3, Mistral, Gemma) running 2x-5x faster with 70% less VRAM.",
    "whyUseIt": "Fine-tunes large open models on a single consumer GPU without out-of-memory crashes by rewriting PyTorch autograd in OpenAI Triton.",
    "tags": [
      "unsloth",
      "fine-tuning",
      "lora",
      "qlora",
      "triton",
      "llama",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://unsloth.ai",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.unsloth.ai",
        "type": "docs"
      },
      {
        "label": "Unsloth Google Colab Tutorial",
        "url": "https://docs.unsloth.ai/get-started/unsloth-notebooks",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "axolotl-finetune",
      "peft"
    ],
    "worksWellWith": [
      "pytorch",
      "huggingface-transformers"
    ],
    "prerequisites": [
      "python",
      "cuda"
    ],
    "stackIndicators": [
      "unsloth"
    ]
  },
  {
    "id": "litellm",
    "name": "LiteLLM",
    "category": "ai-ml",
    "difficulty": "beginner",
    "description": "Call 100+ LLM APIs using the standard OpenAI input/output format with load balancing and fallbacks.",
    "whyUseIt": "Universal translation layer allowing you to switch between Claude, GPT-4, Bedrock, and Ollama in 1 line without refactoring.",
    "tags": [
      "litellm",
      "llm-proxy",
      "multi-model",
      "openai-format",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://docs.litellm.ai",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.litellm.ai/docs/",
        "type": "docs"
      },
      {
        "label": "Quick Start Guide",
        "url": "https://docs.litellm.ai/docs/proxy/quick_start",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "langchain",
      "instructor"
    ],
    "worksWellWith": [
      "fastapi",
      "openai-sdk"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "litellm"
    ]
  },
  {
    "id": "outlines-ai",
    "name": "Outlines",
    "category": "ai-ml",
    "difficulty": "intermediate",
    "description": "Structured text generation and JSON schema enforcement for LLMs using finite-state machine guided decoding.",
    "whyUseIt": "Guarantees 100% valid JSON, regex matches, and type conformity from open models without retry loops or parse failures.",
    "tags": [
      "outlines",
      "structured-generation",
      "json-schema",
      "fsm",
      "vllm",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://dottxt-ai.github.io/outlines/",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://dottxt-ai.github.io/outlines/",
        "type": "docs"
      },
      {
        "label": "Outlines Quickstart Guide",
        "url": "https://dottxt-ai.github.io/outlines/quickstart/",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "instructor",
      "pydantic"
    ],
    "worksWellWith": [
      "vllm",
      "pydantic",
      "huggingface-transformers"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "outlines"
    ]
  },
  {
    "id": "open-interpreter",
    "name": "Open Interpreter",
    "category": "ai-ml",
    "difficulty": "beginner",
    "description": "Natural language interface for computers allowing LLMs to run Python, JavaScript, and Bash code locally in your terminal.",
    "whyUseIt": "Open-source local ChatGPT Code Interpreter running directly on your machine with full access to files and terminal.",
    "tags": [
      "open-interpreter",
      "code-interpreter",
      "terminal",
      "automation",
      "ai",
      "python"
    ],
    "ecosystem": "python",
    "officialUrl": "https://openinterpreter.com",
    "learnResources": [
      {
        "label": "Official Documentation",
        "url": "https://docs.openinterpreter.com",
        "type": "docs"
      },
      {
        "label": "Getting Started Guide",
        "url": "https://docs.openinterpreter.com/getting-started/introduction",
        "type": "tutorial"
      }
    ],
    "alternatives": [
      "langchain"
    ],
    "worksWellWith": [
      "python",
      "ollama"
    ],
    "prerequisites": [
      "python"
    ],
    "stackIndicators": [
      "open-interpreter"
    ]
  }
]) as unknown as Skill[];
