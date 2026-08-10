import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_NAME_ALT } from "@/lib/seo/site";

export const alt = "File Portal by TMY Tuned – ECU & gearbox file portal";
export const size = {
  width: 1200,
  height: 630,
};
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
          background:
            "linear-gradient(135deg, #0c1422 0%, #12233d 48%, #0c1422 100%)",
          color: "#edf3fb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>TMY</span>
          <span style={{ color: "#28a9e0" }}>TUNED</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              maxWidth: 980,
            }}
          >
            <span>File Portal</span>
            <span style={{ color: "#ff4c2b" }}>Upload. Track. Tune.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#9aabc2",
              maxWidth: 860,
              lineHeight: 1.35,
            }}
          >
            Secure ECU and gearbox file requests, TuningPoints checkout, and
            request history — by TMY Tuned.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#9aabc2",
          }}
        >
          <span>{SITE_NAME}</span>
          <span style={{ color: "#ff4c2b" }}>{SITE_NAME_ALT}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
