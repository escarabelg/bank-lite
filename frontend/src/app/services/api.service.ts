import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/client`);
  }

  getClient(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/client/${id}`);
  }

  createClient(data: { name: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/client`, data);
  }

  updateClient(id: string, data: { name: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/client/${id}`, data);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/client/${id}`);
  }

  deposit(clientId: string, value: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transaction/deposit/${clientId}`, {
      value
    });
  }

  withdraw(clientId: string, value: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transaction/withdrawal/${clientId}`, {
      value
    });
  }

  getTransactions(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/transaction/${clientId}`);
  }
}
