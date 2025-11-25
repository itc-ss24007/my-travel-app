import { client } from "@/_lib/microcms";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import SearchField from "@/app/components/SearchField";

type Spot = {
  id: string;
  title: string;
  image?: { url: string };
  city: string;
  recommend?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = q?.trim();

  if (!term) {
    return (
      <main className={styles.main}>
        <SearchField />
      </main>
    );
  }

  // MicroCMS 全文検索（q）を使う（タイトル・本文等にヒットする）
  const data = await client.getList<Spot>({
    endpoint: "travel-spots",
    queries: { q: term },
  });

  //   console.log("data:", data);
  return (
    <main className={styles.main}>
      <SearchField />

      {data.contents.length === 0 && (
        <p style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
          該当する観光地が見つかりませんでした。
        </p>
      )}

      <div className={styles.grid}>
        {data.contents.map((spot) => (
          <Link
            href={`/${spot.city}/${spot.id}`}
            key={spot.id}
            className={styles.card}
          >
            {spot.image?.url && (
              <Image
                src={spot.image.url}
                alt={spot.title}
                width={800}
                height={500}
                className={styles.cardImage}
                sizes="(max-width: 600px) 100vw, 33vw"
              />
            )}
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{spot.title}</h2>
              <p className={styles.cardText}>{spot.recommend}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
