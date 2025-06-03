import { Routes } from '@angular/router';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';
import { ClientFormComponent } from './pages/client-form/client-form.component';
import { ClientTransactionsComponent } from './pages/client-transactions/client-transactions.component';

export const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'client/new', component: ClientFormComponent },
  { path: 'client/:id', component: ClientDetailComponent },
  { path: 'client/:id/edit', component: ClientFormComponent },
  { path: 'client/transactions/:id', component: ClientTransactionsComponent }
];