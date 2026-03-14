import { useState, useMemo, useCallback } from "react"
import { useShareStore } from "@/store/shareStore"
import { generateOGMetaTags } from "@/utils/ogTags"
import { copyToClipboard } from "@/utils/embedGenerator"

export default function OGMetaTags() {
    const { config, updateOG, showToast } = useShareStore()
    const og = config.og
    const [copied, setCopied] = useState(false)

    const metaTagsCode = useMemo(() => generateOGMetaTags(og), [og])

    const handleCopy = useCallback(async () => {
        if (!metaTagsCode) return
        const ok = await copyToClipboard(metaTagsCode)
        if (ok) {
            setCopied(true)
            showToast("Meta tags copied to clipboard!", "success")
            setTimeout(() => setCopied(false), 2000)
        }
    }, [metaTagsCode, showToast])

    return (
        <div className="stack-lg">
            <section>
                <h2>Open Graph Meta Tags</h2>
                <p style={{ marginTop: 4 }}>
                    Configure how your page appears when shared on social media.
                    Add these meta tags to your page's <code>&lt;head&gt;</code>.
                </p>
            </section>

            {/* OG fields */}
            <section className="stack-sm">
                <label>og:title</label>
                <input
                    type="text"
                    value={og.ogTitle}
                    onChange={(e) => updateOG({ ogTitle: e.target.value })}
                    placeholder="My Amazing Page"
                />
            </section>

            <section className="stack-sm">
                <label>og:description</label>
                <textarea
                    rows={2}
                    value={og.ogDescription}
                    onChange={(e) => updateOG({ ogDescription: e.target.value })}
                    placeholder="A brief description of this page..."
                />
            </section>

            <section className="stack-sm">
                <label>og:image</label>
                <input
                    type="url"
                    value={og.ogImage}
                    onChange={(e) => updateOG({ ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
                <p>Recommended: 1200x630px for best results on Facebook.</p>
            </section>

            <section className="stack-sm">
                <label>og:url</label>
                <input
                    type="url"
                    value={og.ogUrl}
                    onChange={(e) => updateOG({ ogUrl: e.target.value })}
                    placeholder="https://example.com/page"
                />
            </section>

            <div className="grid-2">
                <section className="stack-sm">
                    <label>og:type</label>
                    <select
                        value={og.ogType}
                        onChange={(e) => updateOG({ ogType: e.target.value })}
                    >
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="product">product</option>
                        <option value="profile">profile</option>
                        <option value="video.other">video</option>
                    </select>
                </section>

                <section className="stack-sm">
                    <label>og:site_name</label>
                    <input
                        type="text"
                        value={og.ogSiteName}
                        onChange={(e) => updateOG({ ogSiteName: e.target.value })}
                        placeholder="My Site"
                    />
                </section>
            </div>

            <hr />

            {/* Twitter Card */}
            <section>
                <h3>Twitter Card</h3>
                <p style={{ marginTop: 4 }}>
                    Additional meta tags for Twitter/X cards. Falls back to OG values if empty.
                </p>
            </section>

            <section className="stack-sm">
                <label>Card type</label>
                <div className="segment-group">
                    <button
                        onClick={() => updateOG({ twitterCard: "summary" })}
                        className={`segment-btn ${og.twitterCard === "summary" ? "active" : ""}`}
                    >
                        Summary
                    </button>
                    <button
                        onClick={() => updateOG({ twitterCard: "summary_large_image" })}
                        className={`segment-btn ${og.twitterCard === "summary_large_image" ? "active" : ""}`}
                    >
                        Large Image
                    </button>
                </div>
            </section>

            <div className="grid-2">
                <section className="stack-sm">
                    <label>twitter:site</label>
                    <input
                        type="text"
                        value={og.twitterSite}
                        onChange={(e) => updateOG({ twitterSite: e.target.value })}
                        placeholder="@yoursite"
                    />
                </section>
                <section className="stack-sm">
                    <label>twitter:creator</label>
                    <input
                        type="text"
                        value={og.twitterCreator}
                        onChange={(e) => updateOG({ twitterCreator: e.target.value })}
                        placeholder="@author"
                    />
                </section>
            </div>

            <section className="stack-sm">
                <label>twitter:title (optional override)</label>
                <input
                    type="text"
                    value={og.twitterTitle}
                    onChange={(e) => updateOG({ twitterTitle: e.target.value })}
                    placeholder="Defaults to og:title"
                />
            </section>

            <section className="stack-sm">
                <label>twitter:description (optional override)</label>
                <input
                    type="text"
                    value={og.twitterDescription}
                    onChange={(e) => updateOG({ twitterDescription: e.target.value })}
                    placeholder="Defaults to og:description"
                />
            </section>

            <section className="stack-sm">
                <label>twitter:image (optional override)</label>
                <input
                    type="url"
                    value={og.twitterImage}
                    onChange={(e) => updateOG({ twitterImage: e.target.value })}
                    placeholder="Defaults to og:image"
                />
            </section>

            <hr />

            {/* Social Preview */}
            <section>
                <h3 style={{ marginBottom: 8 }}>Social Preview</h3>

                {/* Facebook preview */}
                <div className="preview-container" style={{ marginBottom: 12 }}>
                    <div className="preview-header">Facebook / LinkedIn preview</div>
                    <div style={{ padding: 12, background: "var(--framer-color-bg-secondary)" }}>
                        <div
                            style={{
                                background: "#f0f0f0",
                                borderRadius: 6,
                                overflow: "hidden",
                                border: "1px solid #ddd",
                            }}
                        >
                            {og.ogImage && (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        background: `url(${og.ogImage}) center/cover`,
                                        borderBottom: "1px solid #ddd",
                                    }}
                                />
                            )}
                            {!og.ogImage && (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 80,
                                        background: "#ddd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 10,
                                        color: "#888",
                                    }}
                                >
                                    og:image
                                </div>
                            )}
                            <div style={{ padding: 10 }}>
                                {og.ogSiteName && (
                                    <div style={{ fontSize: 9, color: "#90949c", textTransform: "uppercase", marginBottom: 2 }}>
                                        {og.ogSiteName}
                                    </div>
                                )}
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1d2129", marginBottom: 3, lineHeight: 1.3 }}>
                                    {og.ogTitle || "Page Title"}
                                </div>
                                <div style={{ fontSize: 11, color: "#606770", lineHeight: 1.4 }}>
                                    {og.ogDescription || "Page description will appear here..."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Twitter preview */}
                <div className="preview-container">
                    <div className="preview-header">X (Twitter) Card preview</div>
                    <div style={{ padding: 12, background: "var(--framer-color-bg-secondary)" }}>
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 12,
                                overflow: "hidden",
                                border: "1px solid #e1e8ed",
                            }}
                        >
                            {(og.twitterImage || og.ogImage) && og.twitterCard === "summary_large_image" && (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 130,
                                        background: `url(${og.twitterImage || og.ogImage}) center/cover`,
                                    }}
                                />
                            )}
                            <div style={{ padding: 10, display: "flex", gap: 8 }}>
                                {(og.twitterImage || og.ogImage) && og.twitterCard === "summary" && (
                                    <div
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 6,
                                            flexShrink: 0,
                                            background: `url(${og.twitterImage || og.ogImage}) center/cover`,
                                        }}
                                    />
                                )}
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#0f1419", marginBottom: 2 }}>
                                        {og.twitterTitle || og.ogTitle || "Page Title"}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#536471", lineHeight: 1.3 }}>
                                        {og.twitterDescription || og.ogDescription || "Description..."}
                                    </div>
                                    {og.ogUrl && (
                                        <div style={{ fontSize: 10, color: "#536471", marginTop: 4 }}>
                                            {new URL(og.ogUrl).hostname}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr />

            {/* Generated meta tags */}
            {metaTagsCode && (
                <section>
                    <div className="row-between" style={{ marginBottom: 8 }}>
                        <h3>Generated Meta Tags</h3>
                    </div>
                    <div className="code-block">
                        <button
                            onClick={handleCopy}
                            className={`copy-btn ${copied ? "copied" : ""}`}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                        {metaTagsCode}
                    </div>
                    <p style={{ marginTop: 8 }}>
                        Paste these tags inside your page's <code>&lt;head&gt;</code> element.
                        For Framer: Site Settings &rarr; Custom Code &rarr; End of <code>&lt;head&gt;</code>.
                    </p>
                </section>
            )}
        </div>
    )
}
