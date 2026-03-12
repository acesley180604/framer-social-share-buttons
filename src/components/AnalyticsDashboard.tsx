import { useMemo, useCallback } from "react"
import { useShareStore } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"
import { copyToClipboard } from "@/utils/embedGenerator"

export default function AnalyticsDashboard() {
    const { config, toggleAnalytics, clearAnalytics, showToast } = useShareStore()
    const analytics = config.analytics
    const events = analytics.events

    // Aggregate by platform
    const platformCounts = useMemo(() => {
        const map = new Map<string, number>()
        for (const event of events) {
            map.set(event.platform, (map.get(event.platform) || 0) + 1)
        }
        return Array.from(map.entries())
            .map(([platform, count]) => ({ platform, count }))
            .sort((a, b) => b.count - a.count)
    }, [events])

    // Aggregate by page
    const pageCounts = useMemo(() => {
        const map = new Map<string, number>()
        for (const event of events) {
            map.set(event.page, (map.get(event.page) || 0) + 1)
        }
        return Array.from(map.entries())
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
    }, [events])

    // Daily aggregation
    const dailyStats = useMemo(() => {
        const map = new Map<string, number>()
        for (const event of events) {
            const date = new Date(event.timestamp).toISOString().split("T")[0]
            map.set(date, (map.get(date) || 0) + 1)
        }
        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
    }, [events])

    // Device breakdown
    const deviceCounts = useMemo(() => {
        const map = new Map<string, number>()
        for (const event of events) {
            const device = event.device || "unknown"
            map.set(device, (map.get(device) || 0) + 1)
        }
        return Array.from(map.entries())
            .map(([device, count]) => ({ device, count }))
            .sort((a, b) => b.count - a.count)
    }, [events])

    // Referrer analysis
    const referrerCounts = useMemo(() => {
        const map = new Map<string, number>()
        for (const event of events) {
            const referrer = event.referrer || "direct"
            map.set(referrer, (map.get(referrer) || 0) + 1)
        }
        return Array.from(map.entries())
            .map(([referrer, count]) => ({ referrer, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
    }, [events])

    const totalShares = events.length
    const uniquePlatforms = new Set(events.map((e) => e.platform)).size
    const uniquePages = new Set(events.map((e) => e.page)).size

    const handleExportCSV = useCallback(async () => {
        if (events.length === 0) return

        const headers = ["Platform", "URL", "Page", "Timestamp", "Device", "Referrer"]
        const rows = events.map((e) => [
            e.platform,
            e.url,
            e.page,
            new Date(e.timestamp).toISOString(),
            e.device || "",
            e.referrer || "",
        ])

        const csv = [
            headers.join(","),
            ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")),
        ].join("\n")

        const ok = await copyToClipboard(csv)
        if (ok) {
            showToast("CSV data copied to clipboard!", "success")
        }
    }, [events, showToast])

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
                            <div className="stat-value">{uniquePlatforms}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Pages</div>
                            <div className="stat-value">{uniquePages}</div>
                        </div>
                    </div>

                    {/* Platform breakdown */}
                    {platformCounts.length > 0 ? (
                        <section>
                            <h3 style={{ marginBottom: 6 }}>Platform Breakdown</h3>
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
                                        {platformCounts.map((row) => {
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
                        </section>
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
                                        {dailyStats.slice(-14).map((day) => (
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
                    {pageCounts.length > 0 && (
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
                                        {pageCounts.map((row) => (
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

                    {/* Device breakdown */}
                    {deviceCounts.length > 0 && deviceCounts.some((d) => d.device !== "unknown") && (
                        <section>
                            <h3 style={{ marginBottom: 6 }}>Device Breakdown</h3>
                            <div style={{ border: "1px solid var(--framer-color-divider)", borderRadius: 8, overflow: "hidden" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Device</th>
                                            <th className="text-right">Shares</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deviceCounts.map((row) => (
                                            <tr key={row.device}>
                                                <td className="text-primary capitalize">{row.device}</td>
                                                <td className="text-right">{row.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Referrer analysis */}
                    {referrerCounts.length > 0 && referrerCounts.some((r) => r.referrer !== "direct") && (
                        <section>
                            <h3 style={{ marginBottom: 6 }}>Top Referrers</h3>
                            <div style={{ border: "1px solid var(--framer-color-divider)", borderRadius: 8, overflow: "hidden" }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Referrer</th>
                                            <th className="text-right">Shares</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referrerCounts.map((row) => (
                                            <tr key={row.referrer}>
                                                <td className="text-primary truncate" style={{ maxWidth: 180 }}>
                                                    {row.referrer}
                                                </td>
                                                <td className="text-right">{row.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Actions */}
                    <div className="row gap-8">
                        {events.length > 0 && (
                            <>
                                <button className="btn-secondary" onClick={handleExportCSV}>
                                    Export as CSV
                                </button>
                                <button className="btn-danger" onClick={clearAnalytics}>
                                    Clear all data
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
