import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* SHOP */}

        <Route
          path="/shop"
          element={<Shop />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;