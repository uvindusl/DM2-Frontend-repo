import "../css/EmployeeCard.css";

interface Customer {
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerTel: string;
}

interface EmployeeProps {
  customer: Customer;
}

function CustomerCard({ customer }: EmployeeProps) {
  return (
    <div className="employee-card">
      <div className="employee-content">
        <div className="employee-name">
          <p>{customer.customerName}</p>
        </div>
        <div className="employee-info">
          <h3 className="employee-title">{customer.customerAddress}</h3>
          <p className="employee-description">{customer.customerTel}</p>
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

export default CustomerCard;
