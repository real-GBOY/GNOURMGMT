/** @format */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./shared/components/Layout";
import Home from "./screens/home/Home";
import Login from "./screens/auth/Login";
import Contact from "./screens/contact/Contact";
import Developers from "./screens/home/Developers";
import NotFound from "./screens/shared/NotFound";
import Dashboard from "./screens/dashboard/Dashboard";
import DashboardWrapper from "./screens/dashboard/DashboardWrapper";

import Teams from "./screens/dashboard/teams/Teams";
import TeamDetail from "./screens/dashboard/teams/TeamDetail";
import Events from "./screens/dashboard/events/Events";
import EventDetail from "./screens/dashboard/events/EventDetail";
import EventAttendance from "./screens/dashboard/events/EventAttendance";
import Tasks from "./screens/dashboard/tasks/Tasks";
import TaskDetail from "./screens/dashboard/tasks/TaskDetail";
import UserVerification from "./screens/dashboard/users/UserVerification";
import UserDetails from "./screens/dashboard/users/UserDetails";
import Profile from "./screens/dashboard/Profile";
import Members from "./screens/dashboard/Members";
import Feedbacks from "./screens/dashboard/Feedbacks";
import Achievements from "./screens/dashboard/Achievements";
import AchievementDetail from "./screens/dashboard/achievements/AchievementDetail";
import DashBoard_Applicants from "./screens/dashboard/DashBoard_Applicants";
import ApplicantsAnalytics from "./screens/dashboard/ApplicantsAnalytics";
import RoleBasedRoute from "./shared/Secure/RoleBasedRoute";
import Permissions from "./shared/config/Permissions";
import { AuthProvider } from "./shared/contexts/AuthContext";
import { ThemeProvider } from "./shared/contexts/ThemeContext";
import Signup from "./screens/auth/Signup";

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/login' element={<Login />} />
							{/* <Route path='/signup' element={<Signup />} /> */}
							{/* <Route path='/contact' element={<Contact />} /> */}
							<Route path='/developers' element={<Developers />} />

							{/* Dashboard Routes with Role-Based Protection */}
							{/* <Route
								path='/dashboard'
								element={
									<DashboardWrapper>
										<Dashboard />
									</DashboardWrapper>
								}
							/> */}

							{/* Members Route */}
							{/* <Route
								path='/dashboard/members'
								element={
									<DashboardWrapper>
										<RoleBasedRoute
											requiredPermission={[
												Permissions.ViewPerson,
												Permissions.ViewTeamMembers,
											]}>
											<Members />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Teams Routes */}
							{/* <Route
								path='/dashboard/teams'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewTeam}>
											<Teams />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}
							{/* <Route
								path='/dashboard/teams/:id'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewTeam}>
											<TeamDetail />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Events Routes */}
							{/* <Route
								path='/dashboard/events'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewEvent}>
											<Events />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}
							{/* <Route
								path='/dashboard/events/:id'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewEvent}>
											<EventDetail />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}
							{/* <Route
								path='/dashboard/events/:id/attendance'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewEvent}>
											<EventAttendance />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Tasks Routes */}
							{/* <Route
								path='/dashboard/tasks'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewTask}>
											<Tasks />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}
							{/* <Route
								path='/dashboard/tasks/:id'
								element={
									<DashboardWrapper>
										<RoleBasedRoute requiredPermission={Permissions.ViewTask}>
											<TaskDetail />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Users Route */}
							{/* <Route
								path='/dashboard/users'
								element={
									<DashboardWrapper>
										<RoleBasedRoute
											requiredPermission={[
												Permissions.ViewPerson,
												Permissions.ViewTeamMembers,
											]}>
											<Members />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* User Verification Route */}
							{/* <Route
								path='/dashboard/users/verification'
								element={
									<DashboardWrapper>
										<UserVerification />
									</DashboardWrapper>
								}
							/> */}

							{/* Profile Route - Always accessible */}
							{/* <Route
								path='/dashboard/profile'
								element={
									<DashboardWrapper>
										<Profile />
									</DashboardWrapper>
								}
							/> */}

							{/* User Details Route */}
							{/* <Route
								path='/dashboard/users/:userId'
								element={
									<DashboardWrapper>
										<RoleBasedRoute
											requiredPermission={[
												Permissions.ViewPerson,
												Permissions.ViewTeamMembers,
											]}>
											<UserDetails />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Feedbacks Route */}
							{/* <Route
								path='/dashboard/feedbacks'
								element={
									<DashboardWrapper>
										<RoleBasedRoute
											requiredPermission={Permissions.ViewFeedback}>
											<Feedbacks />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Achievements Routes */}
							{/* <Route
								path='/dashboard/achievements'
								element={
									<DashboardWrapper>
										<RoleBasedRoute
											requiredPermission={Permissions.ViewAchievement}>
											<Achievements />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}
							{/* <Route
								path='/dashboard/achievements/:id'
								element={
									<DashboardWrapper>
										<RoleBasedRoute
											requiredPermission={Permissions.ViewAchievement}>
											<AchievementDetail />
										</RoleBasedRoute>
									</DashboardWrapper>
								}
							/> */}

							{/* Applicants Route - Accessible to all authenticated users */}
							<Route
								path='/dashboard/applicants'
								element={<DashBoard_Applicants />}
							/>
							<Route
								path='/dashboard/applicants/analytics'
								element={<ApplicantsAnalytics />}
							/>

							<Route path='*' element={<NotFound />} />
						</Routes>
					</Layout>
					<Toaster
						toastOptions={{
							style: {
								zIndex: 9998,
							},
						}}
					/>
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
