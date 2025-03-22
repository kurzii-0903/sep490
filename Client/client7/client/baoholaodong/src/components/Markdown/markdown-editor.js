"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import "./markdown-content.css"
export const Markdown = ({ content }) => {
    return (
        <div className="markdown-content">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </div>
    )
}

// Helper function to insert text at cursor position
export const insertTextAtCursor = (textarea, textBefore, textAfter = "") => {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText =
        textarea.value.substring(0, start) + textBefore + selectedText + textAfter + textarea.value.substring(end)

    textarea.value = newText
    textarea.focus()
    textarea.setSelectionRange(start + textBefore.length, start + textBefore.length + selectedText.length)

    // Trigger change event
    const event = new Event("input", { bubbles: true })
    textarea.dispatchEvent(event)

    return newText
}

// Image dialog component
export const ImageDialog = ({ isOpen, onClose, onInsert }) => {
    const [imageUrl, setImageUrl] = useState("")
    const [altText, setAltText] = useState("")
    const [width, setWidth] = useState("")
    const [height, setHeight] = useState("")
    const [alignment, setAlignment] = useState("center")

    const handleInsert = () => {
        if (!imageUrl) return

        let imageCode = `![${altText || "image"}](${imageUrl})`

        // If dimensions are specified, use HTML img tag instead
        if (width || height) {
            let style = `style="`
            if (width) style += `width: ${width}px; `
            if (height) style += `height: ${height}px; `
            if (alignment !== "none") style += `display: block; margin: 0 auto; `
            style += `"`

            let alignClass = ""
            if (alignment === "left") alignClass = ` class="align-left"`
            else if (alignment === "right") alignClass = ` class="align-right"`

            imageCode = `<img src="${imageUrl}" alt="${altText || "image"}" ${style}${alignClass} />`
        }

        onInsert(imageCode)
        onClose()

        // Reset form
        setImageUrl("")
        setAltText("")
        setWidth("")
        setHeight("")
        setAlignment("center")
    }

    if (!isOpen) return null

    return (
        <div className="markdown-dialog-overlay">
            <div className="markdown-dialog">
                <div className="markdown-dialog-header">
                    <h3>Chèn hình ảnh</h3>
                    <button type="button" className="markdown-dialog-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="markdown-dialog-body">
                    <div className="markdown-dialog-form">
                        <div className="markdown-dialog-form-group">
                            <label htmlFor="image-url">URL hình ảnh</label>
                            <input
                                type="text"
                                id="image-url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="markdown-dialog-input"
                            />
                        </div>
                        <div className="markdown-dialog-form-group">
                            <label htmlFor="image-alt">Mô tả hình ảnh</label>
                            <input
                                type="text"
                                id="image-alt"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Mô tả hình ảnh"
                                className="markdown-dialog-input"
                            />
                        </div>
                        <div className="markdown-dialog-form-row">
                            <div className="markdown-dialog-form-group">
                                <label htmlFor="image-width">Chiều rộng (px)</label>
                                <input
                                    type="number"
                                    id="image-width"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    placeholder="Tự động"
                                    className="markdown-dialog-input"
                                />
                            </div>
                            <div className="markdown-dialog-form-group">
                                <label htmlFor="image-height">Chiều cao (px)</label>
                                <input
                                    type="number"
                                    id="image-height"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Tự động"
                                    className="markdown-dialog-input"
                                />
                            </div>
                        </div>
                        <div className="markdown-dialog-form-group">
                            <label htmlFor="image-align">Căn chỉnh</label>
                            <select
                                id="image-align"
                                value={alignment}
                                onChange={(e) => setAlignment(e.target.value)}
                                className="markdown-dialog-select"
                            >
                                <option value="center">Giữa</option>
                                <option value="left">Trái</option>
                                <option value="right">Phải</option>
                                <option value="none">Không căn chỉnh</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="markdown-dialog-footer">
                    <button type="button" className="markdown-dialog-button-secondary" onClick={onClose}>
                        Hủy
                    </button>
                    <button type="button" className="markdown-dialog-button-primary" onClick={handleInsert}>
                        Chèn hình ảnh
                    </button>
                </div>
            </div>
        </div>
    )
}

