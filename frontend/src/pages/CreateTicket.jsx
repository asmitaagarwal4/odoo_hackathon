import React, { useState } from "react"
import { Upload, X, FileText, ImageIcon, Paperclip } from "lucide-react"

export default function CreateTicket() {
  const [files, setFiles] = useState([])
  const [attachment, setAttachment] = useState(null)

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...newFiles])
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function handleAttachmentChange(e) {
    setAttachment(e.target.files[0])
  }

  function removeAttachment() {
    setAttachment(null)
  }

  function handleCancel() {
    window.history.back()
  }

  function handleSubmit(e) {
    e.preventDefault()
    // handle form submission logic here
  }

  return (
    <div style={{ maxWidth: "100%", width: "800px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <div style={{ borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>Create a ticket</h2>
        <p style={{ margin: 0, color: "#666" }}>Create a ticket and submit your issue</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="title" style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description" style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="category" style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}>
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="">Select a category</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature Request</option>
            <option value="support">Support</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}>
            Attachments
          </label>

          <div style={{ position: "relative", display: "inline-block" }}>
            <label
              htmlFor="attachments"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: "4px",
                display: "inline-block"
              }}
            >
              Choose Files
            </label>
            <input
              id="attachments"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer"
              }}
            />
          </div>

          {files.length > 0 && (
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
              {files.map((file, index) => (
                <li key={index} style={{ color: "#000", display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
                  <Paperclip size={16} style={{ marginRight: "0.5rem" }} />
                  <span style={{ flexGrow: 1 }}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label="Remove file"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}>
            Single Attachment
          </label>

          <div style={{ position: "relative", display: "inline-block" }}>
            <label
              htmlFor="attachment"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: "4px",
                display: "inline-block"
              }}
            >
              Choose File
            </label>
            <input
              id="attachment"
              type="file"
              onChange={handleAttachmentChange}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer"
              }}
            />
          </div>

          {attachment && (
            <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
              <FileText size={16} style={{ marginRight: "0.5rem" }} />
              <span style={{ flexGrow: 1, color: "#000" }}>{attachment.name}</span>
              <button
                type="button"
                onClick={removeAttachment}
                aria-label="Remove attachment"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button type="button" onClick={handleCancel} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Cancel
          </button>
          <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
