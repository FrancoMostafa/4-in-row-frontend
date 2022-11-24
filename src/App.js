import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import Footer from "./components/Footer";
import Statistics from "./components/Statistics";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/game/:gameId/:nick/:gameType"
            element={<Game />}
          ></Route>
          <Route path="/estadisticas" element={<Statistics />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
