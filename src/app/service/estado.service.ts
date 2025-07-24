import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from '../model/estado';
import { GlobalConstants } from '../model/global-constants';


@Injectable({
  providedIn: 'root'
})
export class EstadoService {


  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }


public getAllEstados(usuarioOID: string) : Observable<Estado[]> {
    let url:string = GlobalConstants.apiURL + "estados/getAllEstados/"  + usuarioOID ;
    return this.http.get<Estado[]>( url  );
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
