"use client";

import { useEffect, useRef, useState } from "react";

// Returns true when the primary input is a fine pointer (mouse/trackpad).
// Touch-only devices report "coarse" or "none", so we skip the cursor there.
function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}
import gsap from "gsap";

/* ─── Cursor shapes ──────────────────────────────────────────────────────────
   Layout (50×50 "viewport" centred on the mouse):

   [TL]        [TR]
        · dot ·
   [BL]        [BR]

   TL / TR / BL / BR  = corner bracket SVGs  (lagging behind mouse)
   · dot ·            = glowing micro-dot    (snapped to mouse)
   Below dot          = coordinate text      (micro-monospace readout)
───────────────────────────────────────────────────────────────────────────── */

const CORNER = 10; // corner bracket arm length (px)
const GAP = 14;   // half-gap from centre to bracket (px)

// Four L-shaped brackets rendered as SVG paths
const corners = [
  // top-left  — open toward bottom-right
  { key: "tl", x: -GAP - CORNER, y: -GAP - CORNER, d: `M${CORNER} 0 L0 0 L0 ${CORNER}` },
  // top-right — open toward bottom-left
  { key: "tr", x: GAP,           y: -GAP - CORNER, d: `M0 0 L${CORNER} 0 L${CORNER} ${CORNER}` },
  // bottom-left  — open toward top-right
  { key: "bl", x: -GAP - CORNER, y: GAP,           d: `M${CORNER} ${CORNER} L0 ${CORNER} L0 0` },
  // bottom-right — open toward top-left
  { key: "br", x: GAP,           y: GAP,           d: `M0 ${CORNER} L${CORNER} ${CORNER} L${CORNER} 0` },
];

export default function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const coordRef  = useRef<HTMLDivElement>(null);
  const bracketRefs = useRef<(SVGSVGElement | null)[]>([]);
  const scanRef   = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Detect pointer type on the client only (avoids SSR mismatch)
  useEffect(() => {
    setIsFinePointer(hasFinePointer());
  }, []);

  useEffect(() => {
    if (!isFinePointer) return; // touch / mobile — keep default cursor
    document.documentElement.style.cursor = "none";

    const dot   = dotRef.current;
    const coord = coordRef.current;
    const scan  = scanRef.current;
    if (!dot) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    // ── Continuous scanning ring spin ─────────────────────────────────────
    if (scan) {
      gsap.to(scan, {
        rotation: 360,
        duration: 3,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }

    // ── Mouse move ────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Dot — instant
      gsap.set(dot, { x: mx, y: my });

      // Coord display
      if (coord) gsap.set(coord, { x: mx, y: my });
      setCoords({ x: Math.round(mx), y: Math.round(my) });

      // Brackets — elastic lag
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = corners[i];
        gsap.to(el, {
          x: mx + x,
          y: my + y,
          duration: 0.28,
          ease: "power3.out",
        });
      });

      // Scan ring
      if (scan) gsap.set(scan, { x: mx, y: my });
    };

    window.addEventListener("mousemove", onMouseMove);

    // ── Interactive hover  ─────────────────────────────────────────────────
    const SEL = "a,button,input,textarea,select,label,[data-cursor-hover]";

    const onOver = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest(SEL)) return;
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = corners[i];
        const signX = x < 0 ? -1 : 1;
        const signY = y < 0 ? -1 : 1;
        gsap.to(el, {
          x: mx + x + signX * 8,
          y: my + y + signY * 8,
          duration: 0.25,
          ease: "power2.out",
        });
      });
      gsap.to(bracketRefs.current.filter(Boolean), {
        attr: { stroke: "#f0abfc" },  // violet on hover
        duration: 0.2,
      });
      gsap.to(dot, { scale: 2.5, backgroundColor: "#f0abfc", duration: 0.2 });
      if (scan) {
        gsap.to(scan, {
          borderColor: "rgba(240,171,252,0.6)",
          boxShadow: "0 0 12px 3px rgba(240,171,252,0.4)",
          duration: 0.2,
        });
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest(SEL)) return;
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = corners[i];
        gsap.to(el, {
          x: mx + x,
          y: my + y,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      gsap.to(bracketRefs.current.filter(Boolean), {
        attr: { stroke: "#14b8a6" },
        duration: 0.25,
      });
      gsap.to(dot, { scale: 1, backgroundColor: "#2dd4bf", duration: 0.25 });
      if (scan) {
        gsap.to(scan, {
          borderColor: "rgba(20,184,166,0.45)",
          boxShadow: "0 0 8px 2px rgba(20,184,166,0.25)",
          duration: 0.25,
        });
      }
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // ── Click burst ────────────────────────────────────────────────────────
    const onClick = () => {
      const tl = gsap.timeline();
      tl.to(bracketRefs.current.filter(Boolean), {
        scale: 1.8,
        opacity: 0.3,
        duration: 0.18,
        stagger: 0.03,
        ease: "power2.out",
        transformOrigin: "50% 50%",
      }).to(bracketRefs.current.filter(Boolean), {
        scale: 1,
        opacity: 1,
        duration: 0.22,
        ease: "power2.in",
      });
      gsap.to(dot, {
        scale: 3,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 }),
      });
    };
    document.addEventListener("click", onClick);

    // ── Mouse down / up compression ─────────────────────────────────────────
    const onDown = () => {
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = corners[i];
        const signX = x < 0 ? 1 : -1;
        const signY = y < 0 ? 1 : -1;
        gsap.to(el, {
          x: mx + x + signX * 6,
          y: my + y + signY * 6,
          duration: 0.12,
        });
      });
    };
    const onUp = () => {
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = corners[i];
        gsap.to(el, {
          x: mx + x,
          y: my + y,
          duration: 0.2,
          ease: "elastic.out(1.2, 0.5)",
        });
      });
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // ── Window leave / enter ───────────────────────────────────────────────
    const hide = () =>
      gsap.to([dot, ...bracketRefs.current, scan].filter(Boolean), {
        opacity: 0,
        duration: 0.3,
      });
    const show = () =>
      gsap.to([dot, ...bracketRefs.current, scan].filter(Boolean), {
        opacity: 1,
        duration: 0.3,
      });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("click", onClick);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, [isFinePointer]);

  // Don't render anything on touch / mobile devices
  if (!isFinePointer) return null;

  return (
    <>
      {/* ── Scanning outer ring ─────────────────────────────────────── */}
      <div
        ref={scanRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 46,
          height: 46,
          marginLeft: -23,
          marginTop: -23,
          borderRadius: "50%",
          border: "1px dashed rgba(20,184,166,0.45)",
          boxShadow: "0 0 8px 2px rgba(20,184,166,0.25)",
          pointerEvents: "none",
          zIndex: 99997,
          willChange: "transform",
        }}
      />

      {/* ── Four corner brackets ─────────────────────────────────────── */}
      {corners.map((c, i) => (
        <svg
          key={c.key}
          ref={(el) => { bracketRefs.current[i] = el; }}
          aria-hidden="true"
          width={CORNER + 1}
          height={CORNER + 1}
          viewBox={`0 0 ${CORNER + 1} ${CORNER + 1}`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 99999,
            willChange: "transform",
            filter: "drop-shadow(0 0 3px rgba(20,184,166,0.8))",
          }}
        >
          <path
            d={c.d}
            fill="none"
            stroke="#14b8a6"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      ))}

      {/* ── Central glowing dot ──────────────────────────────────────── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          borderRadius: "50%",
          backgroundColor: "#2dd4bf",
          boxShadow:
            "0 0 0 1px rgba(45,212,191,0.3), 0 0 8px 3px rgba(45,212,191,0.7)",
          pointerEvents: "none",
          zIndex: 100000,
          willChange: "transform",
        }}
      />

      {/* ── Coordinate readout ───────────────────────────────────────── */}
      <div
        ref={coordRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          marginLeft: 14,
          marginTop: 10,
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          fontFamily: "'Courier New', monospace",
          fontSize: "8px",
          letterSpacing: "0.05em",
          color: "rgba(45,212,191,0.55)",
          lineHeight: 1.2,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span>{String(coords.x).padStart(4, "0")}</span>
        <br />
        <span>{String(coords.y).padStart(4, "0")}</span>
      </div>
    </>
  );
}
