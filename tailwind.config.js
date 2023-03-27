module.exports = {
  content: ["./imports/ui/**/*.{js,jsx,ts,tsx}", "./client/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};
