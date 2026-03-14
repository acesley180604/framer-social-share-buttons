import { useShareStore } from "@/store/shareStore"

export default function ShareCountConfig() {
    const { config, updateShareCountConfig } = useShareStore()
    const scc = config.shareCountConfig

    return (
        <div className="stack-lg">
            <section>
                <h2>Share Count Integration</h2>
                <p style={{ marginTop: 4 }}>
                    Display real share counts from platform APIs where available.
                    Some platforms have deprecated their count APIs.
                </p>
            </section>

            {/* Enable toggle */}
            <section className="stack-sm">
                <div className="row-between">
                    <label style={{ margin: 0 }}>Enable share counts</label>
                    <div
                        className={`toggle ${scc.enabled ? "on" : ""}`}
                        onClick={() => updateShareCountConfig({ enabled: !scc.enabled })}
                    >
                        <div className="toggle-knob" />
                    </div>
                </div>
            </section>

            {scc.enabled && (
                <>
                    {/* Facebook App ID */}
                    <section className="stack-sm">
                        <label>Facebook App ID</label>
                        <input
                            type="text"
                            value={scc.facebookAppId}
                            onChange={(e) => updateShareCountConfig({ facebookAppId: e.target.value })}
                            placeholder="Your Facebook App ID"
                        />
                        <p>
                            Required for Facebook share counts via the Graph API.
                            Create an app at{" "}
                            <a
                                href="https://developers.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "var(--framer-color-tint)" }}
                            >
                                developers.facebook.com
                            </a>
                        </p>
                    </section>

                    {/* Cache TTL */}
                    <section className="stack-sm">
                        <div className="row-between">
                            <label style={{ margin: 0 }}>Cache duration</label>
                            <span style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                                {scc.cacheTTLMinutes} min
                            </span>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={1440}
                            step={5}
                            value={scc.cacheTTLMinutes}
                            onChange={(e) =>
                                updateShareCountConfig({ cacheTTLMinutes: parseInt(e.target.value) })
                            }
                        />
                        <p>How long to cache share counts before re-fetching from APIs.</p>
                    </section>

                    {/* Minimum Share Count */}
                    <section className="stack-sm">
                        <label>Minimum share count</label>
                        <input
                            type="number"
                            min={0}
                            value={scc.minShareCount || 0}
                            onChange={(e) =>
                                updateShareCountConfig({ minShareCount: parseInt(e.target.value) || 0 })
                            }
                        />
                        <p>
                            Hide share counts below this number to avoid showing low numbers.
                            Set to 0 to always show counts.
                        </p>
                    </section>

                    {/* Platform availability */}
                    <section className="stack-sm">
                        <h3>API Availability</h3>
                        <div style={{ border: "1px solid var(--framer-color-divider)", borderRadius: 8, overflow: "hidden" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Platform</th>
                                        <th>Count API</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-primary">Facebook</td>
                                        <td>Graph API</td>
                                        <td>
                                            <span className={`badge ${scc.facebookAppId ? "badge-active" : "badge-draft"}`}>
                                                {scc.facebookAppId ? "Configured" : "Needs App ID"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-primary">Pinterest</td>
                                        <td>Pin Count API</td>
                                        <td><span className="badge badge-active">Available</span></td>
                                    </tr>
                                    <tr>
                                        <td className="text-primary">Reddit</td>
                                        <td>Info API</td>
                                        <td><span className="badge badge-active">Available</span></td>
                                    </tr>
                                    <tr>
                                        <td className="text-primary">X (Twitter)</td>
                                        <td>Count API</td>
                                        <td><span className="badge badge-paused">Deprecated</span></td>
                                    </tr>
                                    <tr>
                                        <td className="text-primary">LinkedIn</td>
                                        <td>Count API</td>
                                        <td><span className="badge badge-paused">Deprecated</span></td>
                                    </tr>
                                    <tr>
                                        <td className="text-primary">Others</td>
                                        <td>N/A</td>
                                        <td><span className="badge badge-draft">No API</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="info-box info-box-warn">
                        <span>
                            Share counts are approximate and depend on third-party APIs.
                            When an API is unavailable, no count is shown for that platform.
                            Counts are cached locally using the TTL above.
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}
