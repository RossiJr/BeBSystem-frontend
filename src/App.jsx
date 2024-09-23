import {useState} from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

import {ThemeProvider, createTheme} from "@mui/material";


import colors from "./assets/theme-dark/base/colors.js"


import {useMaterialUIController, setMiniSidenav, setOpenConfigurator} from "./components/context/index.jsx";
import MDBox from "@components/MDBox/index.jsx";
import Icon from "@mui/material/Icon";
import Dashboard from "@components/Dashboard/Dashboard.jsx";
import Sidebar from "@components/Sidebar/Sidebar.jsx";
import Login from './components/Login/Login.jsx'
import {getToken} from "./services/authService.js";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken()); // Check if token exists in localStorage

    const login = () => {
        setIsAuthenticated(true); // Update state when logged in
    };

    const logout = () => {
        setIsAuthenticated(false); // Update state when logged out
        localStorage.removeItem('token'); // Clear the token on logout
    };

    return {isAuthenticated, login, logout};
};

const PrivateRoute = ({children, isAuthenticated}) => {
    return isAuthenticated ? children : <Navigate to="/login"/>;
};


function App() {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        layout, openConfigurator, sidenavColor, transparentSidenav, whiteSidenav,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [darkMode, setDarkMode] = useState(true);


    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    const configsButton = (<MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{cursor: "pointer"}}
        onClick={handleConfiguratorOpen}
    >
        <Icon fontSize="small" color="inherit">
            settings
        </Icon>
    </MDBox>);


    const auth = useAuth(); // custom hook

    return (
        <Router>
            <Routes>
                {/*Public routes - accessible without auth*/}
                <Route path={"/login"} element={<Login/>}/>

                {/*Private routes - accessible only with auth*/}
                <Route path={"/dashboard"} element={<PrivateRoute isAuthenticated={auth.isAuthenticated}>
                    <div className="gridContainer" style={{backgroundColor: colors.background.default}}>
                        <Sidebar/>
                        <div className="main" style={{backgroundColor: colors.background.cardSuperTransparent}}>
                            <Dashboard/>
                        </div>
                    </div>
                </PrivateRoute>}/>

                {/*Default route - redirect to "/login" if it does not match any route*/}
                <Route path={"*"} element={<Navigate to={"/login"}/>}/>

            </Routes>
        </Router>
        // <div>
        //     <Login />
        // </div>


        /*
        <div id={"main"}>
            <ThemeProvider theme={themeDark}>
                <CssBaseline/>
                <Router>
                    <Sidenav
                        color={sidenavColor}
                        brand={`${(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}`}
                        brandName="Material Dashboard 2"
                        routes={routes}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    {<Configurator/>}
                    {{configsButton}}

                    <div id={"main-div"}>
                        <Routes>
                            <Route path="/" element={<>
                                <Dashboard/>
                            </>}/>
                            <Route path="/about" element={<>
                                <h1>About</h1>
                            </>}/>
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        </div>
    */
    )
}

export default App
