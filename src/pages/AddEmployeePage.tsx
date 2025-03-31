import AddEmployee from "../components/AddEmployee";
import EmployeeNavBar from "../components/EmployeeNavBar";
import Footer from "../components/Footer";
import "../css/AddEmployee.css";

function AddEmployeePage() {
  return (
    <div className="page-wrapper">
      <EmployeeNavBar />
      <div className="content-area">
        <h2>Add New Employee</h2>
        <div className="login-container1">
          <AddEmployee />
        </div>
      </div>
      <div className="footer5">
        <Footer />
      </div>
    </div>
  );
}

export default AddEmployeePage;
