

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import noImage from "../../images/no-image-product.jpg"

import axios from "axios"


export default function FeedBack() {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [reviewText, setReviewText] = useState("")
    const [reviews, setReviews] = useState([]);
    const { slug } = useParams()
    const [product, setProduct] = useState({
        id: 0,
        name: "",
        image: noImage,
    })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Product/get-product-by-slug-for-page-detail/${slug}`)
                setProduct(response.data.product)
                setReviews(response.data.review.productReviews)
            } catch (err) {
                // Fix error handling with proper type checking
                if (err.response && err.response.status === 404) {
                    setTimeout(() => {
                        navigate("/404");
                    }, 100);
                }
            }
        }
        if(slug){
            fetchData()
        }
    }, [slug, navigate])


    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle review submission logic here
        alert("Cảm ơn bạn đã gửi đánh giá!")
        setRating(0)
        setReviewText()

    }

    // Format price with Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div className="container space-x-6 mx-auto py-8 px-4 ">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                        <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name || "Product image"}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="flex items-center mt-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= (product.rating || 4) ? "fill-primary text-primary" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">({product.reviewCount || 28} đánh giá)</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold">{product.price ? formatPrice(product.price) : "499.000₫"}</p>
                </div>

                <div>
                    {/* Card replacement */}
                    <div className="bg-white rounded-lg border shadow-sm">
                        {/* Card Header */}
                        <div className="p-6 pb-4">
                            <h3 className="text-lg font-semibold">Đánh giá sản phẩm</h3>
                            <p className="text-sm text-gray-500">Chia sẻ trải nghiệm của bạn với sản phẩm này</p>
                        </div>
                        {/* Card Content */}
                        <div className="p-6 pt-0">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Xếp hạng của bạn</label>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-8 h-8 cursor-pointer ${
                                                    star <= (hover || rating) ? "fill-primary text-primary" : "text-gray-300"
                                                }`}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="review" className="block text-sm font-medium mb-2">
                                        Nhận xét của bạn
                                    </label>
                                    <textarea
                                        id="review"
                                        placeholder="Chia sẻ suy nghĩ của bạn về sản phẩm này..."
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full min-h-[80px] resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={rating === 0 || !reviewText.trim()}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Gửi đánh giá
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h2>
                        <div className="space-y-6">
                            {reviews.map(({reviewId,rating,comment,createdAt,customerName}, index) => (
                                <div key={index} className="pb-6">
                                    <div className="flex items-start">
                                        {/* Avatar replacement */}
                                        <div className="h-10 w-10 mr-3 overflow-hidden rounded-full">
                                            <img
                                                src={  "/placeholder.svg"}
                                                alt={customerName}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.currentTarget
                                                    target.onerror = null
                                                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" fill="#f1f5f9"/><text x="50%" y="50%" fontFamily="Arial" fontSize="20" fill="#94a3b8" dominantBaseline="middle" textAnchor="middle">${customerName.charAt(0)}</text></svg>`
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium">{customerName}</h3>
                                                <span className="text-sm text-gray-500">{createdAt.toString()}</span>
                                            </div>
                                            <div className="flex mt-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${
                                                            star <= rating ? "fill-primary text-primary" : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm">{comment}</p>
                                        </div>
                                    </div>
                                    {/* Separator replacement */}
                                    {index < reviews.length - 1 && <div className="h-px w-full bg-gray-200 mt-6"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

