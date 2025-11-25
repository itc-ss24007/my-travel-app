"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Img = { url: string };

export default function ImageCarousel({ images }: { images: Img[] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function startAuto() {
    stopAuto();
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
  }

  function stopAuto() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      style={{ position: "relative", width: "100%", maxWidth: 1200, margin: "0 auto 1rem" }}
    >
      <div style={{ overflow: "hidden", borderRadius: 12 }}>
        <div
          style={{
            display: "flex",
            transition: "transform 400ms ease",
            transform: `translateX(-${index * 100}%)`,
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((img, i) => (
            <div key={i} style={{ minWidth: "100%", height: 420, position: "relative" }}>
              <Image
                src={img.url}
                alt={`image-${i}`}
                fill
                sizes="(max-width: 640px) 100vw, 1200px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="前の画像"
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.45)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              width: 40,
              height: 40,
              cursor: "pointer",
            }}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="次の画像"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.45)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              width: 40,
              height: 40,
              cursor: "pointer",
            }}
          >
            ›
          </button>

          {/* ドット */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`画像 ${i + 1}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  border: "none",
                  background: i === index ? "#0277bd" : "#cfd8dc",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}