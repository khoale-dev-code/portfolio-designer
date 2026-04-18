            import { useEffect, useRef, useState } from "react";
            import { motion } from "motion/react";

            export default function BlurText({
            text = "",
            delay = 200,
            className = "",
            animateBy = "words",
            }) {
            const [inView, setInView] = useState(false);
            const ref = useRef(null);

            useEffect(() => {
                const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                    }
                },
                { threshold: 0.1 }
                );
                if (ref.current) observer.observe(ref.current);
                return () => observer.disconnect();
            }, []);

            const elements = animateBy === "words" ? text.split(" ") : text.split("");

            return (
                <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap", gap: animateBy === "words" ? "0.3em" : "0" }}>
                {elements.map((el, i) => (
                    <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
                    animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
                    transition={{
                        delay: i * (delay / 1000),
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    style={{ display: "inline-block" }}
                    >
                    {el}
                    {animateBy === "words" ? "" : ""}
                    </motion.span>
                ))}
                </p>
            );
            }