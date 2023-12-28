import { BrowserRouter,Navigate, Routes, Route } from "react-router-dom";
import HomePage from "pages/homePage";
import LoginPage from "pages/loginPage";
import ProfilPage from "pages/profilPage";
import ErrorPage from "pages/errorPage";
import GamePage from "pages/gamePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "theme";


function App() {

  const mode=useSelector((state)=>state.mode);
  const theme= useMemo(()=>createTheme(themeSettings(mode)),[mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
            <Routes>
              <Route path="/" element={<LoginPage/>} />
              <Route path="/home" element={isAuth ? <HomePage /> :  <Navigate to="/"/> }/>
              <Route path="/game/:gameId" element={isAuth ? <GamePage /> : <Navigate to="/" />}/>
              <Route path="/*" element={<ErrorPage/>}/>
              <Route path="/profile/:username" element={isAuth ? <ProfilPage /> : <Navigate to="/" />}/>
            </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
