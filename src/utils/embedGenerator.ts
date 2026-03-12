import type { ShareConfig, ClickToTweetConfig } from "@/store/shareStore"
import { PLATFORMS } from "@/utils/platforms"

/**
 * Generate inline embed code for Social Share Buttons.
 * The generated snippet is self-contained -- no external dependencies.
 */
export function generateEmbedCode(config: ShareConfig): string {
    const json = JSON.stringify(config)
    return `<!-- Social Share Buttons v2 -->
<div data-ssb-config='${json.replace(/'/g, "&#39;")}' style="display:none"></div>
<script>
${getEmbedRuntime()}
</script>
<!-- /Social Share Buttons -->`
}

/**
 * Generate a minimal embed code that loads from a CDN URL.
 */
export function generateCdnEmbedCode(config: ShareConfig, cdnUrl: string): string {
    const json = JSON.stringify(config)
    return `<!-- Social Share Buttons v2 -->
<div data-ssb-config='${json.replace(/'/g, "&#39;")}' style="display:none"></div>
<script src="${cdnUrl}/embed.js" defer></script>
<!-- /Social Share Buttons -->`
}

/**
 * Generate embed code for Follow Buttons.
 */
export function generateFollowEmbedCode(config: ShareConfig): string {
    const follow = config.follow
    const enabledProfiles = follow.profiles.filter((p) => p.enabled)
    if (enabledProfiles.length === 0) return "<!-- No follow profiles configured -->"

    const buttonsHtml = enabledProfiles
        .map((profile) => {
            const platform = PLATFORMS.find((p) => p.id === profile.platformId)
            if (!platform || !platform.followUrlTemplate) return ""
            const url = platform.followUrlTemplate.replace("{handle}", profile.handle)
            const countHtml = follow.showCounts && profile.followerCount
                ? `<span class="ssb-follow-count">${profile.followerCount}</span>`
                : ""
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ssb-follow-btn" data-platform="${profile.platformId}" style="background:${follow.useUnifiedColor ? follow.unifiedColor : platform.brandColor}">${platform.name}${countHtml}</a>`
        })
        .filter(Boolean)
        .join("\n    ")

    return `<!-- Social Follow Buttons -->
<div class="ssb-follow-container">
    ${buttonsHtml}
</div>
<style>
.ssb-follow-container{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ssb-follow-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:6px;color:#fff;text-decoration:none;font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;transition:opacity .2s}
.ssb-follow-btn:hover{opacity:.85}
.ssb-follow-count{font-size:11px;opacity:.8}
</style>
<!-- /Social Follow Buttons -->`
}

/**
 * Generate embed code for Image Hover Sharing.
 */
export function generateImageSharingEmbedCode(config: ShareConfig): string {
    const imgConfig = config.imageSharing
    if (!imgConfig.enabled) return "<!-- Image sharing is disabled -->"

    return `<!-- Image Hover Sharing -->
<script>
(function(){
  var platforms=${JSON.stringify(imgConfig.platforms)};
  var minW=${imgConfig.minImageWidth},minH=${imgConfig.minImageHeight};
  var pos="${imgConfig.position}";
  function init(){
    var imgs=document.querySelectorAll("img");
    for(var i=0;i<imgs.length;i++){
      (function(img){
        if(img.naturalWidth<minW||img.naturalHeight<minH)return;
        if(img.closest("[data-ssb-no-hover]"))return;
        var wrap=document.createElement("div");
        wrap.style.cssText="position:relative;display:inline-block";
        img.parentNode.insertBefore(wrap,img);
        wrap.appendChild(img);
        var overlay=document.createElement("div");
        overlay.className="ssb-img-overlay";
        overlay.style.cssText="position:absolute;"+getPosCSS(pos)+"display:none;gap:4px;z-index:99";
        platforms.forEach(function(pid){
          var btn=document.createElement("button");
          btn.className="ssb-img-btn";
          btn.setAttribute("data-platform",pid);
          btn.textContent=pid.charAt(0).toUpperCase();
          btn.style.cssText="width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;color:#fff;font-weight:700;font-size:12px;background:rgba(0,0,0,0.6);transition:background .2s";
          btn.onclick=function(e){e.preventDefault();e.stopPropagation();shareImage(pid,img.src,document.title)};
          overlay.appendChild(btn);
        });
        wrap.appendChild(overlay);
        wrap.onmouseenter=function(){overlay.style.display="flex"};
        wrap.onmouseleave=function(){overlay.style.display="none"};
      })(imgs[i]);
    }
  }
  function getPosCSS(p){
    switch(p){
      case"top-left":return"top:8px;left:8px;";
      case"top-right":return"top:8px;right:8px;";
      case"bottom-left":return"bottom:8px;left:8px;";
      case"bottom-right":return"bottom:8px;right:8px;";
      case"center":return"top:50%;left:50%;transform:translate(-50%,-50%);";
      default:return"top:8px;right:8px;";
    }
  }
  function shareImage(pid,imgUrl,title){
    var urls={pinterest:"https://pinterest.com/pin/create/button/?url="+encodeURIComponent(location.href)+"&media="+encodeURIComponent(imgUrl)+"&description="+encodeURIComponent(title),facebook:"https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(location.href),twitter:"https://twitter.com/intent/tweet?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(title)};
    var url=urls[pid];
    if(url)window.open(url,"_blank","noopener,noreferrer,width=600,height=500");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
</script>
<!-- /Image Hover Sharing -->`
}

