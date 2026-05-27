import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/DropdownMenu";

const UserBox = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="userbox navbar-userbox userbox-trigger">
        <div className="userbox-avatar" aria-hidden="true">AU</div>
        <span>Admin User</span>
        <span className="userbox-caret" aria-hidden="true">▾</span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <a href="#info" className="dropdown-item-link">User Info</a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="#logout" className="dropdown-item-link">Logout</a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default UserBox;
