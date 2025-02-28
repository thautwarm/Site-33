// deno-lint-ignore-file no-explicit-any
import _ from 'npm:lodash';

const defaultOptions = {};

function renderCode(origRule: any, options: any) {
	options = _.merge(defaultOptions, options);
	return (...args: any[]) => {
		const [tokens, idx] = args;
		const content = tokens[idx].content
			.replaceAll('"', '&quot;')
			.replaceAll("'", "&apos;");
		const origRendered = origRule(...args);

		if (content.length === 0)
			return origRendered;

		return `
<div style="position: relative">
	${origRendered}
	<button class="code-copy-button" data-clipboard-text="${content}">
        <span class="code-copy-icon"></span>
    </button>
</div>
`;
	};
}

export default (md: any, options: any) => {
	md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options);
	md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};