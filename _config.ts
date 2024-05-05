import lume from "lume/mod.ts";
import katex from "lume/plugins/katex.ts";
import wiki from "./source/wiki.ts";
import favicon from "lume/plugins/favicon.ts";
import redirects from "lume/plugins/redirects.ts";


const site = lume({});
site
    .use(favicon({ input: './static/favicon.png' }))
    .use(redirects())
    .use(katex( {
        options: {
            output: 'mathml',
            delimiters: [
                {
                    left: "$$",
                    right: "$$",
                    display: true
                },
                {
                    left: "$",
                    right: "$",
                    display: false
                },
            ]
        }
    }))
    .use(wiki())
    ;

site.remoteFile(
    "_includes/css/syntax-highlight.css",
    "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/nnfx-light.min.css"
)

site.ignore("README.md", "CHANGELOG.md", "node_modules");

export default site;
