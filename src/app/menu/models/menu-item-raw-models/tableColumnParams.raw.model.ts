import type { CriteriaOperator } from "./criteriaOperator.raw.model";
import type { DynamicLookupHandlerRaw } from "./dynamicLookupHandler.raw.model";
import type { TableColumnType } from "./tableColumnType.raw.model";

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
