import type { HandlerRaw } from "./handler.raw.model";
import type { TableColumnParamsRaw } from "./tableColumnParams.raw.model";

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
