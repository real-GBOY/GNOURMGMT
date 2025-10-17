/** @format */

import { User } from "./User";

export interface Event {
	_id: string;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	location: string;
	eventType: string;
	agenda?: string;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	guests?: (string | User)[];
}

export interface CreateEventData {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	location: string;
	eventType: string;
	createdBy: string;
	file?: File;
}

export interface UpdateEventData {
	title?: string;
	description?: string;
	startDate?: string;
	endDate?: string;
	location?: string;
	eventType?: string;
	file?: File;
}

export interface EventResponse {
	data: Event[];
}

export interface SingleEventResponse {
	data: Event;
}
