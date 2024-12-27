import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchVideos } from "../api/ytApi"; // Adjust the import path as needed
import { VideoResponse } from "../types";

const Header = ({ className }: { className: string }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<VideoResponse | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            const results = await searchVideos({
                query: query,
            });
            console.log(results); // Handle the search results as needed
            // navigate to Videos page with the search results ==== example: https://www.youtube.com/results?search_query=Lain%27s+Playlist+for+Walking+to+School
            navigate(`/videos?search_query=${query}`);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setSuggestions(null);
        }
    };

    useEffect(() => {
        if (suggestions) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [suggestions]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim()) {
                const results = await searchVideos({
                    query,
                });
                setSuggestions(results);
            } else {
                setSuggestions(null);
            }
        };

        const debounceFetch = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceFetch);
    }, [query]);

    return (
        <header
            className={classNames(
                className,
                `flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg`
            )}
        >
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                />
                <span className="text-lg font-semibold">MyTube</span>
            </Link>

            {/* Search Bar */}
            <form
                className="relative flex items-center w-full max-w-lg"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-600 rounded-l-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600 focus:outline-none"
                >
                    Search
                </button>
                {suggestions && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 w-full bg-white text-black rounded-lg shadow-lg mt-2 z-10 max-h-[200px] overflow-y-auto"
                    >
                        {suggestions.data.map((item) => (
                            <Link
                                key={item.videoId}
                                to={`/videos?search_query=${item.title}`}
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                )}
            </form>

            {/* User Section */}
            <div className="flex items-center space-x-4">
                <button
                    className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white focus:ring-2 focus:ring-blue-500"
                    aria-label="User Actions"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 19.232a4.5 4.5 0 01-6.464 0M9.757 6.257a4.5 4.5 0 016.486 0M12 14.5v.01"
                        />
                    </svg>
                </button>
                <span className="hidden md:block text-sm text-gray-400">
                    User Section
                </span>
            </div>
        </header>
    );
};

export default Header;
