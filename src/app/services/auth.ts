import { Injectable, signal } from "@angular/core";

export type LoginPayload = {
	username: string;
	password: string;
};

@Injectable({
	providedIn: "root",
})
export class Auth {
	// private readonly baseUrl = "http://localhost:5000";
	private readonly baseUrl = "http://10.0.0.5:5000";
	private readonly TOKEN_KEY = "login_token";
	private readonly appCode = "futuresoft";

	token = signal<string | null>(sessionStorage.getItem(this.TOKEN_KEY));
	userData = signal<Record<string, string> | null>(null);
	loading = signal(false);

	private setToken(token: string | null) {
		if (token) {
			sessionStorage.setItem(this.TOKEN_KEY, token);
		} else {
			sessionStorage.removeItem(this.TOKEN_KEY);
		}

		this.token.set(token);
	}

	async login(payload: LoginPayload) {
		this.loading.set(true);

		try {
			const res = await fetch(`${this.baseUrl}/login/user/${payload.username}`, {
				method: "POST",
				headers: { "Content-Type": "application/json", appcode: this.appCode, password: payload.password },
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data?.message || "Login failed");
			}

			this.userData.set(data);
			// biome-ignore lint/complexity/useLiteralKeys: <token>
			this.setToken(this.userData()?.["token"] ?? null);

			return data;
		} finally {
			this.loading.set(false);
		}
	}

	logout() {
		this.setToken(null);
		this.userData.set(null);
		this.loading.set(false);
	}

	isLoggedIn() {
		return !!this.token();
	}
}
