/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', ':root[data-tema="escuro"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Todos apontam para os tokens de app/globals.css — trocar o tema
        // troca o app inteiro sem tocar em componente nenhum.
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        conteudo: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        borda: {
          DEFAULT: 'var(--border)',
          forte: 'var(--border-strong)',
        },
        primary: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          fg: 'var(--accent-fg)',
          // Mantidos para não quebrar telas ainda não convertidas.
          dark: 'var(--accent-hover)',
          light: 'var(--accent-soft)',
          bg: 'var(--accent-soft)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          soft: 'var(--gold-soft)',
        },
        accent: 'var(--gold)',
        perigo: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
        },
        sucesso: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        deep: {
          DEFAULT: 'var(--deep)',
          fg: 'var(--deep-fg)',
        },
      },
      borderRadius: {
        card: 'var(--radius)',
        xl2: 'var(--radius-lg)',
      },
      boxShadow: {
        cartao: 'var(--shadow)',
        alto: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
