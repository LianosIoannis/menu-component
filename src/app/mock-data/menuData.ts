import type { MenuDataModel } from "../menu/menuItem.model";

export const menuData: MenuDataModel = {
	mainHeaderText: "Manufacturing",
	subHeaderText: "System Menu",
	menuItems: [
		{
			id: "partners",
			text: "Partners",
			icon: "user-friends",
			iconColor: "text-indigo-400",
			isFolder: false,
			items: [],
		},
	],
};
