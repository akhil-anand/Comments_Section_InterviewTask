import CustomWidget from "./components/CustomWidget";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Shared/common.css";
import { Container } from "react-bootstrap";

export default function App() {
  return (
    <div className="App">
      <Container className="d-flex justify-content-center">
        <CustomWidget />
      </Container>
    </div>
  );
}
