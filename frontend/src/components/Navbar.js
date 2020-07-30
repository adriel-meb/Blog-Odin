import React, {useState} from "react";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarText
} from 'reactstrap';



function NavbarComponent() {
 
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md" className="Navbar">
        <NavbarBrand Link to="/">My Tech Blog</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about">About</NavLink>
            </NavItem>
          </Nav>
          <NavbarText><a href='/'>Admin login</a></NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavbarComponent;
