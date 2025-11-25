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
  description?: string;
};

export async function generateStaticParams() {
  const res = await client.getList<Spot>({ endpoint: "travel-spots" });
  return res.contents.map((s) => ({ city: s.city, spot: s.id }));
}

export default async function SpotPage({
  params,
}: {
  params: Promise<{ city: string; spot: string }>;
}) {
  const { city, spot } = await params;

  // contentId を使って単一取得
  const data = await client.get<Spot>({
    endpoint: "travel-spots",
    contentId: spot,
  });

  if (!data) return notFound();

  // city が一致しない場合は notFound にしても良い
  if (data.city !== city) return notFound();

  return (
    <main className={styles.main}>
      <Link href={`/${city}`} className={styles.backLink}>
        ← {city} に戻る
      </Link>

      <h1 className={styles.title}>{data.title}</h1>

      {data.image?.url && (
        <Image
          src={data.image.url}
          alt={data.title}
          width={1200}
          height={800}
          className={styles.hero}
          sizes="(max-width: 600px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      )}

      <section className={styles.content}>
        <p className={styles.recommend}>{data.recommend}</p>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: data.description ?? "" }}
        />
      </section>
    </main>
  );
}
