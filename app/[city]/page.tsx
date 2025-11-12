import { client } from "@/_lib/microcms";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

type Spot = {
  id: string;
  title: string;
  image?: { url: string };
  city: string;
  recommend?: string;
};

type City = { slug: string };

export async function generateStaticParams() {
  const res = await client.getList<City>({ endpoint: "cities" });
  return res.contents.map((c) => ({ city: c.slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  const data = await client.getList<Spot>({
    endpoint: "travel-spots",
    queries: { filters: `city[equals]${city}` },
  });

  if (!data?.contents || data.contents.length === 0) return notFound();

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backLink}>
        ← トップへ戻る
      </Link>

      <h1 className={styles.title}>{city} の観光地一覧</h1>

      <div className={styles.grid}>
        {data.contents.map((spot) => (
          <Link
            href={`/${city}/${spot.id}`}
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
