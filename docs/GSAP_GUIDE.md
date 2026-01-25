# GSAP Complete Reference Guide
## Yasser Creatives Portfolio - Official Animation Engine

---

> [!CAUTION]
> ## 🚨 CRITICAL RULE FOR ALL AGENTS
> **GSAP is the ONLY animation library to be used in this project.**
> - DO NOT use CSS animations or transitions for any effects
> - DO NOT use Framer Motion, React Spring, or any other animation library
> - ALL animations MUST use GSAP exclusively
> - When in doubt, use GSAP

---

## Table of Contents
1. [Installation & Setup](#installation--setup)
2. [Tweens - Core Animation](#tweens---core-animation)
3. [Timelines - Sequencing](#timelines---sequencing)
4. [CSS Properties & Transforms](#css-properties--transforms)
5. [Easing](#easing)
6. [Staggers](#staggers)
7. [Keyframes](#keyframes)
8. [ScrollTrigger](#scrolltrigger)
9. [ScrollSmoother](#scrollsmoother)
10. [SplitText](#splittext)
11. [Flip Plugin](#flip-plugin)
12. [Utility Methods](#utility-methods)
13. [React Integration (useGSAP)](#react-integration-usegsap)
14. [All Plugins Reference](#all-plugins-reference)
15. [Best Practices](#best-practices)

---

## Installation & Setup

### NPM Installation
```bash
npm install gsap @gsap/react
```

### Basic Setup
```javascript
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register plugins ONCE at app entry point
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip);
```

### Minimal Usage
```javascript
// Single Tween
gsap.to(".box", { rotation: 27, x: 100, duration: 1 });

// Timeline with sequence
let tl = gsap.timeline();
tl.to("#green", { duration: 1, x: 786 })
  .to("#blue", { duration: 2, x: 786 })
  .to("#orange", { duration: 1, x: 786 });
```

---

## Tweens - Core Animation

A **Tween** is GSAP's core animation unit - a high-performance property setter.

### Tween Methods

| Method | Description |
|--------|-------------|
| `gsap.to()` | Animate TO specified values |
| `gsap.from()` | Animate FROM specified values |
| `gsap.fromTo()` | Animate FROM values TO other values |
| `gsap.set()` | Instantly set values (0 duration) |

### Special Properties

| Property | Description | Default |
|----------|-------------|---------|
| `duration` | Animation length in seconds | 0.5 |
| `delay` | Delay before start | 0 |
| `ease` | Easing function | "power1.out" |
| `stagger` | Delay between targets | 0 |
| `repeat` | Repeat count (-1 = infinite) | 0 |
| `yoyo` | Reverse on repeat | false |
| `paused` | Start paused | false |
| `immediateRender` | Render on creation | varies |
| `overwrite` | Handle conflicts | "auto" |

### Callbacks

| Callback | When Called |
|----------|-------------|
| `onStart` | Animation begins |
| `onUpdate` | Every frame/tick |
| `onComplete` | Animation finishes |
| `onRepeat` | Each repeat cycle |
| `onReverseComplete` | Reaches beginning in reverse |

```javascript
gsap.to(".box", {
    x: 100,
    duration: 1,
    onStart: () => console.log("Started"),
    onComplete: () => console.log("Done"),
    onUpdate: self => console.log(`Progress: ${self.progress()}`)
});
```

### Function-Based Values

Get dynamic values per target:

```javascript
gsap.to(".box", {
    x: 100,
    y: (index, target, targets) => index * 50,  // Different y per element
    duration: 1
});
```

### Random Values

```javascript
gsap.to(".box", {
    x: "random(-100, 100)",           // Random in range
    x: "random(-100, 100, 5)",        // Snapped to 5
    x: "random([0, 100, 200, 500])",  // Random from array
});
```

### Relative Values

```javascript
gsap.to(".box", {
    x: "+=100",   // Add 100 to current
    x: "-=50",    // Subtract 50 from current
    rotation: "+=360"
});
```

---

## Timelines - Sequencing

A **Timeline** is a container for sequencing tweens.

### Creating Timelines

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 50, duration: 0.5 })
  .to(".box3", { rotation: 360, duration: 1 });
```

### Position Parameter (CRUCIAL!)

Control exactly WHEN animations occur:

| Value | Meaning | Example |
|-------|---------|---------|
| `number` | Absolute time | `3` = at 3 seconds |
| `"+=n"` | After timeline end | `"+=1"` = 1s gap |
| `"-=n"` | Before timeline end | `"-=0.5"` = overlap |
| `"<"` | Start of previous | Same start |
| `">"` | End of previous | Sequential |
| `"<n"` | Relative to prev start | `"<0.5"` = 0.5s after start |
| `">n"` | Relative to prev end | `">-0.25"` = 0.25s before end |
| `"label"` | At label position | `"intro"` |
| `"label+=n"` | Relative to label | `"intro+=0.5"` |

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100 })
  .to(".box2", { y: 50 }, "-=0.5")     // Overlap by 0.5s
  .to(".box3", { rotation: 360 }, "<")  // Same start as previous
  .addLabel("halfway")
  .to(".box4", { scale: 2 }, "halfway+=0.2");
```

### Timeline Defaults

```javascript
const tl = gsap.timeline({
    defaults: { 
        duration: 1, 
        ease: "power2.out" 
    }
});

// All tweens inherit defaults
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 50 });
```

### Nesting Timelines

```javascript
function introAnimation() {
    const tl = gsap.timeline();
    tl.to(".intro", { opacity: 1 })
      .to(".title", { y: 0 });
    return tl;
}

function mainAnimation() {
    const tl = gsap.timeline();
    tl.to(".content", { opacity: 1 });
    return tl;
}

// Master timeline
const master = gsap.timeline();
master.add(introAnimation())
      .add(mainAnimation(), "+=0.5");
```

### Control Methods

```javascript
const tl = gsap.timeline();

tl.play();           // Play forward
tl.pause();          // Pause
tl.resume();         // Resume from current
tl.reverse();        // Play backward
tl.restart();        // Start over
tl.seek(2);          // Jump to 2 seconds
tl.seek("myLabel");  // Jump to label
tl.progress(0.5);    // Jump to 50%
tl.timeScale(2);     // Double speed
tl.timeScale(0.5);   // Half speed
tl.kill();           // Destroy
```

---

## CSS Properties & Transforms

### Transform Shortcuts (RECOMMENDED)

GSAP provides optimized transform aliases that are GPU-accelerated:

| GSAP Property | CSS Equivalent | Unit Default |
|---------------|----------------|--------------|
| `x` | translateX() | px |
| `y` | translateY() | px |
| `z` | translateZ() | px |
| `xPercent` | translateX(%) | % |
| `yPercent` | translateY(%) | % |
| `rotation` | rotate() | deg |
| `rotationX` | rotateX() | deg |
| `rotationY` | rotateY() | deg |
| `rotationZ` | rotateZ() | deg |
| `scale` | scale() | - |
| `scaleX` | scaleX() | - |
| `scaleY` | scaleY() | - |
| `skewX` | skewX() | deg |
| `skewY` | skewY() | deg |

```javascript
// ✅ RECOMMENDED - GPU accelerated
gsap.to(".box", { x: 100, y: 50, rotation: 45, scale: 1.2 });

// ❌ AVOID - causes reflow
gsap.to(".box", { left: "100px", top: "50px" });
```

### Transform Order

GSAP always applies transforms in consistent order:
**translate → scale → rotateX → rotateY → skew → rotationZ**

### autoAlpha (Recommended for Opacity)

Combines `opacity` with `visibility` for performance:

```javascript
// Fades out AND sets visibility:hidden at 0
gsap.to(".box", { autoAlpha: 0 });

// Fades in AND sets visibility:inherit
gsap.to(".box", { autoAlpha: 1 });
```

### Directional Rotation

```javascript
gsap.to(".box", {
    rotation: "-170_short",  // Shortest path
    rotation: "45_cw",       // Clockwise
    rotation: "45_ccw",      // Counter-clockwise
});
```

### CSS Variables

```javascript
gsap.to(":root", {
    "--primary-color": "#ff0000",
    duration: 1
});
```

### clearProps

```javascript
gsap.to(".box", {
    x: 100,
    clearProps: "all",    // Clears inline styles on complete
    clearProps: "x,y"     // Clears specific props
});
```

---

## Easing

### Built-in Eases

| Ease | Description |
|------|-------------|
| `"none"` | Linear (no easing) |
| `"power1"` - `"power4"` | Subtle to strong |
| `"back"` | Slight overshoot |
| `"elastic"` | Springy bounce |
| `"bounce"` | Ball bounce |
| `"circ"` | Circular motion |
| `"expo"` | Exponential (dramatic) |
| `"sine"` | Gentle wave |

### Ease Directions

| Suffix | Behavior |
|--------|----------|
| `.in` | Slow start, fast end |
| `.out` | Fast start, slow end |
| `.inOut` | Slow start AND end |

```javascript
gsap.to(".box", { x: 100, ease: "power2.out" });
gsap.to(".box", { x: 100, ease: "elastic.out(1, 0.3)" });
gsap.to(".box", { x: 100, ease: "back.inOut(1.7)" });
```

### EasePack

```javascript
import { RoughEase, SlowMo, ExpoScaleEase } from "gsap/EasePack";
gsap.registerPlugin(RoughEase, SlowMo, ExpoScaleEase);

gsap.to(".box", { ease: "slow(0.7, 0.7, false)" });
gsap.to(".box", { ease: "rough({ strength: 1, points: 20 })" });
```

### CustomEase

```javascript
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

CustomEase.create("myEase", "M0,0 C0.25,0.1 0.25,1 1,1");
gsap.to(".box", { ease: "myEase" });
```

---

## Staggers

### Simple Stagger

```javascript
gsap.to(".box", {
    y: 100,
    stagger: 0.1  // 0.1s between each
});
```

### Advanced Stagger Object

| Property | Description |
|----------|-------------|
| `each` | Time between each |
| `amount` | Total stagger time (distributed) |
| `from` | Origin: "start", "center", "end", "edges", "random", or index |
| `grid` | Grid layout [rows, cols] or "auto" |
| `axis` | "x" or "y" for grids |
| `ease` | Distribution ease |

```javascript
gsap.to(".box", {
    y: 100,
    stagger: {
        each: 0.1,
        from: "center",
        grid: [5, 10],      // or "auto"
        ease: "power2.inOut"
    }
});
```

### Grid Stagger

```javascript
gsap.to(".grid-item", {
    scale: 0,
    stagger: {
        each: 0.05,
        from: "center",
        grid: "auto",
        axis: "both"
    }
});
```

---

## Keyframes

### Object Keyframes

```javascript
gsap.to(".box", {
    keyframes: [
        { x: 100, duration: 1 },
        { y: 200, duration: 0.5, delay: 0.5 },
        { rotation: 360, duration: 1, delay: -0.25 }
    ]
});
```

### Percentage Keyframes (CSS-like)

```javascript
gsap.to(".box", {
    duration: 2,
    keyframes: {
        "0%": { x: 0, y: 0 },
        "50%": { x: 100, y: 0 },
        "100%": { x: 100, y: 100 }
    }
});
```

### Array Keyframes

```javascript
gsap.to(".box", {
    duration: 2,
    keyframes: {
        x: [0, 100, 50],
        y: [0, -50, 0],
        easeEach: "power1.inOut"
    }
});
```

---

## ScrollTrigger

### Basic Usage

```javascript
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Simple trigger
gsap.to(".box", {
    x: 500,
    scrollTrigger: ".box"  // Triggers when .box enters viewport
});
```

### Advanced Configuration

```javascript
gsap.to(".box", {
    x: 500,
    scrollTrigger: {
        trigger: ".box",
        start: "top 80%",        // trigger viewport
        end: "bottom 20%",
        toggleActions: "play pause resume reset",
        markers: true,           // Debug only
        scrub: true,             // Link to scroll
        scrub: 1,                // Smooth 1s catchup
        pin: true,               // Pin element
        pinSpacing: true,
        anticipatePin: 1,
        snap: 0.1                // Snap to 10% increments
    }
});
```

### Start/End Syntax

Format: `"[trigger position] [viewport position]"`

```javascript
start: "top center"      // Trigger top hits viewport center
start: "top 80%"         // Trigger top is 80% down viewport
start: "top bottom-=100" // 100px before trigger hits bottom
end: "bottom top"        // Trigger bottom hits viewport top
end: "+=500"             // 500px after start
```

### Toggle Actions

Format: `"onEnter onLeave onEnterBack onLeaveBack"`

Values: `play`, `pause`, `resume`, `reset`, `restart`, `complete`, `reverse`, `none`

```javascript
toggleActions: "play none none none"      // Play once
toggleActions: "play pause resume reset"  // Full control
toggleActions: "restart pause restart pause"  // Restart each time
```

### Standalone ScrollTrigger

```javascript
ScrollTrigger.create({
    trigger: ".panel",
    start: "top top",
    end: "+=1000",
    pin: true,
    onEnter: () => console.log("Entered"),
    onLeave: () => console.log("Left"),
    onUpdate: self => console.log("Progress:", self.progress)
});
```

### Timeline with ScrollTrigger

```javascript
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".container",
        start: "top center",
        end: "bottom center",
        scrub: 1
    }
});

tl.to(".box1", { x: 100 })
  .to(".box2", { y: 50 })
  .to(".box3", { rotation: 360 });
```

### Batch Animations

```javascript
ScrollTrigger.batch(".box", {
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 }),
    onLeave: batch => gsap.to(batch, { opacity: 0, y: 100 })
});
```

---

## ScrollSmoother

### Setup HTML Structure

```html
<body>
    <div id="smooth-wrapper">
        <div id="smooth-content">
            <!-- ALL CONTENT HERE -->
        </div>
    </div>
</body>
```

### Create ScrollSmoother

```javascript
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,           // Smoothing amount (seconds)
    effects: true,         // Enable data-speed/data-lag
    normalizeScroll: true  // Fix mobile issues
});
```

### Parallax Effects (data-speed)

```html
<div data-speed="0.5">Moves at half speed</div>
<div data-speed="2">Moves at double speed</div>
<div data-speed="auto">Auto-calculated parallax</div>
```

### Lag Effects (data-lag)

```html
<div data-lag="0.5">Takes 0.5s to catch up</div>
```

---

## SplitText

### Basic Usage

```javascript
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const split = SplitText.create(".headline", {
    type: "chars, words, lines"
});

gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    stagger: 0.02
});
```

### Configuration

| Property | Description |
|----------|-------------|
| `type` | "chars", "words", "lines" (comma separated) |
| `mask` | Add overflow:clip wrappers |
| `linesClass` | Class for lines (++ for increment) |
| `wordsClass` | Class for words |
| `charsClass` | Class for characters |
| `autoSplit` | Re-split on resize |

### Masked Line Reveal

```javascript
const split = SplitText.create(".headline", {
    type: "lines",
    mask: "lines"  // Creates overflow:clip wrapper
});

gsap.from(split.lines, {
    yPercent: 100,
    stagger: 0.1,
    duration: 1,
    ease: "power2.out"
});
```

### Responsive Re-splitting

```javascript
SplitText.create(".headline", {
    type: "lines",
    autoSplit: true,
    onSplit: (split) => {
        gsap.from(split.lines, { y: 50, opacity: 0 });
    }
});
```

### Revert

```javascript
split.revert(); // Restore original HTML
```

---

## Flip Plugin

FLIP = First, Last, Invert, Play

### 3-Step Process

```javascript
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

// 1. Get current state
const state = Flip.getState(".box");

// 2. Make DOM changes
element.classList.toggle("active");

// 3. Animate from previous state
Flip.from(state, {
    duration: 1,
    ease: "power1.inOut",
    absolute: true
});
```

### Configuration

```javascript
Flip.from(state, {
    duration: 1,
    ease: "power2.out",
    scale: true,           // Animate scale changes
    absolute: true,        // Use position: absolute during flip
    nested: true,          // Support nested flips
    prune: true,           // Remove elements that don't exist
    onEnter: elements => gsap.from(elements, { opacity: 0, scale: 0 }),
    onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0 })
});
```

---

## Utility Methods

### Available Utils

| Method | Description | Example |
|--------|-------------|---------|
| `toArray()` | Convert to array | `gsap.utils.toArray(".box")` |
| `clamp()` | Limit value range | `gsap.utils.clamp(0, 100, -12)` → 0 |
| `random()` | Random value | `gsap.utils.random(0, 100)` |
| `snap()` | Snap to increment | `gsap.utils.snap(5, 13)` → 15 |
| `wrap()` | Wrap value in range | `gsap.utils.wrap(0, 10, 12)` → 2 |
| `mapRange()` | Map value between ranges | `gsap.utils.mapRange(-10, 10, 0, 100, 5)` → 75 |
| `normalize()` | Normalize to 0-1 | `gsap.utils.normalize(100, 200, 150)` → 0.5 |
| `interpolate()` | Interpolate values | `gsap.utils.interpolate("red", "blue", 0.5)` |
| `distribute()` | Distribute values | For staggers |
| `shuffle()` | Randomize array | `gsap.utils.shuffle([1,2,3])` |
| `selector()` | Scoped selector | `gsap.utils.selector(myElement)` |
| `pipe()` | Chain functions | `gsap.utils.pipe(fn1, fn2)` |

```javascript
// Common use cases
const boxes = gsap.utils.toArray(".box");
const clampedValue = gsap.utils.clamp(0, 100, value);
const randomColor = gsap.utils.random(["red", "green", "blue"]);
const snapped = gsap.utils.snap(10, mouseX);
```

---

## React Integration (useGSAP) 💚

> [!IMPORTANT]
> **Always use `useGSAP()` instead of `useEffect()` for GSAP animations in React.**
> It handles cleanup automatically and prevents memory leaks.

### Installation

```bash
npm install @gsap/react
```

### Basic Setup

```javascript
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP); // Register to avoid React version discrepancies

function Component() {
    const container = useRef();

    useGSAP(() => {
        // gsap code here...
        gsap.to(".box", { x: 360 }); // <-- automatically reverted
    }, { scope: container }); // <-- scope for selector text (optional)

    return (
        <div ref={container}>
            <div className="box" />
        </div>
    );
}
```

---

### Config Object Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dependencies` | Array | `[]` | Re-run when dependencies change |
| `scope` | React Ref | - | Scope all selector text to this container |
| `revertOnUpdate` | Boolean | `false` | Revert animations when dependencies change |

```javascript
useGSAP(() => {
    gsap.to(".box", { x: endX });
}, { 
    dependencies: [endX],      // Re-run when endX changes
    scope: container,          // Scope selectors to container
    revertOnUpdate: true       // Revert on every change
});
```

---

### Targeting Elements

#### Method 1: Refs (Individual Elements)

```javascript
const boxRef = useRef();

useGSAP(() => {
    gsap.to(boxRef.current, { rotation: 360 });
});

return <div className="box" ref={boxRef}>Hello</div>;
```

#### Method 2: Scoped Selectors (RECOMMENDED)

Use `scope` to avoid creating refs for every element:

```javascript
const container = useRef();

useGSAP(() => {
    // ".box" only selects elements INSIDE container
    gsap.from(".box", { opacity: 0, stagger: 0.1 });
}, { scope: container });

return (
    <div ref={container}>
        <div className="box" />
        <div className="box" />
        <div className="box" />
    </div>
);
```

---

### Creating & Controlling Timelines

Store timelines in refs to persist across renders:

```javascript
function App() {
    const container = useRef();
    const tl = useRef();  // Store timeline in ref

    useGSAP(() => {
        tl.current = gsap.timeline()
            .to(".box", { rotate: 360 })
            .to(".circle", { x: 100 });
    }, { scope: container });

    // Control timeline from event handlers
    const { contextSafe } = useGSAP({ scope: container });
    
    const toggleDirection = contextSafe(() => {
        tl.current.reversed(!tl.current.reversed());
    });

    return (
        <div ref={container}>
            <button onClick={toggleDirection}>Toggle</button>
            <div className="box">Box</div>
            <div className="circle">Circle</div>
        </div>
    );
}
```

---

### Dependency Arrays

Control when animations re-run:

```javascript
// Runs once after first render (default)
useGSAP(() => {
    gsap.to(".box-1", { rotation: 360 });
});

// Runs when endX changes
useGSAP(() => {
    gsap.to(".box-2", { x: endX });
}, [endX]);

// With config object (for scope + dependencies)
useGSAP(() => {
    gsap.to(".box-2", { x: endX });
}, { dependencies: [endX], scope: container });

// ⚠️ Runs on EVERY render (avoid if possible)
useGSAP(() => {
    gsap.to(".box-2", { rotation: "+=360" });
}, null);
```

### revertOnUpdate

By default, animations persist when dependencies change. Use `revertOnUpdate: true` to reset:

```javascript
useGSAP(() => {
    gsap.to(".box", { x: endX });
}, { 
    dependencies: [endX], 
    revertOnUpdate: true  // Reset to original position before animating
});
```

---

### Context-Safe Functions

Animations created OUTSIDE useGSAP (click handlers, setTimeout, etc.) won't be cleaned up automatically. Use `contextSafe()`:

```javascript
function Component() {
    const container = useRef();
    
    // ✅ Get contextSafe from useGSAP
    const { contextSafe } = useGSAP({ scope: container });

    // ✅ Wrapped in contextSafe - will be cleaned up
    const handleClick = contextSafe(() => {
        gsap.to(".box", { rotation: 180 });
    });

    return (
        <div ref={container}>
            <button onClick={handleClick}>Animate</button>
            <div className="box" />
        </div>
    );
}
```

#### Inside useGSAP (with manual event listeners)

```javascript
useGSAP((context, contextSafe) => {
    // ✅ Direct animations - auto cleanup
    gsap.to(".box", { x: 100 });

    // ✅ Event handler wrapped in contextSafe
    const onClick = contextSafe(() => {
        gsap.to(".box", { rotation: 360 });
    });

    elementRef.current.addEventListener("click", onClick);

    // 👍 Clean up event listener
    return () => {
        elementRef.current.removeEventListener("click", onClick);
    };
}, { scope: container });
```

---

### Component Communication

#### Passing Timeline as Prop

Use `useState` (not `useRef`) to ensure timeline is ready for children:

```javascript
// Parent
function App() {
    const [tl, setTl] = useState();

    useGSAP(() => {
        const timeline = gsap.timeline();
        setTl(timeline);
    });

    return (
        <>
            <Box timeline={tl} index={0}>Box</Box>
            <Circle timeline={tl} index={1}>Circle</Circle>
        </>
    );
}

// Child
function Box({ timeline, index }) {
    const el = useRef();

    useGSAP(() => {
        timeline && timeline.to(el.current, { x: 100 }, index * 0.1);
    }, [timeline, index]);

    return <div className="box" ref={el} />;
}
```

#### Passing Callback to Build Timeline

```javascript
// Parent
function App() {
    const [tl, setTl] = useState();
    
    useGSAP(() => {
        const timeline = gsap.timeline();
        setTl(timeline);
    });

    const addAnimation = useCallback((animation, index) => {
        tl && tl.add(animation, index * 0.1);
    }, [tl]);

    return (
        <>
            <Box addAnimation={addAnimation} index={0} />
            <Circle addAnimation={addAnimation} index={1} />
        </>
    );
}

// Child
function Box({ addAnimation, index }) {
    const el = useRef();

    useGSAP(() => {
        const animation = gsap.to(el.current, { x: 100 });
        addAnimation(animation, index);
    }, [addAnimation, index]);

    return <div className="box" ref={el} />;
}
```

#### React Context (for deeply nested components)

When props/callbacks aren't ideal (deeply nested or different component trees), use React Context:

> [!NOTE]
> React's Context is NOT the same as GSAP's `gsap.context()`. They are completely different concepts.

```javascript
// Create context
const TimelineContext = createContext();

// Provider in parent
function App() {
    const [tl, setTl] = useState();

    useGSAP(() => {
        const timeline = gsap.timeline();
        setTl(timeline);
    });

    return (
        <TimelineContext.Provider value={tl}>
            <DeeplyNestedComponent />
        </TimelineContext.Provider>
    );
}

// Consumer in any child (no matter how deep)
function DeeplyNestedComponent() {
    const el = useRef();
    const timeline = useContext(TimelineContext);

    useGSAP(() => {
        timeline && timeline.to(el.current, { x: 100 });
    }, [timeline]);

    return <div ref={el}>Animated!</div>;
}
```

---

### Exit Animations

#### Single Element

```javascript
function App() {
    const container = useRef();
    const [active, setActive] = useState(true);
    
    const { contextSafe } = useGSAP({ scope: container });

    const remove = contextSafe(() => {
        gsap.to(".box", { 
            opacity: 0, 
            onComplete: () => setActive(false)
        });
    });

    return (
        <div ref={container}>
            <button onClick={remove}>Remove</button>
            {active && <div className="box">Box</div>}
        </div>
    );
}
```

#### Array of Items

```javascript
function App() {
    const container = useRef();
    const [items, setItems] = useState([
        { id: 0, color: "blue" },
        { id: 1, color: "red" },
        { id: 2, color: "purple" }
    ]);
    
    const { contextSafe } = useGSAP();

    const remove = contextSafe((item, target) => {
        gsap.to(target, { 
            opacity: 0, 
            onComplete: () => removeItem(item) 
        });
    });

    const removeItem = (value) => {
        setItems(prev => prev.filter(item => item !== value));
    };

    return (
        <div ref={container}>
            {items.map(item => (
                <div 
                    key={item.id} 
                    onClick={(e) => remove(item, e.currentTarget)}
                    style={{ background: item.color }}
                >
                    Click to Remove
                </div>
            ))}
        </div>
    );
}
```

#### FLIP + Exit Animations (No Layout Shifts!)

Exit animations often cause layout shifts. Use Flip's `onLeave` to fix:

```javascript
function App() {
    const container = useRef();
    const [items, setItems] = useState([...initialItems]);
    
    const { contextSafe } = useGSAP({ scope: container });

    const removeItem = contextSafe((item) => {
        // Get state BEFORE removal
        const state = Flip.getState(".item");
        
        // Remove item from state
        setItems(prev => prev.filter(i => i.id !== item.id));
        
        // Animate from old state
        Flip.from(state, {
            duration: 0.5,
            ease: "power2.out",
            onLeave: elements => {
                return gsap.to(elements, {
                    opacity: 0,
                    scale: 0
                });
            }
        });
    });

    return (
        <div ref={container}>
            {items.map(item => (
                <div 
                    key={item.id}
                    className="item"
                    data-flip-id={item.id}
                    onClick={() => removeItem(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}
```

---

### Performance: quickTo & quickSetter

For high-frequency events (mousemove), use `quickTo` or `quickSetter`:

```javascript
useGSAP(() => {
    // Create quickTo functions (much faster than gsap.to)
    const xTo = gsap.quickTo(".box", "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(".box", "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
});
```

---

### Reusable Animation Components

```javascript
function FadeIn({ children, stagger = 0.1, x = 0 }) {
    const el = useRef();

    useGSAP(() => {
        gsap.from(el.current.children, { 
            opacity: 0, 
            stagger, 
            x 
        });
    });

    return <div ref={el}>{children}</div>;
}

// Usage
<FadeIn stagger={0.05} x={50}>
    <div className="box">Box 1</div>
    <div className="box">Box 2</div>
    <div className="box">Box 3</div>
</FadeIn>
```

---

### registerEffect (Global Reusable Animations)

```javascript
// Register once at app start
gsap.registerEffect({
    name: "fadeIn",
    effect: (targets, config) => {
        return gsap.from(targets, { 
            opacity: 0, 
            y: config.y, 
            duration: config.duration 
        });
    },
    defaults: { duration: 1, y: 50 }
});

// Use anywhere
useGSAP(() => {
    gsap.effects.fadeIn(".box");
    gsap.effects.fadeIn(".circle", { y: 100, duration: 0.5 });
});
```

---

### Custom Hooks

#### useStateRef (Avoid Stale Closures)

GSAP callbacks can capture stale state values. This hook provides a ref that always has current value:

```javascript
function useStateRef(defaultValue) {
    const [state, setState] = useState(defaultValue);
    const ref = useRef(state);

    const dispatch = useCallback((value) => {
        ref.current = typeof value === "function" 
            ? value(ref.current) 
            : value;
        setState(ref.current);
    }, []);

    return [state, dispatch, ref];
}
```

Usage:

```javascript
function Counter() {
    const [count, setCount, countRef] = useStateRef(0);
    const [gsapCount, setGsapCount] = useState(0);

    useGSAP(() => {
        gsap.to(".box", {
            x: 400,
            repeat: -1,
            duration: 2,
            // countRef.current always has latest value!
            onRepeat: () => setGsapCount(countRef.current)
        });
    });

    return (
        <div>
            <button onClick={() => setCount(c => c + 1)}>
                Increment: {count}
            </button>
            <p>GSAP sees: {gsapCount}</p>
            <div className="box" />
        </div>
    );
}
```

---

### ⚠️ Scoped Selectors & Nested Components

> [!WARNING]
> Scoped selectors will match elements in nested child components too!

```javascript
// Parent component
function App() {
    const container = useRef();
    
    useGSAP(() => {
        // ⚠️ This will animate ALL .box elements, including those in NestedComponent!
        gsap.to(".box", { x: 100 });
    }, { scope: container });

    return (
        <div ref={container}>
            <div className="box">Parent Box</div>
            <NestedComponent /> {/* Contains its own .box elements */}
        </div>
    );
}
```

**Solution**: Use refs for elements you don't want to accidentally target in nested components:

```javascript
function NestedComponent() {
    const boxRef = useRef();
    
    useGSAP(() => {
        // ✅ Only animates THIS specific element
        gsap.to(boxRef.current, { scale: 1.5 });
    });

    return <div className="box" ref={boxRef}>Nested Box</div>;
}
```

---

## All Plugins Reference

### Scroll Plugins
| Plugin | Description |
|--------|-------------|
| **ScrollTrigger** | Trigger animations on scroll position |
| **ScrollSmoother** | Smooth scrolling with native scroll |
| **ScrollToPlugin** | Animate scroll position |

### Text Plugins
| Plugin | Description |
|--------|-------------|
| **SplitText** | Split text into chars/words/lines |
| **ScrambleTextPlugin** | Scramble/decode text effect |
| **TextPlugin** | Replace text character by character |

### SVG Plugins
| Plugin | Description |
|--------|-------------|
| **DrawSVGPlugin** | Animate SVG stroke drawing |
| **MorphSVGPlugin** | Morph between SVG shapes |
| **MotionPathPlugin** | Animate along SVG paths |
| **MotionPathHelper** | Visual path editing |

### UI Plugins
| Plugin | Description |
|--------|-------------|
| **Flip** | Animate layout changes (FLIP technique) |
| **Draggable** | Make elements draggable |
| **InertiaPlugin** | Physics-based momentum |
| **Observer** | Unified input observer |

### Other Plugins
| Plugin | Description |
|--------|-------------|
| **Physics2DPlugin** | 2D physics simulations |
| **PhysicsPropsPlugin** | Physics for any property |
| **GSDevTools** | Visual debugging timeline |
| **EaselPlugin** | CreateJS/EaselJS integration |
| **PixiPlugin** | PixiJS integration |

### Custom Eases
| Plugin | Description |
|--------|-------------|
| **CustomEase** | Create custom ease curves |
| **CustomBounce** | Customizable bounce |
| **CustomWiggle** | Customizable wiggle |
| **EasePack** | RoughEase, SlowMo, ExpoScaleEase |

---

## Best Practices

### 1. Use Transforms (GPU Accelerated)

```javascript
// ✅ Fast - GPU accelerated
gsap.to(".box", { x: 100, y: 50, rotation: 45, scale: 1.2 });

// ❌ Slow - causes reflow
gsap.to(".box", { left: "100px", top: "50px" });
```

### 2. Use autoAlpha Instead of opacity

```javascript
// ✅ Better - also sets visibility
gsap.to(".box", { autoAlpha: 0 });

// Less optimal
gsap.to(".box", { opacity: 0 });
```

### 3. Register Plugins Once

```javascript
// ✅ In main.jsx or gsap.js
gsap.registerPlugin(ScrollTrigger, SplitText);

// ❌ Don't register in every component
```

### 4. Use useGSAP in React

```javascript
// ✅ Automatic cleanup
useGSAP(() => {
    gsap.to(".box", { x: 100 });
});

// ❌ Memory leaks
useEffect(() => {
    gsap.to(".box", { x: 100 });
}, []);
```

### 5. Batch ScrollTrigger.refresh()

```javascript
// ✅ Call once after setup
ScrollTrigger.refresh();

// ❌ Don't call repeatedly
```

### 6. Kill Animations on Cleanup

```javascript
// In React
useGSAP(() => {
    const tl = gsap.timeline();
    // ... animations
    
    return () => tl.kill();
});
```

### 7. Use will-change Sparingly

```javascript
gsap.to(".box", {
    x: 100,
    willChange: "transform",
    onComplete: function() {
        gsap.set(this.targets(), { willChange: "auto" });
    }
});
```

---

## Common Animation Patterns

### Fade In From Below

```javascript
gsap.from(".element", { y: 50, opacity: 0, duration: 1 });
```

### Staggered Reveal

```javascript
gsap.from(".items", { y: 30, opacity: 0, stagger: 0.1 });
```

### Character-by-Character Text

```javascript
const split = SplitText.create(".text", { type: "chars" });
gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.02 });
```

### Masked Line Reveal

```javascript
const split = SplitText.create(".text", { type: "lines", mask: "lines" });
gsap.from(split.lines, { yPercent: 100, stagger: 0.1 });
```

### Scroll-Triggered Reveal

```javascript
gsap.from(".box", {
    y: 100,
    opacity: 0,
    scrollTrigger: {
        trigger: ".box",
        start: "top 80%"
    }
});
```

### Hover Scale

```javascript
const button = document.querySelector(".button");
button.addEventListener("mouseenter", () => {
    gsap.to(button, { scale: 1.1, duration: 0.3 });
});
button.addEventListener("mouseleave", () => {
    gsap.to(button, { scale: 1, duration: 0.3 });
});
```

---

> [!IMPORTANT]
> This guide is the **definitive reference** for all animations in the Yasser Creatives portfolio.
> **GSAP is our exclusive animation library - no exceptions.**

---

*Last Updated: January 2026*
*GSAP Version: 3.x*
