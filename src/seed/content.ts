// Content for the redesigned site.
//
// Lines marked PLACEHOLDER were written by the build and need Theo's review
// before this is loaded into production.

export const assets = 'docs/design/assets'

export const media = {
  // key: [file, alt]
  // Supplied by Theo on 17 November 2026. 653 pixels wide, so it is a little soft at hero size.
  portrait: ['photos/theo-portrait-brick.jpg', 'Theo Denanyoh'],
  signature: ['photos/theo-signature.svg', "Theo's signature"],
  paycor: ['logos/paycor.svg', 'Paycor'],
  paychex: ['logos/paychex.svg', 'Paychex'],
  morganStanley: ['logos/morgan-stanley.svg', 'Morgan Stanley'],
  cleanlyLogo: ['logos/cleanly-2026.svg', 'Cleanly'],
  tillyLogo: ['logos/tilly-2026.svg', 'Tilly'],
  directoryhubLogo: ['logos/directoryhub-mark-2026.svg', 'DirectoryHub'],
  franklinLogo: ['logos/franklin.svg', 'Franklin'],
  packerboxLogo: ['logos/packerbox.svg', 'PackerBox'],
  afrojobsLogo: ['logos/afrojobs.png', 'AfroJobs'],
  founderhubosLogo: ['logos/founderhubos.svg', 'FounderHubOS'],
  helpcenterLogo: ['logos/helpcenter-design.svg', 'helpcenter.design'],
  // Captured from a demo account on 17 November 2026.
  cleanlyTile: [
    'tiles/cleanly-jobs-2026.png',
    "Cleanly's jobs view, with crews and times for the day",
  ],
  tillyTile: ['tiles/tilly-morning-brief.png', 'Tilly morning brief on a phone'],
  // From directoryhub.app, November 2026: a directory built with the product.
  directoryhubTile: [
    'tiles/directoryhub-makers-shelf.jpg',
    "Maker's Shelf, a directory site built with DirectoryHub",
  ],
  chimepostTile: ['tiles/chimepost-calendar.png', 'Chimepost content calendar'],
  tgTile: ['tiles/tg-finished-room.jpg', 'A finished room cleaned by TG Cleaning'],
  packerboxTile: ['tiles/packerbox-hero.png', 'PackerBox reusable moving boxes'],
  oliverTile: ['tiles/oliver-today.png', 'Oliver family display showing today'],
  helpcenterTile: ['tiles/helpcenter-logo.png', 'helpcenter.design logo'],
} as const

export type MediaKey = keyof typeof media

type Stage = 'live' | 'building' | 'private' | 'retired'
type Tint =
  'mint' | 'rose' | 'peach' | 'sky' | 'mist' | 'cobalt-soft' | 'gold' | 'gold-soft' | 'ink'

export type SeedProject = {
  slug: string
  name: string
  summary: string
  stage: Stage
  statusLabel?: string
  tint: Tint
  tileSpan?: '4' | '8'
  homeOrder?: number
  tileImage?: MediaKey
  logo?: MediaKey
  badge?: string
  sampleNote?: string
  sampleRows?: { text: string; on: boolean }[]
  url?: string
  role?: string
  year?: string
  platforms?: ('web' | 'ios' | 'android')[]
  headline?: string
  sections?: {
    heading: string
    lead?: string
    body?: string
    cards?: { title: string; body: string }[]
    image?: MediaKey
    caption?: string
  }[]
  takeaway?: string
  facts?: { label: string; value: string }[]
}

