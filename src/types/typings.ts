export interface CfResult {
	id: string;
	filename: string;
	uploaded: Date;
	variants: string[];
}

export interface CfResponse {
	result: CfResult;
	success: boolean;
	errors: string[];
	messages: string[];
}

export interface imageFile {
	file: File;
	loading: boolean;
	uploaded: boolean;
	error?: string;
	url?: string;
}
