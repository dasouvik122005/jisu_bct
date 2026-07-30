import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user = {
    name: '',
    email: '',
    password: '',
    terms: false
  };

  errorMessage = '';
  successMessage = '';
  passwordStrength = 0;
  strengthLabel = '';
  strengthColor = '';

  constructor(private http: HttpClient, private router: Router) {}

  checkPasswordStrength() {
    const p = this.user.password;
    if (!p) {
      this.passwordStrength = 0;
      this.strengthLabel = '';
      this.strengthColor = '';
      return;
    }

    let score = 0;
    if (p.length > 5) score += 20;
    if (p.length > 7) score += 20;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 20;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;
    
    this.passwordStrength = score;

    if (score < 40) {
      this.strengthLabel = 'Weak';
      this.strengthColor = 'var(--danger-color, #ff4757)';
    } else if (score < 80) {
      this.strengthLabel = 'Medium';
      this.strengthColor = 'var(--warning-color, #ffa502)';
    } else {
      this.strengthLabel = 'Strong';
      this.strengthColor = 'var(--success-color, #2ed573)';
    }
  }

  register() {
    if (!this.user.terms) {
      this.errorMessage = 'You must agree to the terms';
      return;
    }
    
    this.errorMessage = '';
    this.successMessage = '';
    
    this.http.post(`${environment.apiUrl}/auth/register`, this.user)
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed';
        }
      });
  }
}
