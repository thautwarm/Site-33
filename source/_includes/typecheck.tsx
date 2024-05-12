import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';
import Breadcrumb  from './tsx/breadcrumb.tsx'
import Menu  from './tsx/menu.tsx'

export default (data: Lume.Data, helpers: Lume.Helpers) => {
    const { title, children, basename } = data;

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

                <Menu self={data}/>

                <main class="main">
                    <Breadcrumb data={data} />
                    <div class="body" data-pagefind-body>
                        { children }
                    </div>
                </main>
            </div>
        </body>
    </html>
}

type NavShow =
    | null
    | { slug: string; children?: NavShow[] }

function display(n?: NavData): NavShow {
    if (!n) return null;
    return {
        slug: n.slug,
        children: n?.children?.map(display)
    }
}
