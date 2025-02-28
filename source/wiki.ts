import code_highlight from "lume/plugins/code_highlight.ts";
import postcss from "lume/plugins/postcss.ts";
import pagefind from "lume/plugins/pagefind.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import nav from "lume/plugins/nav.ts";
import title from "https://deno.land/x/lume_markdown_plugins@v0.7.0/title.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.7.0/footnotes.ts";
import date from "lume/plugins/date.ts";
import basePath from "lume/plugins/base_path.ts";
import codeCopy from "./codeCopy.ts";
import { alert } from "npm:@mdit/plugin-alert@0.8.0";

import "lume/types.ts";

function plugins() {
    return (site: Lume.Site) => {
        site.use(nav())
            .use(title())
            .use(code_highlight())
            .use(toc())
            .use(footnotes())
            .use(postcss())
            .use(pagefind())
            // .use(prism())
            .use(resolveUrls())
            .use(date())
            .use(basePath())
            .data("layout", "blog-layout.vto")
            .data("date", "Git Last Modified")
            .mergeKey("extra_head", "stringArray")
            .copy([
                ".jpg",
                ".jpeg",
                ".png",
                ".webp",
                ".svg",
                ".mp4",
                ".webm",
                ".gif",
            ]);

        // Alert plugin
        site.hooks.addMarkdownItPlugin(alert);
        site.hooks.addMarkdownItPlugin(codeCopy);
    };
}



export default function () {
    return (site: Lume.Site) => {
        // Configure the site
        site.use(plugins());

        // Add remote files
        const files = [
            "_includes/js/clipboard.js",
            "_includes/svg/copy.svg",
            "_includes/css/menu.css",
            "_includes/css/updates.css",
            "_includes/css/overrides.css",
            "_includes/styles.css",
            "_includes/typecheck.tsx",
            "_includes/list-article-layout.tsx",
            "_includes/blog-layout.vto",
            "_includes/list-sub-layout.vto",
            "_includes/templates/breadcrumb.vto",
            "_includes/templates/menu_item.vto",
            "_includes/templates/menu.vto",
            "_includes/templates/list-sub-item.vto",
            "_includes/templates/list-sub.vto",
            "styles.css",
        ];

        for (const file of files) {
            site.remoteFile(file, import.meta.resolve(`./${file}`));
        }

        site.copy('_includes/svg/copy.svg', 'svg/copy.svg')
        site.copy('_includes/js/clipboard.js', 'js/clipboard.js')
    };
}
