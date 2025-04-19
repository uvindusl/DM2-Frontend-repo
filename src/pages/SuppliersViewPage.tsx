import "../css/EmployeeViewPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeNavBar from "../components/EmployeeNavBar";
import Footer from "../components/Footer";
import SupplierCard from "../components/SupplierCard";

interface supplier {
  id: number;
  name: string;
  address: string;
  tell: string;
  company: string;
}

function SuppliersViewPage() {
  const [suppliers, setsupplier] = useState<supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = "http://localhost:8080/urban-food/suppliers";

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);

        if (response.status === 200) {
          const mappedEmployees = response.data.map((emp: any) => ({
            id: emp.id,
            name: emp.name,
            address: emp.address,
            tel: emp.tell,
            company: emp.company,
          }));
          setsupplier(mappedEmployees);
        } else if (response.status === 204) {
          setsupplier([]);
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
              {suppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
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

export default SuppliersViewPage;
