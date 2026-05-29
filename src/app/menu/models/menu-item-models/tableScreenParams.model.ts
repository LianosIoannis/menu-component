import type { DeleteHandler } from "./deleteHandler.model";
import type { InsertHandler } from "./insertHandler.model";
import type { SelectHandler } from "./selectHandler.model";
import type { TableColumnParams } from "./tableColumnParams.model";
import type { UpdateHandler } from "./updateHandler.model";

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
