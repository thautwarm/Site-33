import * as React from 'npm:preact';

export type RNode = React.ComponentChild;

export function a(options?: { attrs?: React.JSX.HTMLAttributes<HTMLAnchorElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <a {...attrs}>{children}</a>;
}

export function span(options?: { attrs?: React.JSX.HTMLAttributes<HTMLSpanElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <span {...attrs}>{children}</span>;
}

export function div(options?: { attrs?: React.JSX.HTMLAttributes<HTMLDivElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <div {...attrs}>{children}</div>;
}

export function strong(options?: { attrs?: React.JSX.HTMLAttributes<HTMLElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <strong {...attrs}>{children}</strong>;
}

export function ul(options?: { attrs?: React.JSX.HTMLAttributes<HTMLUListElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <ul {...attrs}>{children}</ul>;
}

export function li(options?: { attrs?: React.JSX.HTMLAttributes<HTMLLIElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <li {...attrs}>{children}</li>;
}

export function nav(options?: { attrs?: React.JSX.HTMLAttributes<HTMLElement>, children?: RNode | RNode[] }) {
    const attrs = options?.attrs ?? {};
    const children = options?.children ?? [];
    return <nav {...attrs}>{children}</nav>;
}

export function img(options?: { attrs?: React.JSX.HTMLAttributes<HTMLImageElement> }) {
    const attrs = options?.attrs ?? {};
    return <img {...attrs} />;
}

export function fragments(...children: (RNode | undefined)[]) {
    return <>{children.filter((c): c is RNode => c !== undefined && c !== null)}</>;
}

export function cond<A>(condition: A, mk: (arg: NonNullable<A>) => RNode | RNode[], otherwise?: () => RNode | RNode[]) {
    return <>
        { condition && mk(condition) }
        { !condition && otherwise?.()}
    </>
}