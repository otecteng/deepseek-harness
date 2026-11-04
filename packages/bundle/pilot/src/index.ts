/**
 * @deepseek-ai/dsh-pilot — Desktop profile bundle.
 * The package's substance is `cordis.patch.yml`, declared by `dsh.bundle.patch`;
 * this module names the bundle and the standalone layers its patch replaces.
 * @module @deepseek-ai/dsh-pilot
 */

/** Package name the Desktop profile appends after the Web bundles. */
export const PILOT_BUNDLE = '@deepseek-ai/dsh-pilot'

/**
 * Standalone bundle names whose patch rows this layer inserts.
 * Desktop preparation removes them from the profile so each plugin is inserted once.
 */
export const PILOT_SUPERSEDED_BUNDLES = ['dsh-taskboard', 'dsh-context'] as const
