import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useShareStore } from "./store/shareStore"
import PlatformSelector from "./components/PlatformSelector"
import StyleConfig from "./components/StyleConfig"
import LayoutConfig from "./components/LayoutConfig"
import ShareTextConfig from "./components/ShareTextConfig"
import AnimationConfig from "./components/AnimationConfig"
import PreviewPanel from "./components/PreviewPanel"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import EmbedCodePanel from "./components/EmbedCodePanel"
import FollowButtons from "./components/FollowButtons"
import ImageSharing from "./components/ImageSharing"
import ClickToTweet from "./components/ClickToTweet"
import ContentLocker from "./components/ContentLocker"
import ShareCountConfig from "./components/ShareCountConfig"
import UTMConfig from "./components/UTMConfig"
import OGMetaTags from "./components/OGMetaTags"
import Toast from "./components/Toast"

type Tab =
    | "platforms"
    | "style"
    | "layout"
    | "share-text"
    | "animation"
    | "follow"
    | "images"
    | "tweet"
    | "locker"
    | "counts"
    | "utm"
    | "og-tags"
    | "preview"
    | "analytics"
    | "embed"

const TABS: { id: Tab; label: string }[] = [
    { id: "platforms", label: "Platforms" },
    { id: "style", label: "Style" },
    { id: "layout", label: "Layout" },
    { id: "share-text", label: "Text" },
    { id: "animation", label: "Animate" },
    { id: "follow", label: "Follow" },
    { id: "images", label: "Images" },
    { id: "tweet", label: "Tweet" },
    { id: "locker", label: "Locker" },
    { id: "counts", label: "Counts" },
    { id: "utm", label: "UTM" },
    { id: "og-tags", label: "OG Tags" },
    { id: "preview", label: "Preview" },
    { id: "analytics", label: "Analytics" },
    { id: "embed", label: "Embed" },
]

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("platforms")
    const { toast, clearToast, resetConfig } = useShareStore()

    const handleTabChange = useCallback((tab: Tab) => {
        setActiveTab(tab)
    }, [])

    const handleReset = useCallback(() => {
        resetConfig()
    }, [resetConfig])

    const tabContent = useMemo(() => {
        switch (activeTab) {
            case "platforms": return <PlatformSelector />
            case "style": return <StyleConfig />
            case "layout": return <LayoutConfig />
            case "share-text": return <ShareTextConfig />
            case "animation": return <AnimationConfig />
            case "follow": return <FollowButtons />
            case "images": return <ImageSharing />
            case "tweet": return <ClickToTweet />
            case "locker": return <ContentLocker />
            case "counts": return <ShareCountConfig />
            case "utm": return <UTMConfig />
            case "og-tags": return <OGMetaTags />
            case "preview": return <PreviewPanel />
            case "analytics": return <AnalyticsDashboard />
            case "embed": return <EmbedCodePanel />
            default: return null
        }
    }, [activeTab])

    return (
        <section>
            <header className="row-between" style={{ padding: "12px 15px", borderBottom: "1px solid var(--framer-color-divider)" }}>
                <div className="row gap-8">
                    <h1>Social Share Buttons</h1>
                </div>
                <button
                    className="btn-secondary"
                    onClick={handleReset}
                    style={{ fontSize: 10, padding: "3px 8px" }}
                >
                    Reset
                </button>
            </header>

            <nav className="tab-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={activeTab === tab.id ? "active" : ""}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                    >
                        {tabContent}
                    </motion.div>
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onDismiss={clearToast}
                    />
                )}
            </AnimatePresence>
            <footer>Free plan active. Upgrade: Starter $9/mo | Pro $19/mo | Agency $39/mo</footer>
        </section>
    )
}
