import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api';
import { RealtimeService } from '../services/realtime';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],  // <- adicione DatePipe aqui
  templateUrl: './content.html',
  styleUrls: ['./content.css']
})    
export class DashboardComponent implements OnInit, OnDestroy {

  events: any[] = [];
  realtimeSub!: Subscription;

  constructor(private api: ApiService, private realtime: RealtimeService) { }

  ngOnInit(): void {
    this.api.getEvents(undefined, 200).subscribe(data => {
      this.events = data;
    });

    this.realtimeSub = this.realtime.onEvent().subscribe(event => {
      this.events.unshift(event);
      if (this.events.length > 200) this.events.pop();
    });
  }

  ngOnDestroy(): void {
    this.realtimeSub?.unsubscribe();
  }
}
