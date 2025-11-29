import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'email' | 'number' | 'Yes/No' | 'ListOptions' | 'FreeText';
  required: boolean;
  ruleId: number;
  min?: number;
  max?: number;
  options?: string[];
  createdAt: string;
}

export interface NewQuestion {
  text: string;
  type: 'text' | 'email' | 'number' | 'Yes/No' | 'ListOptions' | 'FreeText';
  required: boolean;
  ruleId: number;
  min?: number;
  max?: number;
  options?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`);
  }

  addQuestion(question: NewQuestion): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${question.id}`, question);
  }
}