import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "../api/ytApi"; // Adjust the import path as needed
import { SearchParams, Video } from "../types";
import VideoCard from "../components/VideoCard";

const Videos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search_query");
    const [token, setToken] = useState<string | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fetchVideos = async (nextToken?: string) => {
        if (!query || isFetchingMore) return; // Avoid multiple requests at once
        setIsFetchingMore(true);

        try {
            const params: SearchParams = {
                query: query,
                token: nextToken,
            };
            const results = await searchVideos(params);
            setVideos((prevVideos) => [...prevVideos, ...results.data]);
            setToken(results.continuation || null);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        // Fetch initial videos on mount
        setVideos([]); // Clear previous results if the query changes
        fetchVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && token && !isFetchingMore) {
                    fetchVideos(token);
                }
            },
            { threshold: 1.0 }
        );

        const currentRef = loadMoreRef.current;
        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, isFetchingMore]);

    return (
        <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-xl font-semibold mb-4">
                Search Results for "{query}"
            </h1>
            <div className="w-full max-w-2xl space-y-4">
                {videos.map((video) => (
                    <VideoCard key={video.videoId} video={video} />
                ))}
            </div>
            {/* Load More Trigger */}
            {token && (
                <div
                    ref={loadMoreRef}
                    className="text-center py-4 text-gray-500"
                >
                    {isFetchingMore ? (
                        <p>Loading more...</p>
                    ) : (
                        <p>Scroll down to load more</p>
                    )}
                </div>
            )}
            {!token && videos.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                    <p>No more results</p>
                </div>
            )}
        </div>
    );
};

export default Videos;
