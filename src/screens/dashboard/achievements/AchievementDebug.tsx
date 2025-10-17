/** @format */

import React, { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { useAchievements, useAchievementStats } from "../../../shared/services/achievementService";
import { useAuth } from "../../../shared/contexts/AuthContext";
import usePermission from "../../../shared/hooks/usePermission";
import Permissions from "../../../shared/config/Permissions";

const AchievementDebug: React.FC = () => {
	const [testResults, setTestResults] = useState<string[]>([]);
	const { user, isAuthenticated, token } = useAuth();
	const { hasPermission } = usePermission();
	
	// Test API calls
	const { data: achievements, isLoading: achievementsLoading, error: achievementsError } = useAchievements();
	const { data: stats, isLoading: statsLoading, error: statsError } = useAchievementStats();

	const addLog = (message: string) => {
		setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
	};

	const testAPI = async () => {
		setTestResults([]);
		addLog("Starting API tests...");
		
		// Test authentication
		addLog(`Authentication Status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
		addLog(`Token exists: ${!!token}`);
		addLog(`User: ${user?.firstName} ${user?.lastName}`);
		addLog(`User role: ${user?.role?.key}`);
		addLog(`User permissions: ${user?.role?.permissions?.map(p => p.key).join(', ') || 'None'}`);
		
		// Test permissions
		const canView = hasPermission(Permissions.ViewAchievement);
		const canCreate = hasPermission(Permissions.CreateAchievement);
		const canEdit = hasPermission(Permissions.EditAchievement);
		const canDelete = hasPermission(Permissions.DeleteAchievement);
		
		addLog(`View permission: ${canView}`);
		addLog(`Create permission: ${canCreate}`);
		addLog(`Edit permission: ${canEdit}`);
		addLog(`Delete permission: ${canDelete}`);
		
		// Test achievements data
		addLog(`Achievements loading: ${achievementsLoading}`);
		addLog(`Achievements count: ${achievements?.length || 0}`);
		if (achievementsError) {
			addLog(`Achievements error: ${achievementsError instanceof Error ? achievementsError.message : 'Unknown error'}`);
		}
		
		// Test stats data
		addLog(`Stats loading: ${statsLoading}`);
		addLog(`Stats data: ${stats ? 'Available' : 'Not available'}`);
		if (statsError) {
			addLog(`Stats error: ${statsError instanceof Error ? statsError.message : 'Unknown error'}`);
		}
		
		// Test raw data
		if (achievements && achievements.length > 0) {
			addLog(`First achievement: ${achievements[0].title}`);
		}
		
		if (stats) {
			addLog(`Total achievements: ${stats.totalAchievements || 0}`);
		}
		
		addLog("API tests completed.");
	};

	const clearLogs = () => {
		setTestResults([]);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Achievement API Debug</h1>
			
			<div className="flex gap-4 mb-6">
				<Button onClick={testAPI} className="bg-blue-600 hover:bg-blue-700">
					Run API Tests
				</Button>
				<Button onClick={clearLogs} variant="outline">
					Clear Logs
				</Button>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div className="border rounded-lg p-4">
					<h3 className="font-semibold mb-2">Current State</h3>
					<div className="space-y-2 text-sm">
						<div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
						<div>Token: {token ? 'Present' : 'Missing'}</div>
						<div>User: {user?.firstName} {user?.lastName}</div>
						<div>Role: {user?.role?.key}</div>
						<div>Permissions: {user?.role?.permissions?.length || 0}</div>
					</div>
				</div>
				
				<div className="border rounded-lg p-4">
					<h3 className="font-semibold mb-2">API Status</h3>
					<div className="space-y-2 text-sm">
						<div>Achievements: {achievementsLoading ? 'Loading' : achievementsError ? 'Error' : `${achievements?.length || 0} items`}</div>
						<div>Stats: {statsLoading ? 'Loading' : statsError ? 'Error' : 'Available'}</div>
					</div>
				</div>
			</div>
			
			<div className="border rounded-lg p-4">
				<h3 className="font-semibold mb-2">Test Results</h3>
				<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
					{testResults.length === 0 ? (
						<p className="text-gray-500">No test results yet. Click "Run API Tests" to start.</p>
					) : (
						testResults.map((log, index) => (
							<div key={index} className="text-sm font-mono mb-1">
								{log}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default AchievementDebug;
