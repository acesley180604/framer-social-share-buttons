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
    mode: "horizontal" | "vertical" | "floating" | "inline" | "fly-in"
    spacing: number
    floatingPosition: "left" | "right"
    floatingOffsetX: number
    floatingOffsetY: number
    /** Fly-in specific */
    flyInPosition: "bottom-left" | "bottom-right"
    flyInTrigger: "scroll" | "time"
    flyInScrollPercent: number
    flyInTimeDelay: number
    flyInDismissable: boolean
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
    device?: string
    referrer?: string
}

export interface AnalyticsConfig {
    enabled: boolean
    events: ShareAnalyticsEvent[]
}

export interface FollowProfile {
    platformId: string
    handle: string
    followerCount: string
    enabled: boolean
}

export interface FollowConfig {
    profiles: FollowProfile[]
    buttonStyle: "icon-only" | "icon-text" | "text-only"
    buttonShape: "square" | "rounded" | "circle" | "pill"
    size: "small" | "medium" | "large"
    showCounts: boolean
    useUnifiedColor: boolean
    unifiedColor: string
}

export interface ImageSharingConfig {
    enabled: boolean
    platforms: string[]
    minImageWidth: number
    minImageHeight: number
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
}

export interface ClickToTweetConfig {
    text: string
    viaHandle: string
    hashtags: string
    style: "minimal" | "bordered" | "gradient" | "dark"
}

export interface ContentLockerConfig {
    enabled: boolean
    message: string
    platforms: string[]
    blurContent: boolean
    lockedContentId: string
}

export interface ShareCountConfig {
    enabled: boolean
    facebookAppId: string
    cacheTTLMinutes: number
}

export interface OGConfig {
    ogTitle: string
    ogDescription: string
    ogImage: string
    ogUrl: string
    ogType: string
    ogSiteName: string
    twitterCard: "summary" | "summary_large_image"
    twitterTitle: string
    twitterDescription: string
    twitterImage: string
    twitterSite: string
    twitterCreator: string
}

export interface ShareConfig {
    platforms: PlatformEntry[]
    style: StyleConfig
    layout: LayoutConfig
    shareText: ShareTextConfig
    animation: AnimationConfig
    showCounts: boolean
    analytics: AnalyticsConfig
    follow: FollowConfig
    imageSharing: ImageSharingConfig
    clickToTweets: ClickToTweetConfig[]
    contentLocker: ContentLockerConfig
    shareCountConfig: ShareCountConfig
    og: OGConfig
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

    // Follow
    updateFollow: (updates: Partial<FollowConfig>) => void
    updateFollowProfile: (platformId: string, updates: Partial<FollowProfile>) => void
    addFollowProfile: (profile: FollowProfile) => void
    removeFollowProfile: (platformId: string) => void

    // Image Sharing
    updateImageSharing: (updates: Partial<ImageSharingConfig>) => void

    // Click to Tweet
    addClickToTweet: (tweet: ClickToTweetConfig) => void
    updateClickToTweet: (index: number, updates: Partial<ClickToTweetConfig>) => void
    removeClickToTweet: (index: number) => void

    // Content Locker
    updateContentLocker: (updates: Partial<ContentLockerConfig>) => void

    // Share Counts
    updateShareCountConfig: (updates: Partial<ShareCountConfig>) => void

    // OG Tags
    updateOG: (updates: Partial<OGConfig>) => void

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

    // Follow
    updateFollow: (updates) =>
        set((state) => ({
            config: { ...state.config, follow: { ...state.config.follow, ...updates } },
        })),

    updateFollowProfile: (platformId, updates) =>
        set((state) => ({
            config: {
                ...state.config,
                follow: {
                    ...state.config.follow,
                    profiles: state.config.follow.profiles.map((p) =>
                        p.platformId === platformId ? { ...p, ...updates } : p
                    ),
                },
            },
        })),

    addFollowProfile: (profile) =>
        set((state) => ({
            config: {
                ...state.config,
                follow: {
                    ...state.config.follow,
                    profiles: [...state.config.follow.profiles, profile],
                },
            },
        })),

    removeFollowProfile: (platformId) =>
        set((state) => ({
            config: {
                ...state.config,
                follow: {
                    ...state.config.follow,
                    profiles: state.config.follow.profiles.filter((p) => p.platformId !== platformId),
                },
            },
        })),

    // Image Sharing
    updateImageSharing: (updates) =>
        set((state) => ({
            config: { ...state.config, imageSharing: { ...state.config.imageSharing, ...updates } },
        })),

    // Click to Tweet
    addClickToTweet: (tweet) =>
        set((state) => ({
            config: {
                ...state.config,
                clickToTweets: [...state.config.clickToTweets, tweet],
            },
        })),

    updateClickToTweet: (index, updates) =>
        set((state) => ({
            config: {
                ...state.config,
                clickToTweets: state.config.clickToTweets.map((t, i) =>
                    i === index ? { ...t, ...updates } : t
                ),
            },
        })),

    removeClickToTweet: (index) =>
        set((state) => ({
            config: {
                ...state.config,
                clickToTweets: state.config.clickToTweets.filter((_, i) => i !== index),
            },
        })),

    // Content Locker
    updateContentLocker: (updates) =>
        set((state) => ({
            config: { ...state.config, contentLocker: { ...state.config.contentLocker, ...updates } },
        })),

    // Share Counts
    updateShareCountConfig: (updates) =>
        set((state) => ({
            config: { ...state.config, shareCountConfig: { ...state.config.shareCountConfig, ...updates } },
        })),

    // OG Tags
    updateOG: (updates) =>
        set((state) => ({
            config: { ...state.config, og: { ...state.config.og, ...updates } },
        })),

    resetConfig: () => set({ config: { ...DEFAULT_SHARE_CONFIG } }),

    showToast: (message, type) => set({ toast: { message, type } }),

    clearToast: () => set({ toast: null }),
}))
