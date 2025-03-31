import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/EmployeeForms.css";
import { useNavigate } from "react-router-dom";

function UpdateEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    address: "",
    telephone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8082/employee-micro/employees/${id}`)
      .then((response) => {
        const emp = response.data;
        setEmployee({
          name: emp.employeeName,
          address: emp.employeeAddress,
          telephone: emp.employeeTel,
        });
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        setError("Failed to load employee data.");
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8082/employee-micro/employees/${id}`, {
        employeeName: employee.name,
        employeeAddress: employee.address,
        employeeTel: employee.telephone,
      });

      alert("Employee Updated Successfully!");
      setError(null);
      navigate("/employee/view/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee.");
    }
  };

  return (
    <div className="form-container">
      {error && <p className="error-message">{error}</p>}

      <form className="form-content" onSubmit={handleSubmit}>
        <label>Employee Name</label>
        <input
          type="text"
          name="name"
          value={employee.name}
          onChange={handleChange}
          required
          pattern="[A-Za-z]*"
        />

        <label>Employee Address</label>
        <input
          type="text"
          name="address"
          value={employee.address}
          onChange={handleChange}
          required
        />

        <label>Employee Telephone Number</label>
        <input
          type="number"
          name="telephone"
          value={employee.telephone}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateEmployee;
