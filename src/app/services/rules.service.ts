import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rule {
  id: number;
  name: string;
  header: string;
  footer: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${this.apiUrl}/rules`);
  }
}