/**
 * Generate embed code for a Click-to-Tweet box.
 */
export function generateClickToTweetEmbedCode(tweet: ClickToTweetConfig, index: number): string {
    const via = tweet.viaHandle ? `&via=${encodeURIComponent(tweet.viaHandle.replace("@", ""))}` : ""
    const hashtags = tweet.hashtags ? `&hashtags=${encodeURIComponent(tweet.hashtags)}` : ""
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.text)}${via}${hashtags}`

    const styleMap: Record<string, string> = {
        minimal: "border:1px solid #e2e8f0;background:#fff;color:#1a202c",
        bordered: "border:2px solid #1DA1F2;background:#f7fafc;color:#1a202c",
        gradient: "border:none;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff",
        dark: "border:none;background:#1a202c;color:#fff",
    }

    const charCount = tweet.text.length
    const remaining = 280 - charCount

    return `<!-- Click to Tweet #${index + 1} -->
<div class="ssb-ctt ssb-ctt-${tweet.style}" style="padding:20px 24px;border-radius:12px;cursor:pointer;position:relative;font-family:-apple-system,sans-serif;${styleMap[tweet.style] || styleMap.minimal}" onclick="window.open('${tweetUrl}','_blank','noopener,noreferrer,width=600,height=500')">
  <blockquote style="margin:0 0 12px;font-size:16px;line-height:1.5;font-weight:500">${tweet.text}</blockquote>
  <div style="display:flex;align-items:center;justify-content:space-between">
    <span style="font-size:12px;opacity:.6">${remaining} characters remaining</span>
    <span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;opacity:.8">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Click to Tweet
    </span>
  </div>
</div>
<!-- /Click to Tweet -->`
}

/**
 * Generate embed code for Content Locker.
 */
export function generateContentLockerEmbedCode(config: ShareConfig): string {
    const locker = config.contentLocker
    if (!locker.enabled) return "<!-- Content locker is disabled -->"

    return `<!-- Content Locker -->
