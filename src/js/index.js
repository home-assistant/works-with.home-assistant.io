let logoCarousels = document.querySelectorAll('.logo-slider .swiper');
if (logoCarousels) {
    // Randomise the order of logo slides to avoid bias
    logoCarousels.forEach(logoCarousel => {
        const wrapper = logoCarousel.querySelector('.swiper-wrapper');
        if (wrapper) {
            const slides = Array.from(wrapper.children);
            // Fisher-Yates shuffle
            for (let i = slides.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                wrapper.appendChild(slides[j]);
                slides[j] = slides[i];
            }
        }
    });
    let r = true;
    logoCarousels.forEach(logoCarousel => {
        r = !r;
        new Swiper(logoCarousel, {
            slidesPerView: 2.5,
            speed: 1500,
            loop: true,
            centeredSlides: true,
            edgeSwipeDetection: 'prevent',
            autoplay: {
                delay: 750,
                reverseDirection: r,
                preventSwipeThreshold: 120,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            spaceBetween: 10,
            breakpoints: {
                768: {
                    slidesPerView: 6.5,
                    spaceBetween: 20
                },
            }
        });
    });
}

let stepsWrapper = document.querySelector('.whats-involved .steps');
let stepsPagination = document.querySelector('.whats-involved .steps-pagination');
if (stepsWrapper) {
    let steps = stepsWrapper.querySelectorAll('.step');
    let currentStep = 1;
    let stepInterval = null;
    if (steps) {
        stepInterval = setInterval(() => {
            doStepSlide(currentStep);
        }, 4000);

        if (stepsPagination) {
            let pageItem = stepsPagination.querySelectorAll('span');
            if (pageItem) {
                pageItem.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        clearInterval(stepInterval);
                        doStepSlide(index);
                        stepInterval = setInterval(() => {
                            doStepSlide(currentStep);
                        }, 4000);
                    });
                });
            }
        }
    }
}

function doStepSlide(index = 0) {
    steps.forEach(step => {
        step.classList.remove('active');
    });
    steps[index].classList.add('active');
    stepsWrapper.setAttribute('data-step', index);
    currentStep = index === steps.length - 1 ? 0 : index + 1;
}


let header = document.querySelector('.header');
let burger = header.querySelector('.burger');
if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        header.classList.toggle('open');
    });
}

let navItems = header.querySelectorAll('.nav-item');
if (navItems) {
    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            header.classList.remove('open');
            burger.classList.remove('active');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === "#") {
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
            });
        }
    });
});

let copyTargets = document.querySelectorAll("[data-copy]");
if (copyTargets) {
    copyTargets.forEach(copyTarget => {
        copyTarget.addEventListener('click', () => {
            let text = copyTarget.getAttribute('data-copy');
            let innerHTML = copyTarget.innerHTML;
            navigator.clipboard.writeText(text).then(() => {
                copyTarget.classList.add('copied');
                copyTarget.innerHTML = "Copied!";
                setTimeout(() => {
                    copyTarget.classList.remove('copied');
                    copyTarget.innerHTML = innerHTML;
                }, 2000);
            });
        });
    });
}