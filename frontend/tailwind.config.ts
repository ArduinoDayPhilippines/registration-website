import type { Config } from "tailwindcss";
import type { PluginAPI } from 'tailwindcss/types/config'
import typography from '@tailwindcss/typography';

declare module 'tailwindcss/types/config' {
  interface ThemeConfig {
    textShadow?: { [key: string]: string }
  }
}

const globalColors = {
  primary: "#008080",
  secondary: "#EE7402",
  accent: "#1A6641",
  white: {
    50: "#E8E8EA",
    100: "#FFFFFF",
  },
  black: "#131118",
  price: "#F2BC51"
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: globalColors,
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        morganite: ["Morganite", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hover": `linear-gradient(130deg, ${globalColors.primary} 0%, #42B7B7 44%, #71DEDF 77%, #7DC5C7 100%)`,
        "gradient-clicked": "linear-gradient(135deg, #42B7B7 4%, #E2ECED 78%, #7DC5C7 100%)",
        "gradient-border-default": `linear-gradient(0deg, ${globalColors.primary} 0%, #66F7F7 63%, #FFFFFF 100%)`,
        "gradient-border-active": `linear-gradient(0deg, #F8F7FC 0%, ${globalColors.accent} 100%)`,
        "gradient-border-transparent": "linear-gradient(180deg, #D6EAEA 24%, #1A1A1C 100%)",
        "gradient-cta": `linear-gradient(90deg, #F8F7FC 0%, #008B9C 35.5%, #EE7402 68.5%, #F8F7FC 100%)`,
      },
      fontSize: {
        xs: ["11.1px", { letterSpacing: "0.005em" }],
        sm: ["13.3px", { letterSpacing: "0.005em" }],
        base: ["16px", { letterSpacing: "0.005em" }],
        xl: ["19.2px", { letterSpacing: "0.005em" }],
        "2xl": ["36.2px", { letterSpacing: "0.05em" }],
        "3xl": ["51.99px", { letterSpacing: "0.05em" }],
        "4xl": ["55.23px", { letterSpacing: "0.05em" }],
        "5xl": ["73.96px", { letterSpacing: "0.05em" }],
      },
      textShadow: {
        'glow': '0 0 25px #F8F7FC',
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
  },
  plugins: [
    typography,
    function ({ matchUtilities, theme }: PluginAPI) {
      matchUtilities(
        {
          'text-shadow': (value: string) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
} satisfies Config;
