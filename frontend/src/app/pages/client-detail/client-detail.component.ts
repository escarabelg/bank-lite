import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  imports: [CommonModule]
})
export class ClientDetailComponent implements OnInit {
  client: any;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getClient(id).subscribe((data) => {
      this.client = data;
    });
  }
}
