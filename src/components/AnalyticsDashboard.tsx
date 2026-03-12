import { useShareStore } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"

export default function AnalyticsDashboard() {
    const { config, toggleAnalytics, clearAnalytics } = useShareStore()
    const analytics = config.analytics
    const events = analytics.events

    // Aggregate by platform
    const platformCounts = new Map<string, number>()
    for (const event of events) {
        platformCounts.set(event.platform, (platformCounts.get(event.platform) || 0) + 1)
    }

    const sortedPlatforms = Array.from(platformCounts.entries())
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count)

    // Aggregate by page
    const pageCounts = new Map<string, number>()
    for (const event of events) {
        pageCounts.set(event.page, (pageCounts.get(event.page) || 0) + 1)
    }

    const sortedPages = Array.from(pageCounts.entries())
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

    // Daily aggregation
    const dailyCounts = new Map<string, number>()
    for (const event of events) {
        const date = new Date(event.timestamp).toISOString().split("T")[0]
        dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    }

    const dailyStats = Array.from(dailyCounts.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

    const totalShares = events.length

    return (
        <div className="stack-lg">
            {/* Toggle */}
            <div className="row-between">
                <h2>Share Analytics</h2>
                <div
                    className={`toggle ${analytics.enabled ? "on" : ""}`}
                    onClick={() => toggleAnalytics(!analytics.enabled)}
                >
                    <div className="toggle-knob" />
                </div>
            </div>

            {!analytics.enabled && (
                <div className="info-box info-box-default">
                    <span>
                        Enable analytics to track when visitors click your share buttons.
                        Events are recorded locally in the embed config.
                    </span>
                </div>
            )}

            {analytics.enabled && (
                <>
                    {/* Summary */}
                    <div className="grid-3">
                        <div className="stat-card">
                            <div className="stat-label">Total Shares</div>
                            <div className="stat-value">{totalShares.toLocaleString()}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Platforms</div>
                            <div className="stat-value">{platformCounts.size}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Pages</div>
                            <div className="stat-value">{pageCounts.size}</div>
                        </div>
                    </div>

                    {/* Platform breakdown */}
                    {sortedPlatforms.length > 0 ? (
                        <div style={{ border: "1px solid var(--framer-color-divider)", borderRadius: 8, overflow: "hidden" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Platform</th>
                                        <th className="text-right">Shares</th>
                                        <th className="text-right">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedPlatforms.map((row) => {
                                        const platform = PLATFORMS.find((p) => p.id === row.platform)
                                        const pct = totalShares > 0 ? ((row.count / totalShares) * 100).toFixed(1) : "0"
                                        return (
                                            <tr key={row.platform}>
                                                <td className="text-primary">
                                                    <div className="row gap-6">
                                                        {platform && (
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                width={14}
                                                                height={14}
                                                                fill={platform.brandColor}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d={platform.iconPath} />
                                                            </svg>
                                                        )}
                                                        <span>{platform?.name ?? row.platform}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right text-green">{row.count}</td>
                                                <td className="text-right">{pct}%</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No share events recorded yet.</p>
                            <p style={{ fontSize: 10, color: "var(--framer-color-text-tertiary)" }}>
                                Share events will appear here once visitors start using your buttons.
                            </p>
                        </div>
                    )}

                    {/* Daily stats */}
                    {dailyStats.length > 0 && (
                        <section>
                            <h3 style={{ marginBottom: 6 }}>Daily Activity</h3>
                            <div style={{ border: "1px solid var(--framer-color-divider)", borderRadius: 8, overflow: "hidden" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th className="text-right">Shares</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyStats.map((day) => (
                                            <tr key={day.date}>
                                                <td className="text-primary">{day.date}</td>
                                                <td className="text-right">{day.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Top pages */}
                    {sortedPages.length > 0 && (
                        <section>
                            <h3 style={{ marginBottom: 6 }}>Top Pages</h3>
                            <div style={{ border: "1px solid var(--framer-color-divider)", borderRadius: 8, overflow: "hidden" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Page</th>
                                            <th className="text-right">Shares</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedPages.map((row) => (
                                            <tr key={row.page}>
                                                <td className="text-primary truncate" style={{ maxWidth: 180 }}>
                                                    {row.page}
                                                </td>
                                                <td className="text-right">{row.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Clear button */}
                    {events.length > 0 && (
                        <button
                            className="btn-danger"
                            onClick={clearAnalytics}
                            style={{ alignSelf: "flex-start" }}
                        >
                            Clear all analytics data
                        </button>
                    )}
                </>
            )}
        </div>
    )
}
