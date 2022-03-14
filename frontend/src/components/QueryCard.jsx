import { Remove } from "@material-ui/icons";
import { Badge, Button } from "react-bootstrap";

function QueryCard({ query }) {
  return <Badge bg="info"> {query} </Badge>;
}

export default QueryCard;
