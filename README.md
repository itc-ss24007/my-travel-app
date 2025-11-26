# 観光スポットガイド

## 概要

- 開発期間: 2025 年 11 月 12 日ー 2025 年 11 月 26 日
- Next.js と microCMS を使用した観光紹介アプリです。  
  観光の人気都市とスポット情報を microCMS から取得し、都市ごとに一覧と詳細ページで表示します。

## 使用技術

- Next.js (App Router)
- TypeScript
- CSS Modules
- microCMS
- Vercel (デプロイ)
- GitHub (ソース管理)

## 主な機能

- microCMS から人気都市とスポット情報を取得
- トップページで都市一覧を表示
- 各都市ページで観光スポット一覧を表示
- 各スポットの詳細ページを表示

## ページ構成

- `/` トップページ（人気都市の一覧）
- `/[city]` 観光スポット一覧
- `/[city]/[spot]` スポットの詳細ページ

## ディレクトリ構成

- app/
  - page.tsx — トップページ
  - page.module.css — トップページのスタイル
  - globals.css
  - [city]/
    - page.tsx — 都市ページ
    - page.module.css — 都市ページのスタイル
    - [spot]/
      - page.tsx — スポット詳細ページ
      - page.module.css — スポット詳細のスタイル
  - components
    - ImageCarousel 　自動スライド
    - Pagination 　　ページネーション
    - SearchField 　検索機能
  - search 検索結果
- \_lib/
  - microcms.ts — microCMS クライアント初期化

## データ項目（microCMS）

- cities
  - name(都市名)
  - image（画像）
  - description（詳細説明）
  - slug(ページの URL 用)
- spots
  - title（スポット名）
  - image（画像）
  - description（詳細説明）
  - location（所在地）
  - recommend（おすすめポイント）
  - city(ページの URL 用と関連)
  - photos (自動スライドで表示画像リスト)

## microCMS にアクセスする処理

- API キーを.env.local に保存
  - MICROCMS_SERVICE_DOMAIN=xxxxx
  - MICROCMS_API_KEY=yyyyyyyy
- microCMS に連携のクライアント初期化
  - /\_lib/microcms.ts を作成
  ```
  import { createClient } from "microcms-js-sdk";
  export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
  });
  ```
- - 都市一覧取得（トップ）

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

## デプロイ先

- https://my-travel-app-pi.vercel.app/
