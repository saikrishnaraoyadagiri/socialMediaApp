import Leftbar from "./Components/Leftbar/Leftbar";
import Home from "./Pages/Homepage/Home";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import Register from "./Pages/Register/Register";
import Header from '../../Components/Header/Header';
import { Outlet } from 'react-router-dom';


function App() {
  return (
  <div className="App">
    <Outlet />
  </div>
  );
}

export default App;
