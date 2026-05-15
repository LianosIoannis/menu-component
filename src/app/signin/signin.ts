import { Component, inject, signal } from "@angular/core";
import { FormField, FormRoot, form, required } from "@angular/forms/signals";
import { Auth, type LoginPayload } from "../services/auth";

@Component({
	selector: "app-signin",
	standalone: true,
	imports: [FormField, FormRoot],
	templateUrl: "./signin.html",
})
export class Signin {
	private readonly authService = inject(Auth);

	loginModel = signal<LoginPayload>({
		username: "",
		password: "",
	});

	loginForm = form(
		this.loginModel,
		(path) => {
			required(path.username, { message: "Username is required" });
			required(path.password, { message: "Password is required" });
		},
		{
			submission: {
				action: async () => {
					try {
						const credentials = this.loginModel();
						await this.authService.login(credentials);
					} catch (error) {
						alert(JSON.stringify(error));
					}
				},
			},
		},
	);
}
