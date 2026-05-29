import { Injectable, inject, signal } from "@angular/core";
import { Auth } from "./auth";

export type QueryResult = {
	success: boolean;
	data?: unknown;
	error?: string;
};

@Injectable({
	providedIn: "root",
})
export class Data {
	// private readonly baseUrl = "http://localhost:5000/fs_timer_mob";
	private readonly baseUrl = "http://10.0.0.5:5000/fs_timer_mob";
	auth = inject(Auth);
	loading = signal(false);

	async execQuery(query: string, useLoading = false): Promise<QueryResult> {
		if (useLoading) {
			this.loading.set(true);
		}

		try {
			const res = await fetch(this.baseUrl, {
				method: "POST",
				headers: { "Content-Type": "application/text", login_token: this.auth.token() ?? "" },
				body: query,
			});

			const responseText = await res.text();
			const data = this.parseResponse(responseText);

			if (res.status === 532) {
				alert("Session expired. Please log in again.");
				this.auth.logout();
				throw new Error("Session expired. Please log in again.");
			}

			if (!res.ok) {
				return { success: false, error: this.responseMessage(data) ?? (responseText || "Query execution failed") };
			}

			if (data === null) {
				return { success: true, data: true };
			}

			const data0 = this.responseData(data);

			return { success: true, data: data0 };
		} finally {
			if (useLoading) {
				this.loading.set(false);
			}
		}
	}

	private parseResponse(responseText: string): unknown | null {
		if (!responseText.trim()) {
			return null;
		}

		try {
			return JSON.parse(responseText) as unknown;
		} catch {
			return null;
		}
	}

	private responseMessage(data: unknown): string | undefined {
		if (!this.isRecord(data)) {
			return undefined;
		}

		return typeof data["message"] === "string" ? data["message"] : undefined;
	}

	private responseData(data: unknown): unknown {
		if (!this.isRecord(data) || !this.isRecord(data["data"])) {
			return true;
		}

		return data["data"]["data0"] ?? true;
	}

	private isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === "object" && value !== null && !Array.isArray(value);
	}
}