export const projects: SeedProject[] = [
  {
    slug: 'cleanly',
    name: 'Cleanly',
    summary:
      'The operating system for cleaning businesses, tested every week inside my own cleaning company.',
    stage: 'live',
    statusLabel: 'Live · Web, iOS, Android',
    tint: 'rose',
    tileSpan: '8',
    homeOrder: 1,
    tileImage: 'cleanlyTile',
    logo: 'cleanlyLogo',
    url: 'https://cleanlyhq.com',
    role: 'Founder, product, design and engineering',
    year: '2024 to now',
    platforms: ['web', 'ios', 'android'],
    // Reviewed by Theo on 17 November 2026.
    headline: 'Cleanly: the operating system for cleaning businesses',
    sections: [
      {
        heading: 'The problem',
        lead: "A cleaning company with five cleaners runs on group texts, a paper calendar and a spreadsheet of who owes what. The owner spends evenings rebuilding tomorrow's schedule instead of winning the next client.",
        body: 'I know this first hand. I run TG Cleaning, a local cleaning company, and none of the tools I tried fit a team of our size. They were built for one-person operations or for franchises with an office.',
      },
      {
        heading: 'What I built',
        body: 'One system for the whole job: clients, quotes, scheduling, team check-ins, payments and a client portal. Cleaners use the phone app in English, Spanish or Portuguese. Each business gets its own branded booking site.',
        cards: [
          {
            title: 'Schedule',
            body: 'Recurring jobs generate themselves. Crew check-ins and photos prove the work.',
          },
          { title: 'Get paid', body: 'Quotes turn into invoices. Clients pay from the portal.' },
        ],
      },
      {
        heading: 'How I test it',
        body: 'I use it in my own cleaning company every week, and that shapes what ships.',
        image: 'tgTile',
        caption: "A finished job at TG Cleaning, Cleanly's first customer.",
      },
    ],
    takeaway:
      'I can take a product from a real customer problem to a shipped app on three platforms.',
    facts: [
      { label: 'Role', value: 'Founder, product, design, engineering' },
      { label: 'Platforms', value: 'Web, iOS, Android' },
      { label: 'Languages', value: 'English, Spanish, Portuguese' },
      { label: 'Stack', value: 'Next.js, Convex, Expo' },
      { label: 'Built for', value: 'Commercial cleaning crews' },
    ],
  },
  {
    slug: 'tilly',
    name: 'Tilly',
    summary: 'A private chief of staff for your calendar and tasks.',
    stage: 'live',
    statusLabel: 'App Store',
    tint: 'peach',
    homeOrder: 2,
    tileImage: 'tillyTile',
    logo: 'tillyLogo',
    url: 'https://trytilly.com',
    platforms: ['ios'],
  },
  {
    slug: 'directoryhub',
    name: 'DirectoryHub',
    summary: 'Launch a niche directory site without code.',
    stage: 'live',
    statusLabel: 'Live',
    tint: 'cobalt-soft',
    homeOrder: 3,
    tileImage: 'directoryhubTile',
    logo: 'directoryhubLogo',
    url: 'https://directoryhub.app',
    platforms: ['web'],
  },
  {
    slug: 'marshedge',
    name: 'marsHedge',
    summary: 'Turns your options trading history into rules you follow.',
    stage: 'building',
    statusLabel: 'In build',
    tint: 'ink',
    homeOrder: 4,
    // Sample data only. The real product screens show private trading results.
    sampleNote: 'Your rules · sample data',
    sampleRows: [
      { text: 'Sell 4 days before expiration', on: true },
      { text: 'Spend up to $500 a trade', on: true },
      { text: 'Up to 5 new trades a week', on: false },
    ],
  },
  {
    slug: 'chimepost',
    name: 'Chimepost',
    summary: 'Plan and publish social posts as a team, no shared passwords.',
    stage: 'building',
    statusLabel: 'In build · Open source',
    tint: 'mint',
    homeOrder: 5,
    tileImage: 'chimepostTile',
    platforms: ['web'],
  },
  {
    slug: 'tg-cleaning',
    name: 'TG Cleaning',
    summary: "The cleaning company I run. Cleanly's first customer.",
    stage: 'live',
    statusLabel: 'Operating',
    tint: 'gold',
    homeOrder: 6,
    tileImage: 'tgTile',
    badge: 'Not software',
  },
  {
    slug: 'packerbox',
    name: 'PackerBox',
    summary: 'Reusable moving boxes, delivered before your move and picked up after.',
    stage: 'building',
    statusLabel: 'Relaunching',
    tint: 'sky',
    tileSpan: '8',
    homeOrder: 7,
    tileImage: 'packerboxTile',
    logo: 'packerboxLogo',
    url: 'https://packerbox.co',
  },
  {
    slug: 'oliver',
    name: 'Oliver',
    summary: 'A shared family assistant for schedules, lists and reminders.',
    stage: 'building',
    statusLabel: 'Prototype',
    tint: 'mist',
    homeOrder: 8,
    tileImage: 'oliverTile',
  },
  {
    slug: 'helpcenter-design',
    name: 'helpcenter.design',
    summary: 'Help centers worth copying.',
    stage: 'building',
    statusLabel: 'Brand done',
    tint: 'gold-soft',
    homeOrder: 9,
    tileImage: 'helpcenterTile',
    logo: 'helpcenterLogo',
  },
  {
    slug: 'franklin',
    name: 'Franklin',
    summary: 'An embedded help center and AI chat widget for SaaS teams.',
    stage: 'live',
    tint: 'mist',
    logo: 'franklinLogo',
    url: 'https://franklinhelp.com',
    platforms: ['web'],
  },
  {
    slug: 'afrojobs',
    name: 'AfroJobs',
    summary: 'Tech and startup jobs for people of color.',
    stage: 'live',
    tint: 'mint',
    logo: 'afrojobsLogo',
    url: 'https://afrojobs.app',
    platforms: ['web'],
  },
  {
    slug: 'founderhubos',
    name: 'FounderHubOS',
    summary: 'The portfolio command center for founders.',
    stage: 'live',
    tint: 'cobalt-soft',
    logo: 'founderhubosLogo',
    url: 'https://founderhubos.com',
    platforms: ['web'],
  },
  {
    slug: 'beacon',
    name: 'Beacon',
    summary: 'Account health, churn risk and renewals for customer success teams.',
    stage: 'retired',
    statusLabel: 'MVP',
    year: '2026',
    tint: 'sky',
  },
  {
    slug: 'creatorbox',
    name: 'CreatorBox',
    summary: 'A directory of software, hardware and services for content creators.',
    stage: 'retired',
    statusLabel: 'MVP',
    year: '2024',
    tint: 'mist',
  },
  {
    slug: 'stylebook',
    name: 'StyleBook',
    summary: 'A voice agent that takes bookings for barbers and stylists.',
    stage: 'retired',
    statusLabel: 'Idea',
    year: '2024',
    tint: 'mist',
  },
  {
    slug: 'built-in-africa',
    name: 'Built In Africa',
    summary: 'A talent network for companies hiring across Africa. It became AfroJobs.',
    stage: 'retired',
    statusLabel: 'MVP',
    year: '2024',
    tint: 'mist',
  },
]

