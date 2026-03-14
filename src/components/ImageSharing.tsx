import { useCallback } from "react"
import { useShareStore } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"

const IMAGE_PLATFORMS = PLATFORMS.filter((p) =>
    ["pinterest", "facebook", "twitter", "linkedin", "tumblr", "reddit"].includes(p.id)
)

const POSITIONS = [
    { id: "top-left" as const, label: "Top Left" },
    { id: "top-right" as const, label: "Top Right" },
    { id: "bottom-left" as const, label: "Bottom Left" },
    { id: "bottom-right" as const, label: "Bottom Right" },
    { id: "center" as const, label: "Center" },
]

export default function ImageSharing() {
    const { config, updateImageSharing } = useShareStore()
    const imgConfig = config.imageSharing

    const togglePlatform = useCallback(
        (id: string) => {
            const current = imgConfig.platforms
            const updated = current.includes(id)
                ? current.filter((p) => p !== id)
                : [...current, id]
            updateImageSharing({ platforms: updated })
        },
        [imgConfig.platforms, updateImageSharing]
    )

    return (
        <div className="stack-lg">
            <section>
                <h2>Image Hover Sharing</h2>
                <p style={{ marginTop: 4 }}>
                    When visitors hover over images on your page, share icons appear
                    (Monarch-style). Great for Pinterest-heavy sites.
                </p>
            </section>

            {/* Enable toggle */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Enable image sharing</label>
                    <div
                        className={`toggle ${imgConfig.enabled ? "on" : ""}`}
                        onClick={() => updateImageSharing({ enabled: !imgConfig.enabled })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
            </section>

            {imgConfig.enabled && (
                <>
                    {/* Platform selection */}
                    <section className="stack-sm">
                        <label>Platforms to show on hover</label>
                        <div className="stack-sm">
                            {IMAGE_PLATFORMS.map((platform) => {
                                const isEnabled = imgConfig.platforms.includes(platform.id)
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

                    {/* Minimum image size */}
                    <section className="stack-sm">
                        <label>Minimum Image Size</label>
                        <p>Images smaller than this threshold will not show hover icons.</p>
                        <div className="grid-2">
                            <div>
                                <label style={{ fontSize: 10 }}>Min Width (px)</label>
                                <input
                                    type="number"
                                    min={50}
                                    max={1000}
                                    value={imgConfig.minImageWidth}
                                    onChange={(e) =>
                                        updateImageSharing({ minImageWidth: parseInt(e.target.value) || 200 })
                                    }
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 10 }}>Min Height (px)</label>
                                <input
                                    type="number"
                                    min={50}
                                    max={1000}
                                    value={imgConfig.minImageHeight}
                                    onChange={(e) =>
                                        updateImageSharing({ minImageHeight: parseInt(e.target.value) || 200 })
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* Position */}
                    <section className="stack-sm">
                        <label>Icon Position on Image</label>
                        <div className="segment-group" style={{ flexWrap: "wrap" }}>
                            {POSITIONS.map((pos) => (
                                <button
                                    key={pos.id}
                                    onClick={() => updateImageSharing({ position: pos.id })}
                                    className={`segment-btn ${imgConfig.position === pos.id ? "active" : ""}`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Preview */}
                    <section>
                        <h3 style={{ marginBottom: 8 }}>Preview</h3>
                        <div className="preview-container">
                            <div className="preview-header">Image hover sharing</div>
                            <div
                                className="preview-body"
                                style={{
                                    position: "relative",
                                    minHeight: 120,
                                    background: "#e2e8f0",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: 160,
                                        height: 100,
                                        background: "#cbd5e0",
                                        borderRadius: 8,
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 10,
                                        color: "#718096",
                                    }}
                                >
                                    Sample Image
                                    <div
                                        style={{
                                            position: "absolute",
                                            ...(imgConfig.position === "top-left" && { top: 4, left: 4 }),
                                            ...(imgConfig.position === "top-right" && { top: 4, right: 4 }),
                                            ...(imgConfig.position === "bottom-left" && { bottom: 4, left: 4 }),
                                            ...(imgConfig.position === "bottom-right" && { bottom: 4, right: 4 }),
                                            ...(imgConfig.position === "center" && {
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                            }),
                                            display: "flex",
                                            gap: 4,
                                        }}
                                    >
                                        {imgConfig.platforms.slice(0, 3).map((pid) => {
                                            const p = PLATFORMS.find((pl) => pl.id === pid)
                                            if (!p) return null
                                            return (
                                                <div
                                                    key={pid}
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        background: "rgba(0,0,0,0.6)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        width={12}
                                                        height={12}
                                                        fill="#fff"
                                                    >
                                                        <path d={p.iconPath} />
                                                    </svg>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <div className="info-box info-box-tint">
                <span>
                    Get the embed code from the Embed tab after configuring.
                    Add <code>data-ssb-no-hover</code> to any image you want to exclude.
                </span>
            </div>
        </div>
    )
}
