import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuestionsService } from './questions.service';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestionsService]
    });
    service = TestBed.inject(QuestionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch questions', () => {
    const mockQuestions = [
      { id: 1, text: 'Test?', type: 'text', required: true, ruleId: 1, createdAt: '2024-01-01' }
    ];

    service.getQuestions().subscribe(questions => {
      expect(questions).toEqual(mockQuestions);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/questions');
    expect(req.request.method).toBe('GET');
    req.flush(mockQuestions);
  });

  it('should add question', () => {
    const newQuestion = { text: 'New?', type: 'text' as const, required: true, ruleId: 1 };
    const mockResponse = { id: 2, ...newQuestion, createdAt: '2024-01-01' };

    service.addQuestion(newQuestion).subscribe(question => {
      expect(question).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/questions');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});