import React, { useEffect, useState } from "react";
import { fetchComments } from "../api/ytApi";
import { Comment, CommentParams } from "../types";

interface CommentsProps {
    id: string; // Video or Short ID
    sortBy?: "newest" | "top";
    geo?: string;
    lang?: string;
}

const Comments: React.FC<CommentsProps> = ({
    id,
    sortBy = "top",
    geo,
    lang,
}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsCount, setCommentsCount] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [replies, setReplies] = useState<Record<string, Comment[]>>({});
    const [loadingReplies, setLoadingReplies] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        fetchInitialComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, sortBy]);

    const fetchInitialComments = async () => {
        setComments([]);
        setToken(null);
        await fetchMoreComments();
    };

    const fetchMoreComments = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: CommentParams = {
                id,
                token: token as string,
                sort_by: sortBy,
                geo,
                lang,
            };

            const data = await fetchComments(params);

            // Use a Set to ensure unique comments
            const existingIds = new Set(
                comments.map((comment) => comment.commentId)
            );
            const newComments = data.data.filter(
                (comment) => !existingIds.has(comment.commentId)
            );

            setComments((prev) => [...prev, ...newComments]);
            setToken(data.continuation || null);

            if (!commentsCount) {
                setCommentsCount(data.commentsCount);
            }
        } catch (err) {
            setError(`Failed to load comments. Please try again later. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async (replyToken: string, commentId: string) => {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
        try {
            const params: CommentParams = { id, token: replyToken, geo, lang };
            const data = await fetchComments(params);
            setReplies((prev) => ({ ...prev, [commentId]: data.data }));
        } catch (err) {
            console.error("Failed to load replies:", err);
        } finally {
            setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
        }
    };

    const toggleReplies = async (replyToken: string, commentId: string) => {
        if (replies[commentId]) {
            setReplies((prev) => {
                const updatedReplies = { ...prev };
                delete updatedReplies[commentId];
                return updatedReplies;
            });
        } else {
            await fetchReplies(replyToken, commentId);
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
                Comments {commentsCount && `(${commentsCount})`}
            </h2>

            {comments.length === 0 && !loading && !error && (
                <p className="text-gray-500 text-center">
                    No comments available.
                </p>
            )}

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment.commentId} className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <img
                                src={comment.authorThumbnail[0]?.url}
                                alt={comment.authorText}
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <p className="font-bold text-sm">
                                    {comment.authorText}
                                    {comment.isVerified && (
                                        <span className="ml-2 text-blue-500">
                                            ✔
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {comment.publishedTimeText}
                                </p>
                                <p className="text-gray-800 text-sm mt-1">
                                    {comment.textDisplay}
                                </p>
                                <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                                    <span>👍 {comment.likesCount}</span>
                                    {parseInt(comment.replyCount) > 0 &&
                                        comment.replyToken && (
                                            <button
                                                onClick={() =>
                                                    toggleReplies(
                                                        comment.replyToken,
                                                        comment.commentId
                                                    )
                                                }
                                                className="text-blue-500"
                                            >
                                                {replies[comment.commentId]
                                                    ? "Hide Replies"
                                                    : `View ${comment.replyCount} replies`}
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                        {loadingReplies[comment.commentId] && (
                            <p className="ml-12 text-gray-500 text-sm">
                                Loading replies...
                            </p>
                        )}
                        {replies[comment.commentId] && (
                            <ul className="ml-12 space-y-2">
                                {replies[comment.commentId].map((reply) => (
                                    <li
                                        key={reply.commentId}
                                        className="flex items-start gap-4"
                                    >
                                        <img
                                            src={reply.authorThumbnail[0]?.url}
                                            alt={reply.authorText}
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <div>
                                            <p className="font-bold text-sm">
                                                {reply.authorText}
                                                {reply.isVerified && (
                                                    <span className="ml-2 text-blue-500">
                                                        ✔
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {reply.publishedTimeText}
                                            </p>
                                            <p className="text-gray-800 text-sm mt-1">
                                                {reply.textDisplay}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            {loading && (
                <p className="text-center text-gray-500 mt-4">
                    Loading comments...
                </p>
            )}

            {token && !loading && (
                <div className="text-center mt-4">
                    <button
                        onClick={fetchMoreComments}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Load More
                    </button>
                </div>
            )}

            {!token && comments.length > 0 && (
                <p className="text-center text-gray-500 mt-4">
                    No more comments to load.
                </p>
            )}
        </div>
    );
};

export default Comments;
