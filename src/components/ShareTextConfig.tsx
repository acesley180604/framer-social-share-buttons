import { useShareStore } from "@/store/shareStore"

export default function ShareTextConfig() {
    const { config, updateShareText, setShowCounts } = useShareStore()
    const shareText = config.shareText

    return (
        <div className="stack-lg">
            <section>
                <h2>Share Text &amp; URL</h2>
                <p style={{ marginTop: 4 }}>
                    Override the default page title and URL used when sharing.
                </p>
            </section>

            {/* Use page meta toggle */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Use page meta (auto)</label>
                    <div
                        className={`toggle ${shareText.usePageMeta ? "on" : ""}`}
                        onClick={() => updateShareText({ usePageMeta: !shareText.usePageMeta })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
                <p>
                    When enabled, the share text and URL will be pulled from the page's
                    title and canonical URL automatically.
                </p>
            </section>

            {/* Custom text */}
            {!shareText.usePageMeta && (
                <>
                    <section className="stack-sm">
                        <label>Custom Share Text</label>
                        <textarea
                            rows={3}
                            value={shareText.customText}
                            onChange={(e) => updateShareText({ customText: e.target.value })}
                            placeholder="Check out this awesome page!"
                        />
                    </section>

                    <section className="stack-sm">
                        <label>Custom Share URL</label>
                        <input
                            type="url"
                            value={shareText.customUrl}
                            onChange={(e) => updateShareText({ customUrl: e.target.value })}
                            placeholder="https://example.com/my-page"
                        />
                    </section>
                </>
            )}

            <hr />

            {/* Show counts toggle */}
            <section className="stack-sm">
                <div className="row-between">
                    <div>
                        <label style={{ margin: 0 }}>Show share counts</label>
                        <p>Display approximate share counts under buttons.</p>
                    </div>
                    <div
                        className={`toggle ${config.showCounts ? "on" : ""}`}
                        onClick={() => setShowCounts(!config.showCounts)}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
                {config.showCounts && (
                    <div className="info-box info-box-warn">
                        <span>
                            Share counts require third-party APIs and may not be available for all
                            platforms. Counts are approximate.
                        </span>
                    </div>
                )}
            </section>
        </div>
    )
}
