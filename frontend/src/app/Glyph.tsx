import { CATEGORY, type ArtCategory } from "./art";
import { Icon } from "./Icon";

/** A small glyph always sits in a recessed well tinted with its category accent (or an explicit one). */
export function Glyph(props: { icon: string; category: ArtCategory; size?: "xs" | "sm" | "md"; accent?: string }) {
  return (
    <span class="k-glyph" data-size={props.size ?? "md"} style={{ "--accent": props.accent ?? CATEGORY[props.category].accent }}>
      <Icon icon={props.icon} />
    </span>
  );
}
