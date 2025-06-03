import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-transactions',
  templateUrl: './client-transactions.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ClientTransactionsComponent implements OnInit {
  clientId = '';
  transactions: any[] = [];
  client: any = null;
  value = 0;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  loadData() {
    this.api.getClient(this.clientId).subscribe(client => {
      this.client = client;
    });

    this.api.getTransactions(this.clientId).subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  deposit() {
    this.api.deposit(this.clientId, this.value).subscribe({
      next: () => {
        this.errorMessage = null;
        this.value = 0;
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'deposit error';
      }
    });
  }

  withdraw() {
    this.api.withdraw(this.clientId, this.value).subscribe({
      next: () => {
        this.errorMessage = null;
        this.value = 0;
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'withdraw error';
      }
    });
  }
}
