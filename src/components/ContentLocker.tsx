import { useCallback } from "react"
import { useShareStore } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"

const LOCKER_PLATFORMS = PLATFORMS.filter((p) =>
    ["facebook", "twitter", "linkedin", "pinterest", "reddit", "whatsapp"].includes(p.id)
)

export default function ContentLocker() {
    const { config, updateContentLocker } = useShareStore()
    const locker = config.contentLocker

    const togglePlatform = useCallback(
        (id: string) => {
            const current = locker.platforms
            const updated = current.includes(id)
                ? current.filter((p) => p !== id)
                : [...current, id]
            updateContentLocker({ platforms: updated })
        },
        [locker.platforms, updateContentLocker]
    )

    return (
        <div className="stack-lg">
            <section>
                <h2>Content Locker</h2>
                <p style={{ marginTop: 4 }}>
                    Lock content behind a share gate. Visitors must share on at least
                    one platform to unlock hidden content on your page.
                </p>
            </section>

            {/* Enable toggle */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Enable content locker</label>
                    <div
                        className={`toggle ${locker.enabled ? "on" : ""}`}
                        onClick={() => updateContentLocker({ enabled: !locker.enabled })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
            </section>

            {locker.enabled && (
                <>
                    {/* Locked content message */}
                    <section className="stack-sm">
                        <label>Locked Content Message</label>
                        <textarea
                            rows={2}
                            value={locker.message}
                            onChange={(e) => updateContentLocker({ message: e.target.value })}
                            placeholder="Share this article to unlock the rest of the content!"
                        />
                    </section>

                    {/* Target element ID */}
                    <section className="stack-sm">
                        <label>Locked Content Element ID</label>
                        <input
                            type="text"
                            value={locker.lockedContentId}
                            onChange={(e) => updateContentLocker({ lockedContentId: e.target.value })}
                            placeholder="locked-content"
                        />
                        <p>
                            The HTML element with this ID will be locked until the visitor shares.
                            Use <code>id="locked-content"</code> on your element.
                        </p>
                    </section>

                    {/* Blur toggle */}
                    <section className="stack-sm">
                        <div className="row-between">
                            <div>
                                <label style={{ margin: 0 }}>Blur locked content</label>
                                <p>When off, content is hidden entirely instead of blurred.</p>
                            </div>
                            <div
                                className={`toggle ${locker.blurContent ? "on" : ""}`}
                                onClick={() => updateContentLocker({ blurContent: !locker.blurContent })}
                            >
                                <div className="toggle-knob" />
                            </div>
                        </div>
                    </section>

                    {/* Platform selection */}
                    <section className="stack-sm">
                        <label>Unlock Platforms</label>
                        <p>Visitors can share on any of these to unlock content.</p>
                        <div className="stack-sm">
                            {LOCKER_PLATFORMS.map((platform) => {
                                const isEnabled = locker.platforms.includes(platform.id)
                                return (
                                    <div
                                        key={platform.id}
                                        className={`platform-item ${isEnabled ? "enabled" : ""}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => togglePlatform(platform.id)}
                                    >
                                        <svg
                                            className="platform-icon"
                                            viewBox="0 0 24 24"
                                            fill={isEnabled ? platform.brandColor : "var(--framer-color-text-tertiary)"}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d={platform.iconPath} />
                                        </svg>
                                        <span className="platform-name">{platform.name}</span>
                                        <div className={`toggle ${isEnabled ? "on" : ""}`}>
                                            <div className="toggle-knob" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Preview */}
                    <section>
                        <h3 style={{ marginBottom: 8 }}>Preview</h3>
                        <div className="preview-container">
                            <div className="preview-header">Content locker preview</div>
                            <div className="preview-body" style={{ flexDirection: "column", gap: 12, padding: 16 }}>
                                {/* Simulated locked content */}
                                <div
                                    style={{
                                        width: "100%",
                                        padding: 12,
                                        background: "#f7fafc",
                                        borderRadius: 8,
                                        filter: locker.blurContent ? "blur(6px)" : "none",
                                        opacity: locker.blurContent ? 1 : 0.3,
                                        fontSize: 11,
                                        color: "#4a5568",
                                        lineHeight: 1.6,
                                        userSelect: "none",
                                    }}
                                >
                                    This is the locked content that will be hidden or blurred
                                    until the visitor shares on one of the configured platforms.
                                    It can contain any HTML content on your page.
                                </div>

                                {/* Gate */}
                                <div
                                    style={{
                                        padding: "16px 20px",
                                        textAlign: "center",
                                        background: "#f7fafc",
                                        border: "2px dashed #cbd5e0",
                                        borderRadius: 12,
                                    }}
                                >
                                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "#1a202c" }}>
                                        {locker.message}
                                    </p>
                                    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                                        {locker.platforms.map((pid) => {
                                            const p = PLATFORMS.find((pl) => pl.id === pid)
                                            if (!p) return null
                                            return (
                                                <button
                                                    key={pid}
                                                    style={{
                                                        padding: "8px 14px",
                                                        border: "none",
                                                        borderRadius: 6,
                                                        cursor: "pointer",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        fontSize: 11,
                                                        background: p.brandColor,
                                                    }}
                                                >
                                                    Share on {p.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="info-box info-box-warn">
                        <span>
                            Content locker uses localStorage to remember unlocks.
                            Clearing browser data will re-lock content. Get the embed code from the Embed tab.
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}
