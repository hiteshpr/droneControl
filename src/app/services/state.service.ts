import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  islogin = undefined;

  roll = 0;
  yaw = 0;
  pitch = 0;

  namespace = "flytsim";

  data = [];


}
