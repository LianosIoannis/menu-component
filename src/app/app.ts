import { Component, effect, inject, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { nanoid } from "nanoid";
import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";
import { Menu } from "./menu/menu";
import type { MenuItemModel } from "./menu/menuItem.model";
import { menuData } from "./mock-data/menuData";
import { Auth } from "./services/auth";
import { Data } from "./services/data";
import { FaIconRegistry } from "./services/fa-icon-registry";
import { Signin } from "./signin/signin";
import type { TabModel } from "./tab-container/tab.model";
import { TabContainer } from "./tab-container/tab-container";

@Component({
	selector: "app-root",
	templateUrl: "./app.html",
	imports: [Menu, FontAwesomeModule, TabContainer, Signin, NgxSpinnerComponent],
})
export class App {
	protected readonly title = signal("menu-component");
	readonly isMenuOpen = signal(true);

	auth = inject(Auth);
	data = inject(Data);
	spinnerService = inject(NgxSpinnerService);

	faIconRegistry = inject(FaIconRegistry);

	selectedMenuItem = signal<MenuItemModel | null>(null);
	menuData = signal(menuData);
	tabs = signal<TabModel[]>([]);
	activeTabId = signal<string | null>(null);

	private readonly _spinnerEffect = effect(() => {
		const _ = this.data.loading() || this.auth.loading() ? this.spinnerService.show() : this.spinnerService.hide();
	});

	async testQuery() {
		const query = "SELECT * FROM timer_fpr2";
		const result = await this.data.execQuery(query, true);
		if (result.success) {
			console.log("Query result:", result.data);
		} else {
			console.error("Query error:", result.error);
		}
	}

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

	onProfileClicked() {
		const userData = this.auth.userData();
		alert(`User data: ${JSON.stringify(userData, null, 2)}`);
	}
}
