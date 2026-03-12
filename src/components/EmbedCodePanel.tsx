import { useState } from "react"
import { useShareStore } from "@/store/shareStore"
import { generateEmbedCode, generateCdnEmbedCode, copyToClipboard } from "@/utils/embedGenerator"

export default function EmbedCodePanel() {
    const { config, showToast } = useShareStore()
    const [copied, setCopied] = useState(false)
    const [mode, setMode] = useState<"inline" | "cdn">("inline")

    const embedCode =
        mode === "inline"
            ? generateEmbedCode(config)
            : generateCdnEmbedCode(config, "https://cdn.example.com/ssb")

    const handleCopy = async () => {
        const ok = await copyToClipboard(embedCode)
        if (ok) {
            setCopied(true)
            showToast("Embed code copied to clipboard!", "success")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>Embed Code</h2>
                <p style={{ marginTop: 4 }}>
                    Copy this code snippet and paste it into your website's HTML.
                </p>
            </section>

            {/* Mode selector */}
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

            {/* Info */}
            <div className="info-box info-box-default">
                {mode === "inline" ? (
                    <span>
                        The inline embed includes all code and config in a single snippet.
                        Self-contained, no external dependencies. Update the snippet
                        whenever you change settings.
                    </span>
                ) : (
                    <span>
                        The CDN embed loads the share button script from an external URL.
                        Config is still inline. Replace the CDN URL with your own hosted endpoint.
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

            {/* Installation guide */}
            <div className="install-guide">
                <header>Installation Guide</header>
                <ol>
                    <li>Copy the embed code above</li>
                    <li>
                        Paste it into your website's HTML where you want the share buttons to appear
                    </li>
                    <li>
                        For Framer: Go to Site Settings &rarr; Custom Code &rarr; End of{" "}
                        <code>&lt;body&gt;</code>
                    </li>
                    <li>
                        For floating layout, the buttons will appear as a sidebar regardless
                        of where the code is placed
                    </li>
                    <li>Publish your site and verify the buttons appear</li>
                </ol>
            </div>
        </div>
    )
}
