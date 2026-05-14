import { Component, inject, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Menu } from "./menu/menu";
import type { MenuItemModel } from "./menu/menuItem.model";
import { menuData } from "./mock-data/menuData";
import { FaIconRegistry } from "./services/fa-icon-registry";

@Component({
	selector: "app-root",
	templateUrl: "./app.html",
	imports: [Menu, FontAwesomeModule],
})
export class App {
	protected readonly title = signal("menu-component");
	readonly isMenuOpen = signal(true);
	faIconRegistry = inject(FaIconRegistry);

	selectedMenuItem = signal<MenuItemModel | null>(null);
	menuData = signal(menuData);

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
		this.toggleMenu(false);
	}
}
