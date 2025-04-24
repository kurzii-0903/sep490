"use client"
import { motion } from "framer-motion"
import { AlertTriangle, Ban, Server, Home, RefreshCw, ArrowLeft } from "lucide-react"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const pulse = {
    scale: [1, 1.05, 1],
    transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
    },
}

const float = {
    y: [0, -10, 0],
    transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
    },
}

const ErrorLayout = ({
                         code,
                         title,
                         message,
                         icon: Icon,
                         color,
                         showHomeButton = true,
                         showRefreshButton = false,
                         showBackButton = false,
                     }) => {
    return (
        // Luôn sử dụng nền sáng, bỏ qua dark mode
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
            <motion.div className="max-w-md w-full" initial="hidden" animate="visible" variants={staggerContainer}>
                <div className="text-center">
                    <motion.div className="inline-block mb-8" animate={float}>
                        <div className={`p-4 rounded-full bg-${color}-100`}>
                            <Icon className={`w-16 h-16 text-${color}-500`} />
                        </div>
                    </motion.div>

                    <motion.div className="relative mb-6" variants={fadeIn}>
                        <motion.h1 className={`text-8xl font-extrabold text-${color}-500 tracking-tighter`} animate={pulse}>
                            {code}
                        </motion.h1>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-50 opacity-60 pointer-events-none" />
                    </motion.div>

                    <motion.h2 className="text-3xl font-bold text-gray-800 mb-3" variants={fadeIn}>
                        {title}
                    </motion.h2>

                    <motion.p className="text-gray-600 mb-8 max-w-sm mx-auto" variants={fadeIn}>
                        {message}
                    </motion.p>

                    <motion.div className="flex flex-wrap gap-3 justify-center" variants={fadeIn}>
                        {showHomeButton && (
                            <motion.a
                                href="/"
                                className={`px-6 py-3 bg-${color}-500 hover:bg-${color}-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="w-4 h-4" />
                                Quay lại trang chủ
                            </motion.a>
                        )}

                        {showRefreshButton && (
                            <motion.button
                                onClick={() => window.location.reload()}
                                className={`px-6 py-3 bg-white border border-${color}-200 hover:bg-${color}-50 text-${color}-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Tải lại trang
                            </motion.button>
                        )}

                        {showBackButton && (
                            <motion.button
                                onClick={() => window.history.back()}
                                className={`px-6 py-3 bg-white border border-${color}-200 hover:bg-${color}-50 text-${color}-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại
                            </motion.button>
                        )}
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className={`absolute top-20 left-10 w-20 h-20 rounded-full bg-${color}-200 opacity-60`} />
                    <div className={`absolute bottom-20 right-10 w-32 h-32 rounded-full bg-${color}-200 opacity-60`} />
                    <div className={`absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-${color}-200 opacity-40`} />
                </div>
            </motion.div>
        </div>
    )
}

export const Error403 = () => {
    return (
        <ErrorLayout
            code="403"
            title="Truy cập bị từ chối"
            message="Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi."
            icon={Ban}
            color="red"
            showHomeButton={true}
            showBackButton={true}
        />
    )
}

export const Error503 = () => {
    return (
        <ErrorLayout
            code="503"
            title="Dịch vụ không khả dụng"
            message="Máy chủ đang bảo trì hoặc quá tải. Vui lòng thử lại sau ít phút. Chúng tôi đang nỗ lực khắc phục sự cố này."
            icon={Server}
            color="yellow"
            showHomeButton={true}
            showRefreshButton={true}
        />
    )
}

export const Error404 = () => {
    return (
        <ErrorLayout
            code="404"
            title="Không tìm thấy trang"
            message="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại URL hoặc quay lại trang chủ."
            icon={AlertTriangle}
            color="blue"
            showHomeButton={true}
            showBackButton={true}
        />
    )
}

// Bonus: Generic error page
export const ErrorGeneric = () => {
    return (
        <ErrorLayout
            code="Oops!"
            title="Đã xảy ra lỗi"
            message="Đã có lỗi không mong muốn xảy ra. Vui lòng thử tải lại trang hoặc quay lại sau."
            icon={AlertTriangle}
            color="gray"
            showHomeButton={true}
            showRefreshButton={true}
            showBackButton={true}
        />
    )
}

