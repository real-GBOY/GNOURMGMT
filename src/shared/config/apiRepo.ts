/** @format */

import apiClient from "./axios";

const apiRepo = {
	GET: async (url: string) => {
		const response = await apiClient.get(url);
		return response.data;
	},
	POST: async (url: string, data: any, config?: any) => {
		const response = await apiClient.post(url, data, config);
		return response.data;
	},
	PUT: async (url: string, data: any) => {
		const response = await apiClient.put(url, data);
		return response.data;
	},
	PATCH: async (url: string, data: any, config?: any) => {
		const response = await apiClient.patch(url, data, config);
		return response.data;
	},
	DELETE: async (url: string, data?: any) => {
		const response = await apiClient.delete(url, { data });
		return response.data;
	},
};

export default apiRepo;
