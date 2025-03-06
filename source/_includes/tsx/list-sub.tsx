import * as React from 'npm:preact';
import ListSubItem from './list-sub-item.tsx';
import MenuItem from './menu_item.tsx';

export default function ListSub({ it }: { it: Lume.Data }) {
  const it_menu = it && it.nav.menu(it.url);
  
  return (
    <ul>
      {it_menu ? 
        (it_menu?.children?.sort((a, b) => a.data?.order - b.data?.order) || []).map((item) => (
          <li key={item.slug}>
            <ListSubItem item={item} />
          </li>
        )) :
        (it.nav.menu().children?.sort((a, b) => a.data?.order - b.data?.order) || []).map((item, index) => (
          <li key={index}>
            <MenuItem item={item} />
          </li>
        ))
      }
    </ul>
  );
} 