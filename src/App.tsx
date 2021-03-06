import "./App.css";
import "./styles/scroll.scss";
import "./styles/index.scss";

import {
	unstable_HistoryRouter as HistoryRouter,
	useNavigate,
} from "react-router-dom";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {useEffect, useRef} from "react";

import Auth from "./features/auth";
import Dev from "./features/dev/Dev";
import Doc from "./features/doc";
import Group from "./features/group";
import HomePage from "./features/home/pages/HomePage";
import InvitePage from "./features/auth/pages/InvitePage";
import MainLayout from "./components/layouts/MainLayout";
import NeedGroupContainer from "./components/common/NeedGroupContainer";
import NeedLogin from "./components/common/NeedLogin";
import Note from "./features/note";
import {authActions} from "./features/auth/authSlice";
import {groupActions} from "./features/group/groupSlice";
import history from "./app/history";
import {useAppDispatch} from "./app/hooks";

// import "./styles/gridLibrary.scss";

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(authActions.firstAccess());
		dispatch(groupActions.getGroup());
	}, []);

	return (
		<HistoryRouter history={history}>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route
						path="note/*"
						element={
							// <NeedGroupContainer>
							<HomePage />
							// </NeedGroupContainer>
						}
					/>
					<Route
						path="doc/*"
						element={
							<NeedGroupContainer>
								<Doc />
							</NeedGroupContainer>
						}
					/>
					<Route
						path="group/*"
						element={
							<NeedGroupContainer>
								<Group />
							</NeedGroupContainer>
						}
					/>
					<Route
						path="invite"
						element={
							<NeedLogin>
								<InvitePage />
							</NeedLogin>
						}
					/>
					<Route path="home" element={<HomePage />} />
					<Route path="auth/*" element={<Auth />} />
					<Route path="dev" element={<Dev />} />
					<Route path="/" element={<HomePage />} />
				</Route>
				<Route path="*" element={<div>Not found</div>} />
			</Routes>
		</HistoryRouter>
	);
}

export default App;
