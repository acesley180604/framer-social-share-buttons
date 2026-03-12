import { useShareStore } from "@/store/shareStore"
import type { StyleConfig as StyleConfigType } from "@/store/shareStore"

const BUTTON_STYLES: { id: StyleConfigType["buttonStyle"]; label: string }[] = [
    { id: "icon-only", label: "Icon" },
    { id: "icon-text", label: "Icon + Text" },
    { id: "text-only", label: "Text" },
]

const BUTTON_SHAPES: { id: StyleConfigType["buttonShape"]; label: string }[] = [
    { id: "square", label: "Square" },
    { id: "rounded", label: "Rounded" },
    { id: "circle", label: "Circle" },
    { id: "pill", label: "Pill" },
]

const SIZES: { id: StyleConfigType["size"]; label: string }[] = [
    { id: "small", label: "S" },
    { id: "medium", label: "M" },
    { id: "large", label: "L" },
    { id: "custom", label: "Custom" },
]

export default function StyleConfig() {
    const { config, updateStyle } = useShareStore()
    const style = config.style

    return (
        <div className="stack-lg">
            {/* Button Style */}
            <section className="stack-sm">
                <label>Button Style</label>
                <div className="segment-group">
                    {BUTTON_STYLES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => updateStyle({ buttonStyle: s.id })}
                            className={`segment-btn ${style.buttonStyle === s.id ? "active" : ""}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Button Shape */}
            <section className="stack-sm">
                <label>Button Shape</label>
                <div className="segment-group">
                    {BUTTON_SHAPES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => updateStyle({ buttonShape: s.id })}
                            className={`segment-btn ${style.buttonShape === s.id ? "active" : ""}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Size */}
            <section className="stack-sm">
                <label>Size</label>
                <div className="segment-group">
                    {SIZES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => updateStyle({ size: s.id })}
                            className={`segment-btn ${style.size === s.id ? "active" : ""}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
                {style.size === "custom" && (
                    <div className="row gap-8" style={{ marginTop: 4 }}>
                        <label style={{ margin: 0 }}>Custom size (px)</label>
                        <input
                            type="number"
                            className="compact"
                            min={20}
                            max={80}
                            value={style.customSize}
                            onChange={(e) => updateStyle({ customSize: parseInt(e.target.value) || 40 })}
                        />
                    </div>
                )}
            </section>

            <hr />

            {/* Unified Color */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Use unified color</label>
                    <div
                        className={`toggle ${style.useUnifiedColor ? "on" : ""}`}
                        onClick={() => updateStyle({ useUnifiedColor: !style.useUnifiedColor })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
                <p>When off, each platform uses its brand color.</p>

                {style.useUnifiedColor && (
                    <>
                        <div className="color-row">
                            <input
                                type="color"
                                value={style.unifiedColor}
                                onChange={(e) => updateStyle({ unifiedColor: e.target.value })}
                            />
                            <input
                                type="text"
                                value={style.unifiedColor}
                                onChange={(e) => updateStyle({ unifiedColor: e.target.value })}
                                placeholder="#333333"
                            />
                            <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>Default</span>
                        </div>
                        <div className="color-row">
                            <input
                                type="color"
                                value={style.unifiedHoverColor}
                                onChange={(e) => updateStyle({ unifiedHoverColor: e.target.value })}
                            />
                            <input
                                type="text"
                                value={style.unifiedHoverColor}
                                onChange={(e) => updateStyle({ unifiedHoverColor: e.target.value })}
                                placeholder="#555555"
                            />
                            <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>Hover</span>
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}
