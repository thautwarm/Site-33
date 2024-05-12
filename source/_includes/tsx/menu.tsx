import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';
import * as x from './builder.tsx';
import MenuItem, { navSortCmp } from './menu_item.tsx';

const FC: React.FunctionComponent<{ self: Lume.Data }> = ({ self }) => {
    const page = self.search.page('url=/');
    const itemMenu = self.nav.menu(self.url)
    const slug = itemMenu?.slug

    const nextThis = itemMenu ? self : undefined;

    return x.nav(
        {
            attrs: { class: 'menu-container' },
            children: x.fragments(
                x.cond(
                    page,
                    (page) => {
                        if (page.logo) {
                            return <a class="menu-logo" href={page.url}>
                                <img src={page.logo} alt={page.title || slug} />
                            </a>
                        }
                        return <a class="menu-highlight" href={page.url}>{page.title || slug}</a>
                    }
                ),

                x.ul(
                    {
                        attrs: { class: 'menu' },
                        children: (() => {
                            const menu = itemMenu ?? self.nav.menu()
                            return menu
                                .children
                                ?.sort(navSortCmp)
                                ?.map((child) =>
                                    x.li({ children: <MenuItem self={nextThis} item={child} /> }))
                                ?? []
                        })(),
                    }
                )
            )
        }
    )
}

export default FC
