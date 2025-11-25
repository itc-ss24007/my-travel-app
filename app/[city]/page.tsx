import { client } from "@/_lib/microcms";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import SearchField from "@/app/components/SearchField";
import Pagination from "@/app/components/Pagination";

type Spot = {
  id: string;
  title: string;
  image?: { url: string };
  city: string;
  recommend?: string;
};

type City = { slug: string };

// 静的パス生成
export async function generateStaticParams() {
  const res = await client.getList<City>({ endpoint: "cities" });
  return res.contents.map((c) => ({ city: c.slug }));
}

const PER_PAGE = 6; // 1ページあたりの件数

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { city } = await params;

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));
  const offset = (currentPage - 1) * PER_PAGE;

  // データ取得
  const data = await client.getList<Spot>({
    endpoint: "travel-spots",
    queries: {
      filters: `city[equals]${city}`,
      limit: PER_PAGE,
      offset,
    },
  });

  if (!data?.contents || data.contents.length === 0) return notFound();

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backLink}>
        ← トップへ戻る
      </Link>

      <h1 className={styles.title}>{city} の観光地一覧</h1>

      <SearchField />

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

      {/* Pagination コンポーネント */}
      <Pagination
        totalCount={data.totalCount}
        current={currentPage}
        basePath={`/${city}`}
        perPage={PER_PAGE}
      />
    </main>
  );
}
