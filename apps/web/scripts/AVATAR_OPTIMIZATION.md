# Avatar Image Optimization

## Problem

On Windows with fractional DPI scaling (125%, 150%), browser compositing layers can cause image blur after CSS animations complete, especially with transforms like `scale` or `opacity` transitions.

## Solution Implemented

### 1. **Removed All Animations on Avatar**

- Eliminated `Grow` wrapper (scale transform) from Avatar component
- Eliminated `Fade` wrapper to prevent opacity-based compositing
- Avatar now renders directly without any CSS transitions

### 2. **Added GPU Rendering Hints**

```tsx
sx={{
  backfaceVisibility: "hidden",
  transform: "translateZ(0)",
  WebkitFontSmoothing: "subpixel-antialiased",
}}
```

These properties force the browser to use GPU acceleration and crisp rendering.

### 3. **Generated Optimized Image Variants**

Created three precisely-sized versions using Lanczos3 resampling:

- `ProfilePic-88.jpg` - 88×88px for mobile (1x)
- `ProfilePic-176.jpg` - 176×176px for mobile retina/desktop (2x)
- `ProfilePic-320.jpg` - 320×320px for desktop retina (2x+)

### 4. **Implemented Responsive srcSet**

```tsx
srcSet: "ProfilePic-88.jpg 88w, ProfilePic-176.jpg 176w, ProfilePic-320.jpg 320w";
sizes: "(min-width: 900px) 160px, 88px";
```

Browser selects the optimal variant based on:

- Device pixel ratio (DPI)
- Viewport width
- Actual display size

### 5. **Changed Section Animation**

Replaced `Grow` with `Fade` in `Section.tsx` to eliminate parent-level scale transforms that could affect child images.

## How to Regenerate Optimized Images

If you update `ProfilePic.jpg`, regenerate variants:

```powershell
cd apps/web
node scripts/optimize-avatar.js
```

This will create/update:

- `public/ProfilePic-88.jpg`
- `public/ProfilePic-176.jpg`
- `public/ProfilePic-320.jpg`

## Image Specifications

- **Format**: Progressive JPEG with mozjpeg compression
- **Resampling**: Lanczos3 (highest quality downscaling)
- **Quality**: 95% (88px), 90% (176px), 85% (320px)
- **Fit**: Cover with center positioning

## Testing Checklist

✅ Test on Windows with 125%/150% DPI scaling  
✅ Hard refresh (Ctrl+F5) to clear cached versions  
✅ Verify image sharpness immediately after page load  
✅ Verify no blur appears after animations complete  
✅ Test on Chrome, Edge, Firefox  
✅ Test on mobile devices (iOS Safari, Chrome Android)

## Additional Notes

- `imageRendering: "-webkit-optimize-contrast"` enables Chromium's enhanced downscaling
- `fetchPriority: "high"` ensures avatar loads quickly (above-the-fold content)
- Exact pixel dimensions (88, 160) prevent fractional scaling blur on Windows
- No transforms or filters on image element itself

## Files Modified

- `src/components/AboutMeSection.tsx` - Avatar rendering with optimized srcSet
- `src/components/Section.tsx` - Replaced Grow with Fade
- `scripts/optimize-avatar.js` - Image optimization script
- `public/ProfilePic-88.jpg` - Generated variant
- `public/ProfilePic-176.jpg` - Generated variant
- `public/ProfilePic-320.jpg` - Generated variant
