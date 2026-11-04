/** The bundle's substance is its patch file and the Desktop bundle names it owns. */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as yaml from 'js-yaml'
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include'
import { PILOT_BUNDLE, PILOT_SUPERSEDED_BUNDLES } from '../src/index.ts'

describe('dsh-pilot bundle', () => {
  it('inserts dsh-taskboard and dsh-context from its declared dependencies', () => {
    const root = fileURLToPath(new URL('..', import.meta.url))
    const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      name: string
      dependencies?: Record<string, string>
      dsh?: { bundle?: { patch?: string } }
    }
    expect(manifest.name).toBe(PILOT_BUNDLE)
    expect(manifest.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(manifest.dependencies).toEqual({
      'dsh-context': '^0.77.0',
      'dsh-taskboard': '^0.9.6',
    })
    const parsed = yaml.load(
      readFileSync(resolve(root, manifest.dsh!.bundle!.patch!), 'utf8'),
      { schema: entryListSchema },
    )
    const rows = (parsed as { insert?: { id?: string; name?: string }[] }[]).flatMap(patch => patch.insert ?? [])
    expect(rows.map(row => row.id)).toEqual([...PILOT_SUPERSEDED_BUNDLES])
    expect(rows.map(row => row.name)).toEqual([...PILOT_SUPERSEDED_BUNDLES])
  })
})
