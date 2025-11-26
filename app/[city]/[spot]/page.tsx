import { client } from "@/_lib/microcms";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageCarousel, { Img } from "@/app/components/ImageCarousel";
import styles from "./page.module.css";

type Spot = {
  id: string;
  title: string;
  city: string;
  recommend?: string;
  description?: string;
  photos?: { url: string }[];
  business_hours?: string;
  price?: string;
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

  const data = await client.get<Spot>({
    endpoint: "travel-spots",
    contentId: spot,
  });

  if (!data) return notFound();
  if (data.city !== city) return notFound();

  // 写真 → Img[] に変換
  const images: Img[] = data.photos?.map((p) => ({ url: p.url })) ?? [];

  return (
    <main className={styles.main}>
      <Link href={`/${city}`} className={styles.backLink}>
        ← {city} に戻る
      </Link>

      <h1 className={styles.title}>{data.title}</h1>

      {/* カルーセル */}
      {images.length > 0 && (
        <div className={styles.carouselWrapper}>
          <ImageCarousel images={images} />
        </div>
      )}

      <section className={styles.content}>
        {data.recommend && <p className={styles.recommend}>{data.recommend}</p>}

        {data.description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        )}

        {/* 営業時間 & 料金 */}
        {(data.business_hours || data.price) && (
          <div className={styles.infoBox}>
            {data.business_hours && (
              <p>
                <strong>営業時間：</strong>
                {data.business_hours}
              </p>
            )}
            {data.price && (
              <p>
                <strong>料金：</strong>
                {data.price}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
