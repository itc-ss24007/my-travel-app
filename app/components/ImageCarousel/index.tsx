"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./index.module.css";

export type Img = { url: string };

export default function ImageCarousel({ images }: { images: Img[] }) {
  const [current, setCurrent] = useState(0);

  // 自動スライド（5秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className={styles.carousel}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={prev}>
        ❮
      </button>

      {images.map((img, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === current ? styles.active : ""}`}
        >
          <Image
            src={img.url}
            alt={`image-${i}`}
            fill
            className={styles.image}
            priority={i === 0}
          />
        </div>
      ))}

      <button className={`${styles.arrow} ${styles.right}`} onClick={next}>
        ❯
      </button>

      {/* 下部ドット */}
      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === current ? styles.activeDot : ""}`}
            onClick={() => goTo(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}
