import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StateService } from '../services/state.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  url = environment.rest_proto + environment.apiurl + environment.rest_parm + '/ros/';

  constructor(private http:HttpClient, private state: StateService) { }

  setGimbalControl(requestBody): Observable<Object> {


    const apiUrl = this.url + this.state.namespace + '/payload/gimbal_set'; 

    const httpOptions = {
      headers: new HttpHeaders({'Authorization': 'Token ' + this.state.data['Authorization'], 'VehicleID': this.state.data['VehicleID']})
    };

    let msgBody = {};
    msgBody["roll"] = 0.0;
    msgBody["pitch"] = parseFloat(requestBody[1]);
    msgBody["yaw"] = parseFloat(requestBody[0]);
    console.log(msgBody);

    return this.http.post(apiUrl, msgBody, httpOptions);
  }

}
