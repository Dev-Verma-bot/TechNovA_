/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        if (isTouchDevice) return;

        const cursor = cursorRef.current;
        if (!cursor) return;

        // Enable custom cursor globally on mount
        document.documentElement.classList.add('has-custom-cursor');

        const xTo = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3.out' });
        const yTo = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3.out' });

        gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2, opacity: 0 });

        const onMouseMove = (e) => {
            if (gsap.getProperty(cursor, "opacity") === 0) {
                gsap.to(cursor, { opacity: 1, duration: 0.2 });
            }
            xTo(e.clientX - 4.1);
            yTo(e.clientY - 3.5);
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { opacity: 0, duration: 0.1 });
            document.documentElement.classList.remove('has-custom-cursor');
        };

        const handleMouseEnter = () => {
            gsap.to(cursor, { opacity: 1, duration: 0.1 });
            document.documentElement.classList.add('has-custom-cursor');
        };

        const handleWindowBlur = () => {
            gsap.to(cursor, { opacity: 0, duration: 0.1 });
            document.documentElement.classList.remove('has-custom-cursor');
        };

        const handleWindowFocus = () => {
            document.documentElement.classList.add('has-custom-cursor');
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);

        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
            if (target) {
                gsap.to(cursor, {
                    scale: 0.85,
                    rotate: -8,
                    ease: 'back.out(1.5)',
                    duration: 0.2
                });
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
            if (target) {
                gsap.to(cursor, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.1,
                    ease: 'power2.out'
                });
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            // Clean up class and listeners on unmount
            document.documentElement.classList.remove('has-custom-cursor');
            gsap.killTweensOf(cursor);
            
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div ref={cursorRef} className="custom-cursor">
            {/* Sleek angled arrow matching the GSAP custom cursor look */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.0927 3.53818L10.8524 26.6874C11.1378 27.6651 12.5085 27.817 13.0125 26.926L17.5815 18.8488L26.3155 15.0234C27.2764 14.6024 27.2403 13.2206 26.2576 12.8504L4.0927 3.53818Z"
                    fill="#bcf1ff"
                    stroke="#0ea5e9"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default CustomCursor;