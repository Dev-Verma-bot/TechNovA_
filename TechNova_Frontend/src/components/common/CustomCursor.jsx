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

        // Start hidden, default system cursor visible
        gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2, opacity: 0 });

        const xTo = gsap.quickTo(cursor, 'x', { duration: 0.08, ease: 'power3.out' });
        const yTo = gsap.quickTo(cursor, 'y', { duration: 0.08, ease: 'power3.out' });

        let isVisible = false;

        const onMouseMove = (e) => {
            if (
                typeof e.clientX !== 'number' ||
                typeof e.clientY !== 'number' ||
                isNaN(e.clientX) ||
                isNaN(e.clientY)
            ) {
                return;
            }

            // Update positions first to avoid cursor jumping from (0,0)
            xTo(e.clientX - 4.1);
            yTo(e.clientY - 3.5);

            if (!isVisible) {
                isVisible = true;
                document.documentElement.classList.add('has-custom-cursor');
                gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' });
            }
        };

        const deactivateCursor = () => {
            if (isVisible) {
                isVisible = false;
                document.documentElement.classList.remove('has-custom-cursor');
                gsap.to(cursor, { opacity: 0, duration: 0.1, overwrite: 'auto' });
            }
        };

        const handleMouseLeave = () => {
            deactivateCursor();
        };

        const handleMouseEnter = (e) => {
            if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number' && !isNaN(e.clientX)) {
                xTo(e.clientX - 4.1);
                yTo(e.clientY - 3.5);
            }
        };

        const handleWindowBlur = () => {
            deactivateCursor();
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('blur', handleWindowBlur);

        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
            if (target) {
                gsap.to(cursor, {
                    scale: 0.85,
                    rotate: -8,
                    ease: 'back.out(1.5)',
                    duration: 0.2,
                    overwrite: 'auto'
                });
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
            if (target) {
                gsap.to(cursor, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.15,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        };

        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        window.addEventListener('mouseout', handleMouseOut, { passive: true });

        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            gsap.killTweensOf(cursor);
            
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('blur', handleWindowBlur);
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