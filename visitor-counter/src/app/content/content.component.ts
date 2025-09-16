import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.services';
import { RealtimeService } from '../services/realtime.services';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.html',
  styleUrls: ['./content.css']
})
export class ContentComponent implements OnInit, OnDestroy {
  events: any[] = [];
  realtimeSub!: Subscription;

  // Chart.js config
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Detections', tension: 0.3 }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };

  constructor(private api: ApiService, private realtime: RealtimeService) {}

  ngOnInit() {
    this.loadHistory();
    this.realtimeSub = this.realtime.onEvent().subscribe((ev: any) => {
      // push to top of table
      this.events.unshift(ev);
      // update chart
      this.addPointToChart(ev);
    });
  }

  loadHistory() {
    this.api.getEvents(undefined, 200).subscribe((data: any[]) => {
      // Influx returns objects; adapt mapping as needed.
      // Expect fields _time, sensorId, detected, value
      const items = data.map(d => ({
        time: d._time || d.time || d._time,
        sensorId: d.sensorId,
        detected: d.detected === true || d.detected === 1,
        value: d.value
      }));
      this.events = items;
      this.buildChartFromEvents(items.reverse()); // oldest -> newest
    });
  }

  buildChartFromEvents(items: any[]) {
    this.lineChartData.labels = items.map(i => new Date(i.time).toLocaleString());
    this.lineChartData.datasets[0].data = items.map(i => i.detected ? 1 : 0);
  }

  addPointToChart(ev: any) {
    const label = new Date(ev.timestamp || ev.time || Date.now()).toLocaleTimeString();
    this.lineChartData.labels = [...(this.lineChartData.labels || []), label];
    this.lineChartData.datasets[0].data = [...(this.lineChartData.datasets[0].data as number[]), ev.detected ? 1 : 0];
    // keep last 200 points
    if ((this.lineChartData.labels || []).length > 200) {
      this.lineChartData.labels.shift();
      (this.lineChartData.datasets[0].data as number[]).shift();
    }
  }

  ngOnDestroy() {
    this.realtimeSub?.unsubscribe();
  }
}
