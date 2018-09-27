import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StateService } from '../services/state.service';
import { environment } from '../../environments/environment';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  url = environment.rest_proto + environment.apiurl + environment.rest_parm + '/ros/';

  constructor(private http:HttpClient, private state: StateService) { }

  setVelocityWaypoint(){

    const httpOptions = {
        headers: new HttpHeaders({'Authorization': this.state.data['Authorization'], 'VehicleID': this.state.data['VehicleID']})
      };

    const apiUrl = this.url + this.state.namespace + '/navigation/velocity_set'; 

    const post_data = "";

    console.log('url', apiUrl);

      return this.http.post(apiUrl, post_data, httpOptions).subscribe((data) => {
        console.log(data);
      });
     
    



  }

}
