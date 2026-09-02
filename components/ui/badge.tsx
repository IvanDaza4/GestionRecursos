import type { Tono } from "@/lib/constants";

export function Badge({ tono = "blue", children }: { tono?: Tono; children: React.ReactNode }) {
  return (
    <span className={`badge ${tono === "blue" ? "" : tono}`}>
      <i />
      {children}
    </span>
  );
}
