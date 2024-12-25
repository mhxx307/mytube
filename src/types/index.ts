export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Short {
    type: string;
    videoId: string;
    title: string;
    viewCountText: string;
    thumbnail: Thumbnail[];
    isOriginalAspectRatio: boolean;
    params: string;
    playerParams: string;
    sequenceParams: string;
}

export interface Video {
    type: string;
    videoId: string;
    title: string;
    channelTitle: string;
    channelId: string;
    channelThumbnail: Thumbnail[];
    description: string;
    viewCount: string;
    publishedTimeText: string;
    lengthText: string;
    thumbnail: Thumbnail[];
    richThumbnail: Thumbnail[];
    data: Short[] | Video[] | null;
}

export interface Filter {
    filter: string;
    continuation: string | null;
}

export interface VideoResponse {
    continuation: string | null;
    estimatedResults: string | null;
    data: Video[];
    filters: Filter[] | null;
    refinements: string[] | null;
    msg: string;
    token?: string; // Pagination token for fetching the next set of results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // To allow any additional fields from the API response
}
