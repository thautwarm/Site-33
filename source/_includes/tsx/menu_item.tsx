import { type NavData } from "lume/plugins/nav.ts";
import * as React from 'npm:preact';
import MenuItem from './menu_item.tsx';

const folder = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--color-dim)" viewBox="0 0 256 256"><path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64l27.73,20.8a16.12,16.12,0,0,0,9.6,3.2H200v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z"></path></svg>;
const library = <svg viewBox="0 0 24 24" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4L19 8.05512V15.9449L12 20L5 15.9449V8.05512L12 4ZM6.5 9.79002L11.25 12.5417L11.25 17.8306L6.5 15.0789V9.79002ZM12.75 17.8306L17.5 15.0789V9.79002L12.75 12.5417L12.75 17.8306ZM12 11.2413L16.7526 8.48809L12 5.73489L7.2474 8.48809L12 11.2413Z" fill="var(--color-dim)" /></svg>

const FC: React.FunctionComponent<{ self?: Lume.Data, item: NavData }> = ({ self, item }) => {

    return <>
        <FC1 self={self} item={item} />
        <FC2 self={self} item={item} />
    </>

}

export default FC;

const FC1: React.FunctionComponent<{ self?: Lume.Data, item: NavData }> = ({ self, item }) => {
    const isSoftware = self?.tags.includes("software") ?? false;

    if (item.data) {
        return <a aria-current={self?.url === item.data?.url ? "page" : undefined} href={item.data?.url}>
            {item.children && <span class='icon'>
                {isSoftware ? library : folder}
            </span>}
            {item.data.title || item.slug}
        </a>
    }
    else {
        return <strong> <span class='icon'>{folder}</span> {item.slug} </strong>
    }
}

const FC2: React.FunctionComponent<{ self?: Lume.Data, item: NavData }> = ({ self, item }) => {
    const isSoftware = self?.tags.includes("software") ?? false;

    if (isSoftware && item.children) {
        return <ul>
            {item.children.sort((a, b) => a.data?.order - b.data?.order).map((child, index) => {
                return <li key={index}>
                    <MenuItem self={self} item={child} />
                </li>
            })}
        </ul>
    }
    return null;
}
