import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useShareStore } from "@/store/shareStore"
import { generateClickToTweetEmbedCode, copyToClipboard } from "@/utils/embedGenerator"
import type { ClickToTweetConfig } from "@/store/shareStore"

const STYLES: { id: ClickToTweetConfig["style"]; label: string }[] = [
    { id: "minimal", label: "Minimal" },
    { id: "bordered", label: "Bordered" },
    { id: "gradient", label: "Gradient" },
    { id: "dark", label: "Dark" },
]

const STYLE_PREVIEW: Record<string, React.CSSProperties> = {
    minimal: {
        border: "1px solid #e2e8f0",
        background: "#fff",
        color: "#1a202c",
    },
    bordered: {
        border: "2px solid #1DA1F2",
        background: "#f7fafc",
        color: "#1a202c",
    },
    gradient: {
        border: "none",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
    },
    dark: {
        border: "none",
        background: "#1a202c",
        color: "#fff",
    },
}

export default function ClickToTweet() {
    const { config, addClickToTweet, updateClickToTweet, removeClickToTweet, showToast } =
        useShareStore()
    const tweets = config.clickToTweets

    const [newText, setNewText] = useState("")
    const [newVia, setNewVia] = useState("")
    const [newHashtags, setNewHashtags] = useState("")
    const [newStyle, setNewStyle] = useState<ClickToTweetConfig["style"]>("minimal")

    const charCount = useMemo(() => newText.length, [newText])
    const remaining = 280 - charCount

    const handleAdd = useCallback(() => {
        if (!newText.trim()) return
        addClickToTweet({
            text: newText.trim(),
            viaHandle: newVia.trim(),
            hashtags: newHashtags.trim(),
            style: newStyle,
        })
        setNewText("")
        setNewVia("")
        setNewHashtags("")
        showToast("Click-to-Tweet box added!", "success")
    }, [newText, newVia, newHashtags, newStyle, addClickToTweet, showToast])

    const handleCopyEmbed = useCallback(
        async (tweet: ClickToTweetConfig, index: number) => {
            const code = generateClickToTweetEmbedCode(tweet, index)
            const ok = await copyToClipboard(code)
            if (ok) {
                showToast("Embed code copied!", "success")
            }
        },
        [showToast]
    )

    return (
        <div className="stack-lg">
            <section>
                <h2>Click to Tweet</h2>
                <p style={{ marginTop: 4 }}>
                    Create styled quote boxes that visitors can click to tweet.
                    Each box gets its own embed code.
                </p>
            </section>

            {/* Create new */}
            <section className="stack-sm">
                <label>Tweet Text</label>
                <textarea
                    rows={3}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Enter the text you want people to tweet..."
                    maxLength={280}
                />
                <div className="row-between">
                    <span style={{ fontSize: 10, color: remaining < 20 ? "#e53e3e" : "var(--framer-color-text-tertiary)" }}>
                        {remaining} characters remaining
                    </span>
                </div>
            </section>

            <div className="grid-2">
                <section className="stack-sm">
                    <label>Via @handle</label>
                    <input
                        type="text"
                        value={newVia}
                        onChange={(e) => setNewVia(e.target.value)}
                        placeholder="@yourhandle"
                    />
                </section>
                <section className="stack-sm">
                    <label>Hashtags</label>
                    <input
                        type="text"
                        value={newHashtags}
                        onChange={(e) => setNewHashtags(e.target.value)}
                        placeholder="tag1,tag2"
                    />
                </section>
            </div>

            <section className="stack-sm">
                <label>Visual Style</label>
                <div className="segment-group">
                    {STYLES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setNewStyle(s.id)}
                            className={`segment-btn ${newStyle === s.id ? "active" : ""}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Preview of new tweet box */}
            {newText && (
                <div className="preview-container">
                    <div className="preview-header">Preview</div>
                    <div className="preview-body" style={{ padding: 12 }}>
                        <div
                            style={{
                                width: "100%",
                                padding: "16px 20px",
                                borderRadius: 12,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                ...STYLE_PREVIEW[newStyle],
                            }}
                        >
                            <blockquote style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>
                                {newText}
                            </blockquote>
                            <div className="row-between">
                                <span style={{ fontSize: 10, opacity: 0.6 }}>
                                    {remaining} chars left
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, opacity: 0.8 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    Click to Tweet
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="framer-button-primary w-full"
                onClick={handleAdd}
                disabled={!newText.trim()}
                style={{ opacity: newText.trim() ? 1 : 0.5 }}
            >
                Add Click-to-Tweet Box
            </button>

            <hr />

            {/* Existing tweet boxes */}
            {tweets.length > 0 && (
                <section className="stack-sm">
                    <h3>Saved Tweet Boxes ({tweets.length})</h3>
                    <AnimatePresence mode="popLayout">
                        {tweets.map((tweet, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                                className="card"
                                style={{ padding: "10px 12px" }}
                            >
                                <div style={{ marginBottom: 8 }}>
                                    <p style={{ fontSize: 12, color: "var(--framer-color-text)", fontWeight: 500 }}>
                                        "{tweet.text.slice(0, 60)}{tweet.text.length > 60 ? "..." : ""}"
                                    </p>
                                </div>
                                <div className="row-between">
                                    <div className="row gap-4">
                                        <span className="badge badge-active">{tweet.style}</span>
                                        {tweet.viaHandle && (
                                            <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                                                via {tweet.viaHandle}
                                            </span>
                                        )}
                                    </div>
                                    <div className="row gap-6">
                                        <button
                                            className="btn-link"
                                            onClick={() => void handleCopyEmbed(tweet, index)}
                                        >
                                            Copy Code
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={() => removeClickToTweet(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </section>
            )}

            {tweets.length === 0 && (
                <div className="info-box info-box-default">
                    <span>
                        No tweet boxes created yet. Fill out the form above and click "Add".
                    </span>
                </div>
            )}
        </div>
    )
}
