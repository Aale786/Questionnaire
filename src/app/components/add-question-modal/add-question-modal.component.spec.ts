import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AddQuestionModalComponent } from './add-question-modal.component';
import { QuestionsService } from '../../services/questions.service';
import { of } from 'rxjs';

describe('AddQuestionModalComponent', () => {
  let component: AddQuestionModalComponent;
  let fixture: ComponentFixture<AddQuestionModalComponent>;
  let questionsService: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    const questionsSpy = jasmine.createSpyObj('QuestionsService', ['addQuestion']);

    await TestBed.configureTestingModule({
      imports: [AddQuestionModalComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: QuestionsService, useValue: questionsSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddQuestionModalComponent);
    component = fixture.componentInstance;
    questionsService = TestBed.inject(QuestionsService) as jasmine.SpyObj<QuestionsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.isOpen).toBe(true);
  });

  it('should close modal', () => {
    spyOn(component.modalClosed, 'emit');
    component.onClose();
    expect(component.isOpen).toBe(false);
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should submit question', () => {
    const mockQuestion = { id: 1, text: 'Test', type: 'Yes/No', required: false, ruleId: 0, createdAt: '2024-01-01' };
    questionsService.addQuestion.and.returnValue(of(mockQuestion));
    spyOn(component.questionAdded, 'emit');
    spyOn(window, 'alert');

    component.questionText = 'Test Question';
    component.selectedType = 'Yes/No';
    component.onSubmit();

    expect(questionsService.addQuestion).toHaveBeenCalled();
    expect(component.questionAdded.emit).toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.questionText = 'Test';
    component.selectedType = 'FreeText';
    component.resetForm();
    
    expect(component.questionText).toBe('');
    expect(component.selectedType).toBe('Yes/No');
  });
});