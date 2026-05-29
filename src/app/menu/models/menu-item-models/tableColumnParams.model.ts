import type { CriteriaOperator } from "./criteriaOperator.model";
import type { DynamicLookupHandler } from "./dynamicLookupHandler.model";
import type { TableColumnType } from "./tableColumnType.model";

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
