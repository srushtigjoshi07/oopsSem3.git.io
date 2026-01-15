// ==============================================
// Self-Reconfiguring Robot Simulation Portfolio
// Team: Srushti G Joshi (Lead), M Shreya, Nisha N Gowda, 
//       Ananya P Kumtakar, Somavva C Gunjal
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully! 🚀');
    
    // ========== MOBILE NAVIGATION ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== CODE PREVIEW INTERACTIVITY ==========
    const codePreview = document.querySelector('.code-preview');
    if (codePreview) {
        codePreview.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
        });
        
        codePreview.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        // Add click to copy functionality
        codePreview.addEventListener('click', function() {
            const code = this.querySelector('code');
            if (code) {
                const text = code.textContent;
                navigator.clipboard.writeText(text)
                    .then(() => showNotification('Code copied to clipboard!', 'success'))
                    .catch(() => showNotification('Failed to copy code', 'error'));
            }
        });
    }
    
    // ========== STATISTICS COUNTER ANIMATION ==========
    function initStatisticsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const originalText = stat.textContent;
            const hasPlus = originalText.includes('+');
            const target = parseInt(originalText);
            
            if (!isNaN(target)) {
                // Reset for animation
                stat.textContent = '0' + (hasPlus ? '+' : '');
                
                // Start counter when in view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCounter(stat, target, hasPlus);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { 
                    threshold: 0.5,
                    rootMargin: '0px 0px -100px 0px'
                });
                
                observer.observe(stat.closest('.stat-card, .stat-item'));
            }
        });
    }
    
    function animateCounter(element, target, hasPlus) {
        let current = 0;
        const increment = target / 30; // 30 steps
        const duration = 1500; // 1.5 seconds
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + (hasPlus ? '+' : '');
        }, duration / 30);
    }
    
    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // ========== HOVER ANIMATIONS ==========
    function initHoverAnimations() {
        // Team cards
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px)';
                this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                
                // Animate initials
                const initials = this.querySelector('.initials');
                if (initials) {
                    initials.style.transform = 'scale(1.1) rotate(5deg)';
                    initials.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                
                // Reset initials
                const initials = this.querySelector('.initials');
                if (initials) {
                    initials.style.transform = 'scale(1) rotate(0)';
                    initials.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
                }
            });
        });
        
        // Feature cards
        const featureCards = document.querySelectorAll('.feature-card, .app-card, .thinking-card, .detail-card, .module-card, .algorithm-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.12)';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.color = 'var(--primary-dark)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                    icon.style.color = '';
                }
            });
        });
        
        // Code syntax highlighting on hover
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(code => {
            const parent = code.closest('.code-preview, .shape-algo');
            if (parent) {
                parent.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                });
                
                parent.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '';
                });
            }
        });
    }
    
    // ========== ACTIVE NAV LINK HIGHLIGHTING ==========
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        function highlightNavLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                if (window.scrollY >= (sectionTop - navbarHeight - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink(); // Initial call
    }
    
    // ========== SCROLL PROGRESS INDICATOR ==========
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // ========== SECTION REVEAL ANIMATIONS ==========
    function initSectionReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    // ========== SKILL TAGS ANIMATION ==========
    function initSkillTagsAnimation() {
        const skillTags = document.querySelectorAll('.team-skills span, .tech-tags span');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) translateY(-3px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                this.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
                this.style.color = 'white';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateY(0)';
                this.style.boxShadow = '';
                this.style.background = '';
                this.style.color = '';
            });
        });
    }
    
    // ========== INITIALIZE ALL FEATURES ==========
    function initializeAllFeatures() {
        initStatisticsCounters();
        initHoverAnimations();
        initActiveNavHighlight();
        initScrollProgress();
        initSectionReveal();
        initSkillTagsAnimation();
        
        // Add CSS animations
        addCSSAnimations();
        
        // Show welcome message
        setTimeout(() => {
            console.log('All features initialized successfully!');
        }, 1000);
    }
    
    function addCSSAnimations() {
        // Add keyframes for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-success {
                border-left: 4px solid var(--success);
            }
            
            .notification-error {
                border-left: 4px solid var(--danger);
            }
            
            .notification-info {
                border-left: 4px solid var(--primary);
            }
            
            .notification-warning {
                border-left: 4px solid var(--warning);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i {
                color: var(--success);
            }
            
            .notification-error .notification-content i {
                color: var(--danger);
            }
            
            .notification-info .notification-content i {
                color: var(--primary);
            }
            
            .notification-warning .notification-content i {
                color: var(--warning);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--gray-dark);
                cursor: pointer;
                padding: 5px;
                font-size: 0.9rem;
                transition: color 0.3s;
            }
            
            .notification-close:hover {
                color: var(--dark);
            }
            
            .nav-links a.active {
                color: var(--primary) !important;
                background: rgba(74, 144, 226, 0.1) !important;
                font-weight: 600 !important;
            }
            
            /* Section reveal animation */
            section:not(.hero) {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }
            
            section.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Stagger animation for cards */
            section.revealed .team-card,
            section.revealed .feature-card,
            section.revealed .app-card,
            section.revealed .thinking-card,
            section.revealed .detail-card,
            section.revealed .module-card,
            section.revealed .algorithm-card {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            /* Delay animations for grid items */
            section.revealed .team-card:nth-child(1) { animation-delay: 0.1s; }
            section.revealed .team-card:nth-child(2) { animation-delay: 0.2s; }
            section.revealed .team-card:nth-child(3) { animation-delay: 0.3s; }
            section.revealed .team-card:nth-child(4) { animation-delay: 0.4s; }
            section.revealed .team-card:nth-child(5) { animation-delay: 0.5s; }
            
            section.revealed .feature-card:nth-child(1),
            section.revealed .app-card:nth-child(1),
            section.revealed .detail-card:nth-child(1),
            section.revealed .module-card:nth-child(1) { animation-delay: 0.1s; }
            
            section.revealed .feature-card:nth-child(2),
            section.revealed .app-card:nth-child(2),
            section.revealed .detail-card:nth-child(2),
            section.revealed .module-card:nth-child(2) { animation-delay: 0.2s; }
            
            section.revealed .feature-card:nth-child(3),
            section.revealed .app-card:nth-child(3),
            section.revealed .detail-card:nth-child(3),
            section.revealed .module-card:nth-child(3) { animation-delay: 0.3s; }
            
            section.revealed .feature-card:nth-child(4),
            section.revealed .app-card:nth-child(4),
            section.revealed .detail-card:nth-child(4),
            section.revealed .module-card:nth-child(4) { animation-delay: 0.4s; }
            
            /* Code preview animation */
            .code-preview {
                animation: float 3s ease-in-out infinite;
            }
            
            /* Hero title gradient animation */
            .hero-title {
                background: linear-gradient(90deg, var(--primary-dark), var(--primary), var(--secondary));
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradientShift 3s ease infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ========== PERFORMANCE OPTIMIZATION ==========
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Perform scroll-related operations
        }, 100);
    });
    
    // Lazy load images (if any)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ========== INITIALIZE EVERYTHING ==========
    initializeAllFeatures();
    
    // ========== UTILITY FUNCTIONS ==========
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text)
            .then(() => showNotification('Copied to clipboard!', 'success'))
            .catch(() => showNotification('Failed to copy', 'error'));
    };
    
    // ========== DEBUG MODE ==========
    // Enable debug mode with ?debug in URL
    if (window.location.search.includes('debug')) {
        console.log('Debug mode enabled');
        document.body.classList.add('debug-mode');
        
        // Add debug panel
        const debugPanel = document.createElement('div');
        debugPanel.className = 'debug-panel';
        debugPanel.innerHTML = `
            <h4>Debug Panel</h4>
            <button onclick="showNotification('Test notification', 'success')">Test Success</button>
            <button onclick="showNotification('Test error', 'error')">Test Error</button>
            <button onclick="location.reload()">Reload</button>
            <button onclick="copyToClipboard('Sample text')">Copy Sample</button>
        `;
        document.body.appendChild(debugPanel);
    }
    
    // ========== LOADING INDICATOR ==========
    // Show loading indicator on page load
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Remove loading indicator
        const loader = document.getElementById('page-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 300);
            }, 500);
        }
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('Welcome to Robotics Simulation Portfolio!', 'info');
        }, 1000);
    });
    
    // ========== KEYBOARD SHORTCUTS ==========
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + / to show debug panel
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showNotification('Debug shortcuts enabled. Use ?debug in URL for panel.', 'info');
        }
        
        // Escape to close notifications
        if (e.key === 'Escape') {
            document.querySelectorAll('.notification').forEach(notification => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        }
    });
});
