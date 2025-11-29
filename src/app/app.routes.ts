import { Routes } from '@angular/router';
import { RulesQuestionsComponent } from './components/rules-questions/rules-questions.component';
import { FinalFormComponent } from './components/final-form/final-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/rules-questions', pathMatch: 'full' },
  { path: 'rules-questions', component: RulesQuestionsComponent },
  { path: 'form/:token', component: FinalFormComponent },
  { path: '**', redirectTo: '/rules-questions' }
];
