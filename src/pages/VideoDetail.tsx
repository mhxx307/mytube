import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Video } from "../types";
import { fetchVideos } from "../api/ytApi";
import VideoCard from "../components/VideoCard";
import { formatViewCount } from "../utils";

const VideoDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const video = location.state?.video as Video;

    const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (relatedVideos.length === 0) {
            fetchRelatedVideos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relatedVideos]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextToken) {
                    fetchRelatedVideos(nextToken);
                }
            },
            { threshold: 1.0 }
        );

        const currentRef = loadMoreRef.current;
        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextToken]);

    if (!video) {
        navigate("/");
        return null;
    }

    const fetchRelatedVideos = async (token: string | null = null) => {
        try {
            setLoading(true);
            const data = await fetchVideos({
                type: "related",
                token,
                geo: "US",
                lang: "en",
                id: video.videoId,
            });
            const filteredVideos = data.data.filter(
                (relatedVideo) => relatedVideo.type === "video"
            );
            setRelatedVideos((prev) => {
                const newVideos = filteredVideos.filter(
                    (newVideo) =>
                        !prev.some(
                            (existingVideo) =>
                                existingVideo.videoId === newVideo.videoId
                        )
                );
                return [...prev, ...newVideos];
            });
            setNextToken(data.continuation || null);
        } catch (error) {
            console.error("Error fetching related videos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                {/* Main Video Section */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-lg sticky top-4">
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${video.videoId}`}
                            controls
                            width="100%"
                            height="480px"
                        />
                        <div className="p-4">
                            <div className="flex justify-between gap-4 mb-4">
                                <h1 className="text-2xl font-bold mb-2">
                                    {video.title}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {video.publishedTimeText}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-4 mb-4"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/channel/${video.channelId}`);
                                }}
                            >
                                <img
                                    src={video.channelThumbnail[0].url}
                                    alt={video.channelTitle}
                                    className="h-10 w-10 rounded-full"
                                />
                                <h3 className="text-lg text-black font-bold">
                                    {video.channelTitle}
                                </h3>
                            </button>
                            <p className="text-sm text-gray-500 mb-4">
                                {formatViewCount(
                                    Number.parseInt(video.viewCount)
                                )}{" "}
                                views
                            </p>
                            <p className="text-gray-700">{video.description}</p>
                        </div>
                    </div>
                </div>

                {/* Related Videos Section */}
                <div className="lg:w-1/3">
                    <h2 className="text-xl font-bold mb-4">Related Videos</h2>
                    <div className="overflow-y-auto h-screen lg:max-h-[calc(100vh-32px)] pr-2">
                        {relatedVideos.map((relatedVideo) => (
                            <VideoCard
                                key={relatedVideo.videoId}
                                video={relatedVideo}
                            />
                        ))}
                        {loading && (
                            <p className="text-gray-500">
                                Loading related videos...
                            </p>
                        )}
                        <div ref={loadMoreRef}></div>
                        {!nextToken && !loading && relatedVideos.length > 0 && (
                            <p className="text-gray-500 text-center py-4">
                                No more related videos.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetail;
