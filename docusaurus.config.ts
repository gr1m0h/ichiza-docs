import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ichiza',
  tagline: 'Community event operations as Code',
  favicon: 'img/favicon.ico',

  url: 'https://ichiza.grimoh.net',
  baseUrl: '/',

  organizationName: 'gr1m0h',
  projectName: 'ichiza-docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/gr1m0h/ichiza-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ichiza',
      logo: {
        alt: 'ichiza logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'ドキュメント',
        },
        {
          href: 'https://github.com/gr1m0h/ichiza',
          label: 'ichiza',
          position: 'right',
        },
        {
          href: 'https://github.com/gr1m0h/ichiza-starter',
          label: 'ichiza-starter',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'ドキュメント',
          items: [
            { label: 'はじめに', to: '/docs/intro' },
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: '運営サイクルガイド', to: '/docs/operations' },
            { label: 'FAQ', to: '/docs/faq' },
          ],
        },
        {
          title: 'プロジェクト',
          items: [
            { label: 'ichiza', href: 'https://github.com/gr1m0h/ichiza' },
            { label: 'ichiza-starter', href: 'https://github.com/gr1m0h/ichiza-starter' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Docs repository', href: 'https://github.com/gr1m0h/ichiza-docs' },
            { label: 'grimoh.net', href: 'https://grimoh.net' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} gr1m0h. MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
