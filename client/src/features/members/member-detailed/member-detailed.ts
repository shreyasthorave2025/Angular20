import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  // protected member = signal<Member | undefined>(undefined);
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  });


  ngOnInit(): void {
    // this.route.data.subscribe({
    //   next: data => this.member.set(data['member'])
    // })

    this.title.set(this.route.firstChild?.snapshot?.title);

    // update title whenever navigation finishes (e.g., on tab/child route change)
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      });

  }

}
