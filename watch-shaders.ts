import {
  watch,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from 'fs'
import { join, basename, extname } from 'path'

const SHADERS_DIR = './src/shaders'
const BUILD_DIR = './src/shaders/build'

mkdirSync(BUILD_DIR, { recursive: true })

const buildIndex = () => {
  const files = readdirSync(BUILD_DIR)
  const out = files.map((f) => `export * from './build/${f}'`).join('\n')
  const outPath = join(SHADERS_DIR, `index.ts`)
  writeFileSync(outPath, out)
  console.log(`Index rebuilt`)
}

const getGeneratedFileName = (filePath: string) => {
  const name = basename(filePath, extname(filePath))
  const ext = extname(filePath).slice(1) // e.g. "vert"
  return `${name}.${ext}.ts`
}
const buildShader = (filePath: string) => {
  const name = basename(filePath, extname(filePath))
  const ext = extname(filePath).slice(1) // e.g. "vert"
  try {
    const src = readFileSync(filePath, 'utf8')
    const out = `export const ${name}_${ext} = ${JSON.stringify(src)};\n`
    const outPath = join(BUILD_DIR, getGeneratedFileName(filePath))
    writeFileSync(outPath, out)
    console.log(`Built: ${outPath}`)
  } catch {
    console.log(`${filePath} doesn't exist.`)
  }
}

const cleanShaders = (filenames: string[]) => {
  const builtFilenames = new Set(readdirSync(BUILD_DIR))
  const orphaned = builtFilenames.difference(
    new Set(filenames.map(getGeneratedFileName)),
  )
  orphaned.forEach((fn) => {
    console.log('Deleting ', join(BUILD_DIR, fn))
    unlinkSync(join(BUILD_DIR, fn))
  })
}

const initialBuild = () => {
  const filenames = readdirSync(SHADERS_DIR)
  cleanShaders(filenames)
  for (let filename of filenames) {
    const ext = extname(filename).slice(1)
    if (!['glsl', 'vert', 'frag'].includes(ext)) return
    buildShader(join(SHADERS_DIR, filename))
  }
}

initialBuild()
buildIndex()

watch(SHADERS_DIR, { recursive: false }, (_, filename) => {
  if (!filename) return
  const ext = extname(filename).slice(1)
  if (!['glsl', 'vert', 'frag'].includes(ext)) return
  buildShader(join(SHADERS_DIR, filename))
})

watch(BUILD_DIR, { recursive: false }, (event, _) => {
  if (event === 'rename') buildIndex()
})

console.log(`Watching ${SHADERS_DIR}...`)
