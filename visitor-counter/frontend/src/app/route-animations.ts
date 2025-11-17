import { trigger, transition, style, query, group, animate } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    // Estado inicial e final
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        opacity: 0,
      })
    ], { optional: true }),
    
    // Animação de saída da página antiga
    query(':leave', [
      style({ opacity: 1 }),
      animate('300ms ease-out', style({ 
        opacity: 0,
        transform: 'translateY(-20px)'
      }))
    ], { optional: true }),
    
    // Animação de entrada da nova página
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'translateY(20px)'
      }),
      animate('300ms 150ms ease-out', style({ 
        opacity: 1,
        transform: 'translateY(0)'
      }))
    ], { optional: true })
  ])
]);
