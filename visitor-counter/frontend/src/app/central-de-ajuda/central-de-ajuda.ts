import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-central-de-ajuda',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './central-de-ajuda.html',
  styleUrl: './central-de-ajuda.css'
})
export class CentralDeAjuda implements OnInit {

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // O tema será aplicado automaticamente pelo serviço
  }
}
