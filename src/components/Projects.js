import React from "react";
import { projects } from "./projectsData";

const Projects = () => {
    return (
        <section className="blogs" id="blogs">
            <h1 className="heading"><span>Our Projects</span></h1>
            <div className="swiper blogs-slider">
                <div className="swiper-wrapper">
                    {projects.map((project) => (
                        <div key={project.id} className="swiper-slide box">
                            <div className="image">
                                <img src={project.image} alt={project.title} />
                            </div>
                            <div className="content">
                                <h3>{project.title}</h3>
                                <p>{project.summary}</p>
                                <a href={project.link} className="btn">Read More</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
