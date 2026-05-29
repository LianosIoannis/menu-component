import type { MenuItemParams } from "./menuItemParams.model";

export type MenuItemModel = {
	id: string;
	text: string;
	icon: string;
	iconColor: string;
	params?: MenuItemParams;
	isFolder: boolean;
	items: MenuItemModel[];
};
