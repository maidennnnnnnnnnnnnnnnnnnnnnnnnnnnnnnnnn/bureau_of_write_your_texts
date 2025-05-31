import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  {
    path: 'notes',
    loadComponent: () => import('./components/notes-list/notes-list.component').then(m => m.NotesListComponent)
  },
  {
    path: 'add-note',
    loadComponent: () => import('./components/add-note/add-note.component').then(m => m.AddNoteComponent)
  },
  { path: '**', redirectTo: '/notes' }
];
