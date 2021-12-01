import React, { Component } from "react";
import { Route, withRouter, Link, useHistory } from "react-router-dom";
import {
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  Row,
  Form,
  Col,
} from "react-bootstrap";
import { compose, withProps } from "recompose";
import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyAwx7ygt9FsbDQ2sMBkJoLANW8DURJxBOs");

// set response language. Defaults to english.
Geocode.setLanguage("en");

import validator from "validator";
import "./Home.css";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAwx7ygt9FsbDQ2sMBkJoLANW8DURJxBOs&v=3&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: props.lat, lng: props.lng }}>
    {props.isMarkerShown && (
      <Marker position={{ lat: props.lat, lng: props.lng }} />
    )}
  </GoogleMap>
));

class Results extends Component {
  constructor(props) {
    super(props);

    this.handleRouteChange = this.handleRouteChange.bind(this);

    this.state = this.props.location.state;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.changeAdress = this.changeAdress.bind(this);
    this.changeAdress();
  }

  async changeAdress() {
    const res = await Geocode.fromAddress(
      `${this.state.address} ${this.state.city} ${this.state.state} ${this.state.zip}`
    );
    const result = res.results[0].geometry.location;
    this.setState({
      lat: result.lat,
      lng: result.lng,
    }),
      () => console.log();
  }

  renderMap() {
    console.log(this.state);

    if (this.state.lat !== undefined) {
      return (
        <MyMapComponent
          isMarkerShown
          lat={this.state.lat}
          lng={this.state.lng}
        />
      );
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });

