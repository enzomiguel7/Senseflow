import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saiba-mais',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saiba-mais.component.html',
  styleUrls: ['./saiba-mais.component.css']
})
export class SaibaMaisComponent implements OnInit {
  features = [
    {
      icon: 'speed',
      title: 'Monitoramento em Tempo Real',
      description: 'Acompanhe o fluxo de visitantes instantaneamente com atualizações em tempo real via MQTT.'
    },
    {
      icon: 'analytics',
      title: 'Análise Avançada de Dados',
      description: 'Gráficos interativos e estatísticas detalhadas para insights profundos sobre o comportamento dos visitantes.'
    },
    {
      icon: 'history',
      title: 'Histórico Detalhado',
      description: 'Registros completos de entrada e saída para análise de padrões e tendências ao longo do tempo.'
    }
  ];

  benefits = [
    {
      icon: 'trending_up',
      title: 'Otimize o Espaço',
      description: 'Entenda os horários de pico e ajuste a capacidade do seu estabelecimento.'
    },
    {
      icon: 'people',
      title: 'Melhore a Experiência',
      description: 'Evite superlotação e proporcione conforto aos seus visitantes.'
    },
    {
      icon: 'schedule',
      title: 'Gestão de Equipe',
      description: 'Organize melhor os horários dos funcionários com base nos períodos de maior movimento.'
    },
    {
      icon: 'savings',
      title: 'Reduza Custos',
      description: 'Tome decisões baseadas em dados para otimizar recursos e operações.'
    },
    {
      icon: 'history',
      title: 'Histórico Completo',
      description: 'Acesse dados históricos para análises de tendências e planejamento futuro.'
    }
  ];

  useCases = [
    {
      icon: 'store',
      title: 'Varejo e Lojas',
      description: 'Monitore o fluxo de clientes e otimize o atendimento em horários de pico.'
    },
    {
      icon: 'corporate_fare',
      title: 'Escritórios',
      description: 'Controle a ocupação de salas de reunião e espaços de trabalho compartilhados.'
    },
    {
      icon: 'restaurant',
      title: 'Restaurantes e Cafés',
      description: 'Gerencie filas e mesas disponíveis em tempo real.'
    },
    {
      icon: 'local_library',
      title: 'Bibliotecas',
      description: 'Monitore a ocupação e melhore o controle de acesso às áreas de estudo.'
    },
    {
      icon: 'fitness_center',
      title: 'Academias',
      description: 'Monitore a lotação e informe os melhores horários para treinar.'
    },
    {
      icon: 'event',
      title: 'Eventos',
      description: 'Controle a entrada e saída de participantes com precisão.'
    }
  ];

  ngOnInit(): void {
    // Scroll to top on component load
    window.scrollTo(0, 0);
  }
}
