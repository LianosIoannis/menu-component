export type MenuItemModel = {
	id: string;
	text: string;
	icon: string;
	iconColor: string;
	params?: MenuItemParams;
	isFolder: boolean;
	items: MenuItemModel[];
};

export type MenuDataModel = {
	mainHeaderText: string;
	subHeaderText: string;
	menuItems: MenuItemModel[];
};

export type TableColumnType = "string" | "number" | "boolean" | "date" | "datetime" | "time";
export type TableScreenType = "table" | "custom";

export type TableColumnParams = {
	name: string;
	label?: string;
	type: TableColumnType;

	retrieve?: boolean;

  retrieveCriteria?: boolean;
  retrieveCriteriaRequired?: boolean;

	insert?: boolean;
  insertRequired?: boolean;

	update?: boolean;
  updateRequired?: boolean;

	primaryKey?: boolean;
	visible?: boolean;
	sortable?: boolean;
	filterable?: boolean;
	editable?: boolean;
};

export type MenuItemParams = {
	screenType: TableScreenType;
	table?: TableScreenParams;
};

export type TableScreenParams = {
	name: string;
	columns: TableColumnParams[];
};
