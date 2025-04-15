import EmployeeLoginForm from "../components/EmployeeLoginForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../css/LoginPage.css";
import axios from "axios";
import CustomerLoginHeader from "../components/CustomerLoginHeader";

interface employee {
  employeeId: number;
  employeeName: string;
  employeeAddress: string;
  employeeTel: number;
  employeePassword: string;
}

function EmployeeLoginPage() {
  const [employee, setemployee] = useState<employee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (username: string, password: string) => {
    const apiUrl = "http://localhost:8080/urban-food/employees/login";

    setLoading(true);
    setError(null);

    axios
      .post(apiUrl, {
        employeeName: username,
        employeePassword: password,
      })
      .then((response) => {
        if (response.status === 200) {
          // HTTP 200 status is successful connect with the server and send data
          const employeeData = response.data;
          setemployee(employeeData);
          navigate("/employee/dashboard");

          // Store the employee id
          sessionStorage.setItem(
            "employeeId",
            employeeData.employeeId.toString()
          );
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        if (error.response) {
          if (error.response.status === 404) {
            setError("Employee not found. Please check your credentials.");
          } else {
            setError("Login failed. Please try again later.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="page-wrapper">
      <CustomerLoginHeader />
      <div className="content-area">
        <div className="login-container">
          <EmployeeLoginForm
            onLogin={handleLogin}
            loading={loading}
            error={error}
          />
        </div>
      </div>
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
}
export default EmployeeLoginPage;
