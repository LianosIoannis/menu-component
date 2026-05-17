import type { TableColumnType } from "../menu/menuItem.model";

export type TabContentDrawerValue = string | number | boolean | null;

export type TabContentDrawerFormModel = Record<string, TabContentDrawerValue>;

export type TabContentDrawerOrientation = "ltr" | "rtl";

export type TabContentDrawerColumn = {
	name: string;
	label: string;
	type: TableColumnType;
	required?: boolean;
	defaultValue?: TabContentDrawerValue;
	readonly?: boolean;
};
