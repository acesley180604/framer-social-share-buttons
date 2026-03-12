import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useShareStore } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"

const PlatformItem = memo(function PlatformItem({
    entryId,
    entryEnabled,
    onToggle,
    onReorder,
}: {
    entryId: string
    entryEnabled: boolean
    onToggle: (id: string) => void
    onReorder: (id: string, dir: "up" | "down") => void
}) {
    const platform = PLATFORMS.find((p) => p.id === entryId)
    if (!platform) return null

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`platform-item ${entryEnabled ? "enabled" : ""}`}
        >
            <svg
                className="platform-icon"
                viewBox="0 0 24 24"
                fill={entryEnabled ? platform.brandColor : "var(--framer-color-text-tertiary)"}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d={platform.iconPath} />
            </svg>

            <span className="platform-name">{platform.name}</span>

            <div className="reorder-btns">
                <button onClick={() => onReorder(entryId, "up")} title="Move up">
                    &uarr;
                </button>
                <button onClick={() => onReorder(entryId, "down")} title="Move down">
                    &darr;
                </button>
            </div>

            <div
                className={`toggle ${entryEnabled ? "on" : ""}`}
                onClick={() => onToggle(entryId)}
            >
                <div className="toggle-knob" />
            </div>
        </motion.div>
    )
})

export default function PlatformSelector() {
    const { config, togglePlatform, reorderPlatform } = useShareStore()
    const [showAll, setShowAll] = useState(false)

    const sorted = [...config.platforms].sort((a, b) => a.order - b.order)
    const displayed = showAll ? sorted : sorted.slice(0, 12)
    const enabledCount = config.platforms.filter((p) => p.enabled).length

    const handleToggle = useCallback(
        (id: string) => togglePlatform(id),
        [togglePlatform]
    )
    const handleReorder = useCallback(
        (id: string, dir: "up" | "down") => reorderPlatform(id, dir),
        [reorderPlatform]
    )

    return (
        <div className="stack">
            <section>
                <h2>Platforms</h2>
                <p style={{ marginTop: 4 }}>
                    Toggle platforms on/off and reorder them. {config.platforms.length} platforms available.
                </p>
            </section>

            <div className="stack-sm">
                <AnimatePresence mode="popLayout">
                    {displayed.map((entry) => (
                        <PlatformItem
                            key={entry.id}
                            entryId={entry.id}
                            entryEnabled={entry.enabled}
                            onToggle={handleToggle}
                            onReorder={handleReorder}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {sorted.length > 12 && (
                <button
                    className="btn-link"
                    onClick={() => setShowAll(!showAll)}
                    style={{ alignSelf: "center" }}
                >
                    {showAll ? "Show less" : `Show all ${sorted.length} platforms`}
                </button>
            )}

            <div className="info-box info-box-default">
                <span>
                    {enabledCount} of {config.platforms.length} platforms enabled.
                    Use arrows to reorder.
                </span>
            </div>
        </div>
    )
}
