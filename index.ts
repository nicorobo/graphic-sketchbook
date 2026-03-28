import index from './pages/index.html'
import canvas from './pages/canvas.html'
import field from './pages/flow-field.html'
import field2 from './pages/flow-field-2.html'
import grid from './pages/grid.html'
import isometric from './pages/isometric.html'
import isowire from './pages/isowire.html'

const server = Bun.serve({
  port: 3000,
  routes: {
    '/': index,
    '/canvas': canvas,
    '/field': field,
    '/field2': field2,
    '/grid': grid,
    '/isometric': isometric,
    '/isowire': isowire,
  },
})
console.log(`Now listening at ${server.url}`)
