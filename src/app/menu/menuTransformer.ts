/** biome-ignore-all lint/suspicious/noExplicitAny: <test> */
/** biome-ignore-all lint/complexity/noBannedTypes: <test> */
import type {
	Handler,
	MaybePromise,
	MenuDataModel,
	MenuItemModel,
	MenuItemParams,
	SelectInput,
	SelectOutput,
	TableColumnParams,
	TableScreenParams,
} from "../menu/menuItem.model";
import type {
	HandlerRaw,
	MenuDataModelRaw,
	MenuItemModelRaw,
	MenuItemParamsRaw,
	TableColumnParamsRaw,
	TableScreenParamsRaw,
} from "./menuItemRaw.model";

export const transformMenuDataModel = (raw: MenuDataModelRaw): MenuDataModel => {
	return {
		mainHeaderText: raw.mainHeaderText,
		subHeaderText: raw.subHeaderText,
		menuItems: raw.menuItems.map(transformMenuItemModel),
	};
};

const transformMenuItemModel = (raw: MenuItemModelRaw): MenuItemModel => {
	return {
		id: raw.id,
		text: raw.text,
		icon: raw.icon,
		iconColor: raw.iconColor,
		isFolder: raw.isFolder,
		items: raw.items.map(transformMenuItemModel),
		params: raw.params ? transformMenuItemParams(raw.params) : undefined,
	};
};

const transformMenuItemParams = (raw: MenuItemParamsRaw): MenuItemParams => {
	return {
		screenType: raw.screenType,
		table: raw.table ? transformTableScreenParams(raw.table) : undefined,
	};
};

const transformTableScreenParams = (raw: TableScreenParamsRaw): TableScreenParams => {
	return {
		name: raw.name,

		columns: raw.columns.map(transformTableColumnParams),

		handlers: raw.handlers
			? {
					select: raw.handlers.select ? transformHandler<SelectInput, SelectOutput>(raw.handlers.select) : undefined,

					insert: raw.handlers.insert ? transformHandler(raw.handlers.insert) : undefined,

					update: raw.handlers.update ? transformHandler(raw.handlers.update) : undefined,

					delete: raw.handlers.delete ? transformHandler(raw.handlers.delete) : undefined,
				}
			: undefined,

		permissions: raw.permissions,
	};
};

const transformTableColumnParams = (raw: TableColumnParamsRaw): TableColumnParams => {
	return {
		name: raw.name,
		label: raw.label,
		type: raw.type,

		primaryKey: raw.primaryKey,

		visible: raw.visible,
		sortable: raw.sortable,
		filterable: raw.filterable,

		retrieve: raw.retrieve,
		insert: raw.insert,
		update: raw.update,

		lookup: raw.lookup
			? {
					enabled: raw.lookup.enabled,
					handler: raw.lookup.handler ? transformHandler<SelectInput, SelectOutput>(raw.lookup.handler) : undefined,
				}
			: undefined,
	};
};

const transformHandler = <Input = any, Output = any>(raw: HandlerRaw): Handler<Input, Output> => {
	switch (raw.type) {
		case "query":
			return {
				type: "query",
				sql: raw.sql,
			};

		case "queryFactory":
			return {
				type: "queryFactory",
				resolve: buildFunction<(input: Input) => MaybePromise<string>>(raw.resolve),
			};

		case "dataFactory":
			return {
				type: "dataFactory",
				resolve: buildFunction<(input: Input) => MaybePromise<Output>>(raw.resolve),
			};

		default:
			throw new Error(`Unsupported handler type`);
	}
};

const buildFunction = <T extends Function>(source: string): T => {
	return new Function(`return (${source})`)() as T;
};
