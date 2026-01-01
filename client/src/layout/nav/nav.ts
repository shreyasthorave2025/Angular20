import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected creds: any = {};
  protected accountService = inject(AccountService);
  protected toast = inject(ToastService);
  protected router = inject(Router);

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (response) => {
        // console.log('Login successful', response);
        this.toast.success('Login successful');
        this.router.navigateByUrl('/members');
        this.creds = {};
      },
      error: (error) => {
        this.toast.error(error.error);
        // alert('Login failed: ' + error);
      },
    });
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
} 
