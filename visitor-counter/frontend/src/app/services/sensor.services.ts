// src/app/services/sensor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SensorService {
  private apiUrl = 'http://localhost:3000/api/events'; // porta do backend Node

  constructor(private http: HttpClient) {}

  getEvents(sensorId?: string, limit: number = 100): Observable<any[]> {
    const params: any = { limit };
    if (sensorId) params.sensorId = sensorId;
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
