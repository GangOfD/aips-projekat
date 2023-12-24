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

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
            <Routes>
              <Route path="/" element={<LoginPage/>} />
              <Route path="/home" element={<HomePage/>}/>
              <Route path="/game" element={<GamePage/>}/>
              <Route path="/*" element={<ErrorPage/>}/>
              <Route path="/profile/:userId" element={<ProfilPage/>}/>
            </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
