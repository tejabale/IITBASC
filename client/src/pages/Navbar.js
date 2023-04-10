import { Link, useMatch, useResolvedPath } from "react-router-dom"
import '../styles/navbar.css'

export default function Navbar() {
  return (
    <body6 id="navbar">
    <nav className="nav">
      <Link to="/home" className="site-title">
        IITB ASC
      </Link>
      <ul>
        <CustomLink to="/home/registration"><h2 className="side_title">Register</h2></CustomLink>
        <CustomLink to="/course/running"><h2 className="side_title">Running Courses</h2></CustomLink>
        <CustomLink to="/logout"><h2 className="side_title_logout">Logout</h2></CustomLink>
      </ul>
    </nav>
    </body6>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}