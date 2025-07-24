import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../model/perfil';
import { GlobalConstants } from '../model/global-constants';
import { Modulo} from '../model/modulo';
import {Empresa} from "../model/empresa";
import {Usuario} from "../model/usuario";
import {PerfilUsuario} from "../model/perfil-usuario";




@Injectable({
  providedIn: 'root'
})
export class PerfilService {


  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }



public getPerfilById(perfilId:number, usuarioOID:string) : Observable<Perfil> {
    let url:string = GlobalConstants.apiURL + "perfiles/getPerfilesById/" + perfilId + "/" + usuarioOID;
    return this.http.get<Perfil>( url  );
}


  public getAll(usuarioOID:string) : Observable<Perfil[]> {
    let url:string = GlobalConstants.apiURL + "perfiles/getAll/" + usuarioOID;
    return this.http.get<Perfil[]>( url  );
  }

  public getPerfilesByPerfilID(usuarioOID:string  , sessionUser:string ) : Observable<PerfilUsuario[]> {
    let url:string = GlobalConstants.apiURL + "usuarios/getPerfilesByUsuarioOID/" + usuarioOID +"/"+sessionUser ;
    return this.http.get<PerfilUsuario[]>( url  );
  }



  public getPerfilModulosJson(perfilId:number , usuarioConsultaOID:string ) : Observable<string[]> {
  let url:string = GlobalConstants.apiURL + "perfiles/getPerfilModulosJson/" + perfilId + "/" + usuarioConsultaOID;
  return this.http.get<string[]>( url );
}

public guardarPerfil(per: Perfil , usuarioOID:string): Observable< Perfil > {
  let url:string = `${GlobalConstants.apiURL}perfiles/savePerfil/${usuarioOID}`;
  return this.http.post<Perfil>( url , JSON.stringify(per), {headers: this.headers});
}
public editarPerfil(per: Perfil , usuarioOID:string): Observable< Perfil > {
  let url:string = `${GlobalConstants.apiURL}perfiles/saveModulosPerfil/${per.perfilId}/${usuarioOID}`;
  return this.http.post<Perfil>( url , JSON.stringify(per), {headers: this.headers});
}

public eliminaPerfil(per: Perfil, usuarioOID: string ): Observable< Perfil > {
    let url:string = GlobalConstants.apiURL + "perfiles/delete" + "/" + usuarioOID;
    return this.http.post<Perfil>( url , JSON.stringify(per), {headers: this.headers});
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
