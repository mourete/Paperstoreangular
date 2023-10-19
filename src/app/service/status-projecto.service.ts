import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusProyecto } from '../model/status-proyecto';
import { GlobalConstants } from '../model/global-constants';

@Injectable({
  providedIn: 'root'
})
export class StatusProjectoService {

  endpoint: String;
  controller:String = "/statusProyecto/";
  wsGetAll:String = "all";

  constructor( private http : HttpClient ) { }

  public getAll() : Observable<StatusProyecto[]> {
      let url:string = GlobalConstants.apiURL + this.controller + this.wsGetAll;  
      return this.http.get<StatusProyecto[]>( url  );
  }
  



}
