// Transportation API types – Rate Cards

import type { GridFilter } from './grid';

export interface ReadRateCardsRequest {
	action: 'read';
	resource: 'rate-cards';
	fields: string[]; // typically ['*']
	filter: GridFilter; // e.g., { and: [{ field: 'carrier', oper: '=', value: 'FEDEX' }, ...] }
	page_num: number;
	page_size: number;
	sort?: Array<Record<string, 'asc' | 'desc'>>;
}

export interface ExportRateCardsRequest extends Omit<ReadRateCardsRequest, 'action'> {
	action: 'export';
	format: 'excel_rate_cards';
}

// A single rate card row as used by the legacy RateCards report UI
export interface RateCardRowDto {
	carrier: string; // e.g., 'FEDEX', 'DHL', 'USPS', 'SELECTSHIP', 'APC', 'APC_DCL'
	service: string; // e.g., 'GROUND', '2DAY'
	region?: string | null; // sometimes used for SELECTSHIP; otherwise region from user
	zone?: string | number | null; // numeric for many carriers, string for others
	weight_limit?: number; // lbs breakpoint used for the row axis
	book_rate: number; // dollar amount per weight/zone
	// Surcharge fields observed in legacy component
	sc_g?: number; // Ground Residential surcharge
	sc_a?: number; // Air Residential surcharge
	sc_sr?: number; // Signature Required surcharge
	sc_asr?: number; // Adult Signature Required surcharge
}

export interface ReadRateCardsResponse {
	resource: 'rate-cards';
	total: number;
	rows: RateCardRowDto[];
}


