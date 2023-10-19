import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { GlobalConstants } from '../model/global-constants';
import { UsuarioEmpresa } from '../model/usuario-empresa';
import { PerfilUsuario } from '../model/perfil-usuario';
import { UsuarioMarca } from '../model/usuario-marca';
import { UsuarioRegion } from '../model/usuario-region';
import { SucursalRegion } from '../model/sucursal-region';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
 

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }

 

public getUsuariosByUsuarioConsulta(usuarioOID:string,   usuarioCreatedOID:string) : Observable<Usuario[]> {
    let url:string = GlobalConstants.apiURL + "usuarios/byUsuarioConsulta/" + usuarioOID + "/" + usuarioCreatedOID;
    return this.http.get<Usuario[]>( url  );
}



public getEmpUsuarioByUserOID(usuarioOID:string , usuarioCreatedOID:string ) : Observable<UsuarioEmpresa[]> {
  let url:string = GlobalConstants.apiURL + "usuarios/getEmpUsuarioByUserOIDJson/" + usuarioOID + "/" + usuarioCreatedOID;
  return this.http.get<UsuarioEmpresa[]>( url  );
}
public getEmpUsuarioByUserOIDJson(usuarioOID:string , usuarioCreatedOID:string ) : Observable<string[]> {
  let url:string = GlobalConstants.apiURL + "usuarios/getEmpUsuarioByUserOIDJson/" + usuarioOID + "/" + usuarioCreatedOID;
  console.log(this.http.get<string[]>( url ));
  return this.http.get<string[]>( url );
}

public getEmpUsuarioNoTodasMarcas(usuarioOID:string , usuarioConsultaOID:string  ) : Observable<UsuarioEmpresa[]> {
  let url:string = GlobalConstants.apiURL + "usuarios/getEmpUsuarioNoTodasMarcas/" + usuarioOID + "/" + usuarioConsultaOID ;
  return this.http.get<UsuarioEmpresa[]>( url  );
}



public getUsuarioMarcasByEmpresa(usuarioOID:string , empresaId:number,usuarioConsultaOID:string   ) : Observable<UsuarioMarca[]> {
  let url:string = GlobalConstants.apiURL + "usuarios/getUsuarioMarcasByEmpresa/" + usuarioOID + "/" + empresaId + "/" + usuarioConsultaOID ;
  return this.http.get<UsuarioMarca[]>( url  );
}


public getUsuarioRegionesByMarca(usuarioOID:string , marcaId:number , usuarioConsultaOID:string  ) : Observable<UsuarioRegion[]> {
  let url:string = GlobalConstants.apiURL + "usuarios/getUsuarioRegionesByMarca/" + usuarioOID + "/" + marcaId + "/" + usuarioConsultaOID ;
  return this.http.get<UsuarioRegion[]>( url  );
}




public getPerfilesByUsuarioOID(usuarioOID:string  , sessionUser:string ) : Observable<PerfilUsuario[]> {
  let url:string = GlobalConstants.apiURL + "usuarios/getPerfilesByUsuarioOID/" + usuarioOID +"/"+sessionUser ;
  return this.http.get<PerfilUsuario[]>( url  );
}


public getUsuarioByOID(usuarioOID:string  , usuarioConsultaOID:string ) : Observable<Usuario> {
 
  let url:string = GlobalConstants.apiURL + "usuarios/byUsuarioOID/" + usuarioOID + "/" + usuarioConsultaOID ; 
  return this.http.get<Usuario>( url  );
}


public guardarUsuario(usuario: Usuario , usuarioConsultaOID:string): Observable< Usuario > {
  
  let url:string = GlobalConstants.apiURL + "usuarios/save/"+usuarioConsultaOID; 
  return this.http.post<Usuario>( url , JSON.stringify(usuario), {headers: this.headers});    
} 


public guardarUsuarioMarcas( um : UsuarioMarca,usuarioConsultaOID:string ): Observable< UsuarioMarca > {
  let url:string = GlobalConstants.apiURL + "/usuarios/saveMarcas/" + usuarioConsultaOID; 
  return this.http.post<UsuarioMarca>( url , JSON.stringify(um), {headers: this.headers});    
} 


public guardarUsuarioRegiones( ur : UsuarioRegion,usuarioConsultaOID:string ): Observable< UsuarioRegion > {
  let url:string = GlobalConstants.apiURL + "/usuarios/saveRegiones/" + usuarioConsultaOID ; 
  return this.http.post<UsuarioRegion>( url , JSON.stringify(ur), {headers: this.headers});    
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
