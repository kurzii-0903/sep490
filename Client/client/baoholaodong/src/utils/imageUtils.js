import Compressor from "compressorjs";

/**
 * Kiểm tra dung lượng ảnh có vượt quá giới hạn không.
 * @param {File} image - Tệp ảnh cần kiểm tra.
 * @param {number} maxSizeMB - Dung lượng tối đa cho phép (MB).
 * @returns {boolean} - Trả về true nếu ảnh hợp lệ, false nếu vượt quá dung lượng.
 */
export const isImageSizeValid = (image, maxSizeMB) => {
    if (!image || !image.type.startsWith("image/")) {
        console.error("Tệp không phải là hình ảnh hợp lệ.");
        return false;
    }
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Chuyển MB thành Bytes
    return image.size <= maxSizeBytes;
};

/**
 * Nén ảnh xuống dung lượng nhất định.
 * @param {File} image - Tệp ảnh cần nén.
 * @param {number} targetSizeKB - Kích thước ảnh mong muốn (KB).
 * @returns {Promise<File>} - Trả về ảnh đã được nén dưới dạng Promise.
 */
export const compressImageToTargetSize = (image, targetSizeKB) => {
    return new Promise((resolve, reject) => {
        if (!image || !image.type.startsWith("image/")) {
            return reject(new Error("Tệp không phải là hình ảnh hợp lệ."));
        }

        const tryCompression = (quality) => {
            new Compressor(image, {
                quality: quality, // Giảm chất lượng ảnh
                success: async (compressedImage) => {
                    if (compressedImage.size / 1024 <= targetSizeKB) {
                        resolve(compressedImage);
                    } else if (quality > 0.1) {
                        // Nếu ảnh vẫn lớn hơn kích thước mong muốn, giảm chất lượng hơn nữa
                        tryCompression(quality - 0.1);
                    } else {
                        resolve(compressedImage); // Nếu đã giảm hết mức mà vẫn lớn, trả về ảnh hiện tại
                    }
                },
                error: (err) => reject(err),
            });
        };

        tryCompression(0.8); // Bắt đầu với chất lượng 80%
    });
};
