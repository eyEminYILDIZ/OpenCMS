import Logo from './Logo';
import Breadcrumb from './Breadcrumb';
import UserBox from './UserBox';

const Navbar = () => (
  <nav className="navbar" aria-label="Application header">
    <Logo />
    <Breadcrumb />
    <UserBox />
  </nav>
);

export default Navbar;
