# Yasser Creatives: Animation & Interaction Architecture Guide (Deep Dive)

This document serves as the comprehensive technical manifest for the Yasser Creatives animation and interaction system. It is designed to ensure that as the platform scales with more static sections, components, and pages, the 100% human-designed vision remains perfectly synchronized with the automated reveal and transition engines.

---

## 1. System Philosophy: The "Surgical Reveal" Engine
The animation layer of Yasser Creatives is not a series of ad-hoc scripts; it is a unified **Surgical Reveal Engine**.

### Core Principles:
- **Zero Flash of Unstyled Content (FOUC)**: Elements intended for animation are pre-hidden at the CSS level before JavaScript even executes.
- **State-Gated Execution**: Animations are physically barred from running if the transition shutters (Shuffle) are closed or the Preloader is active.
- **Performance First**: The engine uses GSAP's hardware-accelerated transforms (x, y, scale, rotation) and avoids expensive layout-triggering properties like `top`, `left`, or `width/height` where possible.
- **Declarative Attachment**: Behavior is defined in the HTML/JSX layer via `data-ys-reveal`, keeping the JavaScript overhead predictable and centralized.

---

## 2. The "Triple-Lock" Lifecycle
Every page on the site follows a strict "Triple-Lock" lifecycle to ensure the entrance is flawless.

### Lock 1: The Transition Shutter (Shuffle)
Managed in `src/context/TransitionContext.jsx`. 
- When a user navigates, five black shutters close. 
- While `isAnimating` is `true`, all page content is theoretically "locked" behind a black wall.
- **Critical Status**: The system will not attempt to fire ScrollTriggers until these shutters are gone.

### Lock 2: The Logic Guard (Pending State)
Managed via `isPendingReveal`.
- Even after the shutters close, the new page is not revealed until it explicitly signals it is "Ready" via `revealPage()`.
- This prevents the user from seeing a "white screen" or "blank video" if a component is still fetching high-resolution assets or decoding video.

### Lock 3: The Reveal Hook (`useReveal.js`)
The final gate. It monitors both of the above. 
- **Wait Phase**: Watches the DOM, prepares SplitText objects, and sets initial transforms.
- **Fire Phase**: Only when `isAnimating === false` AND `isPendingReveal === false`, it converts the "Ready" state into a "Motion" state via GSAP sequences.

---

## 3. Deep Dive into `useReveal.js` (CRITICAL)
**Status:** 🛑 **CRITICAL SYSTEM CORE - DO NOT MODIFY BASE LOGIC.**

This hook is responsible for the "Automated Motion Detection."

### Operational Breakdown:
1. **The Selector Engine**: Uses `gsap.utils.toArray` to find all elements with `data-ys-reveal`.
2. **Text Processing**: 
   - Utilizes `SplitText` to break paragraphs into lines.
   - Wraps lines in a parent mask (`overflow: hidden`) to allow the "surgical" reveal from the bottom.
3. **State Management**:
   ```javascript
   if (isAnimating || isPendingReveal) return; // The Logic Guard
   ```
   This line is the most important in the entire codebase. It prevents a "False Start."
4. **ScrollTrigger Integration**:
   - Each element gets its own `ScrollTrigger` instance.
   - Default `start: "top 95%"` ensures that as the user scrolls, content enters only as it "breaks the surface" of the viewport.
5. **Cleanup Mechanism**:
   - Every time a user leaves a page, the hook runs a return function that "destroys" the GSAP instances and reverts `SplitText` changes. This keeps the browser memory footprint low.

---

## 4. Animation Triggers & Data Attributes
To integrate static content, apply these attributes exactly as described.

### Text Reveals
- **Attribute**: `data-ys-reveal="text"`
- **Effect**: Lines rise 100% from their own container mask with a smooth opacity ramp.
- **Customization**: Use `data-ys-delay="X.X"` to stagger headings after paragraphs.

### Visual Containers
- **Attribute**: `data-ys-reveal="image"`
- **Effect**: Uses a CSS `clip-path` inset animation. The container opens from bottom-to-top while the inner image scales down from 1.2 to 1 for a parallax-feel entry.

### Interaction Elements (Buttons/Links)
- **Attribute**: `data-ys-reveal="fade-up"`
- **Effect**: A 30px upward slide combined with a 0.8s opacity fade.
- **Pairs with**: The `.ys-magnetic` class for mouse-following behavior.

### Architectural Lines
- **Attribute**: `data-ys-reveal="scale-x"`
- **Effect**: Scales an element from 0 to 1 on the X-axis from a left-anchored transform origin.

---

## 5. Global Codebase Map

| File | Exact Function | Modification Risk |
| :--- | :--- | :--- |
| `src/context/TransitionContext.jsx` | Manages the global `isAnimating` and `revealPage` states. | **CRITICAL**. Do not remove state locks. |
| `src/gsap.js` | Source of truth for GSAP, ScrollTrigger, and ScrollSmoother registration. | **CRITICAL**. Do not unregister plugins. |
| `src/hooks/useReveal.js` | The main observer engine for all declarative animations. | **CRITICAL**. Do not change the dependency array. |
| `src/styles/main.css` | Controls the "Initial State" (e.g., `opacity: 0`) for elements. | **SAFE/EXTENDABLE**. Add new reveal types here. |
| `src/App.jsx` | Orchestrates the `useGlobalReveal` hook at the highest level. | **CAUTION**. Keep the hook at the root level. |
| `src/pages/*.jsx` | The actual user-facing content files. | **SAFE**. Build everything here. |

---

## 6. Safe Integration Protocol: Adding a New Page

When you create a new static page (e.g., `Work.jsx`), follow this protocol to ensure it "joins" the animation system correctly:

1. **Import the Controls**:
   ```javascript
   import { useTransition } from '../context/TransitionContext';
   ```
2. **Access the reveal signal**:
   ```javascript
   const { revealPage } = useTransition();
   ```
3. **Trigger on Mount**:
   Send the signal only when the component is ready.
   ```javascript
   useEffect(() => {
       revealPage(); // The world opens
   }, []);
   ```
4. **Structure the HTML**:
   Use standardized data attributes for all text and containers.
   ```html
   <h2 data-ys-reveal="text">My New Work</h2>
   ```

---

## 7. Performance & Debugging Guide

### Common Stalling Issues:
- **"Blank Screen"**: You added a new page but forgot to call `revealPage()`. The system is waiting for a signal that will never come.
- **"Stuttering Scroll"**: You have too many `data-ys-reveal="image"` tags on one screen. Try adding `loading="lazy"` to the images and ensuring they are `.webp`.

### The "Surgical" Rule:
Never wrap a large section in a single `data-ys-reveal="fade-up"`. It is better to have 10 small reveals than 1 giant one. This allows the GSAP engine to only calculate the math for elements that are actually in the viewport.

---

## 8. Exception Strategy: Custom Interactions
If a section needs a specific, non-standard animation (e.g., a rotating 3D gallery):

1. **Avoid `data-ys-reveal`**: Using the attribute will trigger the default logic and conflict with your custom code.
2. **Use `useGSAP` Scope**: Always provide a `scope` (ref) to your `useGSAP` hook to prevent "selection leakage" into other components.
3. **Synchronize with Context**: Use `isAnimating` from `useTransition` as a dependency. Only start your custom timeline when `isAnimating === false`.
