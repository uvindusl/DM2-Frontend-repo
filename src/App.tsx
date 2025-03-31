import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FoodPage from "./pages/FoodPage";
import "../src/css/App.css";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import EmployeeLoginPage from "./pages/EmployeeLoginPage";
import EmployeesViewPage from "./pages/EmployeesViewPage";
import EmployeeViewFood from "./pages/EmployeeViewFood";
import CheckoutPage from "./pages/CheckoutPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import UpdateEmployeePage from "./pages/UpdateEmployeePage";
import AddFood from "./pages/AddFood";
import UpdateFood from "./pages/UpdateFood";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PaymentPage from "./pages/PaymentPage";
import EmployeeViewOrders from "./pages/EmployeeViewOrders";

function App() {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/Home" element={<HomePage />}></Route>
          <Route path="/food/:id" element={<FoodPage />}></Route>
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/employee" element={<EmployeeLoginPage />}></Route>
          <Route
            path="/employee/view/employees"
            element={<EmployeesViewPage />}
          ></Route>
          <Route
            path="/employee/view/foods"
            element={<EmployeeViewFood />}
          ></Route>
          <Route path="/checkout" element={<CheckoutPage />}></Route>
          <Route
            path="/employee/add/employee"
            element={<AddEmployeePage />}
          ></Route>
          <Route
            path="/employee/update/employee/:id"
            element={<UpdateEmployeePage />}
          />
          <Route path="/employee/add/food" element={<AddFood />} />
          <Route path="/employee/update/food/:id" element={<UpdateFood />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/Payment" element={<PaymentPage />} />
          <Route
            path="/employee/view/orders"
            element={<EmployeeViewOrders />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
