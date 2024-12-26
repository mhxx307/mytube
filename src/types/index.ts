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

export interface ShortInfo extends Short {
    channelId: string;
    publishedTimeText: string;
    channelHandle: string;
    channelThumbnail: Thumbnail[];
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

export interface ShortResponse {
    continuation: string | null;
    data: ShortInfo[];
    msg: string;
    token?: string; // Pagination token for fetching the next set of results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // To allow any additional fields from the API response
}

export interface TitleWithNavDetail {
    text: string;
    url?: string;
    bold?: boolean;
}

export interface ChannelNavDetail {
    params: string;
}

export interface SoundAttribution {
    thumbnail: Thumbnail[];
    url: string;
    params: string;
}

export interface DescriptionWithNavDetail {
    text: string;
    url?: string;
}

export interface ShortDetail {
    videoId: string;
    likeStatus: string;
    likeCount: number;
    likeCountText: string;
    likesAllowed: boolean;
    title: string;
    titleWithNavDetails: TitleWithNavDetail[];
    publishedTimeText: string;
    channelId: string;
    channelHandle: string;
    channelNavDetails: ChannelNavDetail;
    channelThumbnail: Thumbnail[];
    commentCount: string;
    soundAttribution: SoundAttribution;
    channelTitle: string;
    viewCount: string;
    publishDate: string;
    description: string;
    descriptionWithNavDetails: DescriptionWithNavDetail[];
}
