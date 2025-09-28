// ========================================
// HERO SLIDESHOW
// ========================================

let currentHeroSlideIndex = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

// Função para mostrar slide específico do hero
function showHeroSlide(index) {
    // Remove classe active de todos os slides e dots do hero
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));
    
    // Adiciona classe active ao slide e dot atual do hero
    if (heroSlides[index]) {
        heroSlides[index].classList.add('active');
        
        // Reinicia animações do conteúdo
        const heroContent = heroSlides[index].querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'none';
            heroContent.offsetHeight; // Trigger reflow
            heroContent.style.animation = 'fadeInUp 1.2s ease-out';
        }
    }
    if (heroDots[index]) {
        heroDots[index].classList.add('active');
    }
    
    currentHeroSlideIndex = index;
}

// Função para ir para o próximo slide do hero
function nextHeroSlide() {
    const nextIndex = (currentHeroSlideIndex + 1) % heroSlides.length;
    showHeroSlide(nextIndex);
}

// Função para ir para o slide anterior do hero
function prevHeroSlide() {
    const prevIndex = (currentHeroSlideIndex - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(prevIndex);
}

// Auto-play do hero slideshow
let heroAutoPlayInterval;

function startHeroAutoPlay() {
    stopHeroAutoPlay();
    heroAutoPlayInterval = setInterval(() => {
        nextHeroSlide();
    }, 5000);
}

function stopHeroAutoPlay() {
    if (heroAutoPlayInterval) {
        clearInterval(heroAutoPlayInterval);
        heroAutoPlayInterval = null;
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Inicialização do hero slideshow quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Mostra o primeiro slide do hero
    if (heroSlides.length > 0) {
        showHeroSlide(0);
        startHeroAutoPlay();
        
        // Pausa o auto-play quando o usuário interage com o hero
        const heroSection = document.querySelector('.hero-slideshow');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopHeroAutoPlay);
            heroSection.addEventListener('mouseleave', startHeroAutoPlay);
        }
        
        // Event listeners para os hero dots
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showHeroSlide(index);
                stopHeroAutoPlay();
                startHeroAutoPlay();
            });
        });
        
        // Adiciona suporte para touch/swipe no hero
        let heroStartX = 0;
        let heroEndX = 0;
        
        heroSection.addEventListener('touchstart', function(e) {
            heroStartX = e.touches[0].clientX;
        });
        
        heroSection.addEventListener('touchend', function(e) {
            heroEndX = e.changedTouches[0].clientX;
            handleHeroSwipe();
        });
        
        function handleHeroSwipe() {
            const threshold = 50;
            const diff = heroStartX - heroEndX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextHeroSlide();
                } else {
                    prevHeroSlide();
                }
                stopHeroAutoPlay();
                startHeroAutoPlay();
            }
        }
    }
    
    // Inicializa o FAQ
    initFAQ();
    
    // Inicializa o menu mobile
    initMobileMenu();
});

// ========================================
// SMOOTH SCROLL
// ========================================

// Smooth scroll para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ANIMAÇÕES
// ========================================

// Observa elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .services-section h2');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
});

// ========================================
// NAVEGAÇÃO POR TECLADO
// ========================================

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        prevHeroSlide();
        stopHeroAutoPlay();
        startHeroAutoPlay();
    } else if (e.key === 'ArrowRight') {
        nextHeroSlide();
        stopHeroAutoPlay();
        startHeroAutoPlay();
    }
});

// ========================================
// ACESSIBILIDADE
// ========================================

// Função para anunciar mudanças de slide para leitores de tela
function announceSlideChange() {
    const activeSlide = document.querySelector('.hero-slide.active');
    if (activeSlide) {
        const slideTitle = activeSlide.querySelector('h1');
        if (slideTitle) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = `Slide alterado para: ${slideTitle.textContent}`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }
}

// Modifica a função showHeroSlide para incluir anúncio de acessibilidade
const originalShowHeroSlide = showHeroSlide;
showHeroSlide = function(index) {
    originalShowHeroSlide(index);
    announceSlideChange();
};

// ========================================
// PRELOAD DE IMAGENS
// ========================================

// Função para preload de imagens críticas
function preloadImages() {
    const criticalImages = [
        'images/imag_001.jpg',
        'images/imag_002.jpg',
        'images/imag_003.jpg',
        'images/logo_andrea.PNG'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Inicializa o preload quando a página carrega
document.addEventListener('DOMContentLoaded', preloadImages);

// ========================================
// FAQ ACCORDION
// ========================================

// FAQ Accordion - Função para inicializar o FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        return;
    }
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) {
            return;
        }
        
        // Adiciona atributos de acessibilidade
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('tabindex', '0');
        
        answer.setAttribute('aria-hidden', 'true');
        
        // Event listeners para clique e teclado
        question.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFAQ(item, faqItems);
        });
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item, faqItems);
            }
        });
    });
}

// Função para toggle do FAQ
function toggleFAQ(item, faqItems) {
    const isActive = item.classList.contains('active');
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // Fecha todos os outros FAQs
    faqItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherQuestion && otherAnswer) {
                otherQuestion.setAttribute('aria-expanded', 'false');
                otherAnswer.setAttribute('aria-hidden', 'true');
            }
        }
    });
    
    // Toggle do FAQ atual
    if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
    } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
    }
}

// ========================================
// COMPONENTE MENU MOBILE
// ========================================

// Função para inicializar o menu mobile
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-menu a');
    
    if (!mobileToggle || !mobileOverlay) {
        return;
    }
    
    // Função para abrir/fechar menu
    function toggleMenu() {
        const isOpen = mobileOverlay.classList.contains('active');
        
        if (isOpen) {
            // Fechar menu
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            // Abrir menu
            mobileToggle.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Event listener para o botão hambúrguer
    mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Fechar menu ao clicar em um link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Fechar menu ao clicar no overlay
    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) {
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fechar menu com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}
