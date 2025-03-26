import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho Quill
import DOMPurify from "dompurify";

const TextEditor = ({ width = "100%", height = "300px", value = "", setValue, maxLength = 500 }) => {
    // ✅ Cấu hình toolbar mở rộng với nhiều kiểu chữ hơn
    const modules = {
        toolbar: [
            [{ font: [] }], // Chọn font chữ
            [{ size: ["small", false, "large", "huge"] }], // Chọn kích thước chữ
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"], // Chữ đậm, nghiêng, gạch chân, gạch ngang
            [{ script: "sub" }, { script: "super" }], // Chỉ số trên và dưới
            [{ list: "ordered" }, { list: "bullet" }], // Danh sách có thứ tự và không thứ tự
            ["blockquote", "code-block"], // Blockquote, code block
            [{ align: [] }], // Căn lề trái, phải, giữa
            [{ color: [] }, { background: [] }], // Màu chữ và nền chữ
            ["link", "image", "video"], // Chèn liên kết, ảnh, video
            ["clean"], // Xóa định dạng
        ],
    };

    // ✅ Thêm các kiểu định dạng mới
    const formats = [
        "font", "size", "header", "bold", "italic", "underline", "strike",
        "script", "list", "bullet", "blockquote", "code-block",
        "align", "color", "background", "link", "image", "video"
    ];

    // ✅ Xử lý khi người dùng nhập dữ liệu
    const handleChange = (content, delta, source) => {
        if (source === "user") {  // Chỉ xử lý khi người dùng nhập
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;
            const textOnly = tempDiv.innerText.trim(); // Lấy văn bản thực tế

            const currentTextLength = (() => {
                const tempDivPrev = document.createElement("div");
                tempDivPrev.innerHTML = value;
                return tempDivPrev.innerText.trim().length;
            })(); // Lấy số ký tự trước đó

            if (textOnly.length <= maxLength || textOnly.length < currentTextLength) {
                setValue(content); // Cập nhật nếu chưa vượt quá hoặc đang xóa
            }
        }
    };

    const textLength = (() => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = value;
        return tempDiv.innerText.trim().length;
    })();

    return (
        <div style={{ width, height }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                style={{ height }}
            />
            {/* Hiển thị số ký tự và cảnh báo màu đỏ khi vượt giới hạn */}
            <p className={`text-right text-sm ${textLength >= maxLength ? "text-red-500 font-bold" : "text-gray-500"}`}>
                {textLength}/{maxLength} ký tự {textLength >= maxLength ? " - Đã đạt giới hạn!" : ""}
            </p>
        </div>
    );
};

const DisplayContent = ({ content }) => {
    const safeContent = DOMPurify.sanitize(content); // Lọc mã độc XSS
    return <div dangerouslySetInnerHTML={{ __html: safeContent }} />;
};

export { TextEditor, DisplayContent };
