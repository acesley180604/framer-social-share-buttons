import { useState, useCallback, useMemo } from "react"
import { motion } from "motion/react"
import { useShareStore } from "@/store/shareStore"
import { PLATFORMS, buildShareUrl } from "@/utils/platforms"

export default function PreviewPanel() {
    const { config } = useShareStore()
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const enabledPlatforms = useMemo(
        () =>
            [...config.platforms]
                .filter((p) => p.enabled)
                .sort((a, b) => a.order - b.order),
        [config.platforms]
    )

    const style = config.style
    const layout = config.layout
    const anim = config.animation

    const previewUrl = config.shareText.customUrl || "https://yoursite.com"
    const previewText = config.shareText.customText || "Check out this page!"

    const px = useMemo(() => {
        switch (style.size) {
            case "small": return 32
            case "medium": return 40
            case "large": return 48
            case "custom": return style.customSize
            default: return 40
        }
    }, [style.size, style.customSize])

    const iconSize = Math.round(px * 0.5)

    const borderRadius = useMemo(() => {
        switch (style.buttonShape) {
            case "square": return "0"
            case "rounded": return `${Math.round(px * 0.2)}px`
            case "circle": return "50%"
            case "pill": return `${px}px`
            default: return `${Math.round(px * 0.2)}px`
        }
    }, [style.buttonShape, px])

    const isVertical = layout.mode === "vertical" || layout.mode === "floating"
    const isTextOnly = style.buttonStyle === "text-only"
    const hasText = style.buttonStyle === "icon-text" || isTextOnly

    const getHoverStyle = useCallback((): React.CSSProperties => {
        switch (anim.hoverEffect) {
            case "scale": return { transform: "scale(1.1)" }
            case "lift": return { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }
            case "glow": return { boxShadow: "0 0 12px rgba(0,0,0,0.3)" }
            case "rotate": return { transform: "rotate(8deg) scale(1.05)" }
            default: return {}
        }
    }, [anim.hoverEffect])

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(previewUrl)
            setCopiedId("copy")
            setTimeout(() => setCopiedId(null), 1500)
        } catch {
            // Fallback silently
        }
    }, [previewUrl])

    if (enabledPlatforms.length === 0) {
        return (
            <div className="stack">
                <div className="empty-state">
                    <p>No platforms enabled.</p>
                    <p style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                        Go to the Platforms tab and enable at least one.
                    </p>
                </div>
            </div>
        )
    }

    function renderButton(platformId: string) {
        const platform = PLATFORMS.find((p) => p.id === platformId)
        if (!platform) return null

        const color = style.useUnifiedColor ? style.unifiedColor : platform.brandColor
        const hoverColor = style.useUnifiedColor ? style.unifiedHoverColor : color
        const isHovered = hoveredId === platformId
        const isCopied = copiedId === platformId

        const baseStyle: React.CSSProperties = {
            width: isTextOnly ? "auto" : px,
            height: px,
            padding: isTextOnly ? "8px 16px" : hasText ? "8px 14px" : 0,
            borderRadius,
            background: isHovered ? hoverColor : color,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: Math.max(11, Math.round(px * 0.3)),
            fontWeight: 600,
            fontFamily: "inherit",
            transition: `all ${anim.duration}ms ease`,
            opacity: isHovered ? 0.9 : 1,
            ...(isHovered ? getHoverStyle() : {}),
        }

        const handleClick = () => {
            if (platformId === "copy") {
                void handleCopy()
                return
            }
            if (platformId === "print") {
                window.print()
                return
            }
            if (!platform.shareUrlTemplate) return
            const url = buildShareUrl(platform.shareUrlTemplate, previewUrl, previewText)
            if (platformId === "email" || platformId === "sms") {
                window.location.href = url
            } else {
                window.open(url, "_blank", "noopener,noreferrer,width=600,height=500")
            }
        }

        return (
            <motion.button
                key={platformId}
                style={baseStyle}
                onClick={handleClick}
                onMouseEnter={() => setHoveredId(platformId)}
                onMouseLeave={() => setHoveredId(null)}
                title={`Share on ${platform.name}`}
                aria-label={`Share on ${platform.name}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
            >
                {!isTextOnly && (
                    <svg
                        viewBox="0 0 24 24"
                        width={iconSize}
                        height={iconSize}
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d={platform.iconPath} />
                    </svg>
                )}
                {hasText && (
                    <span>
                        {isCopied ? "Copied!" : platformId === "copy" ? "Copy" : platform.name}
                    </span>
                )}
            </motion.button>
        )
    }

    return (
        <div className="stack-lg">
            <section>
                <h2>Live Preview</h2>
                <p style={{ marginTop: 4 }}>This is how your share buttons will look on your site.</p>
            </section>

            {/* Preview box */}
            <div className="preview-container">
                <div className="preview-header">
                    {layout.mode === "floating"
                        ? `Floating sidebar (${layout.floatingPosition})`
                        : layout.mode === "fly-in"
                        ? `Fly-in (${layout.flyInPosition})`
                        : `Layout: ${layout.mode}`}
                </div>
                <div
                    className="preview-body"
                    style={{
                        flexDirection: isVertical ? "column" : "row",
                        gap: layout.spacing,
                        justifyContent: layout.mode === "inline" ? "flex-start" : "center",
                        position: layout.mode === "floating" ? "relative" : undefined,
                        minHeight: layout.mode === "floating" || layout.mode === "fly-in" ? 200 : undefined,
                    }}
                >
                    {layout.mode === "floating" && (
                        <div
                            style={{
                                position: "absolute",
                                [layout.floatingPosition]: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                display: "flex",
                                flexDirection: "column",
                                gap: layout.spacing,
                            }}
                        >
                            {enabledPlatforms.map((entry) => renderButton(entry.id))}
                        </div>
                    )}

                    {layout.mode === "fly-in" && (
                        <div
                            style={{
                                position: "absolute",
                                [layout.flyInPosition === "bottom-left" ? "left" : "right"]: 12,
                                bottom: 12,
                                display: "flex",
                                flexDirection: "row",
                                gap: layout.spacing,
                                padding: 12,
                                background: "#fff",
                                borderRadius: 12,
                                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                            }}
                        >
                            {enabledPlatforms.map((entry) => renderButton(entry.id))}
                        </div>
                    )}

                    {layout.mode !== "floating" && layout.mode !== "fly-in" &&
                        enabledPlatforms.map((entry) => renderButton(entry.id))}
                </div>
            </div>

            {/* Settings summary */}
            <div className="info-box info-box-default">
                <div className="stack-sm">
                    <div className="row-between">
                        <span>Style</span>
                        <span style={{ fontWeight: 500 }}>{style.buttonStyle}</span>
                    </div>
                    <div className="row-between">
                        <span>Shape</span>
                        <span style={{ fontWeight: 500 }}>{style.buttonShape}</span>
                    </div>
                    <div className="row-between">
                        <span>Size</span>
                        <span style={{ fontWeight: 500 }}>{px}px</span>
                    </div>
                    <div className="row-between">
                        <span>Hover</span>
                        <span style={{ fontWeight: 500 }}>{anim.hoverEffect}</span>
                    </div>
                    <div className="row-between">
                        <span>Colors</span>
                        <span style={{ fontWeight: 500 }}>
                            {style.useUnifiedColor ? `Unified (${style.unifiedColor})` : "Brand colors"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
