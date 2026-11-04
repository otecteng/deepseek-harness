import type { IconProps } from './icons/props.ts'

/** Native viewBox of {@link FISH_LOGO_PATH} (width and height in user units). */
export const FISH_LOGO_VIEWBOX = { width: 23.16, height: 17.04 }

/** Orange used by the side-view jet mark. */
const FISH_LOGO_FILL = '#FF5C00'

/**
 * Side-view jet silhouette, one even-odd path with a cockpit cutout.
 * Consumers that compose their own svg (entrance effects, masks) reuse this geometry.
 */
export const FISH_LOGO_PATH = 'M22.3 8.3C20.4 7.5 18.2 7.2 16.4 7.6C15.6 6.7 14.2 6.4 13.2 7.3L8.4 7.5L7.6 6.7L6.2 2.4C5.7 1.6 4.4 1.7 4.9 2.8L7.4 7.9L2.8 7.2C1.2 6.9 1 8.3 2.6 8.8L6.8 9.3L9.4 9.7L10.6 14.2C10.9 15.1 12.2 15 12.6 14L15.2 9.6L19 9.2C20.6 9.1 21.6 8.8 22.3 8.3ZM15.4 7.5C14.6 7.2 13.8 7.6 13.7 8.2C14 8.7 15 8.8 15.7 8.3C16 8 15.9 7.7 15.4 7.5Z'

/**
 * Render the jet logo.
 * @param props.size - width in px (default 24; height keeps the 23.16:17.04 ratio).
 * @param props.className - extra class for layout placement.
 * @returns the logo svg (aria-hidden; pair with the wordmark for accessibility).
 */
export function FishLogo({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={(size * FISH_LOGO_VIEWBOX.height) / FISH_LOGO_VIEWBOX.width}
      className={className}
      viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`}
      fill="none"
      aria-hidden="true"
    >
      <path d={FISH_LOGO_PATH} fill={FISH_LOGO_FILL} fillRule="evenodd" />
    </svg>
  )
}
