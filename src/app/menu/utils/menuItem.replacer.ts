import type {
	Handler,
	MenuItemModel,
	MenuItemParams,
	TableColumnParams,
	TableScreenParams,
} from "../models/menu-item-models/index";
import type {
	HandlerRaw,
	MenuItemModelRaw,
	MenuItemParamsRaw,
	TableColumnParamsRaw,
	TableScreenParamsRaw,
} from "../models/menu-item-raw-models/index";

export const replaceMenuItemModel = (menuItem: MenuItemModel): MenuItemModelRaw => {
	return {
		id: menuItem.id,
		text: menuItem.text,
		icon: menuItem.icon,
		iconColor: menuItem.iconColor,
		isFolder: menuItem.isFolder,
		items: menuItem.items.map(replaceMenuItemModel),
		...(menuItem.params ? { params: replaceMenuItemParams(menuItem.params) } : {}),
	};
};

const replaceMenuItemParams = (params: MenuItemParams): MenuItemParamsRaw => {
	return {
		screenType: params.screenType,
		...(params.tableParams ? { tableParams: replaceTableScreenParams(params.tableParams) } : {}),
	};
};

const replaceTableScreenParams = (params: TableScreenParams): TableScreenParamsRaw => {
	return {
		name: params.name,
		columns: params.columns.map(replaceTableColumnParams),
		...(params.handlers
			? {
					handlers: {
						...(params.handlers.select ? { select: replaceHandler(params.handlers.select) } : {}),
						...(params.handlers.insert ? { insert: replaceHandler(params.handlers.insert) } : {}),
						...(params.handlers.update ? { update: replaceHandler(params.handlers.update) } : {}),
						...(params.handlers.delete ? { delete: replaceHandler(params.handlers.delete) } : {}),
					},
				}
			: {}),
		...(params.permissions ? { permissions: params.permissions } : {}),
	};
};

const replaceTableColumnParams = (params: TableColumnParams): TableColumnParamsRaw => {
	return {
		name: params.name,
		type: params.type,
		...(params.label !== undefined ? { label: params.label } : {}),
		...(params.primaryKey !== undefined ? { primaryKey: params.primaryKey } : {}),
		...(params.visible !== undefined ? { visible: params.visible } : {}),
		...(params.sortable !== undefined ? { sortable: params.sortable } : {}),
		...(params.filterable !== undefined ? { filterable: params.filterable } : {}),
		...(params.retrieve ? { retrieve: params.retrieve } : {}),
		...(params.insert ? { insert: params.insert } : {}),
		...(params.update ? { update: params.update } : {}),
		...(params.lookup
			? {
					lookup: {
						...(params.lookup.enabled !== undefined ? { enabled: params.lookup.enabled } : {}),
						...(params.lookup.handler ? { handler: replaceHandler(params.lookup.handler) } : {}),
					},
				}
			: {}),
	};
};

const replaceHandler = <Input, Output>(handler: Handler<Input, Output>): HandlerRaw => {
	switch (handler.type) {
		case "query":
			return {
				type: "query",
				sql: handler.sql,
			};

		case "queryFactory":
			return {
				type: "queryFactory",
				resolve: stringifyHandler(handler.resolve),
			};

		case "dataFactory":
			return {
				type: "dataFactory",
				resolve: stringifyHandler(handler.resolve),
			};
	}
};

const stringifyHandler = (resolve: unknown): string => {
	if (typeof resolve !== "function") {
		throw new Error("Handler resolve value must be a function");
	}

	return resolve.toString();
};
