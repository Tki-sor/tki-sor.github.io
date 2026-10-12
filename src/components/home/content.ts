export type HomeLocale = 'zh-CN' | 'en';

type Link = { label: string; href: string; soon?: boolean };

export interface HomeContent {
  hero: {
    badge: string;
    badgeHref: string;
    titleLead: string;
    titleAccent: string;
    tagline: string;
    primary: Link;
    secondary: Link;
    languagesLabel: string;
    toast: string;
    toastDetail: string;
    completionHint: string;
    codeComment: string;
  };
  stats: { value: string; label: string; detail: string }[];
  paths: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { tag: string; title: string; body: string; cta: string; href: string; icon: string; tone: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    lead: string;
    types: { title: string; body: string; points: string[] };
    modern: { title: string; body: string };
    platforms: { title: string; body: string; rows: [string, boolean, boolean][]; columns: [string, string, string] };
    node: { title: string; body: string };
    reload: { title: string; body: string };
    python: { title: string; body: string };
  };
  sides: {
    eyebrow: string;
    title: string;
    lead: string;
    reloadLabel: string;
    items: { name: string; dir: string; body: string; reload: string; uses: string[]; tone: string }[];
  };
  map: {
    eyebrow: string;
    title: string;
    soon: string;
    groups: { title: string; icon: string; links: Link[] }[];
  };
  cta: {
    title: string;
    body: string;
    primary: Link;
    secondary: Link;
    progressTitle: string;
    progress: { label: string; done: boolean }[];
  };
}

