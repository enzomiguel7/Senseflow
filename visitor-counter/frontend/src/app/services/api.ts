import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000/api'; // backend

  constructor(private http: HttpClient) { }

  getEvents(sensorId?: string, limit: number = 100): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (sensorId) {
      params = params.set('sensorId', sensorId);
    }
    return this.http.get(`${this.baseUrl}/events`, { params });
  }
}
