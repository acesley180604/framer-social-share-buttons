import { create } from "zustand"
import { DEFAULT_SHARE_CONFIG } from "@/utils/defaults"

// ── Types ───────────────────────────────────────────────────────────────────

export interface PlatformEntry {
    id: string
    enabled: boolean
    order: number
}

export interface StyleConfig {
    buttonStyle: "icon-only" | "icon-text" | "text-only"
    buttonShape: "square" | "rounded" | "circle" | "pill"
    size: "small" | "medium" | "large" | "custom"
    customSize: number
    useUnifiedColor: boolean
    unifiedColor: string
    unifiedHoverColor: string
}

export interface LayoutConfig {
    mode: "horizontal" | "vertical" | "floating" | "inline"
    spacing: number
    floatingPosition: "left" | "right"
    floatingOffsetX: number
    floatingOffsetY: number
}

export interface ShareTextConfig {
    customText: string
    customUrl: string
    usePageMeta: boolean
}

export interface AnimationConfig {
    hoverEffect: "scale" | "lift" | "glow" | "rotate" | "none"
    duration: number
}

export interface ShareAnalyticsEvent {
    platform: string
    url: string
    timestamp: number
    page: string
}

export interface AnalyticsConfig {
    enabled: boolean
    events: ShareAnalyticsEvent[]
}

export interface ShareConfig {
    platforms: PlatformEntry[]
    style: StyleConfig
    layout: LayoutConfig
    shareText: ShareTextConfig
    animation: AnimationConfig
    showCounts: boolean
    analytics: AnalyticsConfig
}

// ── Store ───────────────────────────────────────────────────────────────────

interface ShareState {
    config: ShareConfig
    toast: { message: string; type: "success" | "error" | "info" } | null

    // Platform actions
    togglePlatform: (id: string) => void
    reorderPlatform: (id: string, direction: "up" | "down") => void

    // Config updates
    updateStyle: (updates: Partial<StyleConfig>) => void
    updateLayout: (updates: Partial<LayoutConfig>) => void
    updateShareText: (updates: Partial<ShareTextConfig>) => void
    updateAnimation: (updates: Partial<AnimationConfig>) => void
    setShowCounts: (show: boolean) => void
    toggleAnalytics: (enabled: boolean) => void
    addAnalyticsEvent: (event: ShareAnalyticsEvent) => void
    clearAnalytics: () => void

    // Misc
    resetConfig: () => void
    showToast: (message: string, type: "success" | "error" | "info") => void
    clearToast: () => void
}

export const useShareStore = create<ShareState>((set) => ({
    config: { ...DEFAULT_SHARE_CONFIG },
    toast: null,

    togglePlatform: (id) =>
        set((state) => ({
            config: {
                ...state.config,
                platforms: state.config.platforms.map((p) =>
                    p.id === id ? { ...p, enabled: !p.enabled } : p
                ),
            },
        })),

    reorderPlatform: (id, direction) =>
        set((state) => {
            const platforms = [...state.config.platforms].sort((a, b) => a.order - b.order)
            const idx = platforms.findIndex((p) => p.id === id)
            if (idx === -1) return state
            const swapIdx = direction === "up" ? idx - 1 : idx + 1
            if (swapIdx < 0 || swapIdx >= platforms.length) return state

            const tempOrder = platforms[idx].order
            platforms[idx] = { ...platforms[idx], order: platforms[swapIdx].order }
            platforms[swapIdx] = { ...platforms[swapIdx], order: tempOrder }

            return { config: { ...state.config, platforms } }
        }),

    updateStyle: (updates) =>
        set((state) => ({
            config: { ...state.config, style: { ...state.config.style, ...updates } },
        })),

    updateLayout: (updates) =>
        set((state) => ({
            config: { ...state.config, layout: { ...state.config.layout, ...updates } },
        })),

    updateShareText: (updates) =>
        set((state) => ({
            config: { ...state.config, shareText: { ...state.config.shareText, ...updates } },
        })),

    updateAnimation: (updates) =>
        set((state) => ({
            config: { ...state.config, animation: { ...state.config.animation, ...updates } },
        })),

    setShowCounts: (show) =>
        set((state) => ({
            config: { ...state.config, showCounts: show },
        })),

    toggleAnalytics: (enabled) =>
        set((state) => ({
            config: {
                ...state.config,
                analytics: { ...state.config.analytics, enabled },
            },
        })),

    addAnalyticsEvent: (event) =>
        set((state) => ({
            config: {
                ...state.config,
                analytics: {
                    ...state.config.analytics,
                    events: [...state.config.analytics.events, event],
                },
            },
        })),

    clearAnalytics: () =>
        set((state) => ({
            config: {
                ...state.config,
                analytics: { ...state.config.analytics, events: [] },
            },
        })),

    resetConfig: () => set({ config: { ...DEFAULT_SHARE_CONFIG } }),

    showToast: (message, type) => set({ toast: { message, type } }),

    clearToast: () => set({ toast: null }),
}))
