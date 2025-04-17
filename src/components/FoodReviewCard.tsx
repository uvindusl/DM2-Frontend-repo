import "../css/FoodReviewCard.css"; // Assuming you have a CSS file for styling

function FoodReviewCard() {
  return (
    <div className="food-review-card">
      <div className="food-review-card-header">
        <div className="food-review-card-content">
          <div className="details">pic</div>
          <div>
            <div className="details">food name</div>
            <div className="details">price: xxxxxx</div>
          </div>
        </div>
        <div className="details">qty</div>
      </div>
      <div className="food-review-card-footer">
        <form className="food-review-form">
          <label className="review-lable"> Review</label>
          <textarea placeholder="How the fuck u feel about this shit" />

          <label className="review-lable">Rate this</label>
          <div className="rating-conatiner">
            <div className="rating">
              <input type="radio" id="star5" name="rating" defaultValue={5} />
              <label htmlFor="star5" />
              <input type="radio" id="star4" name="rating" defaultValue={4} />
              <label htmlFor="star4" />
              <input type="radio" id="star3" name="rating" defaultValue={3} />
              <label htmlFor="star3" />
              <input type="radio" id="star2" name="rating" defaultValue={2} />
              <label htmlFor="star2" />

              <input type="radio" id="star1" name="rating" defaultValue={1} />
              <label htmlFor="star1" />
            </div>
          </div>

          <button className="review-submit">submit</button>
        </form>
      </div>
    </div>
  );
}

export default FoodReviewCard;
