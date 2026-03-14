import { useState, useCallback, useMemo, memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useShareStore } from "@/store/shareStore"
import { PLATFORMS, buildFollowUrl } from "@/utils/platforms"
import type { FollowConfig } from "@/store/shareStore"

const FOLLOW_PLATFORMS = PLATFORMS.filter((p) => p.supportsFollow)

const BUTTON_STYLES: { id: FollowConfig["buttonStyle"]; label: string }[] = [
    { id: "icon-only", label: "Icon" },
    { id: "icon-text", label: "Icon + Text" },
    { id: "text-only", label: "Text" },
]

const BUTTON_SHAPES: { id: FollowConfig["buttonShape"]; label: string }[] = [
    { id: "square", label: "Square" },
    { id: "rounded", label: "Rounded" },
    { id: "circle", label: "Circle" },
    { id: "pill", label: "Pill" },
]

const FollowProfileRow = memo(function FollowProfileRow({
    platformId,
    handle,
    followerCount,
    enabled,
    onUpdate,
    onRemove,
}: {
    platformId: string
    handle: string
    followerCount: string
    enabled: boolean
    onUpdate: (platformId: string, updates: Record<string, unknown>) => void
    onRemove: (platformId: string) => void
}) {
    const platform = PLATFORMS.find((p) => p.id === platformId)
    if (!platform) return null

    return (
        <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className={`platform-item ${enabled ? "enabled" : ""}`}
            style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}
        >
            <div className="row-between">
                <div className="row gap-8">
                    <svg
                        className="platform-icon"
                        viewBox="0 0 24 24"
                        fill={enabled ? platform.brandColor : "var(--framer-color-text-tertiary)"}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d={platform.iconPath} />
                    </svg>
                    <span className="platform-name">{platform.name}</span>
                </div>
                <div className="row gap-6">
                    <div
                        className={`toggle ${enabled ? "on" : ""}`}
                        onClick={() => onUpdate(platformId, { enabled: !enabled })}
                    >
                        <div className="toggle-knob" />
                    </div>
                    <button
                        className="btn-danger"
                        onClick={() => onRemove(platformId)}
                        style={{ fontSize: 10 }}
                    >
                        Remove
                    </button>
                </div>
            </div>
            <div className="grid-2">
                <div>
                    <label style={{ fontSize: 10 }}>Handle / Username</label>
                    <input
                        type="text"
                        value={handle}
                        onChange={(e) => onUpdate(platformId, { handle: e.target.value })}
                        placeholder="username"
                        style={{ fontSize: 11 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 10 }}>Follower Count</label>
                    <input
                        type="text"
                        value={followerCount}
                        onChange={(e) => onUpdate(platformId, { followerCount: e.target.value })}
                        placeholder="12.5K"
                        style={{ fontSize: 11 }}
                    />
                </div>
            </div>
        </motion.div>
    )
})

