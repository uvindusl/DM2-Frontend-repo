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
import SupplierLoginPage from "./pages/SupplierLoginPage";
import SupplierDashboard from "./pages/SupplierDashborad";
import SupplierViewFood from "./pages/SupplierViewFood";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerReview from "./pages/CustomerReview";
import SupplierProfile from "./pages/SupplierProfile";
import SuppliersViewPage from "./pages/SuppliersViewPage";

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
          <Route path="/supplier/add/food" element={<AddFood />} />
          <Route path="/supplier/update/food/:id" element={<UpdateFood />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/Payment" element={<PaymentPage />} />
          <Route
            path="/employee/view/orders"
            element={<EmployeeViewOrders />}
          />
          <Route path="/supplier" element={<SupplierLoginPage />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/view/foods" element={<SupplierViewFood />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/reviews" element={<CustomerReview />} />
          <Route path="/supplier/profile" element={<SupplierProfile />} />
          <Route
            path="/employee/view/suppliers"
            element={<SuppliersViewPage />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
