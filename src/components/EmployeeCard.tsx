import { useNavigate } from "react-router-dom";
import "../css/EmployeeCard.css";

interface Employee {
  id: number;
  name: string;
  address: string;
  tel: string;
}

interface EmployeeProps {
  handleDeleteClick: (employeeId: number) => void;
  employee: Employee;
}

function EmployeeCard({ employee, handleDeleteClick }: EmployeeProps) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/employee/update/employee/${employee.id}`); // Navigate to Update Page
  };

  return (
    // <div>
    //   <div className="employee-card">
    //     <div className="employee-card__avatar">
    //       <div className="person-icon"></div>
    //     </div>
    //     <div className="employee-card__info">
    //       <h4>{employee.name}</h4>
    //       <p>{employee.tel}</p>
    //       <p>{employee.address}</p>
    //     </div>
    //     <div className="btn-group">
    //       <button className="btnEdit" onClick={handleEditClick}>
    //         <div className="gear-icon"></div>
    //       </button>
    //       <button
    //         className="btnDelete"
    //         onClick={() => handleDeleteClick(employee.id)}
    //       >
    //         <div className="trash-icon"></div>
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="employee-card">
      <div className="employee-content">
        <div className="employee-name">
          <p>{employee.name}</p>
        </div>
        <div className="employee-info">
          <h3 className="employee-title">{employee.address}</h3>
          <p className="employee-description">{employee.tel}</p>
        </div>

        <div className="employee-image">
          <div className="employee-card__avatar">
            <div className="person-icon"></div>
          </div>
        </div>
        <div className="employee-actions">
          <button className="employee-edit-button" onClick={handleEditClick}>
            Edit
          </button>
          <button
            className="employee-delete-button"
            onClick={() => handleDeleteClick(employee.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
