import React, { useState } from 'react'
import { Row, Container, Col, Card, Button, Form } from "react-bootstrap";
import {withRouter,Link} from 'react-router-dom'

import { FaUndo } from "react-icons/fa";
import "./Login.css";

function Reset(props) {
  
  return (
    <Container style={{height: `${props.windowHeight-60}px`}}>
    <Row className="RowLogin">
      <Col sm="9" md="7" lg="5" className="colSignIn2">
            <h3>איפוס סיסמא</h3>
          <Form className="formLogin reset" action="myuploadform.php" method="get">
            <Form.Group controlId="formBasicEmail">
            <Form.Label>הזן את כתובת הדוא"ל שלך כדי לאפס את הסיסמה שלך</Form.Label>
              <Form.Control type="email" placeholder="הכנס אימייל" />
              <Form.Text className="text-muted">
              לעולם לא נשתף את הדוא"ל שלך עם אף אחד אחר.
              </Form.Text>
            </Form.Group>
            <Col className="btnSignIn">
              <Button variant="primary" type="submit" className="btn">
               איפוס
              </Button>
            </Col>
          </Form>
          <Col className="back">
          <Link to="/login">
          <FaUndo /> <span>חזור לעמוד ההתחברות</span> 
          </Link>
      </Col>
      </Col>
    </Row>
  </Container>
  )
}

export default withRouter(Reset)

