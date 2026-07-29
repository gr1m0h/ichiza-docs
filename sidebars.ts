import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'ichiza (CLI & Actions)',
      collapsed: false,
      items: [
        'ichiza/overview',
        'ichiza/commands',
        'ichiza/configuration',
        'ichiza/lifecycle',
      ],
    },
    'ichiza-starter',
    'operations',
    'faq',
  ],
};

export default sidebars;
