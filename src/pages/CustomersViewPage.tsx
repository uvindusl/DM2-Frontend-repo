import "../css/EmployeeViewPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeNavBar from "../components/EmployeeNavBar";
import Footer from "../components/Footer";
import CustomerCard from "../components/CustomerCard";

interface customer {
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerTel: string;
}

function CustomersViewPage() {
  const [customer, setCustomer] = useState<customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = "http://localhost:8080/urban-food/customers";

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);

        if (response.status === 200) {
          const mappedEmployees = response.data.map((cus: any) => ({
            customerId: cus.customerId,
            customerName: cus.customerName,
            customerAddress: cus.customerAddress,
            customerTel: cus.customerTel,
          }));
          setCustomer(mappedEmployees);
        } else if (response.status === 204) {
          setCustomer([]);
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
              {customer.map((customer) => (
                <CustomerCard key={customer.customerId} customer={customer} />
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

export default CustomersViewPage;
