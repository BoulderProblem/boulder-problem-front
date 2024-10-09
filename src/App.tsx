import "./App.css";
import {
  ThemeProvider,
  createMuiTheme,
  createTheme,
} from "@mui/material/styles";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { getFromLS } from "./utils/storage";
import { useState } from "react";
import Header from "./components/Header";

function App() {
  const [isBlack, setIsBlack] = useState(
    JSON.parse(getFromLS("theme") ? getFromLS("theme") : false)
  );
  const darkTheme = createTheme({
    palette: {
      mode: isBlack ? "dark" : "light",
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& label.Mui-focused": {
              color: "var(--primary-400)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--primary-300)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--primary-400)",
            },
            "&.Mui-focused:after": {
              borderBottom: "2px solid var(--primary-400)",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={"layout " + (isBlack ? "dark" : "")}>
        <Header stateChanger={setIsBlack} />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
