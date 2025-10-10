import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // URL do backend
  }

  onEvent(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('sensor_event', (data: any) => observer.next(data));
      return () => this.socket.off('sensor_event');
    });
  }
}
