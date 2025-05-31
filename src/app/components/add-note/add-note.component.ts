import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent {
  noteForm: FormGroup;
  maxTitleLength = 200;
  maxContentLength = 5000;
  maxAuthorLength = 50;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    public router: Router
  ) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(this.maxTitleLength)]],
      content: ['', [Validators.required, Validators.maxLength(this.maxContentLength)]],
      author: ['Анонім', [Validators.required, Validators.maxLength(this.maxAuthorLength)]]
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      const { title, content, author } = this.noteForm.value;
      this.noteService.addNote(title, content, author);
      this.noteForm.reset();
      this.noteForm.patchValue({ author: 'Анонім' });
      this.router.navigate(['/notes']);
    }
  }

  get titleCharCount(): number {
    return this.noteForm.get('title')?.value?.length || 0;
  }

  get contentCharCount(): number {
    return this.noteForm.get('content')?.value?.length || 0;
  }

  get authorCharCount(): number {
    return this.noteForm.get('author')?.value?.length || 0;
  }
}