// Markdown toolbar component
export const MarkdownToolbar = ({ textareaId, onContentChange }) => {
    const [showColorDropdown, setShowColorDropdown] = useState(false)
    const [showSizeDropdown, setShowSizeDropdown] = useState(false)
    const [showImageDialog, setShowImageDialog] = useState(false)

    const handleBold = () => {
        const textarea = document.getElementById(textareaId)
        const newValue = insertTextAtCursor(textarea, "**", "**")
        onContentChange(newValue)
    }

    const handleItalic = () => {
        const textarea = document.getElementById(textareaId)
        const newValue = insertTextAtCursor(textarea, "*", "*")
        onContentChange(newValue)
    }

    const handleHeading = (level) => {
        const textarea = document.getElementById(textareaId)
        const prefix = "#".repeat(level) + " "

        // Get the current line
        const start = textarea.selectionStart
        const text = textarea.value
        const lineStart = text.lastIndexOf("\n", start - 1) + 1

        // Insert at the beginning of the line
        const beforeText = text.substring(0, lineStart) + prefix
        const afterText = text.substring(lineStart)

        textarea.value = beforeText + afterText
        textarea.focus()
        textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)

        // Trigger change event
        const event = new Event("input", { bubbles: true })
        textarea.dispatchEvent(event)
        onContentChange(textarea.value)
    }

    const handleList = (type) => {
        const textarea = document.getElementById(textareaId)
        const prefix = type === "bullet" ? "- " : "1. "

        // Get the current line
        const start = textarea.selectionStart
        const text = textarea.value
        const lineStart = text.lastIndexOf("\n", start - 1) + 1

        // Insert at the beginning of the line
        const beforeText = text.substring(0, lineStart) + prefix
        const afterText = text.substring(lineStart)

        textarea.value = beforeText + afterText
        textarea.focus()
        textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)

        // Trigger change event
        const event = new Event("input", { bubbles: true })
        textarea.dispatchEvent(event)
        onContentChange(textarea.value)
    }

    const handleLink = () => {
        const textarea = document.getElementById(textareaId)
        const newValue = insertTextAtCursor(textarea, "[", "](url)")
        onContentChange(newValue)
    }

    const handleImage = () => {
        setShowImageDialog(true)
    }

    const handleInsertImage = (imageCode) => {
        const textarea = document.getElementById(textareaId)
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const newText = textarea.value.substring(0, start) + imageCode + textarea.value.substring(end)

        textarea.value = newText
        textarea.focus()

        // Set cursor after the inserted image
        const newPosition = start + imageCode.length
        textarea.setSelectionRange(newPosition, newPosition)

        // Trigger change event
        const event = new Event("input", { bubbles: true })
        textarea.dispatchEvent(event)
        onContentChange(textarea.value)
    }

    const handleColor = (color) => {
        const textarea = document.getElementById(textareaId)
        const newValue = insertTextAtCursor(textarea, `<span class="text-${color}">`, "</span>")
        onContentChange(newValue)
    }

    const handleSize = (size) => {
        const textarea = document.getElementById(textareaId)
        const newValue = insertTextAtCursor(textarea, `<span class="text-${size}">`, "</span>")
        onContentChange(newValue)
    }

    return (
        <>
            <div className="markdown-toolbar">
                <button type="button" className="markdown-toolbar-button" onClick={handleBold} title="Bold">
                    B
                </button>
                <button type="button" className="markdown-toolbar-button" onClick={handleItalic} title="Italic">
                    I
                </button>

                <div className="markdown-toolbar-separator"></div>

                <button type="button" className="markdown-toolbar-button" onClick={() => handleHeading(1)} title="Heading 1">
                    H1
                </button>
                <button type="button" className="markdown-toolbar-button" onClick={() => handleHeading(2)} title="Heading 2">
                    H2
                </button>
                <button type="button" className="markdown-toolbar-button" onClick={() => handleHeading(3)} title="Heading 3">
                    H3
                </button>

                <div className="markdown-toolbar-separator"></div>

                <button
                    type="button"
                    className="markdown-toolbar-button"
                    onClick={() => handleList("bullet")}
                    title="Bullet List"
                >
                    •
                </button>
                <button
                    type="button"
                    className="markdown-toolbar-button"
                    onClick={() => handleList("numbered")}
                    title="Numbered List"
                >
                    1.
                </button>

                <div className="markdown-toolbar-separator"></div>

                <button type="button" className="markdown-toolbar-button" onClick={handleLink} title="Link">
                    🔗
                </button>
                <button type="button" className="markdown-toolbar-button" onClick={handleImage} title="Image">
                    🖼️
                </button>

                <div className="markdown-toolbar-separator"></div>

                <div className="markdown-toolbar-dropdown">
                    <button
                        type="button"
                        className="markdown-toolbar-dropdown-button"
                        onClick={() => {
                            setShowColorDropdown(!showColorDropdown)
                            setShowSizeDropdown(false)
                        }}
                        title="Text Color"
                    >
                        Màu chữ ▾
                    </button>
                    <div className={`markdown-toolbar-dropdown-content ${showColorDropdown ? "show" : ""}`}>
                        <button
                            type="button"
                            className="markdown-toolbar-dropdown-item markdown-toolbar-color-item"
                            onClick={() => handleColor("red")}
                        >
                            <span className="markdown-toolbar-color-swatch" style={{ backgroundColor: "#ef4444" }}></span>
                            Đỏ
                        </button>
                        <button
                            type="button"
                            className="markdown-toolbar-dropdown-item markdown-toolbar-color-item"
                            onClick={() => handleColor("blue")}
                        >
                            <span className="markdown-toolbar-color-swatch" style={{ backgroundColor: "#3b82f6" }}></span>
                            Xanh dương
                        </button>
                        <button
                            type="button"
                            className="markdown-toolbar-dropdown-item markdown-toolbar-color-item"
                            onClick={() => handleColor("green")}
                        >
                            <span className="markdown-toolbar-color-swatch" style={{ backgroundColor: "#10b981" }}></span>
                            Xanh lá
                        </button>
                        <button
                            type="button"
                            className="markdown-toolbar-dropdown-item markdown-toolbar-color-item"
                            onClick={() => handleColor("yellow")}
                        >
                            <span className="markdown-toolbar-color-swatch" style={{ backgroundColor: "#f59e0b" }}></span>
                            Vàng
                        </button>
                        <button
                            type="button"
                            className="markdown-toolbar-dropdown-item markdown-toolbar-color-item"
                            onClick={() => handleColor("purple")}
                        >
                            <span className="markdown-toolbar-color-swatch" style={{ backgroundColor: "#8b5cf6" }}></span>
                            Tím
                        </button>
                    </div>
                </div>

                <div className="markdown-toolbar-dropdown">
                    <button
                        type="button"
                        className="markdown-toolbar-dropdown-button"
                        onClick={() => {
                            setShowSizeDropdown(!showSizeDropdown)
                            setShowColorDropdown(false)
                        }}
                        title="Text Size"
                    >
                        Cỡ chữ ▾
                    </button>
                    <div className={`markdown-toolbar-dropdown-content ${showSizeDropdown ? "show" : ""}`}>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("xs")}>
                            Rất nhỏ
                        </button>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("sm")}>
                            Nhỏ
                        </button>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("base")}>
                            Bình thường
                        </button>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("lg")}>
                            Lớn
                        </button>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("xl")}>
                            Rất lớn
                        </button>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("2xl")}>
                            Cực lớn
                        </button>
                        <button type="button" className="markdown-toolbar-dropdown-item" onClick={() => handleSize("3xl")}>
                            Siêu lớn
                        </button>
                    </div>
                </div>
            </div>

            <ImageDialog isOpen={showImageDialog} onClose={() => setShowImageDialog(false)} onInsert={handleInsertImage} />
        </>
    )
}