<script>
(function(){
  var cfg=${JSON.stringify(locker)};
  function init(){
    var el=document.getElementById(cfg.lockedContentId);
    if(!el)return;
    var isUnlocked=localStorage.getItem("ssb_unlocked_"+cfg.lockedContentId);
    if(isUnlocked)return;
    var overlay=document.createElement("div");
    overlay.className="ssb-locker-overlay";
    overlay.style.cssText="position:relative;";
    if(cfg.blurContent){el.style.filter="blur(8px)";el.style.userSelect="none";el.style.pointerEvents="none";}
    else{el.style.display="none";}
    var gate=document.createElement("div");
    gate.className="ssb-locker-gate";
    gate.style.cssText="padding:24px;text-align:center;background:#f7fafc;border:2px dashed #cbd5e0;border-radius:12px;margin:16px 0;font-family:-apple-system,sans-serif";
    gate.innerHTML='<p style="font-size:16px;font-weight:600;margin:0 0 12px">'+cfg.message+'</p><div class="ssb-locker-btns" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"></div>';
    var btnsDiv=gate.querySelector(".ssb-locker-btns");
    cfg.platforms.forEach(function(pid){
      var btn=document.createElement("button");
      btn.textContent="Share on "+pid.charAt(0).toUpperCase()+pid.slice(1);
      btn.style.cssText="padding:10px 20px;border:none;border-radius:8px;cursor:pointer;color:#fff;font-weight:600;font-size:13px;background:#333;transition:opacity .2s";
      btn.onclick=function(){
        var shareUrl="";
        if(pid==="facebook")shareUrl="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(location.href);
        else if(pid==="twitter")shareUrl="https://twitter.com/intent/tweet?url="+encodeURIComponent(location.href);
        else if(pid==="linkedin")shareUrl="https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(location.href);
        if(shareUrl){
          window.open(shareUrl,"_blank","noopener,noreferrer,width=600,height=500");
          localStorage.setItem("ssb_unlocked_"+cfg.lockedContentId,"1");
          if(cfg.blurContent){el.style.filter="none";el.style.userSelect="auto";el.style.pointerEvents="auto";}
          else{el.style.display="";}
          gate.remove();
        }
      };
      btnsDiv.appendChild(btn);
    });
    el.parentNode.insertBefore(gate,el);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
</script>
<!-- /Content Locker -->`
}

function getEmbedRuntime(): string {
    // Build ICONS, COLORS, NAMES, URLS from PLATFORMS
    const icons: Record<string, string> = {}
    const colors: Record<string, string> = {}
    const names: Record<string, string> = {}
    const urls: Record<string, string> = {}

    for (const p of PLATFORMS) {
        icons[p.id] = `<path d="${p.iconPath}"/>`
        colors[p.id] = p.brandColor
        names[p.id] = p.name
        if (p.shareUrlTemplate) {
            urls[p.id] = p.shareUrlTemplate
        }
    }

    return `(function(){var ICONS=${JSON.stringify(icons)};var COLORS=${JSON.stringify(colors)};var NAMES=${JSON.stringify(names)};var URLS=${JSON.stringify(urls)};function enc(s){return encodeURIComponent(s)}function getConfig(){var el=document.querySelector("[data-ssb-config]");if(!el)return null;try{return JSON.parse(el.getAttribute("data-ssb-config")||"")}catch(e){return null}}function init(){var cfg=getConfig();if(!cfg)return;var pageUrl=cfg.shareText&&cfg.shareText.customUrl?cfg.shareText.customUrl:window.location.href;var pageText=cfg.shareText&&cfg.shareText.customText?cfg.shareText.customText:document.title;var platforms=cfg.platforms.filter(function(p){return p.enabled}).sort(function(a,b){return a.order-b.order});if(!platforms.length)return;var st=cfg.style||{};var ly=cfg.layout||{};var anim=cfg.animation||{};var mode=ly.mode||"horizontal";var spacing=ly.spacing||8;var shape=st.buttonShape||"rounded";var btnStyle=st.buttonStyle||"icon-only";var size=st.size||"medium";var customSize=st.customSize||40;var useUnified=st.useUnifiedColor||false;var unifiedColor=st.unifiedColor||"#333";var unifiedHover=st.unifiedHoverColor||"#555";var px;switch(size){case"small":px=32;break;case"medium":px=40;break;case"large":px=48;break;case"custom":px=customSize;break;default:px=40}var iconSize=Math.round(px*0.5);var borderRadius;switch(shape){case"square":borderRadius="0";break;case"rounded":borderRadius=Math.round(px*0.2)+"px";break;case"circle":borderRadius="50%";break;case"pill":borderRadius=px+"px";break;default:borderRadius=Math.round(px*0.2)+"px"}var container=document.createElement("div");container.id="ssb-container";container.setAttribute("role","group");container.setAttribute("aria-label","Share this page");var isFloating=mode==="floating";var isFlyIn=mode==="fly-in";var isVertical=mode==="vertical"||isFloating;Object.assign(container.style,{display:"flex",flexDirection:isVertical?"column":"row",flexWrap:btnStyle==="text-only"?"wrap":"nowrap",gap:spacing+"px",alignItems:"center"});if(isFloating){var floatPos=ly.floatingPosition||"left";var offX=ly.floatingOffsetX||16;var offY=ly.floatingOffsetY||50;Object.assign(container.style,{position:"fixed",zIndex:"999998",top:offY+"%",transform:"translateY(-50%)"});container.style[floatPos]=offX+"px"}if(isFlyIn){var flyPos=ly.flyInPosition||"bottom-left";Object.assign(container.style,{position:"fixed",zIndex:"999998",bottom:"20px",padding:"16px",background:"#fff",borderRadius:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",transform:"translateY(120%)",transition:"transform 0.4s ease"});if(flyPos==="bottom-left")container.style.left="20px";else container.style.right="20px";if(ly.flyInDismissable){var closeBtn=document.createElement("button");closeBtn.textContent="x";closeBtn.style.cssText="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;font-size:16px;color:#999;font-weight:700";closeBtn.onclick=function(){container.style.transform="translateY(120%)"};container.appendChild(closeBtn)}function showFlyIn(){container.style.transform="translateY(0)"}if(ly.flyInTrigger==="scroll"){window.addEventListener("scroll",function(){var pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;if(pct>=(ly.flyInScrollPercent||50))showFlyIn()})}else{setTimeout(showFlyIn,(ly.flyInTimeDelay||5)*1000)}}var hoverEffect=anim.hoverEffect||"scale";var dur=anim.duration||200;var styleTag=document.createElement("style");styleTag.textContent="#ssb-container .ssb-btn{transition:all "+dur+"ms ease;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;cursor:pointer;font-family:-apple-system,sans-serif;font-weight:600;text-decoration:none;line-height:1}#ssb-container .ssb-btn:hover{"+getHoverCss(hoverEffect)+"}#ssb-container .ssb-btn:active{transform:scale(0.95)}";document.head.appendChild(styleTag);for(var i=0;i<platforms.length;i++){(function(p){var pid=p.id;var color=useUnified?unifiedColor:(COLORS[pid]||"#333");var hoverColor=useUnified?unifiedHover:color;var isTextOnly=btnStyle==="text-only";var hasText=btnStyle==="icon-text"||isTextOnly;var btn=document.createElement("button");btn.className="ssb-btn";btn.setAttribute("aria-label","Share on "+(NAMES[pid]||pid));btn.setAttribute("data-platform",pid);var w=isTextOnly?"auto":px+"px";var h=px+"px";var pad=isTextOnly?"8px 16px":hasText?"8px 14px":"0";Object.assign(btn.style,{width:w,height:h,padding:pad,borderRadius:borderRadius,background:color,color:"#fff",fontSize:Math.max(11,Math.round(px*0.3))+"px"});btn.onmouseenter=function(){btn.style.background=hoverColor;btn.style.opacity="0.9"};btn.onmouseleave=function(){btn.style.background=color;btn.style.opacity="1"};if(!isTextOnly&&ICONS[pid]){var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="'+iconSize+'" height="'+iconSize+'" fill="currentColor">'+ICONS[pid]+"</svg>";btn.innerHTML=svg}if(hasText){var span=document.createElement("span");span.textContent=pid==="copy"?"Copy":(NAMES[pid]||pid);btn.appendChild(span)}btn.onclick=function(e){e.preventDefault();if(pid==="copy"){if(navigator.clipboard){navigator.clipboard.writeText(pageUrl).then(function(){showCopied(btn)}).catch(function(){})}else{var ta=document.createElement("textarea");ta.value=pageUrl;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);showCopied(btn)}trackShare(cfg,pid);return}if(pid==="print"){window.print();trackShare(cfg,pid);return}var tmpl=URLS[pid];if(!tmpl)return;var url=tmpl.replace("{url}",enc(pageUrl)).replace("{text}",enc(pageText));if(pid==="email"||pid==="sms")window.location.href=url;else window.open(url,"_blank","noopener,noreferrer,width=600,height=500");trackShare(cfg,pid)};container.appendChild(btn)})(platforms[i])}var target=document.querySelector("[data-ssb-config]");if(target&&target.parentNode)target.parentNode.insertBefore(container,target.nextSibling);else document.body.appendChild(container);function showCopied(btn){var orig=btn.innerHTML;var isTO=btnStyle==="text-only";btn.innerHTML=isTO?"Copied!":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="'+iconSize+'" height="'+iconSize+'" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';setTimeout(function(){btn.innerHTML=orig},1500)}function trackShare(c,platform){if(!c.analytics||!c.analytics.enabled)return;var endpoint=window.__SSB_ANALYTICS_URL||"";if(!endpoint)return;fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({platform:platform,url:pageUrl,timestamp:Date.now(),page:window.location.pathname})}).catch(function(){})}}function getHoverCss(effect){switch(effect){case"scale":return"transform:scale(1.1)";case"lift":return"transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.2)";case"glow":return"box-shadow:0 0 12px rgba(0,0,0,0.3)";case"rotate":return"transform:rotate(8deg) scale(1.05)";case"none":return"";default:return"transform:scale(1.1)"}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()})();`
}

/**
 * Copy text to clipboard. Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand("copy")
            return true
        } catch {
            return false
        } finally {
            document.body.removeChild(textarea)
        }
    }
}
