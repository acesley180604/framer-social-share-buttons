import { useState, useMemo, useCallback } from "react"
import { useShareStore } from "@/store/shareStore"
import {
    generateEmbedCode,
    generateCdnEmbedCode,
    generateFollowEmbedCode,
    generateImageSharingEmbedCode,
    generateContentLockerEmbedCode,
    copyToClipboard,
} from "@/utils/embedGenerator"

type EmbedTab = "share" | "follow" | "images" | "locker"

export default function EmbedCodePanel() {
    const { config, showToast } = useShareStore()
    const [copied, setCopied] = useState(false)
    const [mode, setMode] = useState<"inline" | "cdn">("inline")
    const [embedTab, setEmbedTab] = useState<EmbedTab>("share")

    const embedCode = useMemo(() => {
        switch (embedTab) {
            case "share":
                return mode === "inline"
                    ? generateEmbedCode(config)
                    : generateCdnEmbedCode(config, "https://cdn.example.com/ssb")
            case "follow":
                return generateFollowEmbedCode(config)
            case "images":
                return generateImageSharingEmbedCode(config)
            case "locker":
                return generateContentLockerEmbedCode(config)
            default:
                return ""
        }
    }, [config, mode, embedTab])

    const handleCopy = useCallback(async () => {
        const ok = await copyToClipboard(embedCode)
        if (ok) {
            setCopied(true)
            showToast("Embed code copied to clipboard!", "success")
            setTimeout(() => setCopied(false), 2000)
        }
    }, [embedCode, showToast])

    return (
        <div className="stack-lg">
            <section>
                <h2>Embed Code</h2>
                <p style={{ marginTop: 4 }}>
                    Copy code snippets and paste them into your website's HTML.
                </p>
            </section>

            {/* Embed type selector */}
            <div className="segment-group">
                {([
                    { id: "share" as const, label: "Share" },
                    { id: "follow" as const, label: "Follow" },
                    { id: "images" as const, label: "Images" },
                    { id: "locker" as const, label: "Locker" },
                ]).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setEmbedTab(tab.id)}
                        className={`segment-btn ${embedTab === tab.id ? "active" : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Mode selector (share only) */}
            {embedTab === "share" && (
                <div className="segment-group">
                    <button
                        onClick={() => setMode("inline")}
                        className={`segment-btn ${mode === "inline" ? "active" : ""}`}
                    >
                        Inline (recommended)
                    </button>
                    <button
                        onClick={() => setMode("cdn")}
                        className={`segment-btn ${mode === "cdn" ? "active" : ""}`}
                    >
                        CDN
                    </button>
                </div>
            )}

            {/* Info */}
            <div className="info-box info-box-default">
                {embedTab === "share" && mode === "inline" ? (
                    <span>
                        The inline embed includes all code and config in a single snippet.
                        Self-contained, no external dependencies.
                    </span>
                ) : embedTab === "share" && mode === "cdn" ? (
                    <span>
                        The CDN embed loads the share button script from an external URL.
                        Replace the CDN URL with your own hosted endpoint.
                    </span>
                ) : embedTab === "follow" ? (
                    <span>
                        Follow button embed code. Configure profiles in the Follow tab first.
                    </span>
                ) : embedTab === "images" ? (
                    <span>
                        Image hover sharing embed. Enable and configure in the Images tab.
                    </span>
                ) : (
                    <span>
                        Content locker embed. Enable and configure in the Locker tab.
                    </span>
                )}
            </div>

            {/* Code block */}
            <div className="code-block">
                <button
                    onClick={handleCopy}
                    className={`copy-btn ${copied ? "copied" : ""}`}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
                {embedCode}
            </div>

            {/* Enabled platforms summary */}
            {embedTab === "share" && (
                <section>
                    <label>Enabled Platforms</label>
                    <div className="row gap-4" style={{ flexWrap: "wrap" }}>
                        {config.platforms
                            .filter((p) => p.enabled)
                            .sort((a, b) => a.order - b.order)
                            .map((p) => (
                                <span
                                    key={p.id}
                                    className="badge badge-active"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {p.id === "twitter" ? "X" : p.id}
                                </span>
                            ))}
                    </div>
                </section>
            )}

            {/* Installation guide */}
            <div className="install-guide">
                <header>Installation Guide</header>
                <ol>
                    <li>Copy the embed code above</li>
                    <li>
                        Paste it into your website's HTML where you want the feature to appear
                    </li>
                    <li>
                        For Framer: Go to Site Settings &rarr; Custom Code &rarr; End of{" "}
                        <code>&lt;body&gt;</code>
                    </li>
                    <li>
                        For floating/fly-in layouts, buttons appear as overlays regardless
                        of where the code is placed
                    </li>
                    <li>Publish your site and verify everything works</li>
                </ol>
            </div>
        </div>
    )
}
