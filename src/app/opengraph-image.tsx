import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shivkumar Suthar — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Available for hire
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            Shivkumar Suthar
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, color: "#bfdbfe" }}>
            Full-Stack Engineer
          </div>
          <div style={{ fontSize: 26, color: "#e2e8f0", maxWidth: 900 }}>
            MongoDB · Express.js · React.js · Next.js · Node.js · TypeScript
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#93c5fd" }}>
          Jaipur, India · 3+ years commercial experience
        </div>
      </div>
    ),
    { ...size },
  );
}
