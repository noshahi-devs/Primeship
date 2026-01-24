import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // TODO: Implement actual authentication logic
    const isAuthenticated = false; // Replace with actual auth check
    
    if (!isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    return true;
  }
}
