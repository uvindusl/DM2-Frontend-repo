import EmployeeCard from "../components/EmployeeCard";
import "../css/EmployeeViewPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeNavBar from "../components/EmployeeNavBar";
import Footer from "../components/Footer";

interface employee {
  id: number;
  name: string;
  address: string;
  tel: string;
}

function EmployeesViewPage() {
  const [employees, setEmployee] = useState<employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const DeleteClick = async (employeeId: number) => {
    try {
      const apiUrl = `http://localhost:8082/employee-micro/employees/${employeeId}`;
      await axios.delete(apiUrl);
      window.location.reload();
    } catch (error) {
      console.error("Error", error);
      setError("Failed to delete");
    }
  };

  useEffect(() => {
    const apiUrl = "http://localhost:8082/employee-micro/employees";

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);

        if (response.status === 200) {
          const mappedEmployees = response.data.map((emp: any) => ({
            id: emp.employeeId, //use this id for deleting employee
            name: emp.employeeName,
            address: emp.employeeAddress,
            tel: emp.employeeTel,
          }));
          setEmployee(mappedEmployees);
        } else if (response.status === 204) {
          setEmployee([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Employee data:", error);
        setError("Failed to load employee data. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <EmployeeNavBar />
      <div className="employeeCard-container">
        <div className="employeeCard-container__content">
          {loading ? (
            <p className="loading-message">Loading Employee Data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="employeePage-grid">
              {employees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  handleDeleteClick={DeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="footer6">
        <Footer />
      </div>
    </div>
  );
}

export default EmployeesViewPage;
