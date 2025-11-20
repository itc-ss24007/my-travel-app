"use client";

import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string; // 例: "/tokyo"
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: Props) {
  if (totalPages === 1) {
    return (
      <div className={styles.pagination}>
        <span className={`${styles.pageButton} ${styles.active}`}>1</span>
      </div>
    );
  }

  return (
    <div className={styles.pagination}>
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className={styles.pageButton}
        >
          ← 前へ
        </Link>
      )}

      <span className={styles.pageInfo}>
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className={styles.pageButton}
        >
          次へ →
        </Link>
      )}
    </div>
  );
}
