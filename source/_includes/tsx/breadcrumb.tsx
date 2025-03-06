import * as React from 'npm:preact';

export default function Breadcrumb({ data }: { data: Lume.Data }) {
  const breadcrumbItems = data.nav.breadcrumb(data.url);
  
  return (
    <nav>
      <ul className="breadcrumb">
        {breadcrumbItems.map((item, index) => {
          if (item.data && item.data.url !== data.url) {
            return (
              <li key={index} className="breadcrumb-item">
                <a href={item.data.url}>{item.data.title}</a>
              </li>
            );
          } else if (!item.data) {
            return (
              <li key={index} className="breadcrumb-item">
                <strong>{item.slug}</strong>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </nav>
  );
}
