import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notes: Note[] = [];
  private notesSubject = new BehaviorSubject<Note[]>(this.notes);

  constructor() {
    this.loadNotesFromStorage();
  }

  getNotes(): Observable<Note[]> {
    return this.notesSubject.asObservable();
  }

  addNote(title: string, content: string, author: string): void {
    const sanitizedTitle = this.sanitizeInput(title);
    const sanitizedContent = this.sanitizeInput(content);
    const sanitizedAuthor = this.sanitizeInput(author);

    const newNote: Note = {
      id: this.generateId(),
      title: sanitizedTitle,
      content: sanitizedContent,
      author: sanitizedAuthor,
      createdAt: new Date()
    };

    this.notes.unshift(newNote);
    this.notesSubject.next([...this.notes]);
    this.saveNotesToStorage();
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter(note => note.id !== id);
    this.notesSubject.next([...this.notes]);
    this.saveNotesToStorage();
  }

  // НОВІ ФУНКЦІЇ ДЛЯ ЕКСПОРТУ/ІМПОРТУ
  exportNotesToFile(): void {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalNotes: this.notes.length,
      notes: this.notes
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    // Очищуємо URL після використання
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  importNotesFromFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!file.name.toLowerCase().endsWith('.json')) {
        reject(new Error('Будь ласка, виберіть JSON файл'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const importedData = JSON.parse(result);

          // Перевіряємо формат файлу
          if (importedData.notes && Array.isArray(importedData.notes)) {
            // Валідуємо кожну нотатку
            const validNotes = importedData.notes.filter((note: any) =>
              note.id && note.title && note.content && note.author && note.createdAt
            );

            if (validNotes.length > 0) {
              this.notes = validNotes;
              this.notesSubject.next([...this.notes]);
              this.saveNotesToStorage();
              resolve(true);
            } else {
              reject(new Error('Файл не містить валідних нотаток'));
            }
          } else {
            reject(new Error('Неправильний формат файлу'));
          }
        } catch (error) {
          reject(new Error('Помилка при читанні файлу. Переконайтеся, що це правильний JSON файл.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Помилка при читанні файлу'));
      };

      reader.readAsText(file);
    });
  }

  clearAllNotes(): void {
    if (confirm('Ви впевнені, що хочете видалити ВСІ нотатки? Цю дію неможливо відмінити!')) {
      this.notes = [];
      this.notesSubject.next([...this.notes]);
      this.saveNotesToStorage();
    }
  }

  getNotesCount(): number {
    return this.notes.length;
  }

  private sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveNotesToStorage(): void {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  private loadNotesFromStorage(): void {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
      this.notesSubject.next([...this.notes]);
    }
  }
}
