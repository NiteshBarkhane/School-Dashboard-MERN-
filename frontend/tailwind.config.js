/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        waves: "url('/assets/waves.png')",
      },
      boxShadow: {
        shadow1: "0 0 35px 0 rgba(154, 161, 171, .15)",
        shadow2: "0 .125rem .25rem rgba(0, 0, 0, .075)",
        shadow3: "0px 1px 3px 1px rgb(0 0 0 / 43%)",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(15px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
        dropdownIn: {
          "0%": { "min-height": "0px", opacity: "0" },
          "100%": { "min-height": "100%", opacity: "1" },
        },
        bottomSlideIn: {
          "0%": { transform: "translateY(-50px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
        topSlideOut: {
          "0%": { transform: "translateY(0px)", opacity: "1" },
          "100%": { transform: "translateY(-50px)", opacity: "0" },
        },
        rightSlideIn: {
          "0%": { transform: "translateX(50px)", opacity: "0" },
          "100%": { transform: "translateX(0px)", opacity: "1" },
        },
      },
      animation: {
        slideUp: "slideUp 200ms ease-in",
        dropdownIn: "dropdownIn 400ms ease",
        bottomSlideIn: "bottomSlideIn 300ms ease-out",
        topSlideOut: "topSlideOut 300ms ease-out",
        rightSlideIn: "rightSlideIn 300ms ease-out",
      },
      colors: {
        custom_blue: "#3d73dd",
        custom_indigo: "#727cf5",
        custom_purple: "#536de6",
        custom_pink: "#ff679b",
        custom_red: "#ff5b5b",
        custom_orange: "#fd7e14",
        custom_yellow: "#f9c851",
        custom_green: "#10c469",
        custom_teal: "#02a8b5",
        custom_cyan: "#35b8e0",
        custom_white: "#fff",
        custom_gray: "#98a6ad",
        custom_gray_dark: "#343a40",
        custom_gray_100: "#f1f3fa",
        custom_gray_200: "#eef2f7",
        custom_gray_300: "#dee2e6",
        custom_gray_400: "#ced4da",
        custom_gray_500: "#adb5bd",
        custom_gray_600: "#98a6ad",
        custom_gray_700: "#6c757d",
        custom_gray_800: "#343a40",
        custom_gray_900: "#323a46",
        custom_primary: "#536de6",
        custom_secondary: "#6c757d",
        custom_success: "#10c469",
        custom_info: "#35b8e0",
        custom_warning: "#f9c851",
        custom_danger: "#ff5b5b",
        custom_light: "#eef2f7",
        custom_dark: "#323a46",
        custom_primary_rgb: "83, 109, 230",
        custom_secondary_rgb: "108, 117, 125",
        custom_success_rgb: "16, 196, 105",
        custom_info_rgb: "53, 184, 224",
        custom_warning_rgb: "249, 200, 81",
        custom_danger_rgb: "255, 91, 91",
        custom_light_rgb: "238, 242, 247",
        custom_dark_rgb: "50, 58, 70",
        custom_white_rgb: "255, 255, 255",
        custom_black_rgb: "0, 0, 0",
        custom_body_rgb: "108, 117, 125",
        custom_font_nunito: '["Nunito", sans-serif]',
        custom_font_monospace:
          '[SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace]',
      },
    },

    fontFamily: {
      nunito: "Nunito",
    },
  },
  plugins: [],
};
