import { readdirSync } from 'fs'

const routes: Record<string, any> = {}

for (const file of readdirSync('./pages')) {
  if (!file.endsWith('.html')) continue

  const name = file.replace('.html', '')
  const path = name === 'index' ? '/' : `/${name}`

  const mod = await import(`./pages/${file}`)
  routes[path] = mod.default
}

routes['/'] = new Response(
  `<h1>Pages</h1><ul>
    ${Object.keys(routes)
      .map((p) => `<li><a href="${p}">${p}</a></li>`)
      .join('')}
  </ul>`,
  { headers: { 'Content-Type': 'text/html' } },
)

console.log(routes)
const server = Bun.serve({
  port: 3000,
  routes,
})

console.log(`Now listening at ${server.url}`)
