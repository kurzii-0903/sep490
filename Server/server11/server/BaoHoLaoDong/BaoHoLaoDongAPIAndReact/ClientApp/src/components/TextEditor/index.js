import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

const TextEditor = ({ width = "100%", height = "300px", value = "", setValue, maxLength = 500 }) => {
    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ script: "sub" }, { script: "super" }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const formats = [
        "font", "size", "header", "bold", "italic", "underline", "strike",
        "script", "list", "bullet", "blockquote", "code-block",
        "align", "color", "background", "link", "image", "video"
    ];

    const handleChange = (content, delta, source) => {
        if (source !== "user") return;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const textOnly = tempDiv.innerText.trim();

        // Kiểm tra giá trị không hợp lệ (placeholder của các trường khác)
        if (textOnly.includes("Nhập thẻ, phân cách bằng dấu phẩy") || textOnly === "") {
            setValue("");
            return;
        }

        const currentTextLength = (() => {
            const tempDivPrev = document.createElement("div");
            tempDivPrev.innerHTML = value;
            return tempDivPrev.innerText.trim().length;
        })();

        if (textOnly.length <= maxLength || textOnly.length < currentTextLength) {
            setValue(content);
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
                value={value || ""}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                style={{ height: `calc(${height} - 2rem)` }}
            />
            <p className={`text-right text-sm ${textLength >= maxLength ? "text-red-500 font-bold" : "text-gray-500"} mt-2`}>
                {textLength}/{maxLength} ký tự {textLength >= maxLength ? " - Đã đạt giới hạn!" : ""}
            </p>
        </div>
    );
};

const TextEditor2 = ({ width = "100%", height = "200px", value = "", setValue }) => {
    const modules = {
        toolbar: [
            ["bold", "italic"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
        ],
    };

    const formats = ["bold", "italic", "list", "ordered", "bullet"];

    const handleChange = (content, delta, source) => {
        if (source === "user") {
            setValue(content);
        }
    };

    return (
        <div style={{ width, height }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                style={{ height: `calc(${height} - 2rem)` }}
            />
        </div>
    );
};

const DisplayContent = ({ content }) => {
    const safeContent = DOMPurify.sanitize(content, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });

    return <div dangerouslySetInnerHTML={{ __html: safeContent }} />;
};

export { TextEditor, DisplayContent, TextEditor2 };