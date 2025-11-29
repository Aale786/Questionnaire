import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RulesService, Rule } from '../../services/rules.service';
import { QuestionsService, Question } from '../../services/questions.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { AddQuestionModalComponent } from '../add-question-modal/add-question-modal.component';

@Component({
  selector: 'app-rules-questions',
  standalone: true,
  imports: [CommonModule, DragDropModule, AddQuestionModalComponent],
  templateUrl: './rules-questions.component.html',
  styleUrls: ['./rules-questions.component.scss']
})
export class RulesQuestionsComponent implements OnInit {
  @ViewChild('addQuestionModal') addQuestionModal!: AddQuestionModalComponent;
  
  rules: Rule[] = [];
  questions: Question[] = [];
  selectedRuleId: number | null = null;
  showModal = false;

  constructor(
    private rulesService: RulesService,
    private questionsService: QuestionsService,
    private questionnaireService: QuestionnaireService
  ) {}

  ngOnInit() {
    this.loadRules();
    this.loadQuestions();
  }

  loadRules() {
    this.rulesService.getRules().subscribe({
      next: (rules) => this.rules = rules,
      error: (error) => console.error('Error loading rules:', error)
    });
  }

  loadQuestions() {
    this.questionsService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
        console.log('All questions loaded:', questions);
        console.log('Unassigned questions:', this.getUnassignedQuestions());
      },
      error: (error) => console.error('Error loading questions:', error)
    });
  }

  selectRule(ruleId: number) {
    this.selectedRuleId = this.selectedRuleId === ruleId ? null : ruleId;
  }

  getQuestionsByRule(ruleId: number): Question[] {
    return this.questions.filter(q => q.ruleId === ruleId);
  }

  getSelectedRule(): Rule | undefined {
    return this.rules.find(r => r.id === this.selectedRuleId);
  }

  assignQuestionToRule(question: Question) {
    if (this.selectedRuleId) {
      const updatedQuestion = { ...question, ruleId: this.selectedRuleId };
      this.questionsService.updateQuestion(updatedQuestion).subscribe({
        next: () => {
          this.loadQuestions();
        },
        error: (error) => console.error('Error updating question:', error)
      });
    }
  }

  onQuestionDrop(event: CdkDragDrop<Question[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const question = event.previousContainer.data[event.previousIndex];
      if (event.container.id === 'ruleQuestionsList' && this.selectedRuleId) {
        // Moving to rule questions - assign to selected rule
        const updatedQuestion = { ...question, ruleId: this.selectedRuleId };
        this.questionsService.updateQuestion(updatedQuestion).subscribe({
          next: () => {
            this.loadQuestions();
          },
          error: (error) => console.error('Error updating question:', error)
        });
      } else if (event.container.id === 'allQuestionsList') {
        // Moving to all questions - unassign from rule
        const updatedQuestion = { ...question, ruleId: 0 };
        this.questionsService.updateQuestion(updatedQuestion).subscribe({
          next: () => {
            this.loadQuestions();
          },
          error: (error) => console.error('Error updating question:', error)
        });
      }
    }
  }

  getUnassignedQuestions(): Question[] {
    return this.questions.filter(q => q.ruleId === 0 || q.ruleId === null || q.ruleId === undefined);
  }

  openAddQuestionModal() {
    this.addQuestionModal.openModal();
  }

  closeModal() {
    this.showModal = false;
  }

  onQuestionAdded() {
    this.loadQuestions();
  }

  submitQuestionnaire() {
    if (!this.selectedRuleId) return;
    
    const submission = {
      title: `Questionnaire for ${this.rules.find(r => r.id === this.selectedRuleId)?.name}`,
      ruleIds: [this.selectedRuleId]
    };

    this.questionnaireService.submitQuestionnaire(submission).subscribe({
      next: (response) => {
        console.log('Questionnaire created:', response);
        alert(`Questionnaire created! Share link: ${response.shareLink}`);
      },
      error: (error) => console.error('Error creating questionnaire:', error)
    });
  }
}