import { Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <Link to="/my-playlist">My Playlist</Link>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/api/auth/logout">Logout</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default Sidebar;
