import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 2px 1px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.3)',
      }
    }
  }
};

export default config;
