import { NgClass } from "@angular/common";
import { Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import type { MenuItemModel } from "../menuItem.model";

@Component({
	selector: "app-menu-item",
	imports: [FontAwesomeModule, NgClass],
	templateUrl: "./menu-item.html",
})
export class MenuItem {
	menuItem = input.required<MenuItemModel>();
	filtered = input.required<boolean>();
	onItemClicked = output<MenuItemModel>();

	iconLibrary = inject(FaIconLibrary);

	menuClosed = signal<boolean>(false);
	faIcon = computed(() => this.menuItem().icon || "cog");

	constructor() {
		this.iconLibrary.addIconPacks(fas);

		effect(() => {
			this.menuClosed.set(!this.filtered());
		});
	}

	itemClicked() {
		if (this.menuItem().isFolder) {
			this.menuClosed.update((menuClosed) => !menuClosed);
		} else {
			this.onItemClicked.emit(this.menuItem());
		}
	}

	childClicked(childItem: MenuItemModel) {
		this.onItemClicked.emit(childItem);
	}
}
