/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: <test> */
import type { MenuDataModelRaw } from "../menu/menuItemRaw.model";

export const menuData: MenuDataModelRaw = {
	mainHeaderText: "Administration",
	subHeaderText: "Dynamic CRUD Demo",
	menuItems: [
		{
			id: "timer-fpr2",
			text: "Timer FPR2",
			icon: "clock",
			iconColor: "text-teal-400",
			isFolder: false,
			items: [],
			params: {
				screenType: "table",
				table: {
					name: "timer_fpr2",
					columns: [
						{
							name: "codef",
							label: "Code",
							type: "string",
							primaryKey: true,
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
								criteria: {
									enabled: true,
									allowedFilters: ["equals", "greaterThan", "lessThan"],
								},
							},
						},
						{
							name: "epon",
							label: "Surname",
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
							name: "onom",
							label: "Name",
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
							name: "pat",
							label: "Father",
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
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "active_from",
							label: "Active From",
							type: "datetime",
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
								criteria: {
									enabled: true,
									allowedFilters: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
								},
							},
							insert: {
								enabled: true,
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "active_to",
							label: "Active To",
							type: "datetime",
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
								criteria: {
									enabled: true,
									allowedFilters: ["greaterThanOrEqual", "lessThanOrEqual", "between"],
								},
							},
							insert: {
								enabled: true,
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "sex",
							label: "Sex",
							type: "number",
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
								criteria: {
									enabled: true,
									allowedFilters: ["equals"],
								},
							},
							insert: {
								enabled: true,
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "birthday",
							label: "Birthday",
							type: "date",
							visible: true,
							sortable: true,
							filterable: true,
							retrieve: {
								enabled: true,
								criteria: {
									enabled: true,
									allowedFilters: ["equals", "greaterThanOrEqual", "lessThanOrEqual"],
								},
							},
							insert: {
								enabled: true,
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "address",
							label: "Address",
							type: "string",
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
						{
							name: "tel",
							label: "Phone",
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
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "email",
							label: "Email",
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
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "mht",
							label: "Mother",
							type: "string",
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
						{
							name: "tel2",
							label: "Phone 2",
							type: "string",
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
						{
							name: "adt",
							label: "ID Card",
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
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "afm",
							label: "AFM",
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
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "amka",
							label: "AMKA",
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
							},
							update: {
								enabled: true,
							},
						},
						{
							name: "ama",
							label: "AMA",
							type: "string",
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
						{
							name: "internal_tel",
							label: "Internal Phone",
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
							},
							update: {
								enabled: true,
							},
						},
					],
					handlers: {
						select: {
							type: "query",
							sql: "select codef, epon, onom, pat, active_from, active_to, sex, birthday, address, tel, email, mht, tel2, adt, afm, amka, ama, internal_tel from timer_fpr2",
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
