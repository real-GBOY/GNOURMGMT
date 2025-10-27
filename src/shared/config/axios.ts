/** @format */

import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
	baseURL: "https://gnour-back.vercel.app/",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: any) => void;
	reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});

	failedQueue = [];
};

apiClient.interceptors.request.use(
	(config) => {
		const token = Cookies.get("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Don't set Content-Type for FormData - let the browser set it automatically
		if (config.data instanceof FormData) {
			delete config.headers["Content-Type"];
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = Cookies.get("refreshToken");
				if (!refreshToken) {
					throw new Error("No refresh token available");
				}

				const response = await axios.post(
					"http://localhost:4005/api/auth/refresh",
					{
						refreshToken,
					}
				);

				if (response.data.success && response.data.data) {
					const { accessToken, refreshToken: newRefreshToken } =
						response.data.data;

					// Update cookies
					Cookies.set("token", accessToken, { expires: 7 });
					Cookies.set("refreshToken", newRefreshToken, { expires: 30 });

					// Update the failed request with new token
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;

					// Process queued requests
					processQueue(null, accessToken);

					// Retry the original request
					return apiClient(originalRequest);
				} else {
					throw new Error("Token refresh failed");
				}
			} catch (refreshError) {
				// Clear all auth data on refresh failure
				Cookies.remove("token");
				Cookies.remove("user");
				Cookies.remove("refreshToken");

				// Process queued requests with error
				processQueue(refreshError, null);

				// Redirect to login (this will be handled by the component)
				window.location.href = "/login";

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
