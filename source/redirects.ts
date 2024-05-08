import { merge } from "lume/core/utils/object.ts";
import { Page } from "lume/core/file.ts";
import { log } from "lume/core/utils/log.ts";
import type Site from "lume/core/site.ts";
import { join as joinUrl } from "https://deno.land/std@0.224.0/url/join.ts";

export interface Options {
    /** The redirects output format */
    output?: "html" | OutputStrategy;

    /** The default status code to use */
    defaultStatus?: Status;
}

type Status = 301 | 302 | 307 | 308;

const validStatusCodes = [301, 302, 303, 307, 308];

type Redirect = [string, string, Status];
type OutputStrategy = (
    redirects: Redirect[],
    site: Site,
) => Promise<void> | void;

export const defaults: Options = {
    output: "html",
    defaultStatus: 301,
};

export default function (userOptions?: Options) {
    const options = merge(defaults, userOptions);

    return (site: Site) => {
        site.process("*", (pages) => {
            const redirects: Redirect[] = [];

            pages.forEach((page) => {
                const { url, oldUrl } = page.data;

                if (url && oldUrl) {
                    const oldUrls = Array.isArray(oldUrl) ? oldUrl : [oldUrl];

                    for (const old of oldUrls) {
                        const redirect = parseRedirection(url, old, options.defaultStatus);
                        if (redirect) {
                            redirects.push(redirect);
                        }
                    }
                }
            });

            if (!redirects.length) {
                return;
            }

            const outputFn = typeof options.output === "string"
                ? outputs[options.output]
                : options.output;

            if (!outputFn) {
                log.error(`[redirects] Invalid output format: ${options.output}`);
                throw new Error(`Invalid output format: ${options.output}`);
            }

            redirects.sort((a, b) => a[0].localeCompare(b[0]));

            return outputFn(redirects, site);
        });
    };
}

function parseRedirection(
    newUrl: string,
    oldUrl: string,
    defaultCode: Status,
): [string, string, Status] | undefined {
    const [from, code] = oldUrl.split(/\s+/);
    const parsedCode = code ? parseInt(code) : defaultCode;

    if (!validStatusCodes.includes(parsedCode)) {
        log.error(
            `Invalid status code for redirection from ${from} to ${newUrl} (${code}).`,
        );
        return;
    }

    return [from, newUrl, parsedCode as Status];
}

/** HTML redirect */
function html(redirects: Redirect[], site: Site): void {

    for (const [url, to, statusCode] of redirects) {
        const revisedTo = joinUrl(site.options.location, to).pathname;
        const timeout = (statusCode === 301 || statusCode === 308) ? 0 : 1;
        const content = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Redirecting…</title>
    <meta http-equiv="refresh" content="${timeout}; url=${revisedTo}">
  </head>
  <body>
    <h1>Redirecting…</h1>
    <a href="${revisedTo}">Click here if you are not redirected.</a>
  </body>
  </html>`;
        const page = Page.create({ url, content });
        site.pages.push(page);
    }
}

/** Predefined output strategies */
const outputs: Record<string, OutputStrategy> = {
    html,
};