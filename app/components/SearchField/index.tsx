"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./index.module.css";
import { Suspense } from "react";

function SearchFieldComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = e.currentTarget.elements.namedItem("q");
    if (q instanceof HTMLInputElement) {
      const params = new URLSearchParams();
      params.set("q", q.value.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.search}>
        <Image
          src="/search.svg"
          alt="検索"
          width={16}
          height={16}
          loading="eager"
        />
        <input
          className={styles.searchInput}
          type="text"
          name="q"
          defaultValue={searchParams.get("q") ?? undefined}
          placeholder="この都市で行きたい場所を検索してみましょう"
        />
      </label>
    </form>
  );
}

export default function SearchField() {
  return (
    <Suspense>
      <SearchFieldComponent />
    </Suspense>
  );
}
