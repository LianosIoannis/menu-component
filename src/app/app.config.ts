import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr, ToastNoAnimation } from "ngx-toastr";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideToastr({ positionClass: "toast-bottom-right", toastComponent: ToastNoAnimation, timeOut: 1500 }),
		provideAnimations(),
	],
};
