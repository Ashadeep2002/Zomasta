import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const normalizeVideo = (item) => ({
    ...item,
    likeCount: Number(item.likeCount ?? item.likesCount ?? item.likes ?? 0),
    savesCount: Number(item.savesCount ?? item.bookmarks ?? item.saves ?? 0),
    commentsCount: Number(item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)),
    isLiked: Boolean(item.isLiked ?? item.liked),
    isSaved: Boolean(item.isSaved ?? item.saved),
})

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos((response.data.foodItems ?? []).map(normalizeVideo))
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})
            const isLiked = Boolean(response.data.like)

            setVideos((prev) => prev.map((v) => {
                if (v._id !== item._id) return v
                const currentLikes = Number(v.likeCount ?? 0)

                return {
                    ...v,
                    isLiked,
                    likeCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
                }
            }))
        } catch {
            // noop
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            const isSaved = Boolean(response.data.save)

            setVideos((prev) => prev.map((v) => {
                if (v._id !== item._id) return v
                const currentSaves = Number(v.savesCount ?? 0)

                return {
                    ...v,
                    isSaved,
                    savesCount: isSaved ? currentSaves + 1 : Math.max(0, currentSaves - 1),
                }
            }))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home
