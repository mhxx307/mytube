import axios from "axios";
import { VideoResponse } from "../types";

const BASE_URL = "https://yt-api.p.rapidapi.com";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "X-RapidAPI-Key": "1f38b8ed59mshaee3e67dd81e967p1a8795jsne747106aa251", // Add your RapidAPI key here
        "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
    },
});

interface FetchVideosParams {
    type: string;
    token: string | null;
    geo?: string;
    lang?: string;
    id?: string;
}

export const fetchVideos = async ({
    type,
    token,
    geo = "US",
    lang = "en",
    id,
}: FetchVideosParams): Promise<VideoResponse> => {
    try {
        const { data } = await apiClient.get(`/${type}`, {
            params: {
                token,
                geo,
                lang,
                id,
            },
        });
        return data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw new Error("Failed to fetch videos");
    }
};

export const searchVideos = async (query: string) => {
    const { data } = await apiClient.get("/search", { params: { q: query } });
    return data;
};

export const fetchVideoDetails = async (id: string) => {
    const { data } = await apiClient.get(`/video/${id}`);
    return data;
};

export const fetchChannelDetails = async (channelId: string) => {
    const { data } = await apiClient.get(`/channel/${channelId}`);
    return data;
};
