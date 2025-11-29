import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { FinalFormComponent } from './final-form.component';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { of } from 'rxjs';

describe('FinalFormComponent', () => {
  let component: FinalFormComponent;
  let fixture: ComponentFixture<FinalFormComponent>;
  let questionnaireService: jasmine.SpyObj<QuestionnaireService>;

  beforeEach(async () => {
    const questionnaireSpy = jasmine.createSpyObj('QuestionnaireService', ['getFormByToken', 'submitFormResponse']);
    const routeSpy = { snapshot: { params: { token: 'test-token' } } };

    await TestBed.configureTestingModule({
      imports: [FinalFormComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: QuestionnaireService, useValue: questionnaireSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalFormComponent);
    component = fixture.componentInstance;
    questionnaireService = TestBed.inject(QuestionnaireService) as jasmine.SpyObj<QuestionnaireService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load form on init', () => {
    const mockFormData = {
      questionnaire: { id: 1, token: 'test', title: 'Test', rules: [1], isActive: true, createdAt: '', expiresAt: '' },
      rules: [{ id: 1, name: 'Test Rule', header: 'Test Header', footer: 'Test Footer', isActive: true, createdAt: '' }],
      questions: [{ id: 1, text: 'Test Question', type: 'text', required: true, ruleId: 1, createdAt: '' }]
    };
    
    questionnaireService.getFormByToken.and.returnValue(of(mockFormData));
    
    component.ngOnInit();
    
    expect(questionnaireService.getFormByToken).toHaveBeenCalledWith('test-token');
    expect(component.formData).toEqual(mockFormData);
  });

  it('should submit form response', () => {
    component.token = 'test-token';
    component.answers = { 1: 'Test Answer' };
    
    const mockResponse = { message: 'Success', responseId: 1 };
    questionnaireService.submitFormResponse.and.returnValue(of(mockResponse));
    
    spyOn(window, 'alert');
    component.onSubmit();
    
    expect(questionnaireService.submitFormResponse).toHaveBeenCalled();
  });
});