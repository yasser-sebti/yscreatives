import { useGSAP } from '../gsap';
import { gsap } from '../gsap';

/**
 * useMagnetic Hook
 * Centralized logic for magnetic element interactions.
 * Reduces code duplication across Home, About, Contact, and Header.
 * 
 * @param {React.RefObject} scopeRef - The container ref to scope the selector
 * @param {string} selector - CSS selector for magnetic elements (default: ".ys-magnetic")
 * @param {number} strength - Movement multiplier (default: 0.5)
 */
export const useMagnetic = (scopeRef, selector = ".ys-magnetic", strength = 0.5) => {
    useGSAP((context, contextSafe) => {
        if (!scopeRef.current) return;

        const elements = gsap.utils.toArray(selector, scopeRef.current);

        const handlers = elements.map((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            const onMove = contextSafe((e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                xTo(x * strength);
                yTo(y * strength);
            });

            const onLeave = contextSafe(() => {
                xTo(0);
                yTo(0);
            });

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);

            return { el, onMove, onLeave };
        });

        return () => {
            handlers.forEach(({ el, onMove, onLeave }) => {
                el.removeEventListener("mousemove", onMove);
                el.removeEventListener("mouseleave", onLeave);
            });
        };
    }, { scope: scopeRef, dependencies: [selector, strength] });
};
