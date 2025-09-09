export const theme = {
  colors: {
    light: {
      // Base colors
      background: "#ffffff",
      foreground: "#0a0a0a",

      // Card colors
      card: "#fafafa",
      cardForeground: "#0a0a0a",

      // Primary brand colors
      primary: "#2563eb",
      primaryForeground: "#ffffff",

      // Secondary colors
      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",

      // Accent colors
      accent: "#3b82f6",
      accentForeground: "#ffffff",

      // Muted colors
      muted: "#f8fafc",
      mutedForeground: "#64748b",

      // Destructive colors
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",

      // Border and input
      border: "#e2e8f0",
      input: "#f8fafc",
      ring: "#3b82f6",

      // Popover
      popover: "#ffffff",
      popoverForeground: "#0a0a0a",
    },

    dark: {
      // Base colors
      background: "#0a0a0a",
      foreground: "#fafafa",

      // Card colors
      card: "#1a1a1a",
      cardForeground: "#fafafa",

      // Primary brand colors
      primary: "#3b82f6",
      primaryForeground: "#0a0a0a",

      // Secondary colors
      secondary: "#262626",
      secondaryForeground: "#fafafa",

      // Accent colors
      accent: "#3b82f6",
      accentForeground: "#0a0a0a",

      // Muted colors
      muted: "#262626",
      mutedForeground: "#a1a1aa",

      // Destructive colors
      destructive: "#ef4444",
      destructiveForeground: "#fafafa",

      // Border and input
      border: "#262626",
      input: "#1a1a1a",
      ring: "#3b82f6",

      // Popover
      popover: "#0a0a0a",
      popoverForeground: "#fafafa",
    },
  },

  // Chart colors for data visualization
  charts: {
    light: {
      chart1: "#2563eb",
      chart2: "#3b82f6",
      chart3: "#64748b",
      chart4: "#f1f5f9",
      chart5: "#ef4444",
    },
    dark: {
      chart1: "#3b82f6",
      chart2: "#60a5fa",
      chart3: "#94a3b8",
      chart4: "#374151",
      chart5: "#f87171",
    },
  },

  // Sidebar colors (if needed)
  sidebar: {
    light: {
      sidebar: "#ffffff",
      sidebarForeground: "#0a0a0a",
      sidebarPrimary: "#2563eb",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#3b82f6",
      sidebarAccentForeground: "#ffffff",
      sidebarBorder: "#e2e8f0",
      sidebarRing: "#3b82f6",
    },
    dark: {
      sidebar: "#0f0f0f",
      sidebarForeground: "#fafafa",
      sidebarPrimary: "#3b82f6",
      sidebarPrimaryForeground: "#0a0a0a",
      sidebarAccent: "#262626",
      sidebarAccentForeground: "#fafafa",
      sidebarBorder: "#262626",
      sidebarRing: "#3b82f6",
    },
  },

  // Typography scale
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
  },

  // Border radius scale
  radius: {
    sm: "calc(0.75rem - 4px)",
    md: "calc(0.75rem - 2px)",
    lg: "0.75rem",
    xl: "calc(0.75rem + 4px)",
  },

  // Animation durations
  animation: {
    fast: "0.15s",
    normal: "0.3s",
    slow: "0.5s",
  },

  // Spacing scale (complementing Tailwind)
  spacing: {
    section: "6rem", // py-24
    container: "1.5rem", // px-6
  },

  // Breakpoints (matching Tailwind defaults)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const

// Type definitions for better TypeScript support
export type ThemeColors = typeof theme.colors
export type LightColors = typeof theme.colors.light
export type DarkColors = typeof theme.colors.dark

// Helper function to get CSS variables
export const getCSSVariable = (colorName: keyof LightColors) => {
  return `var(--${colorName.replace(/([A-Z])/g, "-$1").toLowerCase()})`
}

// Helper function to generate CSS custom properties
export const generateCSSVariables = () => {
  const lightVars = Object.entries(theme.colors.light)
    .map(([key, value]) => `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
    .join("\n  ")

  const darkVars = Object.entries(theme.colors.dark)
    .map(([key, value]) => `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
    .join("\n  ")

  return { lightVars, darkVars }
}
