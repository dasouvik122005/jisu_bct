import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, private authService: Auth) {}

  login() {
    this.errorMessage = '';
    
    this.http.post(`${environment.apiUrl}/auth/login`, this.credentials)
      .subscribe({
        next: (res: any) => {
          this.authService.login(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed';
          alert(this.errorMessage);
        }
      });
  }
}
