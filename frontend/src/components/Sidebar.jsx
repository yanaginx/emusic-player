import { Nav } from "react-bootstrap";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <Nav
        className="col-md-12 d-none d-md-block bg-light sidebar"
        // onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>
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
