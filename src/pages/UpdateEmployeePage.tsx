import UpdateEmployee from "../components/UpdateEmployee";
import Footer from "../components/Footer";
import "../css/AddEmployee.css";
import EmployeeNavBar from "../components/EmployeeNavBar";

function UpdateEmployeePage() {
  return (
    <div className="page-wrapper">
      <EmployeeNavBar />
      <div className="content-area">
        <h2>Update Employee</h2>
        <div className="login-container1">
          <UpdateEmployee />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UpdateEmployeePage;
