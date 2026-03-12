import { useShareStore } from "@/store/shareStore"
import type { LayoutConfig as LayoutConfigType } from "@/store/shareStore"

const LAYOUT_MODES: { id: LayoutConfigType["mode"]; label: string; desc: string }[] = [
    { id: "horizontal", label: "Horizontal", desc: "Buttons in a row" },
    { id: "vertical", label: "Vertical", desc: "Buttons stacked" },
    { id: "floating", label: "Floating", desc: "Fixed sidebar" },
    { id: "inline", label: "Inline", desc: "Inline with text" },
]

export default function LayoutConfig() {
    const { config, updateLayout } = useShareStore()
    const layout = config.layout

    return (
        <div className="stack-lg">
            {/* Layout Mode */}
            <section className="stack-sm">
                <label>Layout Mode</label>
                <div className="stack-sm">
                    {LAYOUT_MODES.map((m) => (
                        <div
                            key={m.id}
                            className={`card ${layout.mode === m.id ? "card-active" : ""}`}
                            style={{ cursor: "pointer", padding: "8px 12px" }}
                            onClick={() => updateLayout({ mode: m.id })}
                        >
                            <div className="row-between">
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: 12 }}>{m.label}</span>
                                    <p style={{ marginTop: 2 }}>{m.desc}</p>
                                </div>
                                {layout.mode === m.id && (
                                    <span style={{ color: "var(--framer-color-tint)", fontSize: 14, fontWeight: 700 }}>
                                        &check;
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Spacing */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Spacing</label>
                    <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                        {layout.spacing}px
                    </span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={24}
                    value={layout.spacing}
                    onChange={(e) => updateLayout({ spacing: parseInt(e.target.value) })}
                />
            </section>

            {/* Floating-specific options */}
            {layout.mode === "floating" && (
                <>
                    <hr />
                    <section className="stack-sm">
                        <label>Floating Position</label>
                        <div className="segment-group">
                            <button
                                onClick={() => updateLayout({ floatingPosition: "left" })}
                                className={`segment-btn ${layout.floatingPosition === "left" ? "active" : ""}`}
                            >
                                Left
                            </button>
                            <button
                                onClick={() => updateLayout({ floatingPosition: "right" })}
                                className={`segment-btn ${layout.floatingPosition === "right" ? "active" : ""}`}
                            >
                                Right
                            </button>
                        </div>
                    </section>

                    <section className="stack-sm">
                        <div className="grid-2">
                            <div>
                                <label>Offset X (px)</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={layout.floatingOffsetX}
                                    onChange={(e) =>
                                        updateLayout({ floatingOffsetX: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>
                            <div>
                                <label>Offset Y (%)</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={layout.floatingOffsetY}
                                    onChange={(e) =>
                                        updateLayout({ floatingOffsetY: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
