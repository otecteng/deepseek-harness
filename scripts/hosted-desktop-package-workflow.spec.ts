import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import yaml from 'js-yaml'
import { expect, it } from 'vitest'

const workflow = yaml.load(readFileSync(resolve(import.meta.dirname, '../.github/workflows/desktop-hosted-package.yml'), 'utf8')) as {
  on: Record<string, unknown>
  permissions: Record<string, string>
  concurrency: { group: string; 'cancel-in-progress': boolean }
  jobs: Record<string, {
    'runs-on': string
    defaults?: { run?: { shell?: string } }
    steps: Array<{
      name?: string
      if?: string
      uses?: string
      run?: string
      with?: Record<string, unknown>
    }>
  }>
}

it('builds unsigned macOS arm64 and Windows x64 packages on GitHub-hosted runners', () => {
  expect(Object.keys(workflow.on)).toEqual(['workflow_dispatch'])
  expect(workflow.permissions).toEqual({ contents: 'read' })
  expect(workflow.concurrency).toEqual({
    group: 'hosted-desktop-package-${{ github.ref }}',
    'cancel-in-progress': false,
  })
  expect(workflow.jobs['mac-arm64']!['runs-on']).toBe('macos-15')
  expect(workflow.jobs['win-x64']!['runs-on']).toBe('windows-2025')
  expect(workflow.jobs['win-x64']!.defaults?.run?.shell).toBe('pwsh')
  expect(JSON.stringify(workflow)).not.toMatch(/secrets\.|dsh-mac-package-trial|dsh-win-package-trial/)

  const mac = workflow.jobs['mac-arm64']!.steps.find(step => step.name === 'Package unsigned DMG')
  const windows = workflow.jobs['win-x64']!.steps.find(step => step.name === 'Package unsigned installer')
  expect(mac?.run).toContain('package:desktop:mac:arm64:unsigned')
  expect(windows?.run).toContain('package:desktop:win:x64:unsigned')
  expect(mac?.run).not.toContain('package:desktop:mac:arm64 --')
  expect(windows?.run).not.toContain('--unsigned')

  for (const job of Object.values(workflow.jobs)) {
    const checkout = job.steps.find(step => step.uses?.startsWith('actions/checkout@'))
    expect(checkout?.with).toMatchObject({ 'persist-credentials': false, clean: true })
    const uploads = job.steps.filter(step => step.uses?.startsWith('actions/upload-artifact@'))
    expect(uploads).toHaveLength(2)
    expect(uploads[0]?.if).toBe('always()')
    expect(uploads[0]?.with?.['if-no-files-found']).toBe('warn')
    expect(uploads[1]?.if).toBe('success()')
    expect(uploads[1]?.with?.['compression-level']).toBe(0)
    expect(uploads[1]?.with?.['if-no-files-found']).toBe('error')
    expect(uploads[1]?.with?.['retention-days']).toBe(14)
  }
})
