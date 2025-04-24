import React, { useState } from "react";
import { compressImageToTargetSize, isImageSizeValid } from "../../../../utils/imageUtils";
import { Trash2 } from "lucide-react";
const MAX_IMAGE_SIZE_MB = 0.5;
const TARGET_IMAGE_SIZE_KB = 10;

export default function UpdateImageForm({ image, onUpdateImage, onSetProduct, close, onDelete, setLoading, showToast }) {
    const [preview, setPreview] = useState(image.image || null);
    const [newImage, setNewImage] = useState({
        productImageId: image.id,
        description: image.description,
        isPrimary: image.isPrimary,
        file: null,
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isImageSizeValid(file, MAX_IMAGE_SIZE_MB)) {
            alert("Ảnh vượt quá 0.5MB! Hệ thống sẽ tự động nén ảnh...");
            try {
                const compressedFile = await compressImageToTargetSize(file, TARGET_IMAGE_SIZE_KB);
                setPreview(URL.createObjectURL(compressedFile));
                setNewImage((prev) => ({ ...prev, file: compressedFile }));
            } catch (error) {
                console.error("Lỗi khi nén ảnh:", error);
                alert("Không thể nén ảnh, vui lòng chọn ảnh khác.");
            }
        } else {
            setPreview(URL.createObjectURL(file));
            setNewImage((prev) => ({ ...prev, file }));
        }
    };

    const handleDescriptionChange = (e) => {
        setNewImage((prev) => ({ ...prev, description: e.target.value }));
    };

    const handlePrimaryChange = () => {
        setNewImage((prev) => ({ ...prev, isPrimary: !prev.isPrimary }));
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (!isImageSizeValid(file, MAX_IMAGE_SIZE_MB)) {
            alert("Ảnh vượt quá 0.5MB! Hệ thống sẽ tự động nén ảnh...");
            try {
                const compressedFile = await compressImageToTargetSize(file, TARGET_IMAGE_SIZE_KB);
                setPreview(URL.createObjectURL(compressedFile));
                setNewImage((prev) => ({ ...prev, file: compressedFile }));
            } catch (error) {
                console.error("Lỗi khi nén ảnh:", error);
                alert("Không thể nén ảnh, vui lòng chọn ảnh khác.");
            }
        } else {
            setPreview(URL.createObjectURL(file));
            setNewImage((prev) => ({ ...prev, file }));
        }
    };

    const handleSubmit = async () => {
        if (!newImage.file) {
            alert("Vui lòng chọn ảnh mới!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("productImageId", newImage.productImageId);
        formData.append("description", newImage.description);
        formData.append("isPrimary", newImage.isPrimary);
        formData.append("file", newImage.file);

        try {
            var result = await onUpdateImage(formData);
            if (result) {
                onSetProduct(result);
                showToast("Cập nhật ảnh sản phẩm thành công!", "success");
                close();
            } else {
                showToast("Cập nhật ảnh thất bại!", "error");
            }
        } catch (error) {
            console.log(error.message);
            showToast("Không thể cập nhật ảnh. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa ảnh này?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            var result = await onDelete(image.id);
            onSetProduct(result);
            showToast("Xóa ảnh sản phẩm thành công!", "success");
            close();
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            showToast("Không thể xóa ảnh. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ảnh</label>
                        <input
                            type="text"
                            value={newImage.description}
                            onChange={handleDescriptionChange}
                            placeholder="Nhập mô tả cho ảnh"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={newImage.isPrimary}
                                    onChange={handlePrimaryChange}
                                    className="sr-only"
                                />
                                <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${newImage.isPrimary ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">Đặt làm ảnh chính</div>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ảnh mới</label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
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
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                >
                    <Trash2 size={16} className="mr-2" /> Xóa ảnh
                </button>
                <div>
                    <button
                        type="button"
                        onClick={close}
                        className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!newImage.file}
                        className={`px-4 py-2 rounded-lg ${newImage.file ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"} transition-colors`}
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};