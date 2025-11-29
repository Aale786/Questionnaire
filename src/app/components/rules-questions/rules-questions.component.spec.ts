import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RulesQuestionsComponent } from './rules-questions.component';
import { RulesService } from '../../services/rules.service';
import { QuestionsService } from '../../services/questions.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { of } from 'rxjs';

describe('RulesQuestionsComponent', () => {
  let component: RulesQuestionsComponent;
  let fixture: ComponentFixture<RulesQuestionsComponent>;
  let rulesService: jasmine.SpyObj<RulesService>;
  let questionsService: jasmine.SpyObj<QuestionsService>;

  beforeEach(async () => {
    const rulesSpy = jasmine.createSpyObj('RulesService', ['getRules']);
    const questionsSpy = jasmine.createSpyObj('QuestionsService', ['getQuestions']);
    const questionnaireSpy = jasmine.createSpyObj('QuestionnaireService', ['submitQuestionnaire']);

    await TestBed.configureTestingModule({
      imports: [RulesQuestionsComponent, HttpClientTestingModule],
      providers: [
        { provide: RulesService, useValue: rulesSpy },
        { provide: QuestionsService, useValue: questionsSpy },
        { provide: QuestionnaireService, useValue: questionnaireSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RulesQuestionsComponent);
    component = fixture.componentInstance;
    rulesService = TestBed.inject(RulesService) as jasmine.SpyObj<RulesService>;
    questionsService = TestBed.inject(QuestionsService) as jasmine.SpyObj<QuestionsService>;

    rulesService.getRules.and.returnValue(of([]));
    questionsService.getQuestions.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rules on init', () => {
    component.ngOnInit();
    expect(rulesService.getRules).toHaveBeenCalled();
  });

  it('should load questions on init', () => {
    component.ngOnInit();
    expect(questionsService.getQuestions).toHaveBeenCalled();
  });

  it('should select rule', () => {
    component.selectRule(1);
    expect(component.selectedRuleId).toBe(1);
  });

  it('should open modal', () => {
    component.openAddQuestionModal();
    expect(component.showModal).toBe(true);
  });
});