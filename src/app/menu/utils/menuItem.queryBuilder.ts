import type { Handler } from "../models/menu-item-models/index";
import type { MenuItemQueryBuildInput, SubmittedFields, SubmittedFieldValue } from "./menuItem.queryBuilder.types";
import {
	appendSelectCriteriaSql,
	buildDeleteSql,
	buildInsertSql,
	buildSelectSql,
	buildUpdateSql,
} from "./menuItem.sqlStatements";
import { replaceSqlPlaceholders, unwrapSubmittedFields, unwrapSubmittedScalarFields } from "./menuItem.sqlValues";

export type { MenuItemQueryBuildInput, SubmittedFields, SubmittedFieldValue };

export const buildMenuItemQuery = async (input: MenuItemQueryBuildInput): Promise<unknown> => {
	const tableParams = input.menuItem.params?.tableParams;

	if (!tableParams) {
		throw new Error(`Menu item "${input.menuItem.id}" does not have table params`);
	}

	switch (input.action) {
		case "select":
			return resolveQuery({
				handler: tableParams.handlers?.select,
				handlerInput: { criteria: unwrapSubmittedFields(input.values) },
				fallbackSql: () => buildSelectSql(tableParams, input.values),
				replacementValues: input.values,
				transformSql: (sql) => appendSelectCriteriaSql(sql, input.values),
			});

		case "insert":
			return resolveQuery({
				handler: tableParams.handlers?.insert,
				handlerInput: { values: unwrapSubmittedScalarFields(input.values) },
				fallbackSql: () => buildInsertSql(tableParams, input.values),
				replacementValues: input.values,
			});

		case "update":
			return resolveQuery({
				handler: tableParams.handlers?.update,
				handlerInput: {
					key: unwrapSubmittedScalarFields(input.values.key),
					values: unwrapSubmittedScalarFields(input.values.values),
				},
				fallbackSql: () => buildUpdateSql(tableParams, input.values.key, input.values.values),
				replacementValues: {
					...input.values.key,
					...input.values.values,
				},
			});

		case "delete":
			return resolveQuery({
				handler: tableParams.handlers?.delete,
				handlerInput: { key: unwrapSubmittedScalarFields(input.values.key) },
				fallbackSql: () => buildDeleteSql(tableParams, input.values.key),
				replacementValues: input.values.key,
			});
	}
};

const resolveQuery = async <Input, Output>({
	handler,
	handlerInput,
	fallbackSql,
	replacementValues,
	transformSql,
}: {
	handler: Handler<Input, Output> | undefined;
	handlerInput: Input;
	fallbackSql: () => string;
	replacementValues: SubmittedFields;
	transformSql?: (sql: string) => string;
}): Promise<string | Output> => {
	if (!handler) {
		return fallbackSql();
	}

	if (handler.type === "query") {
		return transformSql?.(replaceSqlPlaceholders(handler.sql, replacementValues)) ?? replaceSqlPlaceholders(handler.sql, replacementValues);
	}

	const result = await handler.resolve(handlerInput);

	if (handler.type === "queryFactory") {
		const sql = replaceSqlPlaceholders(result as string, replacementValues);

		return transformSql?.(sql) ?? sql;
	}

	return result;
};
