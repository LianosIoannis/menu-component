import { Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FaIconRegistry } from "../../services/fa-icon-registry";
import type { MenuItemModel } from "../menuItem.model";

@Component({
	selector: "app-menu-item",
	imports: [FontAwesomeModule],
	templateUrl: "./menu-item.html",
})
export class MenuItem {
	menuItem = input.required<MenuItemModel>();
	filtered = input.required<boolean>();
	onItemClicked = output<MenuItemModel>();

	faIconRegistry = inject(FaIconRegistry);

	menuClosed = signal<boolean>(false);
	menuClosedEffect = effect(() => {
		this.menuClosed.set(!this.filtered());
	});

	faIcon = computed(() => this.menuItem().icon || "cog");

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
