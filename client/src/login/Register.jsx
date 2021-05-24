import React, { useState, useEffect } from "react";
import { Row, Container, Col, FormControl, Button, Form } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup'
import { FaUnlockAlt, FaUndo, FaUserAlt, FaLock } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Swal from "sweetalert2";
import { withRouter, Link } from 'react-router-dom'
import "./Login.css";
import { setInStorage, getFromStorage } from '../helpers/storage';
import { connect } from 'react-redux';
import { registerUser } from '../redux/actions/authActionCreators';

function Register({ windowHeight, dispatchRegisterAction }) {
  const apiUrl = 'https://my-app-dishes.herokuapp.com/app';
  const [FirstName, setFirstName] = useState("")
  const [LastName, setLastName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState({FirstName:false,LastName:false, Email: false, Password: false, ConfirmPassword: false })


  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (isFormInvalid()) updateErrorFlags();
    else{
    if (ConfirmPassword === Password) {
      dispatchRegisterAction(FirstName, LastName, Email, Password,
        () => Swal.fire({
          position: "center",
          icon: "success",
          title: "נרשמת בהצלחה",
          showConfirmButton: false,
          timer: 1200,
        }), console.log("Account created successfully"),
        (message) => console.log(`Error:  ${message}`))
    }
  }
  }

  const isFormInvalid = () => (!Email || !Password || !ConfirmPassword);

  const updateErrorFlags = () => {
    const errObj = {FirstName:false,LastName:false, Email: false, Password: false, ConfirmPassword: false };
    if (!FirstName.trim()) errObj.FirstName = true;
    if (!LastName.trim()) errObj.LastName = true;
    if (!Email.trim()) errObj.Email = true;
    if (!Password.trim()) errObj.Password = true;
    if (!ConfirmPassword.trim()) errObj.ConfirmPassword = true;
    setError(errObj);

  }



  return (
    <Container style={{ height: `${windowHeight - 60}px` }}>
      <Row>
        <Col className="colSignIn2">
          <h3>הרשמה</h3>
        </Col>
      </Row>
      <Row className="RowLogin">
        <Col sm="9" md="7" lg="5" className="inputCol">
          <Form onSubmit={handleOnSubmit}>
            <InputGroup className="mb-3">
              <FormControl
                className={`text form-control ${error.FirstName ? 'is-invalid' : ''}`}
                placeholder="שם פרטי"
                aria-label="username"
                aria-describedby="basic-addon2"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2"><FaUserAlt /></InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                className={`text form-control ${error.LastName ? 'is-invalid' : ''}`}
                placeholder="שם משפחה"
                aria-label="username"
                aria-describedby="basic-addon2"
                onChange={(e) => setLastName(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2"><FaUserAlt /></InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                className={`text form-control ${error.Email ? 'is-invalid' : ''}`}
                placeholder="כתובת אימייל"
                aria-label="username"
                aria-describedby="basic-addon2"
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2"><FaUserAlt /></InputGroup.Text>
              </InputGroup.Append>
              <p className="invalid-feedback mb-0 mr-5">!חובה</p>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                className={`text form-control ${error.Password ? 'is-invalid' : ''}`}
                placeholder="סיסמא"
                aria-label="password"
                type="password" name="password"
                aria-describedby="basic-addon2"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2"><FaLock /></InputGroup.Text>
              </InputGroup.Append>
              <p className="invalid-feedback mb-0 mr-5">!חובה</p>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                className={`text form-control ${error.ConfirmPassword ? 'is-invalid' : ''}`}
                placeholder="אימות סיסמא"
                aria-label="password2"
                type="password" name="password"
                aria-describedby="basic-addon2"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2"><FaLock /></InputGroup.Text>
              </InputGroup.Append>
              <p className="invalid-feedback mb-0 mr-5">!חובה</p>
            </InputGroup>
            <Col className="btnSignIn">
              <Button variant="primary" type="submit" className="btn">
                הרשם
              </Button>
            </Col>
          </Form>
        </Col>


      </Row>
      <Row>
        <Col className="back">
          <Link to="/login">
            <FaUndo /> <span>חזור לעמוד ההתחברות</span>
          </Link>
        </Col>
      </Row>
    </Container>
  )
}
const mapDispatchToProps = dispatch => ({
  dispatchRegisterAction: (FirstName, LastName, Email, Password, onSuccess, onError) =>
    dispatch(registerUser({ FirstName, LastName, Email, Password }, onSuccess, onError))
})
export default connect(null, mapDispatchToProps)(withRouter(Register))
