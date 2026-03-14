import { useShareStore } from "@/store/shareStore"

export default function UTMConfig() {
    const { config, updateUTM } = useShareStore()
    const utm = config.utm

    return (
        <div className="stack-lg">
            <section>
                <h2>UTM Tracking</h2>
                <p style={{ marginTop: 4 }}>
                    Automatically append UTM parameters to shared URLs for campaign tracking
                    in Google Analytics and other tools.
                </p>
            </section>

            {/* Enable toggle */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Enable UTM tracking</label>
                    <div
                        className={`toggle ${utm.enabled ? "on" : ""}`}
                        onClick={() => updateUTM({ enabled: !utm.enabled })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
            </section>

            {utm.enabled && (
                <>
                    {/* Source */}
                    <section className="stack-sm">
                        <label>utm_source</label>
                        <div className="row-between" style={{ marginBottom: 4 }}>
                            <div className="pill-group">
                                <button
                                    className={`pill ${utm.source === "auto" ? "selected" : ""}`}
                                    onClick={() => updateUTM({ source: "auto" })}
                                >
                                    Auto (platform name)
                                </button>
                                <button
                                    className={`pill ${utm.source !== "auto" ? "selected" : ""}`}
                                    onClick={() => updateUTM({ source: utm.source === "auto" ? "website" : utm.source })}
                                >
                                    Custom
                                </button>
                            </div>
                        </div>
                        {utm.source !== "auto" && (
                            <input
                                type="text"
                                value={utm.source}
                                onChange={(e) => updateUTM({ source: e.target.value })}
                                placeholder="e.g. website, newsletter"
                            />
                        )}
                        <p>
                            "Auto" uses the platform name (facebook, twitter, linkedin, etc.)
                            as the source automatically.
                        </p>
                    </section>

                    {/* Medium */}
                    <section className="stack-sm">
                        <label>utm_medium</label>
                        <input
                            type="text"
                            value={utm.medium}
                            onChange={(e) => updateUTM({ medium: e.target.value })}
                            placeholder="social"
                        />
                        <p>The marketing medium. Default: "social".</p>
                    </section>

                    {/* Campaign */}
                    <section className="stack-sm">
                        <label>utm_campaign</label>
                        <input
                            type="text"
                            value={utm.campaign}
                            onChange={(e) => updateUTM({ campaign: e.target.value })}
                            placeholder="e.g. spring_sale, product_launch"
                        />
                        <p>The campaign name for tracking purposes.</p>
                    </section>

                    {/* Preview */}
                    <div className="info-box">
                        <span style={{ fontSize: 10, wordBreak: "break-all" }}>
                            Example URL:
                            {" "}https://example.com/page
                            ?utm_source={utm.source === "auto" ? "facebook" : utm.source}
                            {utm.medium && `&utm_medium=${utm.medium}`}
                            {utm.campaign && `&utm_campaign=${utm.campaign}`}
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}
