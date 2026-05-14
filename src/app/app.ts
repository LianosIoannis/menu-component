import { Component, computed, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "./menu/menu";
import type { MenuItemModel } from "./menu/menuItem.model";
import { menuData } from "./mock-data/menuData";

@Component({
	selector: "app-root",
	templateUrl: "./app.html",
	imports: [Menu, FontAwesomeModule],
})
export class App {
	protected readonly title = signal("menu-component");
	readonly isMenuOpen = signal(true);

	selectedMneuItem = signal<MenuItemModel | null>(null);
	menuData = signal(menuData);
	bars = faBars;

	onBackdropClick() {
		if (this.isMenuOpen()) {
			this.isMenuOpen.set(false);
		}
	}

	toggleMenu(v: boolean) {
		this.isMenuOpen.set(v);
	}

	async menuItemClicked(item: MenuItemModel) {
		this.selectedMneuItem.set(item);
		this.toggleMenu(false);
	}
}
