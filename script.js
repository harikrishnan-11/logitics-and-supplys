
const hum = document.getElementById("hamburger");
const mob = document.querySelector(".mobile-nav");
 
hum.addEventListener("click", () => {
    hum.classList.toggle("active");
    mob.classList.toggle("active");
});




window.togglePasswordVisibility = function(targetId, button) {
    const input = document.getElementById(targetId);
    if (!input || !button) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

    const icon = button.querySelector('svg');
    if (icon) {
        icon.innerHTML = isPassword
            ? '<path d="M3 3l18 18"></path><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"></path><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c7 0 10 7 10 7a19.2 19.2 0 0 1-3.7 4.6"></path><path d="M6.3 6.3A19.2 19.2 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 2.1-.2"></path>'
            : '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
};

document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. SMOOTH ANCHOR NAVIGATION
       ====================================================================== */
    const smoothScrollToTarget = (targetId, offset = 96) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const topPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: topPosition, behavior: 'smooth' });
    };

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const targetId = href.substring(1);
            if (!targetId) return;

            event.preventDefault();
            smoothScrollToTarget(targetId);
            history.pushState(null, '', href);
        });
    });

    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        if (targetId) {
            setTimeout(() => smoothScrollToTarget(targetId), 120);
        }
    }

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

    function showFieldError(input, message) {
        const errorElement = document.querySelector(`[data-error-for="${input.id}"]`);
        if (errorElement) {
            errorElement.textContent = message;
        }

        input.classList.toggle('is-invalid', Boolean(message));
        input.classList.toggle('is-valid', !message && input.value.trim() !== '');
        input.setAttribute('aria-invalid', String(Boolean(message)));
    }

    function clearFieldError(input) {
        showFieldError(input, '');
    }

    function validateField(input) {
        const value = input.value.trim();
        const validator = input.dataset.validate;

        if (!input.required && !value) {
            clearFieldError(input);
            return true;
        }

        if (!value) {
            showFieldError(input, 'This field is required.');
            return false;
        }

        let message = '';
        if (validator === 'name') {
            message = /^[A-Za-z\s]+$/.test(value) ? '' : 'Name should contain letters only.';
        } else if (validator === 'email') {
            message = /^[^\s@]+@[^\s@]+\.(com|in)$/i.test(value) ? '' : 'Please enter a valid email ending with .com or .in.';
        } else if (validator === 'phone') {
            message = /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits.';
        } else if (validator === 'password') {
            message = value.length >= 8 ? '' : 'Password must be at least 8 characters long.';
        } else if (validator === 'confirmPassword') {
            const passwordField = input.closest('form')?.querySelector('input[name="password"]');
            const passwordValue = passwordField ? passwordField.value.trim() : '';
            message = value && passwordValue && value === passwordValue ? '' : 'Passwords do not match.';
        } else if (validator === 'orderId') {
            message = value.length >= 3 ? '' : 'Order ID must be at least 3 characters.';
        } else if (validator === 'region' || validator === 'facility') {
            message = value.length >= 3 ? '' : 'Please enter at least 3 characters.';
        }

        showFieldError(input, message);
        return !message;
    }

    function validateForm(form) {
        let isValid = true;
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.dataset.validate || field.required) {
                if (!validateField(field)) {
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    function initFormValidation(form) {
        if (!form) return;

        form.setAttribute('novalidate', 'true');

        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid') || field.value.trim()) {
                    validateField(field);
                }
            });
            field.addEventListener('change', () => validateField(field));
        });

        form.addEventListener('submit', (event) => {
            const isValid = validateForm(form);
            if (!isValid) {
                event.preventDefault();
                return;
            }

            if (form.id === 'loginForm') {
                event.preventDefault();
                const roleSelect = form.querySelector('select[name="role"]');
                const selectedRole = roleSelect?.value === 'admin' ? 'admin' : 'user';
                window.location.href = selectedRole === 'admin' ? 'admin.html' : 'user.html';
                return;
            }

            if (form.id === 'heroTrackingForm' || form.id === 'heroWarehouseForm') {
                event.preventDefault();
                window.location.href = '404.html';
                return;
            }

            if (form.id === 'quoteForm') {
                event.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                if (!btn || btn.classList.contains('sending')) return;
                const originalLabel = btn.textContent;
                btn.classList.add('sending');
                btn.textContent = 'Sending…';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent';
                    setTimeout(() => {
                        btn.classList.remove('sending');
                        btn.textContent = originalLabel;
                    }, 1800);
                }, 900);
            }
        });
    }

    document.querySelectorAll('form').forEach(initFormValidation);



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