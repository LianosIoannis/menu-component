import type { MenuItemParamsRaw } from "./menuItemParams.raw.model";

export type MenuItemModelRaw = {
	id: string;
	text: string;
	icon: string;
	iconColor: string;
	params?: MenuItemParamsRaw;
	isFolder: boolean;
	items: MenuItemModelRaw[];
};
