import { useRef } from 'react';
import SimpleImage from '../Image/SimpleImage';

const PROJECTS = [
    { id: '01', title: 'Eli Network', category: 'Data Call Center', img: 'Project1.webp' },
    { id: '02', title: 'Pandaify', category: 'Graphics Design Agency', img: 'Project2.webp' },
    { id: '03', title: 'Order', category: 'Orders Confirmation Center', img: 'Project3.webp' },
    { id: '04', title: 'Tech Trendy', category: 'Non-profit Academic Organization', img: 'Project4.webp' },
    { id: '05', title: 'Oldy', category: 'Old Money Clothing Brand', img: 'Project5.webp' },
    { id: '06', title: 'Turbo Reprog', category: 'Automotive Shop', img: 'Project6.webp' }
];

const Portfolio = () => {
    const containerRef = useRef(null);

    return (
        <section className="ys-portfolio" ref={containerRef}>
            <header className="ys-portfolio__header">
                {/* Global Reveal System picks this up via App.jsx */}
                <h2 className="ys-portfolio__title" data-ys-reveal="text">Selected Work</h2>
            </header>

            <div className="ys-portfolio__grid">
                {PROJECTS.map((project, i) => (
                    <article key={i} className="ys-portfolio__item">
                        <div className="ys-portfolio__image-container ys-image-mask" data-ys-reveal="image">
                            <SimpleImage
                                src={`/assets/images/${project.img}`}
                                alt={project.title}
                                className="ys-portfolio__image"
                                loading="lazy"
                                width={800}
                                height={500}
                            />
                        </div>
                        <div className="ys-portfolio__content">
                            <span className="ys-portfolio__category" data-ys-reveal="text" data-ys-delay="0.1">
                                {project.id} — {project.category}
                            </span>
                            <h3 className="ys-portfolio__name" data-ys-reveal="text" data-ys-delay="0.2">
                                {project.title}
                            </h3>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Portfolio;
