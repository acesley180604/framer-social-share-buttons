import { useShareStore } from "@/store/shareStore"
import type { AnimationConfig as AnimationType } from "@/store/shareStore"

const HOVER_EFFECTS: { id: AnimationType["hoverEffect"]; label: string; desc: string }[] = [
    { id: "scale", label: "Scale", desc: "Grow slightly on hover" },
    { id: "lift", label: "Lift", desc: "Float up with shadow" },
    { id: "glow", label: "Glow", desc: "Add outer glow" },
    { id: "rotate", label: "Rotate", desc: "Slight rotation + scale" },
    { id: "none", label: "None", desc: "No hover effect" },
]

export default function AnimationConfig() {
    const { config, updateAnimation } = useShareStore()
    const anim = config.animation

    return (
        <div className="stack-lg">
            <section>
                <h2>Hover Animations</h2>
                <p style={{ marginTop: 4 }}>Choose how buttons react when users hover over them.</p>
            </section>

            {/* Hover effect selector */}
            <section className="stack-sm">
                <label>Hover Effect</label>
                <div className="stack-sm">
                    {HOVER_EFFECTS.map((effect) => (
                        <div
                            key={effect.id}
                            className={`card ${anim.hoverEffect === effect.id ? "card-active" : ""}`}
                            style={{ cursor: "pointer", padding: "8px 12px" }}
                            onClick={() => updateAnimation({ hoverEffect: effect.id })}
                        >
                            <div className="row-between">
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: 12 }}>{effect.label}</span>
                                    <p style={{ marginTop: 2 }}>{effect.desc}</p>
                                </div>
                                {anim.hoverEffect === effect.id && (
                                    <span style={{ color: "var(--framer-color-tint)", fontSize: 14, fontWeight: 700 }}>
                                        &check;
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Duration */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Animation Duration</label>
                    <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                        {anim.duration}ms
                    </span>
                </div>
                <input
                    type="range"
                    min={50}
                    max={500}
                    step={25}
                    value={anim.duration}
                    onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) })}
                />
            </section>

            {/* Preview hint */}
            <div className="info-box info-box-tint">
                <span>Switch to the Preview tab to see animations in action.</span>
            </div>
        </div>
    )
}
