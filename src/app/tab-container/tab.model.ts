import type { MenuItemModel } from "../menu/menuItem.model";

export interface TabModel {
	id: string;
	menuItem: MenuItemModel;
	closable?: boolean;
}
