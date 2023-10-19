import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../model/empresa';
import { GlobalConstants } from '../model/global-constants';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
 

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }

 

public getByUsuarioOID(usuarioOID:string) : Observable<Empresa[]> {
    let url:string = GlobalConstants.apiURL + "empresas/byUsuarioOID/" + usuarioOID ; 
    return this.http.get<Empresa[]>( url  );
}

/*
public getAll() : Observable<Empresa[]> {
  let url:string = GlobalConstants.apiURL + "empresas/getAll"  ; 
  return this.http.get<Empresa[]>( url  );
}
*/

public guardarEmpresa(empresa: Empresa, usuarioOID2:string ): Observable< Empresa > {
  let url:string = GlobalConstants.apiURL + "empresas/save" +"/" + usuarioOID2; 
  return this.http.post<Empresa>( url , JSON.stringify(empresa), {headers: this.headers});    
}  


public getByEmpresaId(empresaId:number , usuarioOID:string ) : Observable<Empresa> {
  let url:string = GlobalConstants.apiURL + "empresas/byEmpresaId/" + empresaId +"/" + usuarioOID; 
  return this.http.get<Empresa>( url  );
}


public eliminaEmpresa(empresa: Empresa ): Observable< Empresa > {
  let url:string = GlobalConstants.apiURL + "empresas/delete"; 
  return this.http.post<Empresa>( url , JSON.stringify(empresa), {headers: this.headers});    
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