// Figures are softened on purpose. The PDF resume carries the exact numbers.
export const experience: {
  role: string
  company: string
  companyNote?: string
  logo?: MediaKey
  startDate: string
  endDate?: string
  current?: boolean
  period?: string
  location?: string
  summary?: string
  outcomes: string[]
  link?: { label: string; href: string }
  order: number
}[] = [
  {
    role: 'Group Product Manager',
    company: 'Paycor',
    companyNote: 'a Paychex company',
    logo: 'paycor',
    startDate: '2018-01-01',
    current: true,
    location: 'Cincinnati, Ohio',
    summary:
      'I lead a portfolio of three product teams and manage three senior PMs, setting strategy for partner revenue and the support experience.',
    outcomes: [
      'Launched a support and partner channel strategy with eight-figure revenue impact in two years. Support contacts fell by a third.',
      'Moved feature delivery from every two weeks to twice a week.',
      'Raised team satisfaction by nearly half with regular portfolio workshops.',
    ],
    order: 1,
  },
  {
    role: 'Senior Technical Product Manager',
    company: 'Paycor',
    logo: 'paychex',
    startDate: '2018-01-01', // Shown as "Earlier at Paycor". Theo chose not to show dates.
    period: 'Earlier at Paycor',
    location: 'Cincinnati, Ohio',
    outcomes: [
      'Migrated service teams to Salesforce Lightning and cut average handle time by about a third in three months.',
      'Embedded a softphone in Service Cloud and sped up resolution by a fifth.',
    ],
    order: 2,
  },
  {
    role: 'Senior Product Owner and Business Analyst',
    company: 'Morgan Stanley',
    logo: 'morganStanley',
    startDate: '2011-12-01',
    endDate: '2017-02-01',
    location: 'Columbus, Ohio',
    outcomes: [
      'Led requirements and UX workshops for the web app redesign and mobile app launch. CSAT and NPS rose by double digits.',
      'Coached eight associates in Scrum and Kanban. Two moved into product roles within six months.',
    ],
    order: 3,
  },
  {
    role: 'Founder, KrumaLabs',
    company: 'KrumaLabs',
    startDate: '2023-12-01',
    current: true,
    location: 'Nights and weekends',
    summary:
      'My studio. I design, build and launch products end to end, which keeps my hands on the tools my teams use.',
    outcomes: [],
    link: { label: 'See the work', href: '/projects' },
    order: 4,
  },
]

