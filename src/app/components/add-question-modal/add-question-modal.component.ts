import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-add-question-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent {
  @Output() questionAdded = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  isOpen = false;
  questionText = '';
  selectedType = 'Yes/No';

  questionTypes = [
    { value: 'Yes/No', label: 'Yes/No' },
    { value: 'ListOptions', label: 'ListOptions' },
    { value: 'FreeText', label: 'FreeText' }
  ];

  constructor(private questionsService: QuestionsService) {}

  openModal() {
    this.isOpen = true;
  }

  onClose() {
    this.isOpen = false;
    this.resetForm();
    this.modalClosed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    this.onClose();
  }

  onSubmit() {
    if (this.questionText.trim()) {
      const questionData: any = {
        text: this.questionText,
        type: this.selectedType as 'Yes/No' | 'ListOptions' | 'FreeText',
        required: false,
        ruleId: 0
      };
      
      // Add default options for ListOptions type
      if (this.selectedType === 'ListOptions') {
        questionData.options = ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'];
      }
      
      this.questionsService.addQuestion(questionData).subscribe({
        next: (response) => {
          console.log('Question submitted:', response);
          this.questionAdded.emit(response);
          alert('Question added successfully!');
          this.onClose();
        },
        error: (error) => {
          console.error('Error adding question:', error);
          alert('Error adding question. Please try again.');
        }
      });
    } else {
      alert('Please enter a question');
    }
  }

  resetForm() {
    this.questionText = '';
    this.selectedType = 'Yes/No';
  }
}