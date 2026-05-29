import type { MenuItemModelRaw } from "./menuItem.raw.model";

export type MenuDataModelRaw = {
	mainHeaderText: string;
	subHeaderText: string;
	menuItems: MenuItemModelRaw[];
};
