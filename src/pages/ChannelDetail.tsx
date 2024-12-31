import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchChannelDetails,
    fetchChannelVideos,
    fetchChannelShorts,
} from "../api/ytApi";
import { Meta, Short, Video } from "../types";
import VideoCard from "../components/VideoCard";
import ShortCard from "../components/ShortCard";

const ChannelDetail: React.FC = () => {
    const { channelId } = useParams();
    const [channelMeta, setChannelMeta] = useState<Meta | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [shorts, setShorts] = useState<Short[]>([]);
    const [videoToken, setVideoToken] = useState<string | null>(null);
    const [shortsToken, setShortsToken] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"videos" | "shorts">("videos");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (channelId) {
            fetchChannelMeta();
            if (activeTab === "videos") fetchChannelVideosList();
            if (activeTab === "shorts") fetchChannelShortsList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId, activeTab]);

    const fetchChannelMeta = async () => {
        try {
            const data = await fetchChannelDetails({ id: channelId! });
            setChannelMeta(data.meta);
        } catch (error) {
            console.error("Error fetching channel details:", error);
        }
    };

    const fetchChannelVideosList = async (token: string | null = null) => {
        try {
            setLoading(true);
            const data = await fetchChannelVideos({
                id: channelId!,
                token: token as string,
            });
            setVideos((prev) => [...prev, ...(data.data as Video[])]);
            setVideoToken(data.continuation || null);
        } catch (error) {
            console.error("Error fetching channel videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChannelShortsList = async (token: string | null = null) => {
        try {
            setLoading(true);
            const data = await fetchChannelShorts({
                id: channelId!,
                token: token as string,
            });
            setShorts((prev) => [...prev, ...(data.data as Short[])]);
            setShortsToken(data.continuation || null);
        } catch (error) {
            console.error("Error fetching channel shorts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Channel Meta */}
            {channelMeta && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={channelMeta.avatar[0]?.url}
                            alt={channelMeta.title}
                            className="h-20 w-20 rounded-full"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">
                                {channelMeta.title}
                            </h1>
                            <p className="text-gray-500">
                                {channelMeta.subscriberCountText}
                            </p>
                            <p className="text-sm text-gray-400">
                                {channelMeta.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "videos"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setActiveTab("videos")}
                >
                    Videos
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "shorts"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setActiveTab("shorts")}
                >
                    Shorts
                </button>
            </div>

            {/* Videos Tab */}
            {activeTab === "videos" && (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videos.map((video) => (
                            <VideoCard key={video.videoId} video={video} />
                        ))}
                    </div>
                    {loading && (
                        <p className="text-center text-gray-500">
                            Loading videos...
                        </p>
                    )}
                    {videoToken && (
                        <div className="text-center mt-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={() =>
                                    fetchChannelVideosList(videoToken)
                                }
                            >
                                Load More
                            </button>
                        </div>
                    )}
                    {!videoToken && videos.length > 0 && (
                        <p className="text-center text-gray-500 mt-4">
                            No more videos to load.
                        </p>
                    )}
                </div>
            )}

            {/* Shorts Tab */}
            {activeTab === "shorts" && (
                <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {shorts.map((short) => (
                            <ShortCard
                                key={short.videoId}
                                short={short as Short}
                                video={null}
                            />
                        ))}
                    </div>
                    {loading && (
                        <p className="text-center text-gray-500">
                            Loading shorts...
                        </p>
                    )}
                    {shortsToken && (
                        <div className="text-center mt-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={() =>
                                    fetchChannelShortsList(shortsToken)
                                }
                            >
                                Load More
                            </button>
                        </div>
                    )}
                    {!shortsToken && shorts.length > 0 && (
                        <p className="text-center text-gray-500 mt-4">
                            No more shorts to load.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChannelDetail;