export const logoStrip: { name: string; logo: MediaKey; showName?: boolean }[] = [
  { name: 'Paycor', logo: 'paycor' },
  { name: 'Paychex', logo: 'paychex' },
  { name: 'Morgan Stanley', logo: 'morganStanley' },
  { name: 'Cleanly', logo: 'cleanlyLogo' },
  { name: 'Tilly', logo: 'tillyLogo', showName: true },
  { name: 'DirectoryHub', logo: 'directoryhubLogo', showName: true },
  { name: 'Franklin', logo: 'franklinLogo' },
  { name: 'PackerBox', logo: 'packerboxLogo' },
  { name: 'AfroJobs', logo: 'afrojobsLogo', showName: true },
  { name: 'FounderHubOS', logo: 'founderhubosLogo' },
  { name: 'helpcenter.design', logo: 'helpcenterLogo' },
]

export const site = {
  hero: {
    eyebrow: 'Group Product Manager · Founder, KrumaLabs',
    headline: 'A product leader\nwho still ships.',
    // The hero does not name an employer.
    intro:
      'I lead product teams in HR software by day. On nights and weekends I design, build and launch my own software, including Cleanly, Tilly and DirectoryHub.',
  },
  videoResume: { url: '', duration: '1:30' },
  // No public email. People book a call or use the contact form.
  contactEmail: null,
  resumeUrl: 'https://drive.google.com/file/d/1LdStBPJzC_n_f5OmxWgmlG-Hbbp71_YQ/view',
  bookingUrl: 'https://app.trytilly.com/theo',
  social: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/theodenanyoh' },
    { label: 'GitHub', url: 'https://github.com/theodenanyoh11' },
    { label: 'Bluesky', url: 'https://bsky.app/profile/theodenanyoh.com' },
  ],
  about: {
    headline: 'Born in Accra. Building in Columbus',
    intro:
      "I'm Theo. I'm a dad, a husband and a product leader. I like products that look good and solve a problem someone actually has.",
    facts: [
      { label: 'Based in', value: 'Columbus, Ohio' },
      { label: 'Day job', value: 'Group Product Manager' },
      { label: 'Studio', value: 'KrumaLabs' },
      { label: 'Also runs', value: 'TG Cleaning, PackerBox' },
    ],
    story: [
      {
        place: 'Accra',
        title: 'My first product was an alumni site on GeoCities',
        body: 'I was born in Accra, Ghana and moved to the US in my early teens. I wanted my junior high class at St. Martin de Porres to stay in touch, so I built them a page. It was my first no-code tool and my first users.',
      },
      {
        place: 'Cleveland',
        title: 'I left college to start TagUs Web',
        body: 'I went to study aerospace engineering and kept drifting to computer science. A friend and I started building websites for businesses around town. It was not hugely profitable. The lessons still shape how I work.',
      },
      {
        place: 'Columbus',
        title: 'Product by day, studio by night',
        body: "I have carried that owner's mindset into every role since, from Morgan Stanley to leading a product portfolio today. KrumaLabs is where I keep building my own.",
      },
    ],
  },
  experiencePage: {
    headline: 'Over ten years in product, from analyst to group lead',
    intro:
      'I lead a product portfolio in B2B SaaS and coach the PMs who run it. Here is the path, with the outcomes.',
    habits: [
      {
        title: 'Think like an owner',
        body: 'I left college to start a web business. I still read a roadmap as a list of bets with a cost.',
      },
      {
        title: 'Coach the PMs',
        body: 'My job is the people who run the products. I mentor weekly, and I use AI as a co-pilot in those sessions.',
      },
      {
        title: 'Stay on the tools',
        body: 'I build my own products so I know what a deadline costs the people doing the work.',
      },
    ],
    certifications: [
      { name: 'Pragmatic Certified Product Manager', year: '2024' },
      { name: 'Salesforce Associate', year: '2023' },
      { name: 'Salesforce Certified Administrator', year: '2020' },
    ],
    also: [
      { name: 'Board member, Village Youth Soccer Academy, Accra', year: '2025 to now' },
      { name: 'Founder, TagUs Web', year: '2004' },
      { name: 'Case Western Reserve University', year: '2003 to 2004' },
    ],
  },
}

