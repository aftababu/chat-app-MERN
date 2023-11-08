import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Chats from "./pages/Chats";


function App() {


  return (
    <>
      <>
        <Routes>

            <Route path="/" Component={HomePage} />
              <Route path="/chats" Component={Chats} />
          
        </Routes>
      </>
    </>
  );
}

export default App;
