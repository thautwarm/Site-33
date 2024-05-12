import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';

const FC: React.FunctionComponent<{ data: Lume.Data }> = ({ data }) => {

    const nodes: React.JSX.Element[] = [];
    let i = 0;
    for (const item of data.nav.breadcrumb(data.url)) {
        let elt: React.JSX.Element;
        if (item.data && item.data.url != data.url) {
            elt = <li class="breadcrumb-item" key={i}>
                <a href={item.data.url}>{item.data.title}</a>
            </li>;
            nodes.push(elt);
        }
        else if (!item.data) {
            elt = <li class="breadcrumb-item" key={i}>
                <strong>{item.slug}</strong>
            </li>
            nodes.push(elt);
        }

        i++;
    }
    return <nav>
        <ul class="breadcrumb">
            {nodes}
        </ul>
    </nav>
}

export default FC;
