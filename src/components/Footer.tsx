import "../css/Footer.css";
import Garfieldpic from "../../src/assets/Garfieldpic.png";
import instagram from "../../src/assets/instagram.png";
import facebook from "../../src/assets/facebook.png";
import twitter from "../../src/assets/twitter.png";

function Footer() {
  return (
    <footer>
      <div className="main-container">
        <div className="col-1">
          <img className="garpic" src={Garfieldpic} alt="Garfield" />
        </div>
        <div className="col-2">
          <div className="row1">
            <h4>Contact Us</h4>
            <br></br>
          </div>
          <div className="row2">
            <p>
              Independence Arcade Commercial Complex, <br></br>
              Independence Ave, <br></br>
              Colombo00700, <br></br>
              Sri Lanka.<br></br>
              <a className="custom-a" href="mailto:garfields@gmail.com">
                garfields@gmail.com
              </a>
              <br></br>
              +94 76-5506968
            </p>
          </div>
        </div>
        <div className="col-3">
          <div className="row1">
            <h4>Follow Us</h4>
          </div>
          <div className="row2">
            <img className="logo" src={instagram} alt="instagram" />
            <a className="custom-a" href="#">
              Instagram
            </a>
            <br></br>
            <img className="logo" src={facebook} alt="facebook" />
            <a className="custom-a" href="#">
              Facebook
            </a>
            <br></br>
            <img className="logo" src={twitter} alt="twitter" />
            <a className="custom-a" href="#">
              Twitter
            </a>
          </div>
        </div>
      </div>
      <div className="bottom">
        <p>&copy; 2025 Garfield's Cheesy Haven</p>
      </div>
    </footer>
  );
}

export default Footer;
