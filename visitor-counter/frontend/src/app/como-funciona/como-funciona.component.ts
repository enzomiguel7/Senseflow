import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './como-funciona.component.html',
  styleUrls: ['./como-funciona.component.css']
})
export class ComoFuncionaComponent implements OnInit {
  steps = [
    {
      number: '01',
      icon: 'sensors',
      title: 'Sensores Infravermelhos',
      description: 'Sensores de alta precisão detectam a passagem de pessoas através de feixes infravermelhos invisíveis posicionados na entrada.',
      details: [
        'Detecção bidirecional (entrada e saída)',
        'Alcance de até 5 metros',
        'Imune à luz ambiente',
        'Baixo consumo de energia'
      ]
    },
    {
      number: '02',
      icon: 'developer_board',
      title: 'Microcontrolador ESP32',
      description: 'O ESP32 processa os sinais dos sensores em tempo real e determina a direção do movimento (entrada ou saída).',
      details: [
        'Processamento em tempo real',
        'Conectividade Wi-Fi integrada',
        'Algoritmo de debounce inteligente',
        'Baixa latência de resposta'
      ]
    },
    {
      number: '03',
      icon: 'hub',
      title: 'Protocolo MQTT',
      description: 'Os dados são transmitidos via protocolo MQTT para o servidor, garantindo comunicação eficiente e confiável.',
      details: [
        'Comunicação leve e rápida',
        'QoS configurável',
        'Reconexão automática',
        'Criptografia TLS/SSL'
      ]
    },
    {
      number: '04',
      icon: 'storage',
      title: 'Servidor Node.js',
      description: 'O servidor recebe, processa e armazena os eventos de entrada e saída no banco de dados PostgreSQL.',
      details: [
        'API RESTful completa',
        'Broker MQTT (Mosquitto)',
        'Validação de dados',
        'Logs de auditoria'
      ]
    },
    {
      number: '05',
      icon: 'analytics',
      title: 'Banco de Dados',
      description: 'PostgreSQL armazena todo o histórico de eventos, permitindo análises detalhadas e geração de relatórios.',
      details: [
        'Armazenamento persistente',
        'Queries otimizadas',
        'Backup automático',
        'Escalabilidade'
      ]
    },
    {
      number: '06',
      icon: 'dashboard',
      title: 'Interface Web',
      description: 'A aplicação Angular exibe os dados em tempo real com gráficos interativos e estatísticas atualizadas.',
      details: [
        'Atualização em tempo real',
        'Gráficos interativos',
        'Design responsivo',
        'Interface intuitiva'
      ]
    }
  ];

  technicalSpecs = [
    {
      category: 'Software',
      icon: 'code',
      items: [
        { label: 'Backend', value: 'Node.js + Express' },
        { label: 'Frontend', value: 'Angular 18' },
        { label: 'Banco de Dados', value: 'PostgreSQL 15' },
        { label: 'MQTT Broker', value: 'Eclipse Mosquitto' }
      ]
    }
  ];

  architecture = {
    layers: [
      {
        name: 'Camada Física',
        icon: 'sensors',
        components: ['Sensores Infravermelhos', 'ESP32', 'Fonte de Alimentação']
      },
      {
        name: 'Camada de Comunicação',
        icon: 'cloud',
        components: ['MQTT Broker', 'Wi-Fi', 'WebSocket']
      },
      {
        name: 'Camada de Aplicação',
        icon: 'layers',
        components: ['Node.js Server', 'PostgreSQL', 'API REST']
      },
      {
        name: 'Camada de Apresentação',
        icon: 'web',
        components: ['Angular App', 'Dashboard', 'Gráficos']
      }
    ]
  };

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
