import "./App.css";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { getFromLS } from "./utils/storage";
import { useState } from "react";
import Header from "./components/Header";

function App() {
  const [isBlack, setIsBlack] = useState(
    JSON.parse(getFromLS("theme") ? getFromLS("theme") : false)
  );
  return (
    <div className={"layout " + (isBlack ? "dark" : "")}>
      <Header stateChanger={setIsBlack} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
