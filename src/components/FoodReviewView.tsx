import "../css/FoodReviewView.css";

function FoodReviewView() {
  return (
    <div className="food-review-card1">
      <div className="food-review-card-header">
        <div className="food-review-card-content">
          <div>
            <div className="details">customer name</div>
            <div className="details">address</div>
          </div>
        </div>
      </div>
      <div className="food-review-card-footer">
        <form className="food-review-form">
          <label className="review-lable"> Review</label>
          <p className="review-content"> Fuck, dont buy this its shit</p>

          <label className="review-lable">Rating</label>
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
        </form>
      </div>
    </div>
  );
}

export default FoodReviewView;
