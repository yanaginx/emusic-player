import { Remove } from "@material-ui/icons";
import { Badge, Button } from "react-bootstrap";

function QueryCard({ name }) {
  return <Badge bg="info"> {name} </Badge>;
}

export default QueryCard;
