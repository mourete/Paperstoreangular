import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../model/global-constants';
import { Proyecto } from '../model/proyecto';
import { ProyectoRegion } from '../model/proyecto-region';
import { ProyectoDocumento } from '../model/proyecto-documento';
 


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
 

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }

 
public getByUsuario(usuarioOID:string) : Observable<Proyecto[]> {
    let url:string = GlobalConstants.apiURL + "proyectos/getByUsuario/" + usuarioOID ; 
    return this.http.get<Proyecto[]>( url  );
}
 

public getProyectoRegionesByMarca( proyectoId:number , marcaId:number , usuarioOID:string  ) : Observable<ProyectoRegion[]>  {
  let url:string = GlobalConstants.apiURL + "proyectos/getProyectoRegionesByMarca/" +proyectoId + "/" + marcaId + "/"  + usuarioOID ; 
  return this.http.get<ProyectoRegion[]>( url  );
}

public eliminarProyecto(proyecto: Proyecto ): Observable< string > {
  let url:string = GlobalConstants.apiURL + "proyectos/delete"; 
  return this.http.post<string>( url , JSON.stringify(proyecto), {headers: this.headers});    
}
public getDocumentosByProyecto( proyectoId:number ,  usuarioOID:string  ) : Observable<ProyectoDocumento[]>  {
  let url:string = GlobalConstants.apiURL + "proyectos/getDocumentosByProyecto/" +proyectoId + "/"  + usuarioOID ; 
  return this.http.get<ProyectoDocumento[]>( url  );
}


public getByEmpresaYMarca(usuarioOID:string ,  empresaId:number ,  marcaId:number ) : Observable<Proyecto[]> {
  let url:string = GlobalConstants.apiURL + "proyectos/getByEmpresaYMarca/" + usuarioOID + "/" + empresaId + "/" + marcaId ; 
  return this.http.get<Proyecto[]>( url  );
}



public getProyectoById( proyectoId : number, usuarioOID:string ) : Observable<Proyecto> {
  let url:string = GlobalConstants.apiURL + "proyectos/getProyectoById/" + proyectoId+ "/" + usuarioOID; 
  return this.http.get<Proyecto>( url  );
}


public saveProyecto( proy : Proyecto, usuarioOID:string ): Observable< Proyecto > {
  let url:string = GlobalConstants.apiURL + "proyectos/saveProyecto" + "/" + usuarioOID; 
  return this.http.post<Proyecto>( url , JSON.stringify(proy), {headers: this.headers});    
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
