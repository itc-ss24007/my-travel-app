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
- \_lib/
  - microcms.ts — microCMS クライアント初期化

## データ項目（microCMS）

## microCMS にアクセスする処理

## デプロイ先

- https://my-travel-app-pi.vercel.app/
