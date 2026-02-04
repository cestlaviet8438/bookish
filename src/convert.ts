import {
	BookishConfig,
	BreakBehavior,
	getMarkdownParser,
	IndentationConfig,
	ManualIndentChar,
} from "./config";

function getManualIndent(
	indentChar: ManualIndentChar,
	spaceCount: number,
): string {
	switch (indentChar) {
		case "emsp":
		case "ensp":
		case "nbsp":
			return `&${indentChar};`.repeat(spaceCount);
		case "tab":
			// return `<pre style='display: inline'>${"&#9;".repeat(spaceCount)}</pre>`;
			throw new Error(`tabs are not supported for now`);
		default:
			throw new Error(
				`could not identify indentation character: ${indentChar}`,
			);
	}
}

function applyIndentation(
	renderedText: string,
	indentConfig: IndentationConfig,
): string {
	if (indentConfig.type === "style") {
		return `<div style="text-indent: ${indentConfig.textIndentStyle}">\n${renderedText}\n</div>`;
	} else {
		const indent = getManualIndent(
			indentConfig.manualIndentChar,
			indentConfig.manualSpaceCount,
		);
		return renderedText.replace(/<p>/g, `<p>${indent}`);
	}
}

function convertMultiBreaks(rawText: string, behavior: BreakBehavior): string {
	if (behavior == "preserve") {
		throw new Error("break preservation is not supported for now");
	}
	return rawText.replace(/\n{2,}/g, '\n\n<br class="placeholder"/>\n\n');
}

function addParagraphBreaks(
	renderedText: string,
	behavior: BreakBehavior,
): string {
	if (behavior == "preserve") {
		throw new Error("break preservation is not supported for now");
	}
	return renderedText.replace(/<br \/>/g, "<br /></p>\n<p>");
}

export function convert(rawText: string, config: BookishConfig): string {
	if (config.breakBehavior) {
		rawText = convertMultiBreaks(rawText, config.breakBehavior);
	}
	let renderedText = getMarkdownParser(config).render(rawText);
	if (config.breakBehavior) {
		renderedText = addParagraphBreaks(renderedText, config.breakBehavior);
	}
	if (config.indentation) {
		renderedText = applyIndentation(renderedText, config.indentation);
	}
	return renderedText;
}
