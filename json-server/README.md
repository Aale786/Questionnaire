# Questionnaire JSON Server

## Setup
```bash
cd json-server
npm install
npm start
```

## API Endpoints

### 1. Rules API
- **GET** `/api/rules` - Fetch all active rules

### 2. Questions API
- **GET** `/api/questions` - Fetch all questions
- **POST** `/api/questions` - Add new question
```json
{
  "text": "Question text",
  "type": "text|email|number",
  "required": true,
  "ruleId": 1
}
```

### 3. Questionnaire Submission API
- **POST** `/api/questionnaire/submit` - Create questionnaire from rules
```json
{
  "title": "Form Title",
  "ruleIds": [1, 2]
}
```

### 4. Public Form API
- **GET** `/api/form/:token` - Get form by token (public access)
- **POST** `/api/form/:token/submit` - Submit form response
```json
{
  "answers": [
    {
      "questionId": 1,
      "answer": "User answer"
    }
  ]
}
```

## Sample Usage

1. Get rules: `GET http://localhost:3000/api/rules`
2. Get questions: `GET http://localhost:3000/api/questions`
3. Create questionnaire: `POST http://localhost:3000/api/questionnaire/submit`
4. Access form: `GET http://localhost:3000/api/form/abc123`
5. Submit response: `POST http://localhost:3000/api/form/abc123/submit`