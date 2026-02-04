import { Editor, MarkdownFileInfo, MarkdownView } from "obsidian";
import { BookishConfig } from "./config";
import { convert } from "./convert";

export async function copyConverted(
	config: BookishConfig,
	editor: Editor,
	view: MarkdownView | MarkdownFileInfo,
) {
	await navigator.clipboard.writeText(convert(editor.getValue(), config));
}

export async function previewConverted(
	config: BookishConfig,
	_editor: Editor,
	view: MarkdownView | MarkdownFileInfo,
) {}