const zh: HomeContent = {
  hero: {
    badge: '基于 GraalJS · 支持 NeoForge 与 Fabric',
    badgeHref: '/reference/api/',
    titleLead: '用现代脚本',
    titleAccent: '重塑你的 Minecraft',
    tagline:
      'NekoJS 把 JavaScript、TypeScript 与 Python 带进 Minecraft。原生 ESM、完整类型补全、热重载与多平台 API，在同一套工作流里完成。',
    primary: { label: '开始第一个脚本', href: '/getting-started/first-script/' },
    secondary: { label: '浏览 API 参考', href: '/reference/api/' },
    languagesLabel: '支持语言',
    toast: '服务端脚本已重新加载',
    toastDetail: '3 个文件 · 0 个错误',
    completionHint: 'Probe 生成的类型提示',
    codeComment: '// 删除木棍配方，并用石头合成钻石'
  },
  stats: [
    { value: '3', label: '脚本语言', detail: 'JavaScript · TypeScript · Python' },
    { value: '2', label: '目标平台', detail: 'NeoForge · Fabric' },
    { value: '4', label: '脚本侧', detail: 'startup · server · client · test' },
    { value: '⟳', label: '即时热重载', detail: '/nekojs reload server' }
  ],
  paths: {
    eyebrow: '选择路线',
    title: '从你现在的位置出发',
    lead: '无论是第一次接触脚本、查找某个绑定，还是从 KubeJS 迁移、为 NekoJS 编写扩展，都有对应的入口。',
    items: [
      {
        tag: '新手',
        title: '写第一个脚本',
        body: '了解脚本目录、开启编辑器补全，并跑通第一个服务端事件。',
        cta: '开始入门',
        href: '/getting-started/first-script/',
        icon: 'rocket',
        tone: 'green'
      },
      {
        tag: '参考',
        title: '查询 API',
        body: '按绑定、事件、类型与成员检索，附带平台与脚本侧可用性。',
        cta: '打开 API 参考',
        href: '/reference/api/',
        icon: 'open-book',
        tone: 'blue'
      },
      {
        tag: '迁移',
        title: '从 KubeJS 迁移',
        body: '对照目录结构、事件与配方写法，把已有脚本平滑迁移过来。',
        cta: '查看配方指南',
        href: '/guides/recipes/modify-recipes/',
        icon: 'random',
        tone: 'amber'
      },
      {
        tag: '进阶',
        title: '开发扩展',
        body: '全局绑定、事件扩展、类型适配器与 Probe backend 的设计说明。',
        cta: '查看开发文档',
        href: '/contributing/docs-architecture/',
        icon: 'puzzle',
        tone: 'violet'
      }
    ]
  },
  features: {
    eyebrow: '核心能力',
    title: '为脚本作者设计的运行时',
    lead: '不只是“能跑脚本”，而是让编辑器、类型、模块和平台差异都变得可见、可查、可依赖。',
    types: {
      title: '类型与补全',
      body: '一条 /nekojs probe 命令，根据当前整合包实际加载的内容生成 .d.ts 与 .pyi 声明。',
      points: ['绑定、事件与成员的自动补全', '参数与返回值类型提示', '整合包更新后重新生成即可同步']
    },
    modern: {
      title: '现代 JavaScript',
      body: '原生 ESM 与 CommonJS 并存，支持 top-level await 和动态导入。'
    },
    platforms: {
      title: '多平台 API',
      body: '每个 API 页面都标注平台可用性，差异一目了然。',
      columns: ['API', 'NeoForge', 'Fabric'],
      rows: [
        ['ServerEvents', true, true],
        ['Utils', true, true],
        ['ClientEvents', true, false]
      ]
    },
    node: {
      title: 'Node.js 兼容模块',
      body: '在安全边界内使用常用的 Node.js 内置模块。'
    },
    reload: {
      title: '热重载',
      body: '修改服务端脚本后无需重启游戏。'
    },
    python: {
      title: 'Python 脚本',
      body: '同一套 API，也可以用 Python 编写。'
    }
  },
  sides: {
    eyebrow: '脚本侧',
    title: '每类脚本都有自己的位置',
    lead: '脚本按运行时机放在不同目录。放对位置，就能决定它何时执行、如何重载。',
    reloadLabel: '重载',
    items: [
      {
        name: '启动脚本',
        dir: 'startup_scripts/',
        body: '游戏启动时执行，用于注册内容。',
        reload: '需要重启游戏',
        uses: ['物品', '方块', '流体', '创造标签页'],
        tone: 'amber'
      },
      {
        name: '服务端脚本',
        dir: 'server_scripts/',
        body: '世界加载时执行，处理游戏逻辑。',
        reload: '/nekojs reload server',
        uses: ['配方', '标签', '事件', '命令'],
        tone: 'green'
      },
      {
        name: '客户端脚本',
        dir: 'client_scripts/',
        body: '仅在客户端执行，负责视觉与交互。',
        reload: '重新进入世界',
        uses: ['按键', 'GUI', '粒子', '渲染'],
        tone: 'blue'
      },
      {
        name: '测试脚本',
        dir: 'test_scripts/',
        body: '显式运行，验证与世界无关的逻辑。',
        reload: '/nekojs test',
        uses: ['单元测试', '断言', '回归检查'],
        tone: 'violet'
      }
    ]
  },
  map: {
    eyebrow: '文档地图',
    title: '所有内容，一页总览',
    soon: '即将推出',
    groups: [
      {
        title: '开始使用',
        icon: 'rocket',
        links: [
          { label: '第一个脚本', href: '/getting-started/first-script/' },
          { label: '目录结构', href: '/getting-started/directory-layout/' },
          { label: '安装与环境', href: '#', soon: true }
        ]
      },
      {
        title: '指南',
        icon: 'document',
        links: [
          { label: '修改配方', href: '/guides/recipes/modify-recipes/' },
          { label: '自定义物品与方块', href: '#', soon: true },
          { label: '事件系统', href: '#', soon: true }
        ]
      },
      {
        title: 'API 参考',
        icon: 'open-book',
        links: [
          { label: 'API 总览', href: '/reference/api/' },
          { label: 'Utils', href: '/reference/api/generated/utils/' },
          { label: '事件索引', href: '#', soon: true }
        ]
      },
      {
        title: '贡献与开发',
        icon: 'puzzle',
        links: [
          { label: '文档架构', href: '/contributing/docs-architecture/' },
          { label: '翻译指南', href: '#', soon: true },
          { label: 'GitHub 源码', href: 'https://github.com/NekoJS-Dev/NekoJS' }
        ]
      }
    ]
  },
  cta: {
    title: '这份 Wiki 正在和 NekoJS 一起成长',
    body: 'API 页面由运行时快照自动生成，指南与翻译欢迎社区共同完善。发现错误或缺失内容？直接在 GitHub 上提出。',
    primary: { label: '参与贡献', href: '/contributing/docs-architecture/' },
    secondary: { label: 'GitHub', href: 'https://github.com/NekoJS-Dev/NekoJS' },
    progressTitle: '建设进度',
    progress: [
      { label: 'API 快照与页面生成', done: true },
      { label: '中文 / 英文 overlay', done: true },
      { label: '示例类型检查', done: true },
      { label: 'JSON Probe backend 接入', done: false }
    ]
  }
};

