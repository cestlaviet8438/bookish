import { Setting } from "obsidian";
import MarkdownIt from "markdown-it";
import { BookishPlugin } from "./frontend";

export type BreakBehavior = "preserve" | "collapse";
export type IndentType = "style" | "manual";
export type ManualIndentChar = "space" | "nbsp" | "emsp" | "ensp" | "tab";

export interface IndentationConfig {
	enabled: boolean;
	type: IndentType;
	textIndentStyle: string;
	manualIndentChar: ManualIndentChar;
	manualSpaceCount: number;
}

export interface BookishConfig {
	allowTypography: boolean;
	breakBehavior: BreakBehavior | null;
	linkify: boolean;
	indentation: IndentationConfig;
}

export const DEFAULT_BOOKISH_CONFIG: BookishConfig = {
	allowTypography: true,
	breakBehavior: "collapse",
	linkify: false,
	indentation: {
		enabled: true,
		type: "style",
		textIndentStyle: "2em",
		manualIndentChar: "emsp",
		manualSpaceCount: 2,
	},
};

export function getMarkdownParser(config: BookishConfig): MarkdownIt {
	let markdownItConfig = {};
	if (config.allowTypography) {
		markdownItConfig = {
			html: true,
			xhtmlOut: true,
			typographer: true,
			breaks: config.breakBehavior,
			linkify: config.linkify,
		};
	} else {
		markdownItConfig = { html: true, xhtmlOut: true, typographer: false };
	}
	return MarkdownIt(markdownItConfig);
}

function typographySetting(
	plugin: BookishPlugin,
	container: HTMLElement,
): void {
	const description = `Allow Bookish to do any typography work at all during
	conversion. If disabled, only basic conversions (*italics*, **bold**, etc.)
	will happen.`;

	new Setting(container)
		.setName("Allow typography")
		.setDesc(description)
		.addToggle((toggle) => {
			toggle.setValue(plugin.settings.allowTypography);
			toggle.onChange(async (value) => {
				plugin.settings.allowTypography = value;
				await plugin.saveSettings();
			});
		});
}

export function constructSettings(
	plugin: BookishPlugin,
	settingContainer: HTMLElement,
): void {
	typographySetting(plugin, settingContainer);
}
