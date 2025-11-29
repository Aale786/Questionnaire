import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService, QuestionnaireForm } from '../../services/questionnaire.service';

@Component({
  selector: 'app-final-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './final-form.component.html',
  styleUrls: ['./final-form.component.scss']
})
export class FinalFormComponent implements OnInit {
  formData: QuestionnaireForm | null = null;
  answers: { [questionId: number]: any } = {};
  isSubmitting = false;
  error: string | null = null;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private questionnaireService: QuestionnaireService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.loadForm();
  }

  loadForm() {
    this.questionnaireService.getFormByToken(this.token).subscribe({
      next: (data) => {
        this.formData = data;
        this.initializeAnswers();
      },
      error: (error) => {
        this.error = 'Form not found or has expired';
        console.error('Error loading form:', error);
      }
    });
  }

  initializeAnswers() {
    if (!this.formData) return;
    
    this.formData.questions.forEach(question => {
      this.answers[question.id] = '';
    });
  }

  getQuestionsByRule(ruleId: number) {
    if (!this.formData) return [];
    return this.formData.questions.filter(q => q.ruleId === ruleId);
  }

  onSubmit() {
    if (this.isSubmitting || !this.formData) return;

    this.isSubmitting = true;
    
    const formattedAnswers = Object.keys(this.answers).map(questionId => ({
      questionId: parseInt(questionId),
      answer: this.answers[parseInt(questionId)]
    }));

    this.questionnaireService.submitFormResponse(this.token, formattedAnswers).subscribe({
      next: (response) => {
        alert('Response submitted successfully!');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting response:', error);
        alert('Error submitting response. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}