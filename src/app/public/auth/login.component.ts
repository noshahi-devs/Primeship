import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const loginData = {
        userNameOrEmailAddress: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberClient: this.loginForm.value.rememberMe
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.showSuccess('Login successful! Welcome to Prime Ship.');

          // Store email for future use
          localStorage.setItem('userEmail', this.loginForm.value.email);

          // Navigate to home/dashboard
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;

          // Extract error message from API response
          let errorMessage = 'Login failed. Please try again.';

          if (error.error?.error?.message) {
            errorMessage = error.error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          // Check for specific error types
          if (errorMessage.includes('email is not confirmed') ||
            errorMessage.includes('not verified') ||
            errorMessage.includes('not active')) {
            this.toastService.showError(
              'Your email is not verified. Please check your inbox for the verification link.'
            );
          } else if (errorMessage.includes('Invalid password')) {
            this.toastService.showError('Invalid password. Please try again.');
          } else if (errorMessage.includes('Invalid email') ||
            errorMessage.includes('Invalid username')) {
            this.toastService.showError(
              'Account not found. Please check your email or register a new account.'
            );
          } else {
            this.toastService.showError(errorMessage);
          }

          console.error('Login error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