    console.log(this.state);
  };

  handleCheckChange = (event) => {
    this.setState({
      [event.target.id]: event.target.checked,
    });

    console.log(this.state);
  };

  handleRouteChange() {
    this.props.history.push("/");
  }

  validateForm() {
    if (this.validateFirstName() && this.validateLastName()) {
      return true;
    }

    return false;
  }

  getNumber() {
    return parsePhoneNumber(this.state.phone, "US").formatNational();
  }

  handleSubmit() {
    event.preventDefault();

    this.props.history.push({
      pathname: "/register",
      state: this.state,
    });
  }

  render() {
    return (
      <body className="body">
        <div className="form login">
          <h1 id="justice">
            <p>Results Verification Page - Jose Castanon</p>
          </h1>

          <hr />
          <Form
            // validated={this.validateForm}
            onSubmit={this.handleSubmit}
          >
            <Row md="auto">
              <FormGroup as={Col} className="lastname" controlId="lastname">
                <FormLabel>
                  <b>Last Name </b>
                </FormLabel>
                <FormControl
                  disabled
                  required
                  type="text"
                  value={this.state.lastname}
                  onChange={this.handleChange}
                  isInvalid={
                    this.state.lastname.length === 0 ||
                    this.state.lastname.length > 40
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid last name.
                </Form.Control.Feedback>
              </FormGroup>
              <FormGroup as={Col} controlId="firstname">
                <FormLabel>
                  <b>First Name </b>
                </FormLabel>
                <FormControl
                  disabled
                  required
                  value={this.state.firstname}
                  onChange={this.handleChange}
                  type="text"
                  isInvalid={
                    this.state.firstname.length === 0 ||
                    this.state.firstname.length > 40
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid first name.
                </Form.Control.Feedback>
              </FormGroup>
            </Row>
            <Row md="2">
              <Form.Group as={Col} controlId="title">
                <Form.Label>
                  <b>Title</b>
                </Form.Label>
                <Form.Control
                  disabled
                  required
                  as="select"
                  value={this.state.title}
                  onChange={this.handleChange}
                >
                  <option value="None">None</option>
                  <option value="Student">Student</option>
                  <option value="Professor">Professor</option>
                  <option value="Retired">Retired</option>
                  <option value="Staff">Staff</option>
                </Form.Control>
              </Form.Group>
            </Row>
            <Row md="2">
              <FormGroup as={Col} controlId="feet">
                <FormLabel>
                  <b>Your Height (Feet)</b>
                </FormLabel>
                <FormControl
                  disabled
                  type="text"
                  value={this.state.feet}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup as={Col} controlId="inches">
                <FormLabel>
                  <b>Your Height (Inches) </b>
                </FormLabel>
                <FormControl
                  disabled
                  value={this.state.inches}
                  onChange={this.handleChange}
                  type="text"
                  isInvalid={this.state.inches > 11}
                />
              </FormGroup>
            </Row>
            <Row md="4">
              <FormGroup as={Col} controlId="phone">
                <FormLabel>
                  <b>Phone Number</b>
                </FormLabel>
                <FormControl
                  disabled
                  value={this.state.phone}
                  onChange={this.handleChange}
                  type="text"
                  isInvalid={
                    (this.state.phone.length < 10 &&
                      this.state.phone.length > 0) ||
                    this.state.phone.length > 10
                  }
                  jcastan6
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a 10 digit phone number.
                </Form.Control.Feedback>
              </FormGroup>
            </Row>

            <FormGroup controlId="address">
              <FormLabel>
                <b>Address </b>
              </FormLabel>
              <FormControl
                disabled
                required
                value={this.state.address}
                onChange={this.handleChange}
                type="text"
                isInvalid={
                  this.state.address.length >= 40 ||
                  this.state.address.length === 0
                }
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid address.
              </Form.Control.Feedback>
            </FormGroup>
            <Row md="3">
              <FormGroup as={Col} controlId="city">
                <FormLabel>
                  <b>City </b>
                </FormLabel>
                <FormControl
                  disabled
                  required
                  value={this.state.city}
                  onChange={this.handleChange}
                  type="text"
                  isInvalid={
                    this.state.city.length >= 40 || this.state.city.length === 0
                  }

                  // isInvalid={}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid city.
                </Form.Control.Feedback>
              </FormGroup>

              <FormGroup as={Col} controlId="state">
                <FormLabel>
                  <b>State </b>
                </FormLabel>
                <Form.Control
                  disabled
                  required
                  value={this.state.state}
                  onChange={this.handleChange}
                  as="select"
                  isInvalid={this.state.state === "Select"}

                  // isInvalid={}
                >
                  <option value="Select">Select</option>
                  <option value="AL">AL</option>
                  <option value="AK">AK</option>
                  <option value="AR">AR</option>
                  <option value="AZ">AZ</option>
                  <option value="CA">CA</option>
                  <option value="CO">CO</option>
                  <option value="CT">CT</option>
                  <option value="DC">DC</option>
                  <option value="DE">DE</option>
                  <option value="FL">FL</option>
                  <option value="GA">GA</option>
                  <option value="HI">HI</option>
                  <option value="IA">IA</option>
                  <option value="ID">ID</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="MA">MA</option>
                  <option value="MD">MD</option>
                  <option value="ME">ME</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MO">MO</option>
                  <option value="MS">MS</option>
                  <option value="MT">MT</option>
                  <option value="NC">NC</option>
                  <option value="NE">NE</option>
                  <option value="NH">NH</option>
                  <option value="NJ">NJ</option>
                  <option value="NM">NM</option>
                  <option value="NV">NV</option>
                  <option value="NY">NY</option>
                  <option value="ND">ND</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="OR">OR</option>
                  <option value="PA">PA</option>
                  <option value="RI">RI</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TN">TN</option>
                  <option value="TX">TX</option>
                  <option value="UT">UT</option>
                  <option value="VT">VT</option>
                  <option value="VA">VA</option>
                  <option value="WA">WA</option>
                  <option value="WI">WI</option>
                  <option value="WV">WV</option>
                  <option value="WY">WY</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please enter a valid state.
                </Form.Control.Feedback>
              </FormGroup>

              <FormGroup as={Col} controlId="zip">
                <FormLabel>
                  <b>Zip Code</b>
                </FormLabel>
                <FormControl
                  disabled
                  required
                  value={this.state.zip}
                  onChange={this.handleChange}
                  type="text"
                  isInvalid={this.state.zip.length !== 5}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid zip code.
                </Form.Control.Feedback>
              </FormGroup>
            </Row>
            <div style={{ width: "100%" }}>{this.renderMap()}</div>
            <br />
            <Form.Label>
              <b>Select all services you require...</b>
            </Form.Label>

            <Form.Group as={Col} className="mb-3" controlId="serviceEmail">
              <Form.Check
                label="Email"
                onChange={this.handleChange}
                disabled
                checked={this.state.serviceEmail}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="servicePhone">
              <Form.Check
                label="Phone"
                checked={this.state.servicePhone}
                disabled
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="serviceFacebook">
              <Form.Check
                label="Facebook"
                checked={this.state.serviceFacebook}
                disabled
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="serviceTwitter">
              <Form.Check
                label="Twitter"
                checked={this.state.serviceTwitter}
                disabled
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="serviceMail">
              <Form.Check
                label="Mail"
                disabled
                checked={this.state.serviceMail}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="servicePersonal">
              <Form.Check
                checked={this.state.personal}
                disabled
                label="Personal Visit"
              />
            </Form.Group>
            <br />
            <Row>
              <Form.Group as={Col} controlId="budget">
                <Form.Label>
                  <b>Your monthly budget for services</b>
                </Form.Label>
                <Form.Control
                  disabled
                  as="select"
                  value={this.state.budget}
                  onChange={this.handleChange}
                >
                  <option value="Select..">Select...</option>
                  <option value="More than $100">More than $100</option>
                  <option value="Less than $50">Less than $50</option>
                  <option value="Between $50 and $100">
                    Between $50 and $100
                  </option>
                </Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <FormGroup as={Col} controlId="email">
                <FormLabel>
                  <b>Email </b>
                </FormLabel>
                <FormControl
                  disabled
                  required
                  value={this.state.email}
                  onChange={this.handleChange}
                  type="text"
                  isInvalid={
                    this.state.email.length > 0 &&
                    !validator.isEmail(this.state.email)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              </FormGroup>
            </Row>
          </Form>
        </div>
      </body>
    );
  }
}
export default withRouter(Results);
