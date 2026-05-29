import { Injectable } from "@angular/core";
import { NativeDateAdapter, type MatDateFormats } from "@angular/material/core";

export const DMY_DATE_FORMATS: MatDateFormats = {
	parse: {
		dateInput: "DD/MM/YYYY",
		timeInput: "HH:mm",
	},
	display: {
		dateInput: "DD/MM/YYYY",
		monthYearLabel: { month: "short", year: "numeric" },
		dateA11yLabel: { day: "numeric", month: "long", year: "numeric" },
		monthYearA11yLabel: { month: "long", year: "numeric" },
		timeInput: "HH:mm",
		timeOptionLabel: "HH:mm",
	},
};

@Injectable()
export class DmyDateAdapter extends NativeDateAdapter {
	override parse(value: unknown): Date | null {
		if (value instanceof Date) {
			return value;
		}

		if (typeof value !== "string") {
			return super.parse(value);
		}

		const trimmedValue = value.trim();

		if (!trimmedValue) {
			return null;
		}

		const isoDate = this.parseIsoDate(trimmedValue);

		if (isoDate) {
			return isoDate;
		}

		const dateParts = trimmedValue.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2}|\d{4}))?$/);

		if (!dateParts) {
			return super.parse(value);
		}

		const day = Number(dateParts[1]);
		const month = Number(dateParts[2]);
		const year = this.normalizeYear(dateParts[3]);

		return this.createValidDate(year, month, day);
	}

	override format(date: Date, displayFormat: unknown): string {
		if (displayFormat === "DD/MM/YYYY") {
			return `${this.pad(date.getDate())}/${this.pad(date.getMonth() + 1)}/${date.getFullYear()}`;
		}

		return super.format(date, displayFormat as object);
	}

	private parseIsoDate(value: string): Date | null {
		const dateParts = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

		if (!dateParts) {
			return null;
		}

		return this.createValidDate(Number(dateParts[1]), Number(dateParts[2]), Number(dateParts[3]));
	}

	private createValidDate(year: number, month: number, day: number): Date | null {
		if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
			return null;
		}

		const date = new Date(year, month - 1, day);

		return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
	}

	private normalizeYear(value: string | undefined): number {
		if (!value) {
			return new Date().getFullYear();
		}

		const year = Number(value);

		if (value.length === 2) {
			return year < 50 ? 2000 + year : 1900 + year;
		}

		return year;
	}

	private pad(value: number): string {
		return value.toString().padStart(2, "0");
	}
}
