document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       1. STEP HOVER -> IMAGE SWAP (How It Works)
       ====================================================================== */
    const actionableRows = document.querySelectorAll('.step-interactive-row');
    const targetDisplayImg = document.getElementById('dynamicTargetImage');
    const targetBadgeNode = document.getElementById('imageTagNode');

    const graphicAssetMapping = {
        "1": {
            url: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800",
            tag: "DUMMY_IMAGE_1"
        },
        "2": {
            url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
            tag: "DUMMY_IMAGE_2"
        },
        "3": {
            url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
            tag: "DUMMY_IMAGE_3"
        }
    };

    function activateStep(row) {
        actionableRows.forEach(item => item.classList.remove('active'));
        row.classList.add('active');
        const targetIndex = row.getAttribute('data-step-index');

        if (graphicAssetMapping[targetIndex] && targetDisplayImg) {
            targetDisplayImg.style.opacity = '0';
            setTimeout(() => {
                targetDisplayImg.src = graphicAssetMapping[targetIndex].url;
                targetBadgeNode.textContent = graphicAssetMapping[targetIndex].tag;
                targetDisplayImg.style.opacity = '1';
            }, 180);
        }
    }

    actionableRows.forEach(row => {
        row.addEventListener('mouseenter', () => activateStep(row));
        row.addEventListener('click', () => activateStep(row));
        row.addEventListener('focus', () => activateStep(row));
    });

    /* ======================================================================
       2. AWARDS CAROUSEL
       ====================================================================== */
    const trackShelf = document.getElementById('sliderShelf');
    const leftArrow = document.getElementById('prevSlideTrigger');
    const rightArrow = document.getElementById('nextSlideTrigger');

    if (trackShelf && leftArrow && rightArrow) {
        let runningTranslationIndex = 0;

        function computeMaxScrollSteps() {
            const card = document.querySelector('.award-card');
            const frame = document.querySelector('.slider-window-frame');
            if (!card || !frame) return 0;
            const individualCardWidth = card.offsetWidth;
            const totalVisibleGapWidth = 24;
            const currentWindowViewportWidth = frame.offsetWidth;
            const absoluteTrackTotalWidth = trackShelf.scrollWidth;

            return Math.max(0, Math.ceil((absoluteTrackTotalWidth - currentWindowViewportWidth) / (individualCardWidth + totalVisibleGapWidth)));
        }

        function refreshArrowState() {
            const totalBoundaryLimit = computeMaxScrollSteps();
            leftArrow.disabled = runningTranslationIndex <= 0;
            rightArrow.disabled = runningTranslationIndex >= totalBoundaryLimit;
        }

        function updateTrackDisplacement() {
            const card = document.querySelector('.award-card');
            if (!card) return;
            const individualCardWidth = card.offsetWidth;
            const totalVisibleGapWidth = 24;
            const targetPixelStepOffset = runningTranslationIndex * (individualCardWidth + totalVisibleGapWidth);

            trackShelf.style.transform = `translateX(-${targetPixelStepOffset}px)`;
            refreshArrowState();
        }

        rightArrow.addEventListener('click', () => {
            const totalBoundaryLimit = computeMaxScrollSteps();
            if (runningTranslationIndex < totalBoundaryLimit) {
                runningTranslationIndex++;
                updateTrackDisplacement();
            }
        });

        leftArrow.addEventListener('click', () => {
            if (runningTranslationIndex > 0) {
                runningTranslationIndex--;
                updateTrackDisplacement();
            }
        });

        window.addEventListener('resize', () => {
            runningTranslationIndex = 0;
            trackShelf.style.transform = `translateX(0px)`;
            refreshArrowState();
        });

        refreshArrowState();
    }

    /* ======================================================================
       3. PARALLAX BACKGROUND (Mission section)
       ====================================================================== */
    const parallaxLayer = document.getElementById('parallaxLayer');
    if (parallaxLayer) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const offsetAmount = window.pageYOffset;
                    parallaxLayer.style.transform = `translateY(${offsetAmount * 0.12}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ======================================================================
       4. HERO TRACKING SHEET TAB SWITCHER
       ====================================================================== */
    const tabButtons = document.querySelectorAll('.sheet-tab-trigger');
    const contentPanes = document.querySelectorAll('.sheet-tab-panel');
    const activeLineTracer = document.querySelector('.dynamic-tab-line');

    function syncTabLineIndicator(targetActiveElement) {
        if (!activeLineTracer || !targetActiveElement) return;
        activeLineTracer.style.width = `${targetActiveElement.offsetWidth}px`;
        activeLineTracer.style.left = `${targetActiveElement.offsetLeft}px`;
    }

    if (tabButtons.length > 0) {
        syncTabLineIndicator(tabButtons[0]);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active-tab'));
            contentPanes.forEach(pane => pane.classList.remove('active-panel'));

            button.classList.add('active-tab');
            const targetId = button.getAttribute('data-target-pane');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active-panel');

            syncTabLineIndicator(button);
        });
    });

    window.addEventListener('resize', () => {
        const globalActiveTab = document.querySelector('.sheet-tab-trigger.active-tab');
        if (globalActiveTab) syncTabLineIndicator(globalActiveTab);
    });

    /* ======================================================================
       5. CONTACT FORM TABS (Request a Quote / Support Message)
       ====================================================================== */
    const formTabTriggers = document.querySelectorAll('.tab-trigger');
    formTabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            formTabTriggers.forEach(t => t.classList.remove('active'));
            trigger.classList.add('active');
        });
    });

    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = quoteForm.querySelector('.btn-submit-form');
            if (!btn || btn.classList.contains('sending')) return;
            const originalLabel = btn.textContent;
            btn.classList.add('sending');
            btn.textContent = 'Sending…';
            setTimeout(() => {
                btn.textContent = 'Request Sent ✓';
                setTimeout(() => {
                    btn.classList.remove('sending');
                    btn.textContent = originalLabel;
                }, 1800);
            }, 900);
        });
    }

    /* ======================================================================
       6. MOBILE NAVBAR OPEN / CLOSE
       ====================================================================== */
    const burgerMenu = document.getElementById('mobileHamburger');
    const navigationDrawer = document.getElementById('navLinksWrapper');
    const navBackdrop = document.getElementById('mobileNavBackdrop');
    const nestedDropdownTriggers = document.querySelectorAll('.nav-item-dropdown > .nav-link');

    function closeMobileMenu() {
        burgerMenu.classList.remove('toggle-active');
        navigationDrawer.classList.remove('mobile-menu-open');
        navBackdrop.classList.remove('visible');
    }

    function toggleMobileMenu() {
        burgerMenu.classList.toggle('toggle-active');
        navigationDrawer.classList.toggle('mobile-menu-open');
        navBackdrop.classList.toggle('visible');
    }

    if (burgerMenu && navigationDrawer && navBackdrop) {
        burgerMenu.addEventListener('click', toggleMobileMenu);
        burgerMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        navBackdrop.addEventListener('click', closeMobileMenu);

        navigationDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 912 && !link.parentElement.classList.contains('nav-item-dropdown')) {
                    closeMobileMenu();
                }
            });
        });
    }

    nestedDropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 912) {
                e.preventDefault();
                const rootParentLi = trigger.parentElement;
                rootParentLi.classList.toggle('mobile-dropdown-active');
            }
        });
    });

    /* ======================================================================
       7. STICKY HEADER — SHRINK + SOLIDIFY ON SCROLL
       ====================================================================== */
    const siteHeader = document.getElementById('siteHeader');
    const backToTopBtn = document.getElementById('backToTopBtn');

    function handleHeaderScrollState() {
        const scrolled = window.scrollY > 40;
        if (siteHeader) siteHeader.classList.toggle('scrolled', scrolled);
        if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 700);
    }
    handleHeaderScrollState();
    window.addEventListener('scroll', handleHeaderScrollState, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ======================================================================
       8. SCROLL-REVEAL ENGINE (IntersectionObserver)
       ====================================================================== */
    const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group]');

    if ('IntersectionObserver' in window && revealTargets.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealTargets.forEach(el => revealObserver.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('in-view'));
    }

    /* ======================================================================
       9. STAT COUNTERS (About section)
       ====================================================================== */
    const counterEls = document.querySelectorAll('.count-up');

    function runCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window && counterEls.length) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counterEls.forEach(el => counterObserver.observe(el));
    } else {
        counterEls.forEach(el => {
            el.textContent = el.getAttribute('data-target');
        });
    }

});