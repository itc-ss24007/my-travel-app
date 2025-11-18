# my-travel-app

概要: Next.js (App Router) と microCMS を使った簡易旅行ガイド。トップページで都市一覧を表示し、各都市ページで観光スポット一覧、各スポットの詳細ページを表示します。

## 機能の説明

- トップページ (/)
  - microCMS の `cities` から取得した都市カードを表示。カードは画像・名前・説明を含む。next/image で最適化。
- 都市ページ (/[city])
  - URL スラッグ (slug) に対応する都市の `travel-spots` をフィルタ取得して一覧表示。各スポットは詳細ページへリンク。
- スポット詳細 (/[city]/[spot])
  - `travel-spots` のコンテンツ ID で単一取得し、画像・推奨コメント・HTML 形式の本文（description）を表示。
- 静的生成
  - `generateStaticParams` を使って cities / travel-spots を静的パス生成（必要に応じて使用）。
- HTML description の表示は `dangerouslySetInnerHTML` を使用。信頼できない場合はサニタイズ（isomorphic-dompurify 推奨）。

## ページ構成の説明

- / (トップ)
  - 都市カードをグリッド表示。リンク先は `/${city.slug}`。
- /[city] (都市ページ)
  - `client.getList<Spot>({ endpoint: "travel-spots", queries: { filters: "city[equals]${slug}" } })` で該当スポットを取得。スポットごとに `/${city}/${spot.id}` へリンク。
- /[city]/[spot] (スポット詳細)
  - `client.get<Spot>({ endpoint: "travel-spots", contentId: spotId })` で詳細取得。都市スラッグと一致しない場合は 404 にする。

注意: App Router のページコンポーネントで受け取る `params` は Promise の場合があるため `const { city } = await params` のようにアンラップが必要。

## ディレクトリ構成の説明（主要部分）

- app/
  - page.tsx — トップページ
  - page.module.css — トップページのスタイル
  - [city]/
    - page.tsx — 都市ページ
    - page.module.css — 都市ページのスタイル
    - [spot]/
      - page.tsx — スポット詳細ページ
      - page.module.css — スポット詳細のスタイル
- \_lib/
  - microcms.ts — microCMS クライアント初期化
- next.config.ts — next/image の外部ドメイン設定
- package.json

## microCMS にアクセスする処理の説明

- クライアント初期化（例: \_lib/microcms.ts）

```ts
import MicroCMS from "microcms-js-sdk";

export const client = new MicroCMS({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});
```

- 都市一覧取得（トップ）

```ts
const data = await client.getList<City>({ endpoint: "cities" });
```

- スポット一覧取得（都市ページ）

```ts
const data = await client.getList<Spot>({
  endpoint: "travel-spots",
  queries: { filters: `city[equals]${slug}` },
});
```

- スポット詳細取得（詳細ページ）

```ts
const item = await client.get<Spot>({
  endpoint: "travel-spots",
  contentId: spotId,
});
```

- HTML description を表示する場合:
  - 信頼済みデータなら: dangerouslySetInnerHTML を使用
  - 信頼できない場合はサニタイズ:

```bash
npm install isomorphic-dompurify
```

```ts
import createDOMPurify from "isomorphic-dompurify";
const DOMPurify = createDOMPurify();
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(data.description ?? ""),
  }}
/>;
```

## スタイル調整について（少数アイテム時／カード高さ）

- 少ないカード（例: 2 件）で中央にまとまるように `.grid` を次のように設定:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 320px));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: center;
  justify-items: center;
  padding-inline: 1rem;
}
.card {
  width: 100%;
  max-width: 320px;
  justify-self: center;
}
```

- カード高さを上げたい場合（画像高さと余白を大きくする）:

```css
.card img {
  height: 220px;
  object-fit: cover;
}
.card {
  padding-bottom: 1rem;
}
```

- city / spot ページ用の CSS も同様に `.grid` / `.card` / `.card img` を調整してください（`app/[city]/page.module.css` と `app/[city]/[spot]/page.module.css`）。

## 実行方法

```bash
# 環境変数を設定 (例: .env.local)
NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN=your-domain
MICROCMS_API_KEY=your-read-api-key

# 依存インストール
npm install

# 開発サーバー起動
npm run dev
```

## 備考

- next/image を使う場合は `next.config.ts` に外部画像ドメインを追加してください:

```ts
const nextConfig = {
  images: { domains: ["images.microcms-assets.io"] },
};
export default nextConfig;
```

- `dangerouslySetInnerHTML` を使う場合は XSS に注意してください。外部入力は必ずサニタイズを推奨します。

必要ならこの README をリポジトリに追加する差分を出
