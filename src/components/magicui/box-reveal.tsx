/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BoxRevealProps {
	children: React.ReactNode;
	boxColor?: string;
	duration?: number;
}

export function BoxReveal({
	children,
	boxColor = "#000",
	duration = 0.5,
}: BoxRevealProps) {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className='relative overflow-hidden'>
			<motion.div
				initial={{ x: "-100%" }}
				animate={{ x: isVisible ? "100%" : "-100%" }}
				transition={{ duration, ease: "easeInOut" }}
				style={{ backgroundColor: boxColor }}
				className='absolute inset-0 z-10'
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: isVisible ? 1 : 0 }}
				transition={{ duration: duration * 0.5, delay: duration * 0.5 }}
				className='relative z-20'>
				{children}
			</motion.div>
		</div>
	);
}
