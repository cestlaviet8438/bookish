import { App, Command, Plugin, PluginSettingTab } from "obsidian";
import {
	BookishConfig,
	constructSettings,
	DEFAULT_BOOKISH_CONFIG,
} from "./config";
import { copyConverted, previewConverted } from "./backend";

class BookishSettingTab extends PluginSettingTab {
	plugin: BookishPlugin;

	constructor(app: App, plugin: BookishPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		constructSettings(this.plugin, containerEl);
	}
}

export class BookishPlugin extends Plugin {
	settings: BookishConfig;

	async onload() {
		await this.loadSettings();
		this.addCommand(this.getCopyConvertedCommand());
		this.addCommand(this.getPreviewConvertedCommand());
		this.addSettingTab(new BookishSettingTab(this.app, this));
	}

	getCopyConvertedCommand(): Command {
		return {
			id: "bookish-copy-html",
			name: "Copy the converted text to the clipboard",
			editorCallback: async (editor, view) =>
				await copyConverted(this.settings, editor, view),
		};
	}

	getPreviewConvertedCommand(): Command {
		return {
			id: "bookish-preview-html",
			name: "Preview the converted text in a new tab",
			editorCallback: async (editor, view) =>
				await previewConverted(this.settings, editor, view),
		};
	}

	async loadSettings() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.settings = Object.assign(
			{},
			DEFAULT_BOOKISH_CONFIG,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
