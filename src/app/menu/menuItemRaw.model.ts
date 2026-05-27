export type MenuDataModelRaw = {
	mainHeaderText: string;
	subHeaderText: string;
	menuItems: MenuItemModelRaw[];
};

export type MenuItemModelRaw = {
	id: string;
	text: string;
	icon: string;
	iconColor: string;
	params?: MenuItemParamsRaw;
	isFolder: boolean;
	items: MenuItemModelRaw[];
};

export type SqlQuery = string;

export type HandlerKind = "query" | "queryFactory" | "dataFactory";

export type QueryHandlerRaw = {
	type: "query";
	sql: SqlQuery;
};

export type QueryFactoryHandlerRaw = {
	type: "queryFactory";
	resolve: string;
};

export type DataFactoryHandlerRaw = {
	type: "dataFactory";
	resolve: string;
};

export type HandlerRaw = QueryHandlerRaw | QueryFactoryHandlerRaw | DataFactoryHandlerRaw;

export type TableColumnType = "string" | "number" | "boolean" | "date" | "datetime" | "time";

export type ScreenType = "table" | "custom";

export type CriteriaOperator =
	| "equals"
	| "notEquals"
	| "greaterThan"
	| "lessThan"
	| "greaterThanOrEqual"
	| "lessThanOrEqual"
	| "contains"
	| "notContains"
	| "startsWith"
	| "endsWith"
	| "between"
	| "in"
	| "notIn";

export type LookupOptionRaw = {
	value: string | number | boolean;
	label: string;
};

export type DynamicLookupHandlerRaw = HandlerRaw;

export type TableColumnParamsRaw = {
	name: string;
	label?: string;
	type: TableColumnType;

	primaryKey?: boolean;

	visible?: boolean;
	sortable?: boolean;
	filterable?: boolean;

	retrieve?: {
		enabled?: boolean;
		criteria?: {
			enabled?: boolean;
			required?: boolean;
			allowedFilters?: CriteriaOperator[];
		};
	};

	insert?: {
		enabled?: boolean;
		required?: boolean;
	};

	update?: {
		enabled?: boolean;
		required?: boolean;
	};

	lookup?: {
		enabled?: boolean;
		handler?: DynamicLookupHandlerRaw;
	};
};

export type TableScreenParamsRaw = {
	name: string;
	columns: TableColumnParamsRaw[];

	handlers?: {
		select?: HandlerRaw;
		insert?: HandlerRaw;
		update?: HandlerRaw;
		delete?: HandlerRaw;
	};

	permissions?: {
		insert?: boolean;
		update?: boolean;
		delete?: boolean;
	};
};

export type MenuItemParamsRaw = {
	screenType: ScreenType;
	table?: TableScreenParamsRaw;
};
