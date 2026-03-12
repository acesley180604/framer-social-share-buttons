import { useShareStore } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"

export default function PlatformSelector() {
    const { config, togglePlatform, reorderPlatform } = useShareStore()
    const sorted = [...config.platforms].sort((a, b) => a.order - b.order)

    return (
        <div className="stack">
            <section>
                <h2>Platforms</h2>
                <p style={{ marginTop: 4 }}>Toggle platforms on/off and reorder them.</p>
            </section>

            <div className="stack-sm">
                {sorted.map((entry) => {
                    const platform = PLATFORMS.find((p) => p.id === entry.id)
                    if (!platform) return null

                    return (
                        <div
                            key={entry.id}
                            className={`platform-item ${entry.enabled ? "enabled" : ""}`}
                        >
                            <svg
                                className="platform-icon"
                                viewBox="0 0 24 24"
                                fill={entry.enabled ? platform.brandColor : "var(--framer-color-text-tertiary)"}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d={platform.iconPath} />
                            </svg>

                            <span className="platform-name">{platform.name}</span>

                            <div className="reorder-btns">
                                <button
                                    onClick={() => reorderPlatform(entry.id, "up")}
                                    title="Move up"
                                >
                                    &uarr;
                                </button>
                                <button
                                    onClick={() => reorderPlatform(entry.id, "down")}
                                    title="Move down"
                                >
                                    &darr;
                                </button>
                            </div>

                            <div
                                className={`toggle ${entry.enabled ? "on" : ""}`}
                                onClick={() => togglePlatform(entry.id)}
                            >
                                <div className="toggle-knob" />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="info-box info-box-default">
                <span>
                    {config.platforms.filter((p) => p.enabled).length} of {config.platforms.length} platforms enabled.
                    Drag the arrows to reorder.
                </span>
            </div>
        </div>
    )
}
