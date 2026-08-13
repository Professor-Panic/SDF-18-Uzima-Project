import { Link, NavLink } from "react-router-dom";
function Header() {
  return (
    <>
    <div>
      <h2>Uzima Wellness</h2>
    </div>
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/map">Map</NavLink>
      <NavLink to="/appointments">Appointments</NavLink>
    </nav>
    </>
  );
}
export default Header;