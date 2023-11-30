import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerPerfil } from '../model/verPerfil';
import { GlobalConstants } from '../model/global-constants';
import { Modulo} from '../model/modulo';
import {Empresa} from "../model/empresa";




@Injectable({
  providedIn: 'root'
})
export class VerPerfilService {


  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }



public getVerPerfilById(verPerfilId:number,   usuarioCreatedOID:string) : Observable<VerPerfil> {
    let url:string = GlobalConstants.apiURL + "perfiles/verPerfilConsulta/" + verPerfilId + "/" + usuarioCreatedOID;
    return this.http.get<VerPerfil>( url  );
}

public getVerPerfiles(verPerfilId:number,   usuarioCreatedOID:string) : Observable<VerPerfil[]> {
  let url:string = GlobalConstants.apiURL + "perfiles/verPerfilConsulta/" + verPerfilId + "/" + usuarioCreatedOID;
  return this.http.get<VerPerfil[]>( url  );
}


public getVerModulosJson(verPerfilId:number , usuarioCreatedOID:string ) : Observable<string[]> {
  let url:string = GlobalConstants.apiURL + "perfiles/getPerfilModulosJson/" + verPerfilId + "/" + usuarioCreatedOID;
  console.log(this.http.get<string[]>( url ));
  return this.http.get<string[]>( url );
}

public guardarVerPerfil(verPerfil: VerPerfil , usuarioCreatedOID:string): Observable< VerPerfil > {

  let url:string = GlobalConstants.apiURL + "perfiles/save/"+usuarioCreatedOID;
  return this.http.post<VerPerfil>( url , JSON.stringify(perfil), {headers: this.headers});
}


public guardarVerPerfilModulo( um : Modulo[],verPerfilId:string,usuarioCreatedOID:string ): Observable< Modulo[] > {
  let url:string = GlobalConstants.apiURL + "/perfiles/saveModulo/" + verPerfilId + "/" + usuarioCreatedOID;
  return this.http.post<Modulo[]>( url , JSON.stringify(um), {headers: this.headers});
}

public eliminaVerPerfil(verPerfil: VerPerfil, usuarioOID ): Observable< VerPerfil > {
    let url:string = GlobalConstants.apiURL + "perfiles/delete" + "/" + usuarioOID;
    return this.http.post<VerPerfil>( url , JSON.stringify(perfil), {headers: this.headers});
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
