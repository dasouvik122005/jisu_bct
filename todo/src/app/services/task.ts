import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks(page: number = 1, limit: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, { headers: this.getHeaders() });
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  reorderTasks(tasks: {id: string, order: number}[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/reorder`, { tasks }, { headers: this.getHeaders() });
  }
}
