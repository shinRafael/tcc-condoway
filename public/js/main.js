/**
 * ===================================
 * CONDOWAY - SCRIPT PRINCIPAL
 * Arquivo: js/main.js
 * Descrição: Funcionalidades interativas da landing page
 * ===================================
 */

// ESPERA O DOM CARREGAR COMPLETAMENTE
document.addEventListener('DOMContentLoaded', function() {
    
    /* ================================= */
    /* NAVEGAÇÃO SUAVE (SMOOTH SCROLL) */
    /* ================================= */
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previne comportamento padrão do link
            
            // Obtém o ID da seção alvo
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Fecha menu mobile se estiver aberto
            const navLinksContainer = document.querySelector('.nav-links');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (navLinksContainer) navLinksContainer.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            
            // Faz scroll suave até a seção
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    /* ================================= */
    /* MENU HAMBÚRGUER MOBILE */
    /* ================================= */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }
    
    /* ================================= */
    /* DESTAQUE DE SEÇÃO ATIVA NO MENU */
    /* ================================= */
    const sections = document.querySelectorAll('section, main');
    
    function updateActiveNavigation() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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
    
    /* ================================= */
    /* CONTROLE DA NAVBAR E SCROLL */
    /* ================================= */
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        // Adiciona classe quando usuário faz scroll para baixo
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // CONTROLA BOTÃO "VOLTAR AO TOPO"
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible'); // Mostra botão
            } else {
                scrollTopBtn.classList.remove('visible'); // Esconde botão
            }
        }
        
        // Atualiza navegação ativa
        updateActiveNavigation();
    });
    
    /* ================================= */
    /* MODAL DE LOGIN */
    /* ================================= */
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('loginModal');
        });
    }
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simula processo de login
            const submitBtn = this.querySelector('.login-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fi fi-br-spinner"></i> Entrando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Login simulado! Em um projeto real, aqui seria feita a autenticação.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                closeModal('loginModal');
            }, 2000);
        });
    }
    
    /* ================================= */
    /* FORMULÁRIO DE CONTATO */
    /* ================================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fi fi-br-spinner"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Retornaremos em breve.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                toggleContactForm(); // Fecha o formulário
            }, 2000);
        });
    }
    
    /* ...existing code... */
    
    /* ================================= */
    /* ANIMAÇÕES BASEADAS EM SCROLL */
    /* ================================= */
    
    // Configurações do Intersection Observer
    const observerOptions = {
        threshold: 0.1,                    // Elemento precisa estar 10% visível
        rootMargin: '0px 0px -50px 0px'   // Margem inferior para ativar animação
    };
    
    // Observer para detectar quando elementos entram na viewport
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            // Quando elemento entra na viewport, aplica animação
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';           // Torna visível
                entry.target.style.transform = 'translateY(0) translateX(0)'; // Move para posição final
            }
        });
    }, observerOptions);
    
    /* ================================= */
    /* OBSERVA ELEMENTOS PARA ANIMAÇÃO */
    /* ================================= */
    
    // Seleciona todos os cards que devem ter animação de entrada
    document.querySelectorAll('.feature-card, .testimonial-card, .faq-item').forEach(card => {
        observer.observe(card); // Adiciona cada card ao observer
    });
    
    // LOG DE INICIALIZAÇÃO
    console.log('🚀 CondoWay - Sistema atualizado com sucesso!');
});

/* ================================= */
/* FUNÇÕES GLOBAIS */
/* ================================= */

// Função para abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        
        setTimeout(() => {
            modal.classList.add('active');
            overlay.classList.add('active');
        }, 10);
        
        // Previne scroll do body
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar modal específico
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
        
        // Restaura scroll do body
        document.body.style.overflow = 'auto';
    }
}

// Função para fechar todos os modais
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modalOverlay');
    
    modals.forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
    
    // Restaura scroll do body
    document.body.style.overflow = 'auto';
}

// Função para toggle do FAQ
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const question = faqItem.querySelector('.faq-question');
    
    // Fecha outras FAQs abertas
    document.querySelectorAll('.faq-question.active').forEach(activeQuestion => {
        if (activeQuestion !== question) {
            activeQuestion.classList.remove('active');
            activeQuestion.closest('.faq-item').querySelector('.faq-answer').classList.remove('active');
        }
    });
    
    // Toggle da FAQ clicada
    question.classList.toggle('active');
    answer.classList.toggle('active');
}

// Função para toggle do formulário de contato
function toggleContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
            setTimeout(() => {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }, 10);
        } else {
            form.style.opacity = '0';
            form.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                form.style.display = 'none';
            }, 300);
        }
    }
}

// Função para toggle do formulário de notificação
function toggleNotifyForm() {
    const form = document.getElementById('notifyForm');
    const btn = document.querySelector('.notify-btn');
    
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        btn.innerHTML = '<i class="fi fi-br-cross"></i> Cancelar';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        form.style.display = 'none';
        btn.innerHTML = '<i class="fi fi-br-bell"></i> Quero ser notificado';
    }
}
