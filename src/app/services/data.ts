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
	private readonly baseUrl = "http://localhost:5000/fs_timer_mob";
	auth = inject(Auth);
	loading  = signal(false);

	async execQuery(query: string, useLoading = false): Promise<QueryResult> {
		if (useLoading) {
			this.loading.set(true);
		}

		const res = await fetch(this.baseUrl, {
			method: "POST",
			headers: { "Content-Type": "application/text", "login_token": this.auth.token() ?? "" },
			body: query,
		});

		const data = await res.json();
    
		if (res.status === 532) {
      alert("Session expired. Please log in again.");
			this.auth.logout();
			throw new Error("Session expired. Please log in again.");
		}

		if (!res.ok) {
			return { success: false, error: data?.message || "Query execution failed" };
		}

		const data0 = data?.data?.data0;

		if (useLoading) {
			this.loading.set(false);
		}

		return { success: true, data: data0 };
	}
}
