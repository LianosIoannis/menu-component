import type {
	DeleteInput,
	Handler,
	InsertInput,
	MaybePromise,
	MenuDataModel,
	MenuItemModel,
	MenuItemParams,
	MutationOutput,
	SelectInput,
	SelectOutput,
	TableColumnParams,
	TableScreenParams,
	UpdateInput,
} from "../models/menu-item-models/index";
import type {
	HandlerRaw,
	MenuDataModelRaw,
	MenuItemModelRaw,
	MenuItemParamsRaw,
	TableColumnParamsRaw,
	TableScreenParamsRaw,
} from "../models/menu-item-raw-models/index";

export const transformMenuDataModel = (raw: MenuDataModelRaw): MenuDataModel => {
	return {
		mainHeaderText: raw.mainHeaderText,
		subHeaderText: raw.subHeaderText,
		menuItems: raw.menuItems.map(transformMenuItemModel),
	};
};

export const transformMenuItemModel = (raw: MenuItemModelRaw): MenuItemModel => {
	return {
		id: raw.id,
		text: raw.text,
		icon: raw.icon,
		iconColor: raw.iconColor,
		isFolder: raw.isFolder,
		items: raw.items.map(transformMenuItemModel),
		...(raw.params ? { params: transformMenuItemParams(raw.params) } : {}),
	};
};

const transformMenuItemParams = (raw: MenuItemParamsRaw): MenuItemParams => {
	return {
		screenType: raw.screenType,
		...(raw.tableParams ? { tableParams: transformTableScreenParams(raw.tableParams) } : {}),
	};
};

const transformTableScreenParams = (raw: TableScreenParamsRaw): TableScreenParams => {
	return {
		name: raw.name,

		columns: raw.columns.map(transformTableColumnParams),

		...(raw.handlers
			? {
					handlers: {
						...(raw.handlers.select
							? { select: transformHandler<SelectInput, SelectOutput>(raw.handlers.select) }
							: {}),
						...(raw.handlers.insert
							? { insert: transformHandler<InsertInput, MutationOutput>(raw.handlers.insert) }
							: {}),
						...(raw.handlers.update
							? { update: transformHandler<UpdateInput, MutationOutput>(raw.handlers.update) }
							: {}),
						...(raw.handlers.delete
							? { delete: transformHandler<DeleteInput, MutationOutput>(raw.handlers.delete) }
							: {}),
					},
				}
			: {}),

		...(raw.permissions ? { permissions: raw.permissions } : {}),
	};
};

const transformTableColumnParams = (raw: TableColumnParamsRaw): TableColumnParams => {
	return {
		name: raw.name,
		type: raw.type,

		...(raw.label !== undefined ? { label: raw.label } : {}),

		...(raw.primaryKey !== undefined ? { primaryKey: raw.primaryKey } : {}),

		...(raw.visible !== undefined ? { visible: raw.visible } : {}),
		...(raw.sortable !== undefined ? { sortable: raw.sortable } : {}),
		...(raw.filterable !== undefined ? { filterable: raw.filterable } : {}),

		...(raw.retrieve ? { retrieve: raw.retrieve } : {}),
		...(raw.insert ? { insert: raw.insert } : {}),
		...(raw.update ? { update: raw.update } : {}),

		...(raw.lookup
			? {
					lookup: {
						...(raw.lookup.enabled !== undefined ? { enabled: raw.lookup.enabled } : {}),
						...(raw.lookup.handler ? { handler: transformHandler<SelectInput, SelectOutput>(raw.lookup.handler) } : {}),
					},
				}
			: {}),
	};
};

const transformHandler = <Input, Output>(raw: HandlerRaw): Handler<Input, Output> => {
	switch (raw.type) {
		case "query":
			return {
				type: "query",
				sql: raw.sql,
			};

		case "queryFactory":
			return {
				type: "queryFactory",
				resolve: compileRawHandler<(input: Input) => MaybePromise<string>>(raw.resolve),
			};

		case "dataFactory":
			return {
				type: "dataFactory",
				resolve: compileRawHandler<(input: Input) => MaybePromise<Output>>(raw.resolve),
			};

		default:
			throw new Error(`Unsupported handler type`);
	}
};

const compileRawHandler = <T extends (...args: never[]) => unknown>(source: string): T => {
	try {
		const compiled = new Function(`return (${source})`)();

		if (typeof compiled !== "function") {
			throw new Error("Raw handler source must evaluate to a function");
		}

		return compiled as T;
	} catch (error) {
		throw new Error("Failed to compile raw handler source", { cause: error });
	}
};
