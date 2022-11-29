import { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Navbar = () => {
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(undefined);
    router.push("/login", undefined, { shallow: true });
  };
  return (
    <div>
      <ul className="nav d-flex bg-dark justify-content-between">
        <li className="nav-item">
          <Link shallow className="nav-link logo active" href="/">
            MERN
          </Link>
        </li>
        {state?.token !== undefined ? (
          <>
            <a
              className="nav-link btn dropdown-toggle text-light"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {state && state.user && state.user.name}
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link
                  className={`nav-link dropdown-item 
                    `}
                  href="/user/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a onClick={logout} className="nav-link cursor-pointer ">
                  Logout
                </a>
              </li>
            </ul>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link shallow className="nav-link" href="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link shallow className="nav-link" href="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
