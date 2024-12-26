// src/components/VideoCard.tsx
import { useNavigate } from "react-router-dom";
import { Video } from "../types/index"; // Assuming the types are in src/types.ts

interface VideoCardProps {
    video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/video/${video.videoId}`, { state: { video } });
    };

    return (
        <div
            className="bg-white rounded-lg shadow-lg cursor-pointer"
            onClick={handleClick}
        >
            {video.thumbnail && (
                <img
                    src={video.thumbnail[0].url}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            )}
            <div className="p-4">
                <h2 className="text-lg font-bold line-clamp-2">
                    {video.title}
                </h2>
                <p className="text-sm text-gray-500">{video.channelTitle}</p>
                <p className="text-sm text-gray-500">{video.viewCount}</p>
            </div>
        </div>
    );
};

export default VideoCard;
