import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Short, ShortDetail as ShortDetailType } from "../types";
import { fetchShortDetails, fetchShorts } from "../api/ytApi";

const ShortDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [shortDetail, setShortDetail] = useState<ShortDetailType | null>(
        null
    );
    const [showDetail, setShowDetail] = useState<boolean>(false);
    // const [shorts, setShorts] = useState<Short[]>([]);

    const short = location.state?.short as Short;

    useEffect(() => {
        if (!short) {
            navigate("/");
        }
        // Fetch shorts list
        fetchShorts(short.sequenceParams).then((data) => {
            console.log("Shorts fetched:", data);
            // setShorts(data.data);
        });
    }, [short, navigate]);

    useEffect(() => {
        if (!short) return;

        // Fetch short detail
        fetchShortDetails(short.videoId).then((data) => {
            console.log("Short detail fetched:", data);
            setShortDetail(data);
        });
    }, [short]);

    if (!short) {
        navigate("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center">
            {/* Main Content */}
            <div className="w-full max-w-[900px] flex">
                {/* Video Player */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="h-screen flex flex-col items-center justify-center">
                        {/* Short Video */}
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${short.videoId}`}
                            playing
                            controls
                            width="100%"
                            height="100%"
                            className="max-h-[60%]"
                        />
                        {/* Toggle Details Button */}
                        <button
                            className="mt-2 p-2 bg-gray-700 rounded"
                            onClick={() => setShowDetail(!showDetail)}
                        >
                            {showDetail ? "Hide Details" : "Show Details"}
                        </button>
                        {/* Short Details */}
                        {showDetail && (
                            <div className="p-4">
                                <h1 className="text-lg font-bold">
                                    {short.title}
                                </h1>
                                <p className="text-sm text-gray-400">
                                    {shortDetail?.viewCount} views •{" "}
                                    {shortDetail?.publishedTimeText}
                                </p>
                                <p className="mt-2">
                                    {shortDetail?.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shorts List*/}
                {/* <div className="w-[300px] h-screen overflow-y-auto bg-gray-800 p-4"></div> */}
            </div>
        </div>
    );
};

export default ShortDetail;
