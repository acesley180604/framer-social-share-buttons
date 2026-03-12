import type { ShareConfig } from "@/store/shareStore"

export const DEFAULT_SHARE_CONFIG: ShareConfig = {
    platforms: [
        { id: "facebook", enabled: true, order: 0 },
        { id: "twitter", enabled: true, order: 1 },
        { id: "linkedin", enabled: true, order: 2 },
        { id: "pinterest", enabled: false, order: 3 },
        { id: "reddit", enabled: false, order: 4 },
        { id: "whatsapp", enabled: true, order: 5 },
        { id: "telegram", enabled: false, order: 6 },
        { id: "email", enabled: true, order: 7 },
        { id: "copy", enabled: true, order: 8 },
    ],
    style: {
        buttonStyle: "icon-only",
        buttonShape: "rounded",
        size: "medium",
        customSize: 40,
        useUnifiedColor: false,
        unifiedColor: "#333333",
        unifiedHoverColor: "#555555",
    },
    layout: {
        mode: "horizontal",
        spacing: 8,
        floatingPosition: "left",
        floatingOffsetX: 16,
        floatingOffsetY: 50,
    },
    shareText: {
        customText: "",
        customUrl: "",
        usePageMeta: true,
    },
    animation: {
        hoverEffect: "scale",
        duration: 200,
    },
    showCounts: false,
    analytics: {
        enabled: false,
        events: [],
    },
}
