import "../css/MostSoldProducts.css";

function MostSoldProducts() {
  return (
    <div className="Most-Sold-Products-container">
      <h2 className="Most-Sold-Products-title">Most Sold Products</h2>
      <div className="Most-Sold-Products-grid">
        <div className="Most-Sold-Product-card">
          <h2 className="Most-Sold-Products-title">1st Place</h2>
          <div className="Most-Sold-Products-details">
            <img src="#" alt="Product 1" className="Most-Sold-Products-image" />
            <p className="Most-Sold-Products-name">Name 1</p>
            <p className="Most-Sold-Products-qty">Sold 100 items</p>
          </div>
        </div>
        <div className="Most-Sold-Product-card">
          <h2 className="Most-Sold-Products-title">2nd Place</h2>
          <div className="Most-Sold-Products-details">
            <img src="#" alt="Product 1" className="Most-Sold-Products-image" />
            <p className="Most-Sold-Products-name">Name 2</p>
            <p className="Most-Sold-Products-qty">Sold 90 items</p>
          </div>
        </div>
        <div className="Most-Sold-Product-card">
          <h2 className="Most-Sold-Products-title">3rd Place</h2>
          <div className="Most-Sold-Products-details">
            <img src="#" alt="Product 1" className="Most-Sold-Products-image" />
            <p className="Most-Sold-Products-name">Name 3</p>
            <p className="Most-Sold-Products-qty">Sold 50 items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MostSoldProducts;
