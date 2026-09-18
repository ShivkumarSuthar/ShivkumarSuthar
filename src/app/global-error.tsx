"use client";

/* global-error replaces the root layout — plain anchors are intentional here. */
/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#f8fafc",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          color: "#334155",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1120,
            margin: "0 auto",
            overflow: "hidden",
            background: "rgba(255,255,255,0.4)",
            boxShadow: "0 20px 45px -15px rgba(0,0,0,0.15)",
          }}
        >
          <header
            style={{
              background: "#000000",
              color: "white",
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                Shivkumar Suthar
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#e2e8f0" }}>
                MERN Stack Developer · Full-Stack Engineer
              </p>
            </div>
            <a
              href="/"
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
                background: "rgba(255,255,255,0.12)",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              Portfolio
            </a>
          </header>

          <div
            style={{
              width: "100%",
              maxWidth: 520,
              margin: "40px auto",
              borderRadius: 24,
              overflow: "hidden",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 24px 60px -20px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          >
            <div
              style={{
                background: "#000000",
                color: "white",
                textAlign: "center",
                padding: "40px 32px 32px",
              }}
            >
              <p style={{ margin: 0, fontSize: 72, fontWeight: 800, lineHeight: 1 }}>
                500
              </p>
              <h1 style={{ margin: "12px 0 0", fontSize: 28, fontWeight: 700 }}>
                Critical error
              </h1>
              <p
                style={{
                  margin: "12px auto 0",
                  maxWidth: 360,
                  color: "#e2e8f0",
                  fontSize: 14,
                }}
              >
                The app hit a serious error. Please try again. If it keeps happening,
                refresh the page.
              </p>
            </div>
            <div style={{ padding: 28, textAlign: "center" }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  border: 0,
                  borderRadius: 12,
                  background: "#0f172a",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 20px",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <div style={{ marginTop: 16 }}>
                <a
                  href="/"
                  style={{
                    color: "#0f172a",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  Go to portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
