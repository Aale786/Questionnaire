const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes for questionnaire APIs

// 1. Rules Fetch API
server.get('/api/rules', (req, res) => {
  const db = router.db;
  const rules = db.get('rules').filter({ isActive: true }).value();
  res.json(rules);
});

// 2. Questions APIs
server.get('/api/questions', (req, res) => {
  const db = router.db;
  const questions = db.get('questions').value();
  res.json(questions);
});

server.post('/api/questions', (req, res) => {
  const db = router.db;
  const newQuestion = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.get('questions').push(newQuestion).write();
  res.status(201).json(newQuestion);
});

server.put('/api/questions/:id', (req, res) => {
  const db = router.db;
  const questionId = parseInt(req.params.id);
  const updatedQuestion = {
    ...req.body,
    id: questionId,
    updatedAt: new Date().toISOString()
  };
  
  db.get('questions')
    .find({ id: questionId })
    .assign(updatedQuestion)
    .write();
    
  res.json(updatedQuestion);
});

// 3. Rules submission API
server.post('/api/questionnaire/submit', (req, res) => {
  const db = router.db;
  const { ruleIds, questions } = req.body;
  const token = Math.random().toString(36).substring(7);
  
  const questionnaire = {
    id: Date.now(),
    token,
    title: req.body.title || 'New Questionnaire',
    rules: ruleIds,
    isActive: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  db.get('questionnaires').push(questionnaire).write();
  res.json({ questionnaire, shareLink: `http://localhost:4200/form/${token}` });
});

// 4. Final form API - Get form by token
server.get('/api/form/:token', (req, res) => {
  const db = router.db;
  const { token } = req.params;
  
  const questionnaire = db.get('questionnaires').find({ token, isActive: true }).value();
  if (!questionnaire) {
    return res.status(404).json({ error: 'Form not found or expired' });
  }
  
  const rules = db.get('rules').filter(rule => questionnaire.rules.includes(rule.id)).value();
  const questions = db.get('questions').filter(q => questionnaire.rules.includes(q.ruleId)).value();
  
  res.json({
    questionnaire,
    rules,
    questions
  });
});

// 5. Final Form Submission API
server.post('/api/form/:token/submit', (req, res) => {
  const db = router.db;
  const { token } = req.params;
  
  const questionnaire = db.get('questionnaires').find({ token, isActive: true }).value();
  if (!questionnaire) {
    return res.status(404).json({ error: 'Form not found or expired' });
  }
  
  const response = {
    id: Date.now(),
    questionnaireId: questionnaire.id,
    token,
    answers: req.body.answers,
    submittedAt: new Date().toISOString()
  };
  
  db.get('responses').push(response).write();
  res.json({ message: 'Response submitted successfully', responseId: response.id });
});

// Use default router for other routes
server.use('/api', router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('GET /api/rules - Fetch all rules');
  console.log('GET /api/questions - Fetch all questions');
  console.log('POST /api/questions - Add new question');
  console.log('POST /api/questionnaire/submit - Submit questionnaire');
  console.log('GET /api/form/:token - Get form by token');
  console.log('POST /api/form/:token/submit - Submit form response');
});