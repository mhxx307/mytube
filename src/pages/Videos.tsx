import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "../api/ytApi"; // Adjust the import path as needed
import { Video } from "../types";
import VideoCard from "../components/VideoCard";

const Videos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search_query");

    console.log(query);
    console.log(videos);

    useEffect(() => {
        const fetchVideos = async () => {
            if (query) {
                const results = await searchVideos(query);
                setVideos(results.data);
            }
        };

        fetchVideos();
    }, [query]);

    return (
        <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-xl font-semibold mb-4">
                Search Results for "{query}"
            </h1>
            <div className="w-full max-w-2xl space-y-4 h-96">
                {videos.length > 0 &&
                    videos.map((video) => (
                        <VideoCard key={video.videoId} video={video} />
                    ))}
            </div>
        </div>
    );
};

export default Videos;
