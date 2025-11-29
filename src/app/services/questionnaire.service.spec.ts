import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuestionnaireService } from './questionnaire.service';

describe('QuestionnaireService', () => {
  let service: QuestionnaireService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestionnaireService]
    });
    service = TestBed.inject(QuestionnaireService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit questionnaire', () => {
    const mockData = { title: 'Test', ruleIds: [1, 2] };
    const mockResponse = { questionnaire: { id: 1 }, shareLink: 'test-link' };

    service.submitQuestionnaire(mockData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/questionnaire/submit');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get form by token', () => {
    const token = 'abc123';
    const mockResponse = { questionnaire: {}, rules: [], questions: [] };

    service.getFormByToken(token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/form/${token}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});