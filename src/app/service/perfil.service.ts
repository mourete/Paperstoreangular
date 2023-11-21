import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../model/perfil';
import { GlobalConstants } from '../model/global-constants';
import { Modulo} from '../model/modulo';




@Injectable({
  providedIn: 'root'
})
export class PerfilService {
 

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }

 

public getPerfilById(perfilId:number,   usuarioCreatedOID:string) : Observable<Perfil> {
    let url:string = GlobalConstants.apiURL + "perfiles/perfilConsulta/" + perfilId + "/" + usuarioCreatedOID;
    return this.http.get<Perfil>( url  );
}

public getPerfiles(perfilId:number,   usuarioCreatedOID:string) : Observable<Perfil[]> {
  let url:string = GlobalConstants.apiURL + "perfiles/perfilConsulta/" + perfilId + "/" + usuarioCreatedOID;
  return this.http.get<Perfil[]>( url  );
}


public getModulosJson(perfilId:number , usuarioCreatedOID:string ) : Observable<string[]> {
  let url:string = GlobalConstants.apiURL + "perfiles/getPerfilModulosJson/" + perfilId + "/" + usuarioCreatedOID;
  console.log(this.http.get<string[]>( url ));
  return this.http.get<string[]>( url );
}






public guardarPerfil(perfil: Perfil , usuarioCreatedOID:string): Observable< Perfil > {
  
  let url:string = GlobalConstants.apiURL + "perfiles/save/"+usuarioCreatedOID; 
  return this.http.post<Perfil>( url , JSON.stringify(perfil), {headers: this.headers});    
} 


public guardarPerfilModulo( um : Modulo[],perfilID:string,usuarioCreatedOID:string ): Observable< Modulo[] > {
  let url:string = GlobalConstants.apiURL + "/perfiles/saveModulo/" + perfilID + "/" + usuarioCreatedOID; 
  return this.http.post<Modulo[]>( url , JSON.stringify(um), {headers: this.headers});    
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