export default function FollowButtons() {
    const { config, updateFollow, updateFollowProfile, addFollowProfile, removeFollowProfile } =
        useShareStore()
    const follow = config.follow
    const [addingPlatform, setAddingPlatform] = useState<string>("")

    const availablePlatforms = useMemo(
        () =>
            FOLLOW_PLATFORMS.filter(
                (p) => !follow.profiles.some((fp) => fp.platformId === p.id)
            ),
        [follow.profiles]
    )

    const handleAdd = useCallback(() => {
        if (!addingPlatform) return
        addFollowProfile({
            platformId: addingPlatform,
            handle: "",
            followerCount: "",
            enabled: true,
        })
        setAddingPlatform("")
    }, [addingPlatform, addFollowProfile])

    const handleUpdate = useCallback(
        (platformId: string, updates: Record<string, unknown>) => {
            updateFollowProfile(platformId, updates)
        },
        [updateFollowProfile]
    )

    // Preview
    const enabledProfiles = follow.profiles.filter((p) => p.enabled && p.handle)

    return (
        <div className="stack-lg">
            <section>
                <h2>Follow Buttons</h2>
                <p style={{ marginTop: 4 }}>
                    Add follow buttons to let visitors follow your social profiles.
                    Different from share buttons -- these link to your profiles.
                </p>
            </section>

            {/* Add profile */}
            {availablePlatforms.length > 0 && (
                <div className="row gap-8">
                    <select
                        value={addingPlatform}
                        onChange={(e) => setAddingPlatform(e.target.value)}
                        style={{ flex: 1 }}
                    >
                        <option value="">Select platform...</option>
                        {availablePlatforms.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <button className="framer-button-primary" onClick={handleAdd}>
                        Add
                    </button>
                </div>
            )}

            {/* Profile list */}
            <div className="stack-sm">
                <AnimatePresence mode="popLayout">
                    {follow.profiles.map((profile) => (
                        <FollowProfileRow
                            key={profile.platformId}
                            platformId={profile.platformId}
                            handle={profile.handle}
                            followerCount={profile.followerCount}
                            enabled={profile.enabled}
                            onUpdate={handleUpdate}
                            onRemove={removeFollowProfile}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {follow.profiles.length === 0 && (
                <div className="empty-state">
                    <p>No follow profiles added yet.</p>
                    <p style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                        Select a platform above and click Add.
                    </p>
                </div>
            )}

            <hr />

            {/* Style options */}
            <section className="stack-sm">
                <label>Button Style</label>
                <div className="segment-group">
                    {BUTTON_STYLES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => updateFollow({ buttonStyle: s.id })}
                            className={`segment-btn ${follow.buttonStyle === s.id ? "active" : ""}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="stack-sm">
                <label>Button Shape</label>
                <div className="segment-group">
                    {BUTTON_SHAPES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => updateFollow({ buttonShape: s.id })}
                            className={`segment-btn ${follow.buttonShape === s.id ? "active" : ""}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Show follower counts</label>
                    <div
                        className={`toggle ${follow.showCounts ? "on" : ""}`}
                        onClick={() => updateFollow({ showCounts: !follow.showCounts })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
            </section>

            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Unified color</label>
                    <div
                        className={`toggle ${follow.useUnifiedColor ? "on" : ""}`}
                        onClick={() => updateFollow({ useUnifiedColor: !follow.useUnifiedColor })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
                {follow.useUnifiedColor && (
                    <div className="color-row">
                        <input
                            type="color"
                            value={follow.unifiedColor}
                            onChange={(e) => updateFollow({ unifiedColor: e.target.value })}
                        />
                        <input
                            type="text"
                            value={follow.unifiedColor}
                            onChange={(e) => updateFollow({ unifiedColor: e.target.value })}
                            placeholder="#333333"
                        />
                    </div>
                )}
            </section>

            {/* Preview */}
            {enabledProfiles.length > 0 && (
                <>
                    <hr />
                    <section>
                        <h3 style={{ marginBottom: 8 }}>Preview</h3>
                        <div className="preview-container">
                            <div className="preview-header">Follow buttons</div>
                            <div className="preview-body">
                                {enabledProfiles.map((profile) => {
                                    const platform = PLATFORMS.find((p) => p.id === profile.platformId)
                                    if (!platform) return null
                                    const url = buildFollowUrl(platform.followUrlTemplate, profile.handle)
                                    const color = follow.useUnifiedColor
                                        ? follow.unifiedColor
                                        : platform.brandColor

                                    return (
                                        <a
                                            key={profile.platformId}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                                padding: "8px 14px",
                                                borderRadius: 6,
                                                background: color,
                                                color: "#fff",
                                                textDecoration: "none",
                                                fontSize: 12,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {follow.buttonStyle !== "text-only" && (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    width={16}
                                                    height={16}
                                                    fill="currentColor"
                                                >
                                                    <path d={platform.iconPath} />
                                                </svg>
                                            )}
                                            {follow.buttonStyle !== "icon-only" && (
                                                <span>{platform.name}</span>
                                            )}
                                            {follow.showCounts && profile.followerCount && (
                                                <span style={{ fontSize: 10, opacity: 0.8 }}>
                                                    {profile.followerCount}
                                                </span>
                                            )}
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
