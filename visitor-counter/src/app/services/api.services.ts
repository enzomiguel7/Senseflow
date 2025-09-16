import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getEvents(sensorId?: string, limit = 200): Observable<any> {
    let params = new HttpParams().set('limit', String(limit));
    if (sensorId) params = params.set('sensorId', sensorId);
    return this.http.get(`${this.base}/events`, { params });
  }
}
