import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const normalizeSavedVideo = (item) => ({
    _id: item.food._id,
    video: item.food.video,
    description: item.food.description,
    likeCount: Number(item.food.likeCount ?? item.food.likesCount ?? item.food.likes ?? 0),
    savesCount: Number(item.food.savesCount ?? item.food.bookmarks ?? item.food.saves ?? 0),
    commentsCount: Number(item.food.commentsCount ?? (Array.isArray(item.food.comments) ? item.food.comments.length : 0)),
    foodPartner: item.food.foodPartner,
    isSaved: true,
    isLiked: Boolean(item.food.isLiked ?? item.food.liked),
})

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = (response.data.savedFoods ?? []).map(normalizeSavedVideo)
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

            if (response.data.save) {
                setVideos((prev) => prev.map((v) => (
                    v._id === item._id
                        ? { ...v, isSaved: true, savesCount: Number(v.savesCount ?? 0) + 1 }
                        : v
                )))
                return
            }

            setVideos((prev) => prev.filter((v) => v._id !== item._id))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved
