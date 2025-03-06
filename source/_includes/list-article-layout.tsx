import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';
import Breadcrumb from './tsx/breadcrumb.tsx'
import Menu from './tsx/menu.tsx'
import { TrackingData } from "../tracking.ts";

export default (data: Lume.Data, helpers: Lume.Helpers) => {
    const { title, children, basename, lang } = data;
    const articles = Array.from(findAllArticles(data.nav.menu(data.url)));

    return <html lang={lang || 'en'}>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title || basename}</title>
            <meta name="supported-color-schemes" content="light dark" />
            <meta name="theme-color" content="hsl(220, 20%, 100%)" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="hsl(220, 20%, 10%)" media="(prefers-color-scheme: dark)" />

            <link rel="stylesheet" href="/styles.css" />
            <link rel="canonical" href={data.url} />
        </head>
        <body>
            <div class="container">
                <div class="toolbar">
                    <div id="search" class="search"></div>
                </div>

                <Menu self={data} />

                <main class="main">
                    <Breadcrumb data={data} />
                    <div class="body" data-pagefind-body>
                        {children}
                        <ArticleList articles={articles} />
                    </div>
                </main>
            </div>
        </body>
    </html>
}

function ArticleList(options: { articles: NavData[] }) {
    const articles = options.articles;
    articles.sort((a, b) => {
        const d1 = a.data?.date ?? new Date(0);
        const d2 = b.data?.date ?? new Date(0);
        return d2.getTime() - d1.getTime();
    });
    return <ul class='article-list'>
        {
            articles.map((art, i) => {
                const originalDate = TrackingData[art.data?.url ?? ''].originalDate ?? art.data?.date?.toLocaleDateString('zh-CN');
                return <li key={i}>
                    <div class='article-list-item'>
                        <a class='article-list-title' href={art.data?.url ?? art.slug}>
                            {art.data?.title ?? art.data?.basename}
                        </a>
                        <span class='article-list-date' style="float: right">
                            {originalDate}
                        </span>
                    </div>
                </li>
            })
        }
    </ul>;
}

function* findAllArticles(nav?: NavData): Iterable<NavData> {
    if (!nav) return;
    if (nav.data?.tags?.includes("article")) {
        yield nav;
    }
    if (nav.children) {
        for (const child of nav?.children ?? []) {
            yield* findAllArticles(child);
        }
    }
}

