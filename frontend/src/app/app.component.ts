import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  template: `
    <h1>{{title}}!</h1>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'Bank Lite';
}
