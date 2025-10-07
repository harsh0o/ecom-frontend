import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./layout/PrivateRoutes";
import Login from "./components/Login";
import Users from "./components/Users";
import ImageManager from "./components/ImageUpload";
// import Products from "./components/Products";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Users />} />
          <Route path="/images" element={<ImageManager />} />
          {/* <Route path="/" element={<Products />} /> */}
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
