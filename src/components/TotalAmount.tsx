import React from "react";

function TotalAmount({ total }: { total: number }) {
  return (
    <div className="total-container">
      <p>Total: <span>Rs. {total}</span></p>
      <button className="proceed-btn">Proceed</button>
    </div>
  );
}

export default TotalAmount;
