import { Injectable, inject } from "@angular/core";
import { Data } from "../services/data";

export type TableRow = object;

@Injectable({ providedIn: "root" })
export class TableDataService {
	private readonly data = inject(Data);

	async retrieveRows(query: string): Promise<TableRow[]> {
		const result = await this.data.execQuery(query);

		if (!result.success) {
			throw new Error(result.error ?? "Query execution failed.");
		}

		return this.toRows(result.data);
	}

	private toRows(data: unknown): TableRow[] {
		if (!Array.isArray(data)) {
			return [];
		}

		return data.filter((row): row is TableRow => typeof row === "object" && row !== null);
	}
}
