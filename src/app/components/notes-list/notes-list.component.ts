import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notes$: Observable<Note[]>;

  constructor(private noteService: NoteService) {
    this.notes$ = this.noteService.getNotes();
  }

  ngOnInit(): void {}

  deleteNote(id: string): void {
    if (confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
      this.noteService.deleteNote(id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('uk-UA');
  }

  // НОВІ ФУНКЦІЇ
  exportNotes(): void {
    this.noteService.exportNotesToFile();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.noteService.importNotesFromFile(file)
        .then(() => {
          alert('Нотатки успішно імпортовано!');
          // Очищуємо input для можливості повторного використання
          event.target.value = '';
        })
        .catch((error) => {
          alert('Помилка імпорту: ' + error.message);
          event.target.value = '';
        });
    }
  }

  clearAllNotes(): void {
    this.noteService.clearAllNotes();
  }

  getNotesCount(): number {
    return this.noteService.getNotesCount();
  }
}
