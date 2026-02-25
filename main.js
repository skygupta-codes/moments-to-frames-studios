/**
 * Moments To Frames Studio
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            // Toggle hamburger icon animation
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileNav.classList.contains('active')) {
                spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile nav when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- Sticky Navbar ---
    const navbar = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe fade-in and fade-in-up elements
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Simple Parallax Effect ---
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.4;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // --- Hero Slider (Horizontal Infinite Loop) ---
    const track = document.getElementById('heroTrack');
    if (track && track.children.length > 0) {
        const slideInterval = 4000; // 4 seconds before moving
        const transitionDuration = 800; // 0.8 seconds to animate

        setInterval(() => {
            const firstSlide = track.children[0];
            const slideWidth = firstSlide.getBoundingClientRect().width;

            // Apply transition and move left by one slide's true width
            track.style.transition = `transform ${transitionDuration}ms ease-in-out`;
            track.style.transform = `translateX(-${slideWidth}px)`;

            // Once the transition is over, move the DOM element to the end
            setTimeout(() => {
                track.style.transition = 'none'; // Temporarily disable transition
                track.style.transform = 'translateX(0)'; // Snap back to 0
                track.appendChild(firstSlide); // Move the element, seamless visual continuation
            }, transitionDuration);

        }, slideInterval);
    }

    // --- Services Learn More Toggle ---
    const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Find the sibling content div
            const content = this.nextElementSibling;

            // Toggle the expanded class
            content.classList.toggle('expanded');

            // Optionally change button text
            if (content.classList.contains('expanded')) {
                this.textContent = 'SHOW LESS';
            } else {
                this.textContent = 'LEARN MORE';
            }
        });
    });

    // --- Testimonial Slider ---
    const testimonials = [
        "\"Absolutely stunning photos that we will cherish forever. The experience was professional, calm, and relaxing. Akash made us feel totally at ease.\"",
        "\"The best photography studio we've ever visited. The attention to detail is unmatched, and the final prints brought tears to our eyes.\"",
        "\"Such a beautiful, natural light setting. I felt so beautiful during my maternity shoot. Highly recommended!\"",
        "\"Akash has a true gift for capturing the authentic moments between our children. We will treasure these heirlooms.\"",
        "\"From the wardrobe consultation to the final reveal, the entire process was seamless and luxurious. Simply incredible.\""
    ];

    let currentTestimonialIndex = 0;
    const quoteElement = document.getElementById('testimonial-quote');
    const indicatorElement = document.getElementById('testimonial-indicator');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    function updateTestimonial(index) {
        if (!quoteElement) return;

        // fade out
        quoteElement.style.opacity = '0';

        setTimeout(() => {
            quoteElement.textContent = testimonials[index];
            if (indicatorElement) {
                indicatorElement.textContent = `${index + 1}/${testimonials.length}`;
            }
            // fade in
            quoteElement.style.opacity = '1';
        }, 300); // Wait 300ms for fade out transition
    }

    let slideIntervalId;

    function startAutoSlide() {
        slideIntervalId = setInterval(() => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateTestimonial(currentTestimonialIndex);
        }, 5000); // Slide every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(slideIntervalId);
        startAutoSlide();
    }

    if (quoteElement && prevBtn && nextBtn) {
        quoteElement.style.transition = 'opacity 0.3s ease';

        // Start the automatic rotation
        startAutoSlide();

        prevBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonial(currentTestimonialIndex);
            resetAutoSlide(); // Pause timer on manual interaction
        });

        nextBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateTestimonial(currentTestimonialIndex);
            resetAutoSlide(); // Pause timer on manual interaction
        });
    }
});
