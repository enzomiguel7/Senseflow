import { Component, ViewEncapsulation, OnInit, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  isHeaderScrolled = false;
  faqItems = [
    {
      question: 'O que é o SenseFlow e como funciona?',
      answer: 'O SenseFlow é uma plataforma de análise de fluxo de pessoas que utiliza sensores inteligentes para monitorar em tempo real a movimentação em espaços físicos. Os dados são processados e apresentados em dashboards intuitivos, permitindo decisões baseadas em dados concretos.',
      isOpen: false
    },
    {
      question: 'Quais tipos de espaços podem usar o SenseFlow?',
      answer: 'O SenseFlow é ideal para bibliotecas, museus, centros culturais, espaços corporativos, universidades, shopping centers, eventos e qualquer ambiente que precise entender e otimizar o fluxo de pessoas.',
      isOpen: false
    },
    {
      question: 'Os dados coletados são seguros e estão em conformidade com a LGPD?',
      answer: 'Sim, totalmente! Todos os dados são anonimizados e criptografados. Não coletamos informações pessoais identificáveis. Nossa plataforma está em total conformidade com a Lei Geral de Proteção de Dados (LGPD) e melhores práticas de segurança da informação.',
      isOpen: false
    },
    {
      question: 'Consigo acessar os dados em tempo real?',
      answer: 'Sim! O dashboard SenseFlow apresenta dados em tempo real, permitindo que você monitore o fluxo de pessoas instantaneamente de qualquer dispositivo com acesso à internet. Você também pode gerar relatórios históricos e análises personalizadas.',
      isOpen: false
    },
    {
      question: 'O SenseFlow funciona offline?',
      answer: 'Os sensores precisam de conexão com a internet para enviar dados em tempo real ao dashboard. No entanto, em caso de falha temporária de conexão, os sensores armazenam os dados localmente e sincronizam automaticamente quando a conexão é restabelecida.',
      isOpen: false
    }
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Scroll suave configurado no styles.css global
  }

  ngAfterViewInit() {
    // Aguardar a renderização completa antes de configurar animações
    setTimeout(() => {
      this.setupScrollAnimations();
      this.setupDashboardPreviewAnimation();
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Scroll suave para header
    this.isHeaderScrolled = window.pageYOffset > 50;
    
    // Atualizar link ativo na navbar
    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    const sections = ['recursos', 'como-funciona', 'solucoes', 'contato'];
    const navLinks = this.elementRef.nativeElement.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
          current = sectionId;
        }
      }
    });
    
    navLinks.forEach((link: HTMLElement) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  setupScrollAnimations() {
    // Animação de entrada dos elementos ao scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Elementos para animar
    const animateElements = this.elementRef.nativeElement.querySelectorAll('.stat-card, .feature-card, .step-card');
    animateElements.forEach((el: HTMLElement) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  setupDashboardPreviewAnimation() {
    // Animação especial para preview do dashboard
    const previewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Anima o gráfico
          const chart = (entry.target as HTMLElement).querySelector('.preview-chart');
          if (chart) {
            chart.classList.add('visible');
          }
          
          // Anima os itens de features com delay
          const featureItems = (entry.target as HTMLElement).querySelectorAll('.preview-feature-item');
          featureItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 200);
          });
        }
      });
    }, {
      threshold: 0.2
    });

    const dashboardPreview = this.elementRef.nativeElement.querySelector('.dashboard-preview');
    if (dashboardPreview) {
      previewObserver.observe(dashboardPreview);
    }
  }

  toggleFaq(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
