import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function AppNavbar() {
    return (
      <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
          <Navbar.Brand href="/">Accounts-Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/plant">Plant</Nav.Link>
              {/* <Nav.Link href="/site">Site</Nav.Link> */}
              <Nav.Link href="/report">Report</Nav.Link>
            </Nav>
          </Navbar.Collapse>
      </Navbar>
    );
  }
  
  export default AppNavbar;