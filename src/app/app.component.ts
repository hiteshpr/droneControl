import { Component,OnInit, AfterViewInit, ElementRef } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {StateService} from './services/state.service';
import { RestService } from './services/rest.service';

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

  constructor(private elementRef:ElementRef, public http: HttpClient, private toastr: ToastrService, public state: StateService, public rest:RestService) {}



    ngOnInit() {
      
      const intervl = setInterval(() => {
        
        this.state.data['VehicleID'] = localStorage.getItem('VehicleID');
        this.state.data['Authorization'] = localStorage.getItem('Authorization');
        if (localStorage.getItem('namespace') !== undefined) {
          this.state.data['namespace'] = localStorage.getItem('namespace');
          clearInterval(intervl);
        }
      }, 1000);


      this.state.data['Authorization'] = localStorage.getItem('Authorization');
      this.state.data['VehicleID'] = localStorage.getItem('VehicleID');

      console.log(this.state.data);

      const httpOptions = {
        headers: new HttpHeaders({'Authorization': 'Token ' + this.state.data['Authorization'], 'VehicleID': this.state.data['VehicleID']})
      };

      const new_url = this.url + environment.namespace_url;
      
      this.http.get(new_url, httpOptions).subscribe(data => {
          this.state.namespace = data['param_info']['param_value'];
         
      }, error => {
        // this.toastr.error(error);
           console.log(error);
        
      });

    }
    
  }

