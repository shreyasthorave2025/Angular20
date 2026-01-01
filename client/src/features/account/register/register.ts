import { Component, inject, input, Input, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds = {} as RegisterCreds;
  protected accountService = inject(AccountService);
  // membersFromHome = input.required<User[]>();
  cancelRegister = output<boolean>();

  register() {
    this.accountService.register(this.creds).subscribe({
      next: (user: User) => {
        console.log('registration successful', user);
        this.cancel();
      },
      error: (error) => {
        console.log('registration failed', error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('registration cancelled');
  }
}
