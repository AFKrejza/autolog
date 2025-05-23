import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

//notification component
export function Notification({ show, msg, onClose }) {
  return (
    <div>
      <Row>
        <Col xs={6}>
          <ToastContainer
            position="top-end"
            className="p-3"
            style={{ zIndex: 1200 }} //sets it above modal, so it doesn't darken (modal default is ~1050)
          >
            <Toast onClose={onClose} show={show} delay={5000} autohide>
              <Toast.Header>
                <strong className="me-auto">Message</strong>
              </Toast.Header>
              <Toast.Body>{msg}</Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </div>
  );
}

//TODO: have a customizable header, like warning or error, and having it change color (warning yellow, red error, green success)
