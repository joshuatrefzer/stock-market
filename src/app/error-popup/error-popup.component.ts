import { Component } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-error-popup',
  standalone: true,
  imports: [],
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.scss'
})
export class ErrorPopupComponent {
  constructor(public mainService: MainService){}

}
