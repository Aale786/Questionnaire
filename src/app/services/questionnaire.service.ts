import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Questionnaire {
  id: number;
  token: string;
  title: string;
  rules: number[];
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface QuestionnaireForm {
  questionnaire: Questionnaire;
  rules: any[];
  questions: any[];
}

export interface QuestionnaireSubmission {
  title: string;
  ruleIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  submitQuestionnaire(data: QuestionnaireSubmission): Observable<any> {
    return this.http.post(`${this.apiUrl}/questionnaire/submit`, data);
  }

  getFormByToken(token: string): Observable<QuestionnaireForm> {
    return this.http.get<QuestionnaireForm>(`${this.apiUrl}/form/${token}`);
  }

  submitFormResponse(token: string, answers: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/form/${token}/submit`, { answers });
  }
}