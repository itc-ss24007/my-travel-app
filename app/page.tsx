import { client } from "@/_lib/microcms";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

type City = {
  id: string;
  name: string;
  image?: { url: string };
  description?: string;
  slug: string;
};

export default async function Home() {
  const data = await client.getList<City>({ endpoint: "cities" });

  return (
    <main className={styles.main}>
      <h1>人気観光都市</h1>
      <div className={styles.grid}>
        {data.contents.map((city) => (
          <Link key={city.id} href={`/${city.slug}`} className={styles.card}>
            {/* 画像最適化のため next/image を使用 */}
            {city.image?.url && (
              <Image
                src={city.image.url}
                alt={city.name}
                width={800}
                height={500}
                sizes="(max-width: 600px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            )}
            <h2>{city.name}</h2>
            <p>{city.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
