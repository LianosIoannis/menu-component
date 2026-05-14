import { Component, inject, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { nanoid } from "nanoid";
import { Menu } from "./menu/menu";
import type { MenuItemModel } from "./menu/menuItem.model";
import { menuData } from "./mock-data/menuData";
import { FaIconRegistry } from "./services/fa-icon-registry";
import type { TabModel } from "./tab-container/tab.model";
import { TabContainer } from "./tab-container/tab-container";

@Component({
	selector: "app-root",
	templateUrl: "./app.html",
	imports: [Menu, FontAwesomeModule, TabContainer],
})
export class App {
	protected readonly title = signal("menu-component");
	readonly isMenuOpen = signal(true);
	faIconRegistry = inject(FaIconRegistry);

	selectedMenuItem = signal<MenuItemModel | null>(null);
	menuData = signal(menuData);
	tabs = signal<TabModel[]>([]);
	activeTabId = signal<string | null>(null);

	onBackdropClick() {
		if (this.isMenuOpen()) {
			this.isMenuOpen.set(false);
		}
	}

	toggleMenu(v: boolean) {
		this.isMenuOpen.set(v);
	}

	async menuItemClicked(item: MenuItemModel) {
		this.selectedMenuItem.set(item);
		this.openTab(item);
		this.toggleMenu(false);
	}

	protected selectTab(tabId: string): void {
		this.activeTabId.set(tabId);
	}

	protected closeTab(tabId: string): void {
		this.tabs.update((tabs) => tabs.filter((tab) => tab.id !== tabId));

		if (this.activeTabId() !== tabId) {
			return;
		}

		const remainingTabs = this.tabs();
		this.activeTabId.set(remainingTabs.at(-1)?.id ?? null);
	}

	private openTab(item: MenuItemModel): void {
		const tabId = nanoid();

		this.tabs.update((tabs) => [
			...tabs,
			{
				id: tabId,
				menuItem: item,
				closable: true,
			},
		]);

		this.activeTabId.set(tabId);
	}
}
