import { useEffect, useState, useRef } from "react";
import { fetchVideos } from "../api/ytApi";
import VideoCard from "../components/VideoCard";
import { Short, Video } from "../types";
import Sidebar from "../components/Sidebar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShortCard from "../components/ShortCard";

const CACHE_KEY_VIDEOS = "home_videos_cache";
const CACHE_KEY_TOKEN = "home_token_cache";

const Home = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Load cached data
    useEffect(() => {
        const cachedVideos = localStorage.getItem(CACHE_KEY_VIDEOS);
        const cachedToken = localStorage.getItem(CACHE_KEY_TOKEN);

        if (cachedVideos) {
            setVideos(JSON.parse(cachedVideos));
            setLoading(false);
        }
        if (cachedToken) {
            setToken(cachedToken);
        }
    }, []);

    const fetchVideosHomeFeed = async (nextToken: string | null = null) => {
        try {
            if (!nextToken && videos.length > 0) return;

            const data = await fetchVideos({ type: "home", token: nextToken });
            const newVideos = data.data.filter(
                (video) =>
                    video.type === "video" || video.type === "shorts_listing"
            );

            const updatedVideos = [
                ...videos,
                ...newVideos.filter(
                    (newVideo) =>
                        !videos.some(
                            (video) => video.videoId === newVideo.videoId
                        )
                ),
            ];

            setVideos(updatedVideos);
            setToken(data.continuation || null);
            setLoading(false);

            // Cache the updated data
            localStorage.setItem(
                CACHE_KEY_VIDEOS,
                JSON.stringify(updatedVideos)
            );
            localStorage.setItem(CACHE_KEY_TOKEN, data.continuation || "");
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        if (videos.length === 0) fetchVideosHomeFeed();
    }, [videos]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && token) {
                    setIsFetchingMore(true);
                    fetchVideosHomeFeed(token);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [token]);

    // React Slick settings
    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5, // Number of slides to show (adjust as needed)
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <>
            <Sidebar className="fixed top-16 left-0 bottom-0 z-10" />
            <div className="p-4 flex-1 ml-64">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {videos.map((video, index) => {
                            if (video.type === "shorts_listing" && video.data) {
                                // Render Shorts Slider
                                return (
                                    <div
                                        key={`shorts-${index}`}
                                        className="col-span-full mb-8"
                                    >
                                        <h2 className="text-xl font-bold mb-4">
                                            Shorts
                                        </h2>
                                        <Slider {...sliderSettings}>
                                            {video.data.map((short) => (
                                                <div
                                                    key={short.videoId}
                                                    className="p-2"
                                                >
                                                    {/* Render each short */}
                                                    <ShortCard
                                                        short={short as Short}
                                                        video={video as Video}
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                );
                            } else {
                                // Render Regular Video
                                return (
                                    <VideoCard
                                        key={video.videoId}
                                        video={video}
                                    />
                                );
                            }
                        })}
                    </div>
                )}
                {/* Load More Trigger */}
                <div
                    ref={loadMoreRef}
                    className="text-center py-4 text-gray-500"
                >
                    {isFetchingMore && <p>Loading more...</p>}
                </div>
            </div>
        </>
    );
};

export default Home;