export const products = [
  {
    slug: 'consulting',
    kind: 'consulting' as const,
    name: 'Product strategy or a working build, by the hour or by the project.',
    summary: 'For founders who need a product lead before they can hire one.',
    ctaLabel: 'Book a call',
  },
  // Theo confirmed all three engagements on 17 November 2026. Prices are on request.
  {
    slug: 'product-review-call',
    kind: 'engagement' as const,
    term: 'One hour',
    name: 'Product review call',
    summary:
      'Bring a roadmap, a prototype or a pricing page. Leave with a written list of what I would change first.',
    priceLabel: 'Price on request',
  },
  {
    slug: 'prototype-sprint',
    kind: 'engagement' as const,
    term: 'Two weeks',
    name: 'Prototype sprint',
    summary:
      'A clickable, working first version of your idea, designed and built by me, ready to show customers.',
    priceLabel: 'Price on request',
  },
  {
    slug: 'fractional-product-lead',
    kind: 'engagement' as const,
    term: 'Ongoing',
    name: 'Fractional product lead',
    summary:
      'A few hours a week of product leadership for a team that is not ready for a full-time hire.',
    priceLabel: 'Price on request',
  },
  {
    slug: 'help-center-design-templates',
    kind: 'template' as const,
    name: 'Help center design templates',
    summary: 'Layouts for a help center your customers can use.',
    // Planned, not yet for sale.
    comingSoon: true,
    priceLabel: '',
  },
  {
    slug: 'ships-tee',
    kind: 'merch' as const,
    // Planned, not yet for sale.
    name: 'The "ships." tee',
    summary: 'For people who finish things. More on the way.',
    comingSoon: true,
  },
]

// PLACEHOLDER: local sample posts. Production already has Theo's real posts.
export const posts = [
  {
    slug: 'web-vitals-explained-in-six-minutes',
    kind: 'video' as const,
    title: 'Web vitals, explained in six minutes',
    category: 'Build log',
    duration: '6 min',
    excerpt: 'Episode one of my video series on how the products get built, one concept at a time.',
  },
  {
    slug: 'introducing-sfdcjuice',
    kind: 'article' as const,
    title: 'Introducing sfdcJuice: Helpjuice and Salesforce Knowledge in one search',
    category: 'Engineering',
    duration: '6 min',
    excerpt: 'Why I built one search across two knowledge bases, and how it works.',
  },
  {
    slug: 'product-management-in-tech-startups',
    kind: 'article' as const,
    title: 'Navigating the challenges of product management in tech startups',
    category: 'Product',
    duration: '8 min',
    excerpt: 'What changes when the roadmap, the team and the runway are all small.',
  },
  {
    slug: 'getting-certified-in-salesforce',
    kind: 'article' as const,
    title: 'Building expertise and getting certified in Salesforce',
    category: 'Career',
    duration: '7 min',
    excerpt: 'How I studied for the Salesforce certifications while leading product teams.',
  },
]

export const contactReasons = [
  'Hiring a product leader',
  'Looking for a co-founder',
  'Need something built',
  'Something else',
]
