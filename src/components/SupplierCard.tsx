import { useNavigate } from "react-router-dom";
import "../css/EmployeeCard.css";

interface Supplier {
  id: number;
  name: string;
  address: string;
  tell: string;
  company: string;
}

interface EmployeeProps {
  supplier: Supplier;
}

function SupplierCard({ supplier }: EmployeeProps) {
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
          <p>{supplier.name}</p>
        </div>
        <div className="employee-info">
          <h3 className="employee-title">{supplier.address}</h3>
          <p className="employee-description">{supplier.tell}</p>
          <p className="employee-company">{supplier.company}</p>
        </div>

        <div className="employee-image">
          <div className="employee-card__avatar">
            <div className="person-icon"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierCard;