const en: HomeContent = {
  hero: {
    badge: 'Powered by GraalJS · NeoForge & Fabric',
    badgeHref: '/en/reference/api/',
    titleLead: 'Modern scripting',
    titleAccent: 'for Minecraft',
    tagline:
      'NekoJS brings JavaScript, TypeScript and Python to Minecraft. Native ESM, full type completion, hot reload and multi-platform APIs in one workflow.',
    primary: { label: 'Write your first script', href: '/en/getting-started/first-script/' },
    secondary: { label: 'Browse the API', href: '/en/reference/api/' },
    languagesLabel: 'Languages',
    toast: 'Server scripts reloaded',
    toastDetail: '3 files · 0 errors',
    completionHint: 'Types generated by Probe',
    codeComment: '// Remove sticks, craft diamonds from stone'
  },
  stats: [
    { value: '3', label: 'Languages', detail: 'JavaScript · TypeScript · Python' },
    { value: '2', label: 'Platforms', detail: 'NeoForge · Fabric' },
    { value: '4', label: 'Script sides', detail: 'startup · server · client · test' },
    { value: '⟳', label: 'Hot reload', detail: '/nekojs reload server' }
  ],
  paths: {
    eyebrow: 'Pick a path',
    title: 'Start from where you are',
    lead: 'Whether you are writing your first script, looking up a binding, migrating from KubeJS or building an extension, there is an entry point for you.',
    items: [
      {
        tag: 'Beginner',
        title: 'Your first script',
        body: 'Learn the script folders, enable editor completion and run your first server event.',
        cta: 'Get started',
        href: '/en/getting-started/first-script/',
        icon: 'rocket',
        tone: 'green'
      },
      {
        tag: 'Reference',
        title: 'Look up the API',
        body: 'Search bindings, events, types and members with platform and side availability.',
        cta: 'Open the reference',
        href: '/en/reference/api/',
        icon: 'open-book',
        tone: 'blue'
      },
      {
        tag: 'Migrate',
        title: 'Coming from KubeJS',
        body: 'Compare folders, events and recipe syntax to move existing scripts over smoothly.',
        cta: 'Read the recipe guide',
        href: '/en/guides/recipes/modify-recipes/',
        icon: 'random',
        tone: 'amber'
      },
      {
        tag: 'Advanced',
        title: 'Build extensions',
        body: 'Global bindings, event extensions, type adapters and the Probe backend design.',
        cta: 'Developer docs',
        href: '/en/contributing/docs-architecture/',
        icon: 'puzzle',
        tone: 'violet'
      }
    ]
  },
  features: {
    eyebrow: 'Capabilities',
    title: 'A runtime built for script authors',
    lead: 'More than “it runs scripts”: editors, types, modules and platform differences become visible, searchable and dependable.',
    types: {
      title: 'Types & completion',
      body: 'One /nekojs probe command generates .d.ts and .pyi declarations from what your modpack actually loads.',
      points: ['Completion for bindings, events and members', 'Parameter and return type hints', 'Re-run after modpack updates to stay in sync']
    },
    modern: {
      title: 'Modern JavaScript',
      body: 'Native ESM alongside CommonJS, with top-level await and dynamic imports.'
    },
    platforms: {
      title: 'Multi-platform API',
      body: 'Every API page shows platform availability so differences are obvious.',
      columns: ['API', 'NeoForge', 'Fabric'],
      rows: [
        ['ServerEvents', true, true],
        ['Utils', true, true],
        ['ClientEvents', true, false]
      ]
    },
    node: {
      title: 'Node.js modules',
      body: 'Use familiar Node.js built-ins inside a safe sandbox.'
    },
    reload: {
      title: 'Hot reload',
      body: 'Change server scripts without restarting the game.'
    },
    python: {
      title: 'Python scripts',
      body: 'The same API, written in Python.'
    }
  },
  sides: {
    eyebrow: 'Script sides',
    title: 'Every script has its place',
    lead: 'Scripts live in folders by when they run. Put a script in the right place and you decide when it executes and how it reloads.',
    reloadLabel: 'Reload',
    items: [
      {
        name: 'Startup',
        dir: 'startup_scripts/',
        body: 'Runs at game launch to register content.',
        reload: 'Restart the game',
        uses: ['Items', 'Blocks', 'Fluids', 'Creative tabs'],
        tone: 'amber'
      },
      {
        name: 'Server',
        dir: 'server_scripts/',
        body: 'Runs when a world loads and drives gameplay.',
        reload: '/nekojs reload server',
        uses: ['Recipes', 'Tags', 'Events', 'Commands'],
        tone: 'green'
      },
      {
        name: 'Client',
        dir: 'client_scripts/',
        body: 'Runs only on the client for visuals and input.',
        reload: 'Rejoin the world',
        uses: ['Keybinds', 'GUI', 'Particles', 'Rendering'],
        tone: 'blue'
      },
      {
        name: 'Test',
        dir: 'test_scripts/',
        body: 'Run explicitly to verify world-independent logic.',
        reload: '/nekojs test',
        uses: ['Unit tests', 'Assertions', 'Regressions'],
        tone: 'violet'
      }
    ]
  },
  map: {
    eyebrow: 'Docs map',
    title: 'Everything at a glance',
    soon: 'Soon',
    groups: [
      {
        title: 'Getting started',
        icon: 'rocket',
        links: [
          { label: 'First script', href: '/en/getting-started/first-script/' },
          { label: 'Directory layout', href: '/en/getting-started/directory-layout/' },
          { label: 'Installation', href: '#', soon: true }
        ]
      },
      {
        title: 'Guides',
        icon: 'document',
        links: [
          { label: 'Modify recipes', href: '/en/guides/recipes/modify-recipes/' },
          { label: 'Custom items & blocks', href: '#', soon: true },
          { label: 'Event system', href: '#', soon: true }
        ]
      },
      {
        title: 'API reference',
        icon: 'open-book',
        links: [
          { label: 'API overview', href: '/en/reference/api/' },
          { label: 'Utils', href: '/en/reference/api/generated/utils/' },
          { label: 'Event index', href: '#', soon: true }
        ]
      },
      {
        title: 'Contributing',
        icon: 'puzzle',
        links: [
          { label: 'Docs architecture', href: '/en/contributing/docs-architecture/' },
          { label: 'Translation guide', href: '#', soon: true },
          { label: 'GitHub source', href: 'https://github.com/NekoJS-Dev/NekoJS' }
        ]
      }
    ]
  },
  cta: {
    title: 'This wiki grows together with NekoJS',
    body: 'API pages are generated from runtime snapshots, and guides and translations are open to the community. Found a mistake or a gap? Open an issue on GitHub.',
    primary: { label: 'Contribute', href: '/en/contributing/docs-architecture/' },
    secondary: { label: 'GitHub', href: 'https://github.com/NekoJS-Dev/NekoJS' },
    progressTitle: 'Progress',
    progress: [
      { label: 'API snapshots & page generation', done: true },
      { label: 'Chinese / English overlays', done: true },
      { label: 'Type-checked examples', done: true },
      { label: 'JSON Probe backend', done: false }
    ]
  }
};

export function getHomeContent(lang: string | undefined): HomeContent {
  return lang?.toLowerCase().startsWith('en') ? en : zh;
}
