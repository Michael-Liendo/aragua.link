import type { JSX } from "react";
import {
	Navigate,
	Outlet,
	Routes as ReactRoutes,
	Route,
	BrowserRouter as Router,
} from "react-router-dom";
import { useAuth } from "@/features/auth";
import AppLayout from "./components/app-layout";
import { LoadingFullScreen } from "./components/loading";
import { AuthRoutesEnum, PrivateRoutesEnum, PublicRoutesEnum } from "./data/routesEnums";
import Home from "./pages/(app)/home";
import Login from "./pages/(auth)/Login";
import Register from "./pages/(auth)/Register";
import Landing from "./pages/(public)/Landing";

const PrivateRoutesWrapper = () => {
	const { token, authInitialized } = useAuth();

	if (!authInitialized) return <LoadingFullScreen />;

	return token ? (
		<AppLayout>
			<Outlet />
		</AppLayout>
	) : (
		<Navigate to={AuthRoutesEnum.Login} />
	);
};

const AuthRoutesWrapper = () => {
	const { token } = useAuth();
	return !token ? <Outlet /> : <Navigate to={PrivateRoutesEnum.Home} />;
};

export function Routes() {
	return (
		<Router>
			<ReactRoutes>
				<Route element={<PrivateRoutesWrapper />}>
					{PrivateRoutes.map((route) => route)}
				</Route>
				<Route element={<AuthRoutesWrapper />}>
					{AuthRoutes.map((route) => route)}
				</Route>
				{PublicRoutes.map((route) => route)}
				<Route
					path="*"
					element={<Navigate to={PublicRoutesEnum.Landing} replace />}
				/>
			</ReactRoutes>
		</Router>
	);
}

const PrivateRoutes: JSX.Element[] = [
	<Route key={PrivateRoutesEnum.Home} path={PrivateRoutesEnum.Home} Component={Home} />,
];

const AuthRoutes: JSX.Element[] = [
	<Route
		path={AuthRoutesEnum.Login}
		key={AuthRoutesEnum.Login}
		Component={Login}
	/>,
	<Route
		key={AuthRoutesEnum.Register}
		path={AuthRoutesEnum.Register}
		Component={Register}
	/>,
];

const PublicRoutes: JSX.Element[] = [
	<Route key={PublicRoutesEnum.Landing} path={PublicRoutesEnum.Landing} Component={Landing} />,
];
