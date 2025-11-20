"use client";

import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  totalCount: number; // 総件数
  current?: number; // 現在のページ（デフォルトは1）
  basePath: string; // 基本パス（例: "/tokyo"）
  perPage?: number; // 1ページあたりの表示件数（デフォルト3）
};

export default function Pagination({
  totalCount,
  current = 1,
  basePath,
  perPage = 3,
}: Props) {
  const totalPages = Math.ceil(totalCount / perPage); // 総ページ数

  // ページ番号の配列を生成
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className={styles.container}>
        {pages.map((p) => (
          <li className={styles.list} key={p}>
            {current !== p ? (
              // 現在のページでない場合はリンクにする
              <Link href={`${basePath}?page=${p}`} className={styles.item}>
                {p}
              </Link>
            ) : (
              // 現在のページはハイライト表示
              <span className={`${styles.item} ${styles.current}`}>{p}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
