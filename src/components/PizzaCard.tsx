import styled from "styled-components";
import { Link } from "react-router-dom";

interface Food {
  id: number;
  picture: string; // Base64 string for the image
  name: string;
  price: number;
}

interface PizzaCardProps {
  food: Food;
}

function PizzaCard({ food }: PizzaCardProps) {
  // Create a proper data URI from base64 string
  const imageSource = food.picture
    ? `data:image/jpeg;base64,${food.picture}`
    : "/placeholder.png";

  return (
    <StyledWrapper>
      <div className="card">
        <Link to={`/food/${food.id}`}>
          <div className="card-image">
            <img
              src={imageSource}
              alt={food.name}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>
          <div className="heading">
            {food.name}
            <div className="author">RS.{food.price}</div>
          </div>
        </Link>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 190px;
    background: white;
    padding: 0.4em;
    border-radius: 6px;
  }

  .card-image {
    position: relative; // Needed for link to cover image
  }

  .card-image img {
    width: 100%;
    height: 130px;
    border-radius: 6px 6px 0 0;
    object-fit: cover;
  }

  .card-image a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block; // Make link cover the image
  }

  .heading {
    font-weight: 600;
    color: rgb(88, 87, 87);
    padding: 7px;
  }

  .author {
    color: gray;
    font-weight: 400;
    font-size: 11px;
    padding-top: 20px;
  }
`;

export default PizzaCard;
