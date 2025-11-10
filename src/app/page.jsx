"use client"; // Necessário porque a página usa scripts e funções no lado do cliente
import React from 'react';
import Script from 'next/script'; // Componente do Next.js para carregar scripts

export default function HomePage() {
  return (
    <>
      {/* CABEÇALHO/NAVEGAÇÃO PRINCIPAL */}
      <header className="navbar">
        <div className="container">
          {/* Logo da empresa com imagem e texto */}
          <a href="/" className="logo">
            <img src="/assets/icons/condoway-logo.png" alt="CondoWay Logo" />
            <span>CondoWay</span>
          </a>
          {/* Menu de navegação principal */}
          <nav>
            <ul className="nav-links">
              <li><a href="#home" className="nav-link">Home</a></li>
              <li><a href="#funcionalidades" className="nav-link">Funcionalidades</a></li>
              <li><a href="#sobre" className="nav-link">Sobre</a></li>
              <li><a href="#parceiros" className="nav-link">Parceiros</a></li>
              <li><a href="#faq" className="nav-link">Ajuda</a></li>
              <li><a href="#contato" className="nav-link">Contato</a></li>
            </ul>
          </nav>

          {/* Menu Hambúrguer para Mobile */}
          <button className="mobile-menu-toggle" aria-label="Menu de navegação">
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Botão de login para síndicos */}
          <a href="/login" className="login-button" id="loginButton">Login do Síndico</a>
        </div>
      </header>

      {/* SEÇÃO HERO/PRINCIPAL - Apresentação inicial do site */}
      <main id="home" className="hero">
        <div className="container hero-content">
          {/* Texto principal da seção hero */}
          <div className="hero-text">
            <h1><i className="fi fi-br-building"></i> Seu condomínio, mais conectado e inteligente.</h1>
            <p>O CondoWay simplifica a comunicação, agiliza reservas e organiza a vida no seu condomínio. Tudo na palma da sua mão.</p>
            {/* Botões de ação principais */}
            <div className="action-buttons">
              <a href="#download" className="btn btn-primary">
                <i className="fi fi-br-smartphone"></i>
                Baixar o App
              </a>
              <a href="#funcionalidades" className="btn btn-secondary">
                <i className="fi fi-br-search"></i> Ver Funcionalidades
              </a>
            </div>
          </div>
          {/* Imagem ilustrativa do aplicativo */}
          <div className="aplicativo-condoway">
            <img src="/assets/images/aplicativo-condoway.png" alt="App CondoWay em um smartphone" />
          </div>
        </div>
      </main>

      {/* SEÇÃO DE FUNCIONALIDADES - Cards com as principais features */}
      <section id="funcionalidades" className="features">
        <div className="container">
          {/* Tag e título da seção */}
          <span className="section-tag"><i className="fi fi-br-sparkles"></i> O que oferecemos</span>
          <h2><i className="fi fi-br-rocket"></i> Funcionalidades Pensadas para Você</h2>

          {/* Grid de cards com as funcionalidades */}
          <div className="features-grid">
            {/* Card 1: Reservas de Ambientes */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-br-calendar"></i>
              </div>
              <h3>Reservas de Ambientes</h3>
              <p>Agende o salão de festas ou a churrasqueira com um calendário visual e intuitivo, sem conflitos.</p>
            </div>

            {/* Card 2: Mural de Avisos */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-br-megaphone"></i>
              </div>
              <h3>Mural de Avisos</h3>
              <p>Receba comunicados importantes do síndico em tempo real, direto no seu celular.</p>
            </div>

            {/* Card 3: Registro de Ocorrências */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-br-clipboard-list"></i>
              </div>
              <h3>Registro de Ocorrências</h3>
              <p>Reporte problemas de manutenção e acompanhe o status da resolução de forma transparente.</p>
            </div>

            {/* Card 4: Controle de Encomendas */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-br-box"></i>
              </div>
              <h3>Controle de Encomendas</h3>
              <p>Seja notificado assim que sua encomenda chegar na portaria e registre a retirada com facilidade.</p>
            </div>

            {/* Card 5: Pagamentos (Em Desenvolvimento) */}
            <div className="feature-card">
              {/* Badge de status para funcionalidades em desenvolvimento */}
              <div className="status-badge coming-soon">Em Desenvolvimento</div>
              <div className="feature-icon">
                <i className="fi fi-br-credit-card"></i>
              </div>
              <h3>Pagamentos Condominiais</h3>
              <p>Visualize boletos, pague taxas e gerencie extratos de forma integrada.</p>
            </div>

            {/* Card 6: Votações (Em Desenvolvimento) */}
            <div className="feature-card">
              {/* Badge de status para funcionalidades em desenvolvimento */}
              <div className="status-badge coming-soon">Em Desenvolvimento</div>
              <div className="feature-icon">
                <i className="fi fi-br-vote-yea"></i>
              </div>
              <h3>Enquetes e Votações</h3>
              <p>Crie e participe de enquetes para decisões do condomínio com sistema de votos e resultados públicos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE TESTEMUNHOS - Depoimentos de usuários */}
      <section className="testimonials">
        <div className="container">
          {/* Tag da seção */}
          <span className="section-tag"><i className="fi fi-br-comment-dots"></i> Opinião de quem usa</span>
          {/* Título da seção */}
          <h2><i className="fi fi-br-smile"></i> Moradores e Síndicos Satisfeitos</h2>

          {/* Grid de testemunhos */}
          <div className="testimonials-grid">
            {/* Testemunho 1: Moradora */}
            <div className="testimonial-card">
              {/* Foto do usuário */}
              <div className="testimonial-avatar">
                <img src="/assets/images/avatar-joana.svg" alt="Joana Silva" />
              </div>
              {/* Sistema de avaliação com estrelas */}
              <div className="testimonial-rating">
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
              </div>
              <p className="testimonial-text">&quot;Com o CondoWay, a comunicação no nosso prédio melhorou 100%. Organizar a reserva da churrasqueira agora é muito mais fácil!&quot;</p>
              {/* Informações do autor */}
              <div className="testimonial-author">
                <strong>Joana Silva</strong>
                <span className="testimonial-role">Moradora, Bloco A</span>
              </div>
            </div>

            {/* Testemunho 2: Síndico */}
            <div className="testimonial-card">
              {/* Foto do usuário */}
              <div className="testimonial-avatar">
                <img src="/assets/images/avatar-carlos.svg" alt="Carlos Almeida" />
              </div>
              {/* Sistema de avaliação com estrelas */}
              <div className="testimonial-rating">
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
                <i className="fi fi-br-star"></i>
              </div>
              <p className="testimonial-text">&quot;Gerenciar as ocorrências e os avisos ficou muito mais prático. A transparência com os moradores aumentou e meu trabalho foi otimizado.&quot;</p>
              {/* Informações do autor */}
              <div className="testimonial-author">
                <strong>Carlos Almeida</strong>
                <span className="testimonial-role">Síndico</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO SOBRE - Informações sobre o projeto */}
      <section id="sobre" className="about">
        <div className="container">
          {/* Tag e título da seção */}
          <span className="section-tag"><i className="fi fi-br-graduation-cap"></i> O Projeto</span>
          <h2><i className="fi fi-br-lightbulb"></i> Uma solução completa para a vida em condomínio</h2>
          <p className="section-subtitle">O CondoWay nasceu como um projeto de TCC com a missão de modernizar a gestão condominial, focando em uma experiência de usuário simples e eficiente.</p>

          {/* Grid com informações detalhadas */}
          <div className="about-grid">
            {/* Card 1: Nossa Missão */}
            <div className="about-card">
              <div className="about-icon">
                <i className="fi fi-br-target"></i>
              </div>
              <h3>Nossa Missão</h3>
              <p>Transformar a gestão de condomínios através da tecnologia, criando uma ponte digital entre síndicos e moradores para uma comunicação mais eficiente e transparente.</p>
            </div>

            {/* Card 2: Tecnologia */}
            <div className="about-card">
              <div className="about-icon">
                <i className="fi fi-br-computer"></i>
              </div>
              <h3>Tecnologia</h3>
              <p>Desenvolvido com as mais modernas tecnologias web e mobile, garantindo performance, segurança e uma experiência de usuário excepcional em todas as plataformas.</p>
            </div>

            {/* Card 3: Impacto */}
            <div className="about-card">
              <div className="about-icon">
                <i className="fi fi-br-chart-growth"></i>
              </div>
              <h3>Impacto</h3>
              <p>Reduzindo em até 70% o tempo gasto com tarefas administrativas, melhorando a comunicação e aumentando a satisfação dos moradores e síndicos.</p>
            </div>
          </div>

          {/* Estatísticas do projeto */}
          <div className="project-stats">
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Funcionalidades Principais</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Gratuito para Moradores</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Disponibilidade</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">LGPD</span>
              <span className="stat-label">Conformidade</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO FAQ - Perguntas Frequentes */}
      <section id="faq" className="faq-section">
        <div className="container">
          <span className="section-tag"><i className="fi fi-br-comment-question"></i> Dúvidas</span>
          <h2><i className="fi fi-br-interrogation"></i> Perguntas Frequentes</h2>

          <div className="faq-grid">
            {/* FAQ Item 1 */}
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <span>Como faço para baixar o aplicativo?</span>
                <i className="fi fi-br-angle-down faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p>O CondoWay estará disponível para download na Google Play Store e Apple App Store. Por enquanto, estamos na fase de desenvolvimento, mas em breve você poderá baixar o app gratuitamente.</p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <span>O aplicativo é gratuito?</span>
                <i className="fi fi-br-angle-down faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p>Sim! O CondoWay é completamente gratuito para moradores. O condomínio pode optar por planos premium com funcionalidades avançadas para a administração.</p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <span>Como o síndico pode começar a usar?</span>
                <i className="fi fi-br-angle-down faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p>O síndico deve fazer o cadastro do condomínio através do painel administrativo. Após a configuração inicial, todos os moradores receberão um convite para baixar o app.</p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <span>Meus dados estão seguros?</span>
                <i className="fi fi-br-angle-down faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p>Absolutamente! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. Seus dados são protegidos conforme a LGPD (Lei Geral de Proteção de Dados).</p>
              </div>
            </div>
            
            {/* ... (Restante dos FAQs) ... */}

          </div>
        </div>
      </section>

      {/* SEÇÃO DE PARCEIROS */}
      <section id="parceiros" className="partners-section">
          {/* ... (Conteúdo da seção de parceiros) ... */}
      </section>

      {/* SEÇÃO DE DOWNLOAD */}
      <section id="download" className="download-section">
        <div className="container">
          <h2><i className="fi fi-br-smartphone"></i> Leve o CondoWay com você</h2>
          <p>Disponível para as principais plataformas móveis. Baixe agora!</p>
          <div className="app-store-buttons">
            <a href="https://play.google.com/store/" target="_blank" rel="noopener noreferrer" aria-label="Baixar no Google Play"><img src="/assets/icons/playstore.png" alt="Disponível no Google Play" /></a>
            <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer" aria-label="Baixar na App Store"><img src="/assets/icons/appstore.svg" alt="Baixar na App Store" /></a>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer id="contato" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-about">
              <a href="#" className="logo">
                <img src="/assets/icons/condoway-transparente.png" alt="CondoWay Logo" />
                <span>CondoWay</span>
              </a>
              <p>Um Projeto de TCC para modernizar a gestão de condomínios.</p>
            </div>
            <div className="footer-contact">
              <h4><i className="fi fi-br-phone-call"></i> Contato</h4>
              <p><i className="fi fi-br-envelope"></i> <a href="mailto:contato@condoway.com">contato@condoway.com</a></p>
              <p><i className="fi fi-br-social-network"></i> <a href="https://github.com/matheusvribeiro/tcc-condoway" target="_blank">Github do Projeto</a></p>

              {/* Redes Sociais */}
              <div className="social-links">
                {/* ... (ícones de redes sociais) ... */}
              </div>

              {/* Formulário de Contato */}
              <div className="contact-form-container">
                <button className="contact-form-toggle" onClick={() => toggleContactForm()}>
                  <i className="fi fi-br-comment-dots"></i> Enviar Mensagem
                </button>
                <form className="contact-form" id="contactForm" style={{ display: 'none' }}>
                  {/* ... (campos do formulário) ... */}
                </form>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 CondoWay. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* BOTÃO SCROLL TO TOP */}
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fi fi-br-angle-up"></i>
      </button>

      {/* MODAL DE LOGIN */}
      <div id="loginModal" className="modal" style={{ display: 'none' }}>
        {/* ... (conteúdo do modal de login) ... */}
      </div>

      {/* OVERLAY PARA MODAIS */}
      <div id="modalOverlay" className="modal-overlay" onClick={() => closeAllModals()} style={{ display: 'none' }}></div>

      {/* SCRIPT - Carrega o JS da sua landing page */}
      <Script src="/js/main.js" strategy="lazyOnload" />
    </>
  );
}

{/* Funções do main.js que precisam ser globais (ou recriadas em React) */}
{/* Como estamos carregando o main.js via <Script>, estas funções estarão disponíveis globalmente */}
<Script id="inline-helpers" strategy="lazyOnload">
  {`
    function toggleFAQ(element) {
        const faqItem = element.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const question = faqItem.querySelector('.faq-question');
        
        document.querySelectorAll('.faq-question.active').forEach(activeQuestion => {
            if (activeQuestion !== question) {
                activeQuestion.classList.remove('active');
                activeQuestion.closest('.faq-item').querySelector('.faq-answer').classList.remove('active');
            }
        });
        
        question.classList.toggle('active');
        answer.classList.toggle('active');
    }

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
            document.body.style.overflow = 'hidden';
        }
    }

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
            document.body.style.overflow = 'auto';
        }
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        });
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
        }
        document.body.style.overflow = 'auto';
    }

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
                setTimeout(() => { form.style.display = 'none'; }, 300);
            }
        }
    }
  `}
</Script>