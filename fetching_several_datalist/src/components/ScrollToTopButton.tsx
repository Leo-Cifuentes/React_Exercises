import { useState, useEffect, use } from 'react';

const ScrollToTopButton = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    if (!showScrollTop) return null;

    return (
        <>
            <button
                onClick={scrollToTop}
                className='fixed bottom-6 right-6 cursor-pointer bg-cyan-100 hover:bg-cyan-300 p-3 rounded-full shadow-lg transition-opacity duration-300 '
            >
                <svg width='32' height='32'>
                    <use href='../../src/assets/sprites.svg#chevron'/>
                </svg>
            </button>
        </>
    )
}

export default ScrollToTopButton;