import { useNavigate } from "react-router-dom";
import { Short, Video } from "../types";

interface ShortCardProps {
    short: Short;
    video: Video;
}

const ShortCard: React.FC<ShortCardProps> = ({ short, video }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // transfer short, video data to ShortDetail page
        navigate(`/shorts/${short.videoId}`, {
            state: { short: short },
        });
    };

    return (
        <div
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
            onClick={handleClick}
        >
            <img
                src={short.thumbnail[0].url}
                alt={short.title}
                className="w-full h-96 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1">
                    {short.title}
                </h3>
                <p className="text-gray-600">{video.channelTitle}</p>
                <p className="text-gray-500 text-sm">
                    {short.viewCountText} views • {video.publishedTimeText}
                </p>
            </div>
        </div>
    );
};

export default ShortCard;
