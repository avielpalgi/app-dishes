import React, { useEffect, useState } from 'react';
import { Row, Container, Col, Card, Button, Form } from "react-bootstrap";
import axios from 'axios';
import { connect } from 'react-redux'
import { loginUser } from './../redux/actions/authActionCreators'
import Swal from "sweetalert2";
import "./Login.css";
import Facebook from "./facebook";
import Google from "./google";
import { getFromStorage, setInStorage } from '../helpers/storage'
import { withRouter, Link } from 'react-router-dom'

function Login({ windowHeight, dispatchLoginAction }) {
  const apiUrl = 'https://my-app-dishes.herokuapp.com/app';
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState({ Email: false, Password: false })

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (isFormInvalid()) updateErrorFlags();
    else{
    dispatchLoginAction(Email, Password,
      () =>
        Swal.fire({
          position: "center",
          icon: "success",
          title: "התחברת בהצלחה",
          showConfirmButton: false,
          timer: 1200,
        }),
      console.log('Logged in successfully='), (message) => console.log(`Error: ${message}`));
    }
  }

  const isFormInvalid = () => (!Email || !Password);

  const updateErrorFlags = () => {
    const errObj = { Email: false, Password: false };
    if (!Email.trim()) errObj.Email = true;
    if (!Password.trim()) errObj.Password = true;
    setError(errObj);

  }


  const RememberMe = () => {
    // if (!rememberMe) {
    //   setRememberMe(true);
    //   let remember = {
    //     Email: email,
    //     Password: password,
    //   };
    //   localStorage.setItem("remember", JSON.stringify(remember));
    //   Swal.fire({
    //     position: "center",
    //     icon: "success",
    //     title: "Your Password and Email are saved",
    //     showConfirmButton: false,
    //     timer: 1200,
    //   });
    // } else {
    //   setRememberMe(false);
    //   localStorage.removeItem('remember');
    //   Swal.fire({
    //     position: "center",
    //     icon: "success",
    //     title: "Your Password and Email are not saved",
    //     showConfirmButton: false,
    //     timer: 1200,
    //   });
    // }
  }
  return (
    <Container className="contLogin" style={{ height: `${windowHeight - 60}px` }}>
      <Row>
        <Col className="colSignIn2">
          <h3>התחבר</h3>
        </Col>
      </Row>
      <Row className="RowLogin">
        <Col sm="9" md="7" lg="5">
          <Form className="formLogin" onSubmit={handleOnSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label >שם משתמש</Form.Label>
              <Form.Control
                className={`form-control ${error.Email ? 'is-invalid' : ''}`}
                id="EmailForm"
                type="email"
                placeholder="הכנס שם משתמש"
                value={Email}
                onChange={(e) => { setEmail(e.target.value) }}
              />
              <p className="invalid-feedback">חובה!</p>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>סיסמא</Form.Label>
              <Form.Control
                className={`form-control ${error.Password ? 'is-invalid' : ''}`}
                id="PasswordForm"
                type="password" name="password"
                placeholder="הכנס סיסמא"
                value={Password}
                onChange={(e) => { setPassword(e.target.value) }}
              />
              <p className="invalid-feedback">חובה!</p>
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                className="check"
                checked={rememberMe}
                type="checkbox"
                label="זכור אותי"
                onChange={() => { RememberMe() }}
              />
            </Form.Group>
            <Col className="btnSignIn">
              <Button variant="primary" type="submit" className="btn">
                התחבר
                </Button>
            </Col>
          </Form>
          <div className="or-seperator">
            <i>או</i>
          </div>
          <Row className="FacebookGoogleRow">
            <Col lg="6" md="6" sm="12" className="facebook">
              <Facebook />
            </Col>
            <Col lg="6" md="6" sm="12" className="google">
              <Google />
            </Col>
          </Row>

          <Row className="footerCardLogin">
            <Col lg="6" md="6" sm="6" xs="6" className="forgot">
              <p className="font-small blue-text">
                <Link to="/reset">שכחת את הסיסמא?</Link>
              </p>
            </Col>
            <Col lg="6" md="6" sm="6" xs="6" className="signup">
              <p className="font-small grey-text">
                פעם ראשונה?
                    <Link to="/register">הרשם</Link>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )

}
const mapDispatchToProps = dispatch => ({
  dispatchLoginAction: (Email, Password, onSuccess, onError) =>
    dispatch(loginUser({ Email, Password }, onSuccess, onError))
});
export default withRouter(connect(null, mapDispatchToProps)(Login))
