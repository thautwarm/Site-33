// deno-lint-ignore-file no-explicit-any
import * as React from 'npm:preact';
import Breadcrumb from './tsx/breadcrumb.tsx'
import Menu from './tsx/menu.tsx'
import { TrackingData } from "../tracking.ts";

export default function BlogLayout(it: Lume.Data) {
    const content = it.content as (string | undefined) ?? "";

    const originalDate = TrackingData[it.url ?? ""].originalDate;
    const editDate = it.date?.toLocaleDateString('zh-CN');

    return <html lang={it.lang || "en"}>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{it.title || it.basename}</title>
            <meta name="supported-color-schemes" content="light dark" />
            <meta name="theme-color" content="hsl(220, 20%, 100%)" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="hsl(220, 20%, 10%)" media="(prefers-color-scheme: dark)" />

            <link rel="stylesheet" href="/styles.css" />
            <link rel="canonical" href={it.url} />
            {it.extra_head && <div dangerouslySetInnerHTML={{ __html: it.extra_head.join("\n") }} />}
        </head>
        <body>
            <div className="container">
                <div className="toolbar">
                    <div id="search" className="search"></div>
                </div>

                <Menu self={it} />

                {it.toc && it.toc.length > 0 && (
                    <nav className="toc">
                        <h2>On this page</h2>
                        <ol>
                            {it.toc.map((item: any) => (
                                <li key={item.slug}>
                                    <a href={`#${item.slug}`}>{item.text}</a>

                                    {item.children && item.children.length > 0 && (
                                        <ul>
                                            {item.children.map((child: any) => (
                                                <li key={child.slug}>
                                                    <a href={`#${child.slug}`}>{child.text}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <main className="main">
                    <Breadcrumb data={it} />
                    <div
                        className="body"
                        {...(it.content && it.pagefind ? { "data-pagefind-body": true } : {})}
                    >
                        {!it.title && <h1>{it.basename}</h1>}

                        <em> 此文档创建于 {originalDate ?? it.date?.toLocaleDateString('zh-CN')} </em>
                        {originalDate && originalDate !== editDate && <em style='float: right'> 更新时间 {editDate} </em>}

                        {content ? (
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                            <p className="emptyState">The page <code>{it.url}</code> is empty</p>
                        )}
                    </div>

                    {it.footnotes && it.footnotes.length > 0 && (
                        <aside role="note" className="footnotes">
                            <dl>
                                {it.footnotes.map((note: any) => (
                                    <div id={note.id} className="footnote" key={note.id}>
                                        <dt><a href={`#${note.refId}`}>{note.label}</a></dt>
                                        <dd dangerouslySetInnerHTML={{ __html: note.content }} />
                                    </div>
                                ))}
                            </dl>
                        </aside>
                    )}
                </main>
            </div>

            <script src="/js/clipboard.js"></script>
        </body>
    </html>
}