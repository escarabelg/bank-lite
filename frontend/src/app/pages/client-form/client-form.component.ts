import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ClientFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      email: ['']
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.api.getClient(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  submit() {
    if (this.isEdit && this.id) {
      this.api.updateClient(this.id, {name:this.form.value.name}).subscribe({
        next: () => {
          this.errorMessage = null;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'editing error';
        }
      });
    } else {
      this.api.createClient(this.form.value).subscribe({
        next: () => {
          this.errorMessage = null;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'creation error';
        }
      });
    }
  }
}