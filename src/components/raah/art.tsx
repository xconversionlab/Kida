import type { VehicleId } from "@/lib/raah/types";

const vehicleCells: Record<VehicleId, { column: number; row: number; label: string }> = {
  bike: { column: 0, row: 1, label: "Bike taxi" },
  auto: { column: 1, row: 0, label: "Auto rickshaw" },
  mini: { column: 3, row: 0, label: "Economy cab" },
  sedan: { column: 1, row: 1, label: "Premium cab" },
  xl: { column: 3, row: 1, label: "Travel van" },
};

export function VehicleArt({ id, className = "h-12 w-20" }: { id: VehicleId; className?: string }) {
  const cell = vehicleCells[id];
  return (
    <span
      role="img"
      aria-label={cell.label}
      className={`inline-block shrink-0 bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url('/vehicles/kida-vehicle-sprite.jpg')",
        backgroundSize: "400% 200%",
        backgroundPosition: `${cell.column * 100 / 3}% ${cell.row * 100}%`,
      }}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-xl bg-[#d3d3d1] px-2 py-1 ${className}`}>
      <img src="/brand/kida-logo.svg" alt="Kida" className="h-[1.15em] w-auto object-contain" />
    </span>
  );
}
