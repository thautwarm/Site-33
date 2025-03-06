import * as React from 'npm:preact';
import MenuItem from './menu_item.tsx';

export default function Menu({ self }: { self: Lume.Data }) {
	const page = self.search.page("url=/");
	const it_menu = self && self.nav.menu(self.url);

	return (
		<nav className="menu-container">
			{page && (
				page.logo ?
					<a className="menu-logo" href={page.url}>
						<img src={page.logo} alt={page.title || page.slug} />
					</a> :
					<a className="menu-highlight" href={page.url}>
						{page.title || page.slug}
					</a>
			)}

			<ul className="menu">
				{it_menu ?
					(it_menu?.children?.sort((a, b) => a.data?.order - b.data?.order) || []).map((item) => (
						<li key={item.slug}>
							<MenuItem item={item} self={self} />
						</li>
					)) :
					(self.nav.menu().children?.sort((a, b) => a.data?.order - b.data?.order) || []).map((item) => (
						<li key={item.slug}>
							<MenuItem item={item} />
						</li>
					))
				}
			</ul>
		</nav>
	);
}
