const { nextui } = require("@nextui-org/theme");
import defaultTheme from "tailwindcss/defaultTheme";
import svgToDataUri from "mini-svg-data-uri";
import colors from "tailwindcss/colors";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

/** @type {import('tailwindcss').Config} */

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({ ":root": newVars });
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(table|checkbox|form|spacer).js",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#01B55E",
        secondary: "#E5FAF1",
        warning: colors.amber,
        danger: colors.red,
        success: colors.green,
      },
      backgroundImage: {
        "dotted-background": "url('/bg.png')",
        backy:
          "url('https://i.pinimg.com/736x/32/49/14/324914bb1233fa62e640c6a1133d550c.jpg')",
        pattern1: "url('/pattern1.png')",
        pattern2: "url('/pattern2.png')",
        pattern3: "url('/pattern3.png')",
        pattern4:
          "url('https://dsathemes.com/html/soltech_1.1/files/images/hero-1.jpg')",
        bg1: "url('https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-right.png')",
        bg2: "url('https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-left.png')",
      },
      keyframes: {
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        scrollY: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        scroll: {
          to: { transform: "translate(calc(-50% - 0.5rem))" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        scroll: "scroll var(--animation-duration, 40s) linear infinite",
        bounce: "bounce 3s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        scrollX: "scrollX var(--duration) linear infinite",
        scrollY: "scrollY var(--duration) linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    addVariablesForColors,
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${value}'><path d='M0 .5H31.5V32'/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='8' height='8' fill='none' stroke='${value}'><path d='M0 .5H31.5V32'/></svg>`
            )}")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'><circle fill='${value}' id='pattern-circle' cx='10' cy='10' r='1.625'></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
};
