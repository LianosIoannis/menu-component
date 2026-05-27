import type { TabContentDrawerColumn } from "../tab-content-drawer/tab-content-drawer.model";

type TabContentDrawerTestScenario = {
	title: string;
	columns: TabContentDrawerColumn[];
};

export const tabContentDrawerTestData: Record<"criteria" | "insert" | "update", TabContentDrawerTestScenario> = {
	criteria: {
		title: "Filter products",
		columns: [
			{
				name: "productName",
				label: "Product name",
				type: "string",
				allowedOperators: ["contains", "startsWith", "equals"],
				required: true,
				defaultValue: "coffee",
			},
			{
				name: "category",
				label: "Category",
				type: "string",
				allowedOperators: ["in"],
				multiple: true,
				availableValues: [
					{ value: "beverages", text: "Beverages" },
					{ value: "bakery", text: "Bakery" },
					{ value: "produce", text: "Produce" },
					{ value: "pantry", text: "Pantry" },
				],
				defaultValue: ["beverages", "bakery"],
			},
			{
				name: "status",
				label: "Status",
				type: "string",
				allowedOperators: ["equals", "notEquals"],
				availableValues: [
					{ value: "active", text: "Active" },
					{ value: "inactive", text: "Inactive" },
					{ value: "draft", text: "Draft" },
				],
				defaultValue: "active",
			},
			{
				name: "minPrice",
				label: "Minimum price",
				type: "number",
				allowedOperators: ["greaterThanOrEqual", "lessThanOrEqual", "equals"],
				defaultValue: 10,
			},
			{
				name: "createdAfter",
				label: "Created after",
				type: "date",
				allowedOperators: ["greaterThanOrEqual"],
				defaultValue: "2026-01-01",
			},
			{
				name: "hasStock",
				label: "Has stock",
				type: "boolean",
				defaultValue: true,
			},
		],
	},
	insert: {
		title: "Add product",
		columns: [
			{
				name: "productName",
				label: "Product name",
				type: "string",
				required: true,
			},
			{
				name: "category",
				label: "Category",
				type: "string",
				required: true,
				availableValues: [
					{ value: "beverages", text: "Beverages" },
					{ value: "bakery", text: "Bakery" },
					{ value: "produce", text: "Produce" },
					{ value: "pantry", text: "Pantry" },
				],
			},
			{
				name: "price",
				label: "Price",
				type: "number",
				required: true,
			},
			{
				name: "availableFrom",
				label: "Available from",
				type: "datetime",
				defaultValue: "2026-05-27T09:00",
			},
			{
				name: "hasStock",
				label: "Has stock",
				type: "boolean",
				defaultValue: false,
			},
		],
	},
	update: {
		title: "Update product",
		columns: [
			{
				name: "id",
				label: "ID",
				type: "number",
				readonly: true,
				defaultValue: 101,
			},
			{
				name: "productName",
				label: "Product name",
				type: "string",
				required: true,
				defaultValue: "Espresso beans",
			},
			{
				name: "status",
				label: "Status",
				type: "string",
				availableValues: [
					{ value: "active", text: "Active" },
					{ value: "inactive", text: "Inactive" },
					{ value: "draft", text: "Draft" },
				],
				defaultValue: "active",
			},
			{
				name: "tags",
				label: "Tags",
				type: "string",
				multiple: true,
				availableValues: [
					{ value: "featured", text: "Featured" },
					{ value: "seasonal", text: "Seasonal" },
					{ value: "discounted", text: "Discounted" },
				],
				defaultValue: ["featured"],
			},
		],
	},
};