// Markdown help component
export const MarkdownHelp = () => {
    return (
        <div className="markdown-help">
            <h3 className="markdown-help-title">Hướng dẫn định dạng Markdown</h3>
            <table className="markdown-help-table">
                <thead>
                <tr>
                    <th>Định dạng</th>
                    <th>Cú pháp</th>
                    <th>Kết quả</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>In đậm</td>
                    <td>
                        <code className="markdown-help-code">**Văn bản in đậm**</code>
                    </td>
                    <td>
                        <strong>Văn bản in đậm</strong>
                    </td>
                </tr>
                <tr>
                    <td>In nghiêng</td>
                    <td>
                        <code className="markdown-help-code">*Văn bản in nghiêng*</code>
                    </td>
                    <td>
                        <em>Văn bản in nghiêng</em>
                    </td>
                </tr>
                <tr>
                    <td>Tiêu đề</td>
                    <td>
                        <code className="markdown-help-code"># Tiêu đề 1</code>
                    </td>
                    <td>
                        <strong>Tiêu đề 1</strong> (cỡ lớn)
                    </td>
                </tr>
                <tr>
                    <td>Danh sách</td>
                    <td>
                        <code className="markdown-help-code">
                            - Mục 1<br />- Mục 2
                        </code>
                    </td>
                    <td>
                        • Mục 1<br />• Mục 2
                    </td>
                </tr>
                <tr>
                    <td>Liên kết</td>
                    <td>
                        <code className="markdown-help-code">[Tên liên kết](url)</code>
                    </td>
                    <td>
                        <a href="#">Tên liên kết</a>
                    </td>
                </tr>
                <tr>
                    <td>Hình ảnh</td>
                    <td>
                        <code className="markdown-help-code">![Mô tả](url)</code>
                    </td>
                    <td>Hiển thị hình ảnh</td>
                </tr>
                <tr>
                    <td>Hình ảnh có kích thước</td>
                    <td>
                        <code className="markdown-help-code">&lt;img src="url" width="300" height="200" /&gt;</code>
                    </td>
                    <td>Hình ảnh có kích thước cố định</td>
                </tr>
                <tr>
                    <td>Màu chữ</td>
                    <td>
                        <code className="markdown-help-code">&lt;span class="text-red"&gt;Chữ màu đỏ&lt;/span&gt;</code>
                    </td>
                    <td>
                        <span style={{ color: "#ef4444" }}>Chữ màu đỏ</span>
                    </td>
                </tr>
                <tr>
                    <td>Cỡ chữ</td>
                    <td>
                        <code className="markdown-help-code">&lt;span class="text-xl"&gt;Chữ lớn&lt;/span&gt;</code>
                    </td>
                    <td>
                        <span style={{ fontSize: "1.25rem" }}>Chữ lớn</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}


