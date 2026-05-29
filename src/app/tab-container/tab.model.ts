import type { MenuItemModel } from "../menu/models/menu-item-models/index";

export interface TabModel {
	id: string;
	menuItem: MenuItemModel;
	closable?: boolean;
}
