import type { PrimaryKey } from "./primaryKey.model";
import type { Row } from "./row.model";

export type UpdateInput = {
	key: PrimaryKey;
	values: Row;
};
