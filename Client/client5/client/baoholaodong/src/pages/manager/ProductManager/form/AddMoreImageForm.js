import React, {useState} from "react";
import {compressImageToTargetSize, isImageSizeValid} from "../../../../utils/imageUtils";
const MAX_IMAGE_SIZE_MB = 0.5; // 2MB
const TARGET_IMAGE_SIZE_KB = 10; // 100KB
export default function  AddMoreImageForm ({ product, uploadImage, setProduct, close, setLoading })  {
    const [image, setImage] = useState({
        productId: product.id,
        description: "",
        isPrimary: false,
        file: null,
    });
    const [preview, setPreview] = useState(null);
    const [isSubmitting ,setIsSubmitting] = useState(false);
    // Xử lý khi người dùng chọn ảnh
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        // Kiểm tra kích thước ảnh trước khi xử lý
        if (!isImageSizeValid(selectedFile, MAX_IMAGE_SIZE_MB)) {
            alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
            return;
        }

        try {
            // Nén ảnh xuống dưới 500KB (nếu cần)
            const compressedFile = await compressImageToTargetSize(selectedFile, TARGET_IMAGE_SIZE_KB);
            setImage({ ...image, file: compressedFile });
            setPreview(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Lỗi khi nén ảnh:", error);
            alert("Không thể xử lý ảnh!");
        }
    };

    const clearImage = () => {
        setImage({
            productId: product.id,
            description: "",
            isPrimary: false,
            file: null,
        });
        setPreview(null);
    }

    // Xử lý khi nhập mô tả ảnh
    const handleDescriptionChange = (event) => {
        setImage({ ...image, description: event.target.value });
    };

    // Xử lý khi chọn ảnh chính (Primary)
    const handlePrimaryChange = (event) => {
        setImage({ ...image, isPrimary: event.target.checked });
    };

    // Gửi ảnh lên server
    const handleSubmit = async () => {
        if (!image.file) {
            alert("Vui lòng chọn ảnh trước khi lưu!");
            return;
        }

        try {
            setIsSubmitting(true);
            setLoading(true);
            const formData = new FormData();
            formData.append("productId", image.productId);
            formData.append("description", image.description);
            formData.append("isPrimary", image.isPrimary);
            formData.append("file", image.file); // Ảnh được gửi dưới dạng file
            var result = await uploadImage(formData); // Gửi form-data lên server
            if (result) {
                clearImage();
                setProduct(result);
                close();
            }
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            alert("Không thể tải ảnh lên. Vui lòng thử lại!");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    {/* Nhập mô tả ảnh */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ảnh</label>
                        <input
                            type="text"
                            value={image.description}
                            onChange={handleDescriptionChange}
                            placeholder="Nhập mô tả cho ảnh"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Checkbox chọn ảnh chính */}
                    <div className="mb-4">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={image.isPrimary}
                                    onChange={handlePrimaryChange}
                                    className="sr-only"
                                />
                                <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${image.isPrimary ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                                Đặt làm ảnh chính
                            </div>
                        </label>
                    </div>

                    {/* Input chọn ảnh */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ảnh</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-blue-600"><span className="font-semibold">Click để tải ảnh</span></p>
                                    <p className="text-xs text-blue-500">PNG, JPG, GIF (Max: {MAX_IMAGE_SIZE_MB}MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước</label>
                    <div className="flex-1 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="text-center p-6">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">Chưa có ảnh được chọn</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={clearImage}
                    className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
                    disabled={!preview}
                >
                    Xóa
                </button>
                <button
                    type="button"
                    onClick={close}
                    className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!image.file || isSubmitting}
                    className={`px-4 py-2 rounded-lg ${
                        image.file
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } transition-colors`}
                >
                    Lưu
                </button>
            </div>
        </div>
    );
};
