import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import ProfileView from "./views/ProfileView";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/dashboard/profile" element={<ProfileView />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
