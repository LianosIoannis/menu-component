import type { CriteriaOperator, MenuItemModel, Scalar } from "../models/menu-item-models/index";

export type SubmittedFieldValue = {
	operator: CriteriaOperator;
	value: Scalar | Scalar[];
};

export type SubmittedFields = Record<string, SubmittedFieldValue>;

export type MenuItemQueryBuildInput =
	| {
			action: "select";
			menuItem: MenuItemModel;
			values: SubmittedFields;
	  }
	| {
			action: "insert";
			menuItem: MenuItemModel;
			values: SubmittedFields;
	  }
	| {
			action: "update";
			menuItem: MenuItemModel;
			values: {
				key: SubmittedFields;
				values: SubmittedFields;
			};
	  }
	| {
			action: "delete";
			menuItem: MenuItemModel;
			values: {
				key: SubmittedFields;
			};
	  };
