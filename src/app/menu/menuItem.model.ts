export type MenuDataModel = {
	mainHeaderText: string;
	subHeaderText: string;
	menuItems: MenuItemModel[];
};

export type MenuItemModel = {
	id: string;
	text: string;
	icon: string;
	iconColor: string;
	params?: MenuItemParams;
	isFolder: boolean;
	items: MenuItemModel[];
};

export type MaybePromise<T> = T | Promise<T>;

export type Scalar = string | number | boolean | null;

export type Row = Record<string, Scalar>;
export type Criteria = Record<string, unknown>;
export type PrimaryKey = Record<string, Scalar>;

export type SqlQuery = string;

export type HandlerKind = "query" | "queryFactory" | "dataFactory";

export type QueryHandler = {
	type: "query";
	sql: SqlQuery;
};

export type QueryFactoryHandler<Input> = {
	type: "queryFactory";
	resolve: (input: Input) => MaybePromise<SqlQuery>;
};

export type DataFactoryHandler<Input, Output> = {
	type: "dataFactory";
	resolve: (input: Input) => MaybePromise<Output>;
};

export type Handler<Input, Output> = QueryHandler | QueryFactoryHandler<Input> | DataFactoryHandler<Input, Output>;

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

export type LookupOption = {
	value: string | number | boolean;
	label: string;
};

export type DynamicLookupHandler = SelectHandler;

export type SelectInput = {
	criteria: Criteria;
};

export type InsertInput = {
	values: Row;
};

export type UpdateInput = {
	key: PrimaryKey;
	values: Row;
};

export type DeleteInput = {
	key: PrimaryKey;
};

export type SelectOutput = Row[];
export type MutationOutput = boolean;

export type SelectHandler = Handler<SelectInput, SelectOutput>;
export type InsertHandler = Handler<InsertInput, MutationOutput>;
export type UpdateHandler = Handler<UpdateInput, MutationOutput>;
export type DeleteHandler = Handler<DeleteInput, MutationOutput>;

export type TableColumnParams = {
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
		handler?: DynamicLookupHandler;
	};
};

export type TableScreenParams = {
	name: string;
	columns: TableColumnParams[];

	handlers?: {
		select?: SelectHandler;
		insert?: InsertHandler;
		update?: UpdateHandler;
		delete?: DeleteHandler;
	};

	permissions?: {
		insert?: boolean;
		update?: boolean;
		delete?: boolean;
	};
};

export type MenuItemParams = {
	screenType: ScreenType;
	table?: TableScreenParams;
};
