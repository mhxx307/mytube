// format view count to k, m, b
export const formatViewCount = (viewCount: number): string => {
    if (viewCount < 1000) {
        return viewCount.toString();
    }
    if (viewCount < 1000000) {
        return `${(viewCount / 1000).toFixed(1)}k`;
    }
    if (viewCount < 1000000000) {
        return `${(viewCount / 1000000).toFixed(1)}m`;
    }
    return `${(viewCount / 1000000000).toFixed(1)}b`;
};
