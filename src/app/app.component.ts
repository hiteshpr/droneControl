import { Component,OnInit, AfterViewInit, ElementRef } from '@angular/core';
/* import { AfterViewInit, ElementRef} from '@angular/core'; */


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'app';
  gamePad: Gamepad;

  constructor(private elementRef:ElementRef) {}

  ngOnInit(){
    /* Gamepad.on('SUPPORTED_EVENT', function () {
      
    }); */

    console.log('gamepad', this.gamePad);
  }
}
