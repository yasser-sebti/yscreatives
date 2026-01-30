import{u as o,a as i,j as e,T as r}from"./index-DwJWsyuL.js";import{r as s}from"./react-vendor-CDLYgQtX.js";import{S as a}from"./SEO-Cr_yVTe3.js";import"./gsap-vendor-DwQni7f4.js";const d=()=>{const t=s.useRef(null),{revealPage:n}=o();return i(t,".ys-magnetic",.4),s.useEffect(()=>{n()},[]),e.jsxs("main",{className:"ys-courses-coming",ref:t,children:[e.jsx(a,{title:"Courses - Coming Soon"}),e.jsxs("div",{className:"ys-courses-coming__content",children:[e.jsx("h1",{className:"ys-courses-coming__title","data-ys-reveal":"fade-up",children:"Coming Soon"}),e.jsx("p",{className:"ys-courses-coming__text","data-ys-reveal":"fade-up","data-ys-delay":"0.1",children:"We are currently working on crafting educational experiences that will elevate your design journey. Stay tuned."}),e.jsx("div",{className:"ys-courses-coming__cta","data-ys-reveal":"fade-up","data-ys-delay":"0.2",children:e.jsx(r,{to:"/",className:"ys-button-special ys-magnetic",children:"Return Home"})})]}),e.jsx("style",{children:`
                .ys-courses-coming {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #000000;
                    color: #fff;
                    overflow: hidden;
                    position: relative;
                }
                
                .ys-courses-coming__content {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 32px;
                    position: relative;
                    z-index: 10;
                    padding: 0 var(--grid-margin);
                }

                .ys-courses-coming__title {
                    font-family: 'PP Editorial New', serif;
                    font-size: clamp(3rem, 12vw, 8rem);
                    line-height: 0.8; 
                    font-weight: 200;
                    margin: 0;
                    color: #ffffff;
                    letter-spacing: -0.04em;
                    padding-bottom: 2rem;
                    text-transform: capitalize;
                }

                .ys-courses-coming__text {
                    font-family: 'DM Mono', monospace;
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.6);
                    max-width: 580px;
                    line-height: 1.6;
                    margin-bottom: 12px;
                }

                .ys-courses-coming__cta {
                    display: inline-block;
                    width: fit-content;
                }

                .ys-button-special {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.6rem 1.5rem;
                    background: transparent;
                    color: #fff;
                    border: 1px solid #fff;
                    border-radius: 0;
                    font-family: 'DM Mono', monospace;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                }

                .ys-button-special:hover {
                    background: #fff;
                    color: #000;
                }
            `})]})};export{d as default};
