export const theme: any = {
  colors: {
    primary: {
      pink: "#ec4899",
      yellow: "#eab308",
      blue: "#3b82f6",
      orange: "#f97316",
      red: "#ef4444",
      indigo: "#6366f1",
    },
    gradients: {
      hero: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(234, 179, 8, 0.2), rgba(59, 130, 246, 0.2))",
      text: "linear-gradient(90deg, #ec4899, #eab308, #3b82f6)",
      background: "linear-gradient(180deg, #fdf2f8, #fefce8, #eff6ff)",
      section: "linear-gradient(90deg, #fce7f3, #fef3c7, #dbeafe)",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
    },
    red: {
      500: "#ef4444",
      600: "#dc2626",
    },
    green: {
      500: "#10b981",
      600: "#059669",
    },
    white: "#ffffff",
    black: "#000000",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "50%",
  },
};

export type Theme = typeof theme;
