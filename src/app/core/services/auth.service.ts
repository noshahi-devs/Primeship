import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface RegisterInput {
    emailAddress: string;
    password: string;
    phoneNumber: string;
    country: string;
}

export interface LoginInput {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient?: boolean;
}

export interface AuthResponse {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://localhost:44311/api';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    // Prime Ship is Tenant 2
    private tenantId = '2';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Check if user is already logged in
        const token = this.getToken();
        if (token) {
            this.currentUserSubject.next({ token });
        }
    }

    /**
     * Register a new Prime Ship Seller (Supplier role)
     */
    registerSeller(input: RegisterInput): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/services/app/Account/RegisterPrimeShipSeller`,
            input,
            {
                headers: this.getTenantHeaders()
            }
        );
    }

    /**
     * Register a new Prime Ship Customer (Reseller role)
     */
    registerCustomer(input: RegisterInput): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/services/app/Account/RegisterPrimeShipCustomer`,
            input,
            {
                headers: this.getTenantHeaders()
            }
        );
    }

    /**
     * Login to Prime Ship
     */
    login(input: LoginInput): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.apiUrl}/TokenAuth/Authenticate`,
            input,
            {
                headers: this.getTenantHeaders()
            }
        ).pipe(
            tap(response => {
                if (response && response.accessToken) {
                    this.setToken(response.accessToken);
                    this.setUserId(response.userId.toString());
                    this.currentUserSubject.next({
                        token: response.accessToken,
                        userId: response.userId
                    });
                }
            })
        );
    }

    /**
     * Logout
     */
    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    /**
     * Set token
     */
    private setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    /**
     * Set user ID
     */
    private setUserId(userId: string): void {
        localStorage.setItem('userId', userId);
    }

    /**
     * Get user ID
     */
    getUserId(): string | null {
        return localStorage.getItem('userId');
    }

    /**
     * Get tenant headers for Prime Ship (Tenant 2)
     */
    private getTenantHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Abp-TenantId': this.tenantId
        });
    }

    /**
     * Get auth headers with token
     */
    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Abp-TenantId': this.tenantId
        });
    }
}
