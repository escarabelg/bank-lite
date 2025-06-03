import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getClients().subscribe((data) => {
      this.clients = data;
    });
  }

  deleteClient(id: string) {
    this.api.deleteClient(id).subscribe(() => {
      this.clients = this.clients.filter((client) => client.id !== id);
    });
  }

  editClient(id: string) {
    this.router.navigate([`/client/${id}/edit`]);
  }
}
