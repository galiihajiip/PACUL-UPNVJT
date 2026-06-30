const CATEGORIES = [
  { label: "Energi", color: "#F59E0B" },
  { label: "Limbah", color: "#10B981" },
  { label: "Transportasi", color: "#2D5F3F" },
  { label: "Pangan", color: "#7AC74F" },
];

export default function MapLegend() {
  return (
    <div
      className="absolute bottom-6 left-4 z-[1000] w-40 rounded-[12px] bg-white/90 p-3 shadow-md backdrop-blur-sm"
      style={{ border: "1px solid rgba(229,231,235,0.8)" }}
    >
      {/* Intensity heading */}
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-700">
        Intensitas Dampak
      </p>

      {/* Gradient bar */}
      <div
        className="mb-1 h-2 w-full rounded-full"
        style={{
          background: "linear-gradient(to right, #A8D5BA, #7AC74F, #2D5F3F, #1a3d27)",
        }}
      />
      <div className="mb-4 flex justify-between text-[9px] text-gray-400">
        <span>Rendah</span>
        <span>Sangat Tinggi</span>
      </div>

      {/* Category legend */}
      <div className="flex flex-col gap-1.5">
        {CATEGORIES.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
