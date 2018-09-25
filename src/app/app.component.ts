import { Component,OnInit, AfterViewInit, ElementRef } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'app';
  gamePad: Gamepad;
  token = '';
  vid = '';
  remember = false;
  url = environment.rest_proto + environment.apiurl + environment.rest_parm;

  constructor(private elementRef:ElementRef, public http: HttpClient,private toastr: ToastrService) {}



    ngOnInit() {
      if (sessionStorage.getItem('VehicleID') === null || sessionStorage.getItem('Authorization') === null) {
        if (localStorage.getItem('VehicleID') !== null && localStorage.getItem('Authorization') !== null) {
          this.vid = localStorage.getItem('VehicleID');
          this.token = localStorage.getItem('Authorization').split(' ')[1];
          this.remember = true;
        } else {
        }
      } else {
        this.vid = sessionStorage.getItem('VehicleID');
        this.token = sessionStorage.getItem('Authorization').split(' ')[1];
        this.remember = true;
      }

      console.log('gamepad', this.gamePad);
      this.login();
    }


    login(){

    const token = 'Token ' + this.token;

    const httpOptions = {
      headers: new HttpHeaders({'Authorization': token, 'VehicleID': this.vid})
    };
    console.log(httpOptions);
    const new_url = this.url + environment.namespace_url;
    this.http.get(new_url, httpOptions).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
      this.toastr.error('Error To Proceed');
    });
    }
    
    
  }

