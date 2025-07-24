import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seccion } from '../model/seccion';
import { GlobalConstants } from '../model/global-constants';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor( private http : HttpClient ) { }


  public guardarSeccion(seccion: Seccion, usuarioOID:string ): Observable< Seccion > {
    let url:string = GlobalConstants.apiURL + "secciones/save" + "/" + usuarioOID;
    return this.http.post<Seccion>( url , JSON.stringify(seccion), {headers: this.headers});
}

public upload(file: File,documentoId, documentoInstanciaOID, seccionOID, conceptoOID,conceptoInstanciaOID,  usuarioOID:string ): Observable<String> {
  const formData: FormData = new FormData();



  formData.append('file', file);
  formData.append('documentoId', documentoId);
  formData.append('documentoInstanciaOID', documentoInstanciaOID);
  formData.append('seccionInstanciaOID', seccionOID);
  formData.append('conceptoOID', conceptoOID);
  formData.append('conceptoInstanciaOID', conceptoInstanciaOID);



  let url:string = GlobalConstants.apiURL + "documentosInstancia/saveFile" + "/" + usuarioOID; ;
    return this.http.post<any>( url , formData);

 // return this.http.request(req);
}


public getPrimeraSeccion( documentoId :number, usuarioOID:string  ) : Observable<Seccion> {
  let url:string = GlobalConstants.apiURL + "secciones/primera/" + documentoId  + "/" + usuarioOID ;
  return this.http.get<Seccion>( url  );
}

public getSeccionesActivas( documentoId :number , usuarioOID:string ) : Observable<Seccion[]> {
  let url:string = GlobalConstants.apiURL + "secciones/activas/" + documentoId   + "/" + usuarioOID;  ;
  alert(url);
  return this.http.get<Seccion[]>( url  );
}

public deleteSeccion(seccion: Seccion ,usuarioOID:string) {
  let url:string = GlobalConstants.apiURL + "secciones/delete" + "/" + usuarioOID;
  return this.http.post<Seccion>( url , JSON.stringify(seccion), {headers: this.headers});
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
