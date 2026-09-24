import { renderMonogram } from "@/lib/icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return renderMonogram({ size: size.width, radius: 7 });
}
