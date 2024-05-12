import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';
import Breadcrumb from './tsx/breadcrumb.tsx'
import Menu from './tsx/menu.tsx'

export default (data: Lume.Data, helpers: Lume.Helpers) => {
    const { title, children, basename } = data;
    const articles = Array.from(findAllArticles(data.nav.menu(data.url)));

    return <html>
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
    return <ul>
        {
            articles.map(art => {
                return <li>
                    <a href={art.data?.url ?? art.slug}>{art.data?.title ?? art.data?.basename}</a><span style="float: right;">{art.data?.date?.toLocaleDateString()}</span>
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

