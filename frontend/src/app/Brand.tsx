interface BrandStyle {
  label: string;
  bg: string;
  fg: string;
  accent?: string;
}

const BRANDS: Record<string, BrandStyle> = {
  TESCO: { label: "TESCO", bg: "#ffffff", fg: "#00539f", accent: "#ee1c2e" },
  ASDA: { label: "ASDA", bg: "#78be20", fg: "#ffffff" },
  JET: { label: "JET", bg: "#ffd200", fg: "#111111" },
  ESSO: { label: "Esso", bg: "#ffffff", fg: "#e4002b" },
  SHELL: { label: "Shell", bg: "#ffd500", fg: "#dd1d21" },
  BP: { label: "bp", bg: "#007f3e", fg: "#ffe600" },
  MORRISONS: { label: "M", bg: "#ffe500", fg: "#00563f" },
  SAINSBURYS: { label: "S", bg: "#f06c00", fg: "#ffffff" },
  TEXACO: { label: "TEXACO", bg: "#e2001a", fg: "#ffffff" },
  GULF: { label: "Gulf", bg: "#f68b1f", fg: "#003d7c" },
  APPLEGREEN: { label: "ag", bg: "#8dc63f", fg: "#ffffff" },
  MURCO: { label: "Murco", bg: "#d7141a", fg: "#ffffff" },
  VALERO: { label: "Valero", bg: "#00447c", fg: "#ffb81c" },
  COSTCO: { label: "Costco", bg: "#e31837", fg: "#ffffff" },
};

export function brandStyle(brand: string | undefined): BrandStyle {
  const key = (brand ?? "").toUpperCase().replace(/[^A-Z]/g, "");
  const hit = Object.entries(BRANDS).find(([k]) => key.startsWith(k));
  if (hit) return hit[1];
  const label = (brand ?? "?").trim().slice(0, 6);
  return { label, bg: "linear-gradient(145deg,#a5b4c7,#647890)", fg: "#f4f8ff" };
}

/** Brand wordmark in a small rounded well, colours approximating each retailer. */
export function Brand(props: { brand?: string; size?: "sm" | "md" }) {
  const s = () => brandStyle(props.brand);
  return (
    <span
      class="k-brand"
      classList={{ sm: props.size === "sm" }}
      style={{ background: s().bg, color: s().fg, "border-bottom-color": s().accent ?? "transparent" }}
    >
      {s().label}
    </span>
  );
}
