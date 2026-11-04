// The composer remains in ConversationRoot so switching out of the blank-draft
// phase does not remount its textarea.

import { useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import {
  FISH_LOGO_PATH, FISH_LOGO_VIEWBOX, IconChevronDownOutlineRegular, IconFolderCloseRegular, IconFolderOpenRegular,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { workspaceTitleOf } from '@deepseek-ai/dsh-util-workspace-path'
import type { ConversationContentProps } from '../contract/slots.ts'
import css from './HeroShell.module.css'

/** The owner's locale seat type, passed to hero chrome as a plain prop. */
type HeroTranslate = ConversationContentProps['t']

/**
 * Basename label for the workspace chip (the shared derivation);
 * separator-only paths echo the raw cwd.
 * @param cwd - workspace directory path (non-empty).
 * @returns chip label.
 */
export function workspaceLabel(cwd: string): string {
  const base = workspaceTitleOf(cwd)
  return base !== '' ? base : cwd
}

/**
 * The workspace chip (folder + label + chevron), always interactive: before
 * the first message the workspace stays switchable — picking another one
 * moves the New Session flow to that workspace's blank session. Without a
 * label the chip renders its placeholder state: closed folder + the
 * "Choose workspace" call to action.
 * @param props.label - chip label (see {@link workspaceLabel}); omitted → placeholder.
 * @param props.menuOpen - menu expansion echo.
 * @param props.onClick - menu toggle.
 * @returns the chip button element.
 */
export function WorkspaceChip({ buttonRef, label, menuOpen = false, onClick, t }: {
  buttonRef?: RefObject<HTMLButtonElement>
  label?: string | undefined
  menuOpen?: boolean
  onClick?: () => void
  t: HeroTranslate
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={css.workspace}
      aria-label={t('hero.chooseWorkspace')}
      aria-haspopup="menu"
      aria-expanded={menuOpen}
      onClick={onClick}
    >
      {label === undefined
        ? <IconFolderCloseRegular className={css.folder} size={16} />
        : <IconFolderOpenRegular className={css.folder} size={16} />}
      <span className={css.workspaceLabel}>{label ?? t('hero.chooseWorkspace')}</span>
      <IconChevronDownOutlineRegular className={css.chevron} size={12} />
    </button>
  )
}

/** Hero chrome props. The workspace row rides the InputBar accessory hole, not here. */
export interface HeroShellProps {
  /** The owner's locale seat, passed down as a plain prop. */
  t: HeroTranslate
  /** Authorized renderer for the hero brand-mark slot. */
  renderSlot: ConversationContentProps['renderSlot']
  /** Overlay content after the stack (modals). */
  children?: ReactNode
}

/* Hover pitch targets keep the jet path's command structure so SMIL can
   interpolate `d`. The tail fin and wing move; the cockpit cutout stays put. */
const HERO_SWIM_UP_PATH =
  'M22.3 8.1C20.4 7.3 18.2 7 16.4 7.4C15.6 6.5 14.2 6.2 13.2 7.1L8.4 7.3L7.6 6.5L6 1.5C5.5 0.7 4.2 0.8 4.7 1.9L7.4 7.7L2.8 7C1.2 6.7 1 8.1 2.6 8.6L6.8 9.1L9.4 9.5L10.4 13.3C10.7 14.2 12 14.1 12.4 13.1L15.2 9.4L19 9C20.6 8.9 21.6 8.6 22.3 8.1ZM15.4 7.5C14.6 7.2 13.8 7.6 13.7 8.2C14 8.7 15 8.8 15.7 8.3C16 8 15.9 7.7 15.4 7.5Z'
const HERO_SWIM_DOWN_PATH =
  'M22.3 8.5C20.4 7.7 18.2 7.4 16.4 7.8C15.6 6.9 14.2 6.6 13.2 7.5L8.4 7.7L7.6 6.9L6.4 3.3C5.9 2.5 4.6 2.6 5.1 3.7L7.4 8.1L2.8 7.4C1.2 7.1 1 8.5 2.6 9L6.8 9.5L9.4 9.9L10.8 15.1C11.1 16 12.4 15.9 12.8 14.9L15.2 9.8L19 9.4C20.6 9.3 21.6 9 22.3 8.5ZM15.4 7.5C14.6 7.2 13.8 7.6 13.7 8.2C14 8.7 15 8.8 15.7 8.3C16 8 15.9 7.7 15.4 7.5Z'

/**
 * The hero jet (34px wide), static at rest. Hovering pitches it in place:
 * SMIL interpolates `d` through the tail-up and tail-down targets on a 1.6s
 * period. Decorative — hidden from the accessibility tree; reduced motion
 * keeps the static logo on hover (sampled at mouseenter; a mid-hover
 * preference change takes effect on the next enter).
 * @param props.hovering - driven by the hitbox parent's pointer state.
 * @returns the jet svg element.
 */
function HeroFish({ hovering }: { hovering: boolean }) {
  return (
    <svg
      className={css.fish}
      width={34}
      height={(34 * FISH_LOGO_VIEWBOX.height) / FISH_LOGO_VIEWBOX.width}
      viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`}
      fill="none"
      aria-hidden="true"
    >
      <path d={FISH_LOGO_PATH} fill="#FF5C00" fillRule="evenodd">
        {hovering && (
          <animate
            attributeName="d"
            values={`${FISH_LOGO_PATH};${HERO_SWIM_UP_PATH};${FISH_LOGO_PATH};${HERO_SWIM_DOWN_PATH};${FISH_LOGO_PATH}`}
            keyTimes="0;0.35;0.55;0.75;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        )}
      </path>
    </svg>
  )
}

/**
 * Render the hero chrome (headline only; no composer, no workspace row).
 * @param props - see {@link HeroShellProps}.
 * @returns the centered hero element tree.
 */
export function HeroShell({ t, renderSlot, children }: HeroShellProps) {
  const [hovering, setHovering] = useState(false)
  return (
    <div className={css.root}>
      <div className={css.stack}>
        <div className={css.headline}>
          {/* figma 34:10412: fish 34×25 leading the headline, gap 10. */}
          <span
            className={css.fishHitbox}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch'
                && window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
                setHovering(true)
              }
            }}
            onPointerLeave={() => { setHovering(false) }}
          >
            {renderSlot('conversation.hero.brand.mark', { size: 34, className: css.fish }, {
              fallback: <HeroFish hovering={hovering} />,
            })}
          </span>
          <span className={css.titleGroup}>
            {/* Own element: keeps the headline text addressable apart from the badge. */}
            <span>{t('hero.headline')}</span>
            <span className={css.previewBadge}>{t('hero.preview')}</span>
          </span>
        </div>
        <div className={css.body}>
          {/* The composer remains mounted outside this component. */}
        </div>
      </div>
      {children}
    </div>
  )
}
