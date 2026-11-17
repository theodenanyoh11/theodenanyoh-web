// Requests every public route and fails if one does not answer 200 or lacks an H1.
// Usage: node scripts/smoke.mjs [baseUrl]
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')

const staticRoutes = [
  { path: '/', h1: true },
  { path: '/posts', h1: true },
  { path: '/projects', h1: true },
  { path: '/products', h1: true },
  { path: '/search', h1: true },
  { path: '/admin/login', h1: false },
  { path: '/sitemap.xml', h1: false },
]

// One detail page per collection, taken from the first document the API returns.
const collections = [
  { api: 'posts', prefix: '/posts/' },
  { api: 'projects', prefix: '/projects/' },
  { api: 'products', prefix: '/products/' },
  // CMS pages choose their own hero, so an H1 is not guaranteed there.
  { api: 'pages', prefix: '/', skip: 'home', h1: false },
]

async function detailRoutes() {
  const routes = []
  for (const { api, prefix, skip, h1 = true } of collections) {
    const res = await fetch(`${base}/api/${api}?limit=5&depth=0`)
    if (!res.ok) {
      routes.push({ path: `/api/${api}`, h1: false, forced: res.status })
      continue
    }
    const { docs } = await res.json()
    const doc = docs.find((d) => d.slug && d.slug !== skip)
    if (doc) routes.push({ path: `${prefix}${doc.slug}`, h1 })
    else console.log(`SKIP ${prefix}[slug] (no ${api} documents)`)
  }
  return routes
}

let failed = 0
for (const route of [...staticRoutes, ...(await detailRoutes())]) {
  let status = route.forced
  let hasH1 = true
  if (!status) {
    const res = await fetch(base + route.path, { redirect: 'follow' })
    status = res.status
    if (route.h1) hasH1 = /<h1[\s>]/i.test(await res.text())
  }
  const ok = status === 200 && hasH1
  if (!ok) failed++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${status} ${route.path}${hasH1 ? '' : ' (no h1)'}`)
}

if (failed) {
  console.error(`${failed} route(s) failed`)
  process.exit(1)
}
