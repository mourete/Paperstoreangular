import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../model/global-constants';
import { SeccionInstancia } from '../model/seccion-instancia';
import { OpcionInstancia } from '../model/opcion-instancia';

@Injectable({
  providedIn: 'root'
})
export class SeccionInstanciaService {

  
  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor( private http : HttpClient ) { }

 
 

public getAll( documentoInstanciaOID :string  , documentoId:number , usuarioOID:string) : Observable<SeccionInstancia[]> {  
  
  let url:string = GlobalConstants.apiURL + "seccionInstancia/getAll/" + documentoInstanciaOID +"/" + documentoId   +"/" + usuarioOID  ; 
  return this.http.get<SeccionInstancia[]>( url  );
}

 
public getOpciones( listaOID :string  , opcionFiltroOID:string , usuarioOID:string) : Observable<OpcionInstancia[]> {  
  let url:string = GlobalConstants.apiURL + "opcionInstancia/getOpciones/" + listaOID +"/" + opcionFiltroOID  +"/" + usuarioOID ; 
  return this.http.get<OpcionInstancia[]>( url  );
  
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
  console.log(errorMessage);
  // return throwError(errorMessage);
}







}
