import * as React from 'npm:preact';

export default function ListSubItem({ item }: { item: any }) {
  const moduleIcon = <svg viewBox="0 0 24 24" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4L19 8.05512V15.9449L12 20L5 15.9449V8.05512L12 4ZM6.5 9.79002L11.25 12.5417L11.25 17.8306L6.5 15.0789V9.79002ZM12.75 17.8306L17.5 15.0789V9.79002L12.75 12.5417L12.75 17.8306ZM12 11.2413L16.7526 8.48809L12 5.73489L7.2474 8.48809L12 11.2413Z" fill="var(--color-dim)"/></svg>;
  
  if (item.data) {
    return (
      <a href={item.data.url}>
        {item.children && (
          <span className="icon">{moduleIcon}</span>
        )}
        {item.data.title || item.slug}
      </a>
    );
  } else {
    return (
      <strong>
        <span className="icon">{moduleIcon}</span> {item.slug}
      </strong>
    );
  }
} 