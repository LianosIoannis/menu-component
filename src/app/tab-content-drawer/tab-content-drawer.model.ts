import type { CriteriaOperator, TableColumnType } from "../menu/models/menu-item-models/index";

export type { CriteriaOperator };

export type TabContentDrawerScalarValue = string | number | boolean | null;

export type TabContentDrawerValue = TabContentDrawerScalarValue | TabContentDrawerScalarValue[];

export type TabContentDrawerOperatorValue = {
	operator: CriteriaOperator;
	value: TabContentDrawerValue;
};

export type TabContentDrawerFormModel = Record<string, TabContentDrawerValue | TabContentDrawerOperatorValue>;

export type TabContentDrawerOrientation = "ltr" | "rtl";

export type TabContentDrawerAvailableValue = {
	value: Exclude<TabContentDrawerScalarValue, null>;
	text: string;
};

export type TabContentDrawerColumn = {
	name: string;
	label: string;
	type: TableColumnType;
	allowedOperators?: CriteriaOperator[];
	defaultOperator?: CriteriaOperator;
	availableValues?: TabContentDrawerAvailableValue[];
	multiple?: boolean;
	required?: boolean;
	defaultValue?: TabContentDrawerValue;
	readonly?: boolean;
};
