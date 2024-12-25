import classNames from "classnames";
import { Link } from "react-router-dom";

const Sidebar = ({ className }: { className: string }) => (
    <nav
        className={classNames(
            className,
            `w-64 h-screen bg-gray-800 text-white p-4`
        )}
    >
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/shorts">Shorts</Link>
            </li>
            <li>
                <Link to="/trending">Trending</Link>
            </li>
        </ul>
    </nav>
);

export default Sidebar;
