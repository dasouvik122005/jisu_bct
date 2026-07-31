import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  user: any = { name: '', email: '' };
  isLoading = true;
  isSaving = false;
  isDeleting = false;
  showDeleteModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = { name: data.name, email: data.email };
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile details.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  saveProfile(event: Event) {
    event.preventDefault();
    if (!this.user.name || !this.user.email) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateProfile(this.user).subscribe({
      next: (data) => {
        this.user = { name: data.name, email: data.email };
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        console.error(err);
      }
    });
  }

  deleteAccount() {
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    this.isDeleting = true;
    this.errorMessage = '';

    this.authService.deleteAccount().subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.authService.logout();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.errorMessage = err.error?.message || 'Failed to delete account. Please try again.';
        console.error(err);
      }
    });
  }
}
