import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';
import * as x from './builder.tsx';

const folder = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--color-dim)" viewBox="0 0 256 256"><path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64l27.73,20.8a16.12,16.12,0,0,0,9.6,3.2H200v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z"></path></svg>;

const library = <svg viewBox="0 0 24 24" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4L19 8.05512V15.9449L12 20L5 15.9449V8.05512L12 4ZM6.5 9.79002L11.25 12.5417L11.25 17.8306L6.5 15.0789V9.79002ZM12.75 17.8306L17.5 15.0789V9.79002L12.75 12.5417L12.75 17.8306ZM12 11.2413L16.7526 8.48809L12 5.73489L7.2474 8.48809L12 11.2413Z" fill="var(--color-dim)" /></svg>

const FC: React.FunctionComponent<{ self?: Lume.Data, item: NavData }> = ({ self, item }) => {
    const isSoftware = self?.tags.includes("software");
    return x.fragments(
        x.cond(
            item.data,
            (data) => {
                const attrs: React.JSX.HTMLAttributes<HTMLAnchorElement> = {};
                attrs.href = data.url;
                if (data.url == self?.url) attrs['aria-current'] = 'page';
                return x.a(
                    {
                        attrs,
                        children: x.fragments(
                            x.cond(item.children, () => {
                                return x.span(
                                    {
                                        attrs: { class: 'icon' },
                                        children: isSoftware ? library : folder
                                    }
                                );
                            }),
                            " " + (data.title || item.slug)
                        )
                    }
                )
            },
            () => x.strong(
                {
                    children: [
                        x.span(
                            {
                                attrs: { className: 'icon' },
                                children: folder
                            }
                        ),
                        " " + item.slug
                    ]
                })
        ),

        x.cond(
            isSoftware ? item.children : undefined,
            (children) => x.ul(
                {
                    children: children
                        .sort(navSortCmp)
                        .map((child) => {
                            return x.li(
                                {
                                    children: <FC self={self} item={child} />
                                }
                            )
                        })
                }
            )
        )
    )
}

export function navSortCmp(a: NavData, b: NavData) {
    const i1 = a.data?.renderOrder ?? 0;
    const i2 = b.data?.renderOrder ?? 0;
    return i1 - i2;
}

export default FC;
