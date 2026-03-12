import { useState } from "react"
import { useShareStore } from "./store/shareStore"
import PlatformSelector from "./components/PlatformSelector"
import StyleConfig from "./components/StyleConfig"
import LayoutConfig from "./components/LayoutConfig"
import ShareTextConfig from "./components/ShareTextConfig"
import PreviewPanel from "./components/PreviewPanel"
import AnimationConfig from "./components/AnimationConfig"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import EmbedCodePanel from "./components/EmbedCodePanel"
import Toast from "./components/Toast"

type Tab = "platforms" | "style" | "layout" | "share-text" | "animation" | "preview" | "analytics" | "embed"

const TABS: { id: Tab; label: string }[] = [
    { id: "platforms", label: "Platforms" },
    { id: "style", label: "Style" },
    { id: "layout", label: "Layout" },
    { id: "share-text", label: "Share Text" },
    { id: "animation", label: "Animate" },
    { id: "preview", label: "Preview" },
    { id: "analytics", label: "Analytics" },
    { id: "embed", label: "Embed" },
]

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("platforms")
    const { toast, clearToast, resetConfig } = useShareStore()

    return (
        <section>
            <header className="row-between" style={{ padding: "12px 15px", borderBottom: "1px solid var(--framer-color-divider)" }}>
                <div className="row gap-8">
                    <h1>Social Share Buttons</h1>
                </div>
                <button
                    className="btn-secondary"
                    onClick={resetConfig}
                    style={{ fontSize: 10, padding: "3px 8px" }}
                >
                    Reset
                </button>
            </header>

            <nav className="tab-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? "active" : ""}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main>
                {activeTab === "platforms" && <PlatformSelector />}
                {activeTab === "style" && <StyleConfig />}
                {activeTab === "layout" && <LayoutConfig />}
                {activeTab === "share-text" && <ShareTextConfig />}
                {activeTab === "animation" && <AnimationConfig />}
                {activeTab === "preview" && <PreviewPanel />}
                {activeTab === "analytics" && <AnalyticsDashboard />}
                {activeTab === "embed" && <EmbedCodePanel />}
            </main>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={clearToast}
                />
            )}
            <footer>Free plan active. Upgrade: Starter $9/mo | Pro $19/mo | Agency $39/mo</footer>
        </section>
    )
}
