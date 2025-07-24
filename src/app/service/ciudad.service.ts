import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from '../model/ciudad';
import { GlobalConstants } from '../model/global-constants';


@Injectable({
  providedIn: 'root'
})
export class CiudadService {


  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }


public getCiudadesByEstado(estadoId:number, usuarioOID :string) : Observable<Ciudad[]> {
    let url:string = GlobalConstants.apiURL + "ciudades/getCiudadesByEstado/"  + estadoId +"/" + usuarioOID ;
    return this.http.get<Ciudad[]>( url  );
}



 errorHandl(error) {
  let errorMessage = '';
  if(error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
  } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  // return throwError(errorMessage);
}
















}
