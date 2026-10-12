import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tki-sor.github.io',
  devToolbar: {
    enabled: false
  },
  integrations: [
    starlight({
      title: 'NekoJS Wiki',
      description: 'NekoJS 脚本引擎的使用指南、API 参考与开发文档。',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN'
        },
        en: {
          label: 'English',
          lang: 'en'
        }
      },
      sidebar: [
        {
          label: '开始使用',
          items: [
            { label: '首页', slug: '' },
            { label: '第一个脚本', slug: 'getting-started/first-script' },
            { label: '目录结构', slug: 'getting-started/directory-layout' }
          ]
        },
        {
          label: '指南',
          items: [
            { label: '修改配方', slug: 'guides/recipes/modify-recipes' }
          ]
        },
        {
          label: 'API 参考',
          autogenerate: { directory: 'reference/api' }
        },
        {
          label: '贡献与开发',
          items: [
            { label: '文档架构', slug: 'contributing/docs-architecture' }
          ]
        }
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Tki-sor/tki-sor.github.io'
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/Tki-sor/tki-sor.github.io/edit/main/'
      },
      components: {
        Hero: './src/components/overrides/Hero.astro',
        ThemeSelect: './src/components/overrides/ThemeSelect.astro'
      },
      customCss: ['./src/styles/site.css', './src/styles/home.css']
    })
  ]
});
