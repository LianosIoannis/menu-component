import type { MenuDataModelRaw } from "../menu/menuItemRaw.model";

export const menuData: MenuDataModelRaw = {
	mainHeaderText: "Administration",
	subHeaderText: "Dynamic CRUD Demo",
	menuItems: [
		{
			id: "users",
			text: "Users",
			icon: "users",
			iconColor: "text-indigo-400",
			isFolder: false,
			items: [],
			params: {
				screenType: "table",
				table: {
					name: "users",
					columns: [
						{
							name: "id",
							label: "ID",
							type: "number",
							primaryKey: true,
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
							},
						},
						{
							name: "username",
							label: "Username",
							type: "string",
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
								criteria: {
									enabled: true,
									allowedFilters: ["contains", "equals", "startsWith"],
								},
							},
							insert: {
								enabled: true,
								required: true,
							},
							update: {
								enabled: true,
								required: true,
							},
						},
						{
							name: "email",
							label: "Email",
							type: "string",
							visible: true,
							sortable: true,
							filterable: true,
							insert: {
								enabled: true,
								required: true,
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "roleId",
							label: "Role",
							type: "number",
							visible: true,
							sortable: true,
							filterable: true,
							lookup: {
								enabled: true,
								handler: {
									type: "query",
									sql: "select id as value, name as label from roles order by name",
								},
							},
							insert: {
								enabled: true,
								required: true,
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "isActive",
							label: "Active",
							type: "boolean",
							visible: true,
							sortable: true,
							filterable: true,
							insert: {
								enabled: true,
							},
							update: {
								enabled: true,
							},
						},
					],
					handlers: {
						select: {
							type: "query",
							sql: "select id, username, email, role_id as roleId, is_active as isActive from users",
						},
						insert: {
							type: "queryFactory",
							resolve:
								"(input) => `insert into users (username, email, role_id, is_active) values ('${input.values.username}', '${input.values.email}', ${input.values.roleId}, ${input.values.isActive ? 1 : 0})`",
						},
						update: {
							type: "queryFactory",
							resolve:
								"(input) => `update users set username='${input.values.username}', email='${input.values.email}', role_id=${input.values.roleId}, is_active=${input.values.isActive ? 1 : 0} where id=${input.key.id}`",
						},
						delete: {
							type: "queryFactory",
							resolve: "(input) => `delete from users where id=${input.key.id}`",
						},
					},
					permissions: {
						insert: true,
						update: true,
						delete: true,
					},
				},
			},
		},
	],
};
