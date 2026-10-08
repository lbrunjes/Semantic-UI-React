import fs from 'fs'
import path from 'path'

// Copies all `.d.ts` files from `src/` to the target directory, preserving the folder structure.
// Usage: node scripts/copy-typings.mjs dist/commonjs

const [outDir] = process.argv.slice(2)

if (!outDir) {
  throw new Error('Usage: node scripts/copy-typings.mjs <outDir>')
}

const srcDir = path.resolve('src')

const copyTypings = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      copyTypings(entryPath)
      return
    }

    if (entry.name.endsWith('.d.ts')) {
      const targetPath = path.resolve(outDir, path.relative(srcDir, entryPath))

      fs.mkdirSync(path.dirname(targetPath), { recursive: true })
      fs.copyFileSync(entryPath, targetPath)
    }
  })
}

copyTypings(srcDir)
