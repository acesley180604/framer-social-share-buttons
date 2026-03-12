import type { OGConfig } from "@/store/shareStore"

/**
 * Generate Open Graph + Twitter Card meta tags as an HTML string.
 */
export function generateOGMetaTags(og: OGConfig): string {
    const lines: string[] = []

    if (og.ogTitle) {
        lines.push(`<meta property="og:title" content="${escapeAttr(og.ogTitle)}" />`)
    }
    if (og.ogDescription) {
        lines.push(`<meta property="og:description" content="${escapeAttr(og.ogDescription)}" />`)
    }
    if (og.ogImage) {
        lines.push(`<meta property="og:image" content="${escapeAttr(og.ogImage)}" />`)
    }
    if (og.ogUrl) {
        lines.push(`<meta property="og:url" content="${escapeAttr(og.ogUrl)}" />`)
    }
    if (og.ogType) {
        lines.push(`<meta property="og:type" content="${escapeAttr(og.ogType)}" />`)
    }
    if (og.ogSiteName) {
        lines.push(`<meta property="og:site_name" content="${escapeAttr(og.ogSiteName)}" />`)
    }

    // Twitter Card
    if (og.twitterCard) {
        lines.push(`<meta name="twitter:card" content="${escapeAttr(og.twitterCard)}" />`)
    }
    if (og.twitterTitle || og.ogTitle) {
        lines.push(`<meta name="twitter:title" content="${escapeAttr(og.twitterTitle || og.ogTitle)}" />`)
    }
    if (og.twitterDescription || og.ogDescription) {
        lines.push(
            `<meta name="twitter:description" content="${escapeAttr(og.twitterDescription || og.ogDescription)}" />`
        )
    }
    if (og.twitterImage || og.ogImage) {
        lines.push(`<meta name="twitter:image" content="${escapeAttr(og.twitterImage || og.ogImage)}" />`)
    }
    if (og.twitterSite) {
        lines.push(`<meta name="twitter:site" content="${escapeAttr(og.twitterSite)}" />`)
    }
    if (og.twitterCreator) {
        lines.push(`<meta name="twitter:creator" content="${escapeAttr(og.twitterCreator)}" />`)
    }

    return lines.join("\n")
}

function escapeAttr(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
