export type MenuItemModel = {
	id: string;
	text: string;
	icon: string;
	iconColor: string;
	isFolder: boolean;
	items: MenuItemModel[];
};

export type MenuDataModel = {
  mainHeaderText: string;
  subHeaderText: string;
  menuItems: MenuItemModel[];
}
