import classNames from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ className }: { className: string }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Perform search
    };

    return (
        <header
            className={classNames(
                className,
                `flex items-center justify-between p-4 bg-gray-900 text-white`
            )}
        >
            <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-8" />
            </Link>
            <form
                className="flex items-center space-x-2"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    className="form-input rounded-lg"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="bg-red-500 p-2 rounded-lg">
                    Search
                </button>
            </form>
            <div>Optional User Section</div>
        </header>
    );
};

export default Header;
