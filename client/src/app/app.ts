import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
 async ngOnInit() {
  
       this.members.set(await this.getMembers());   
  }
  
  private http=inject(HttpClient);
  protected readonly title = signal('Shreyas');
  protected members= signal<any>([]); 

  async getMembers(){
    try {
      return  lastValueFrom(this.http.get('https://localhost:5001/api/members'));
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
}
