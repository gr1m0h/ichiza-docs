import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.hero)}>
      <div className={clsx("container", styles.heroContainer)}>
        <div className={styles.heroCopy}>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
            <span style={{ fontSize: "0.5em", marginLeft: "0.3em" }}>
              （一座）
            </span>
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroLead}>
            技術勉強会の運営を GitHub で管理するための CLI と GitHub
            Actions。イベントごとに 1 件の Dashboard Issue を作成し、
            告知文の生成や期限の通知も行います。
          </p>
          <div className={styles.heroButtons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/getting-started"
            >
              始める
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
            >
              ドキュメントを読む
            </Link>
          </div>
        </div>
        <div className={styles.heroPreview}>
          <div className={styles.previewLabel}>
            Run workflow にイベント情報を入力
          </div>
          <CodeBlock language="yaml" className={styles.previewBlock}>
            {`slug: tokyo-3
title: Your Meetup #3
date: 2026-11-28
mode: hybrid`}
          </CodeBlock>
          <div className={styles.previewArrow}>
            <code>ichiza new</code>
          </div>
          <div className={styles.previewLabel}>
            期限を設定した 1 件の Dashboard Issue を作成
          </div>
          <CodeBlock language="text" className={styles.previewBlock}>
            {`2026-10-24  会場確定・確保
2026-10-29  イベントページ作成・公開
2026-11-25  配信リハーサル
2026-12-08  振り返り`}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

type ProductCard = {
  title: string;
  docsHref: string;
  description: string;
};

const products: ProductCard[] = [
  {
    title: "ichiza",
    docsHref: "/docs/ichiza/overview",
    description:
      "CLI、composite actions、任意の Web コックピットを提供。Dashboard の作成・更新、期限通知、募集文の生成、申込数の確認に対応。",
  },
  {
    title: "ichiza-starter",
    docsHref: "/docs/ichiza-starter",
    description:
      "運営リポジトリのテンプレート。workflows、ichiza.yaml、募集ページのテンプレートをあらかじめ用意。",
  },
  {
    title: "運営サイクルガイド",
    docsHref: "/docs/operations",
    description:
      "イベント作成、事前準備、当日の進行、振り返りまでの手順を説明。",
  },
];

function Products() {
  return (
    <section className={styles.products}>
      <div className="container">
        <div className={styles.cardGrid}>
          {products.map((p) => (
            <Link key={p.title} to={p.docsHref} className={styles.card}>
              <Heading as="h3" className={styles.cardTitle}>
                {p.title}
              </Heading>
              <p className={styles.cardDescription}>{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="技術勉強会の運営を GitHub で管理するためのツール。"
    >
      <Hero />
      <main>
        <Products />
      </main>
    </Layout>
  );
}
