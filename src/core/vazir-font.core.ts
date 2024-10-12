import { Vazirmatn } from "next/font/google";

export const vazirFont = Vazirmatn({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["system-ui"],
  adjustFontFallback: true,
  style: "normal",
});
