import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from '../model/sucursal';
import { GlobalConstants } from '../model/global-constants';
import { SucursalRegion } from '../model/sucursal-region';
 


@Injectable({
  providedIn: 'root'
})
export class SucursalService {
 

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }

 
public getSucursalesByUsuarioOID(usuarioOID:string) : Observable<Sucursal[]> {
    let url:string = GlobalConstants.apiURL + "sucursales/getSucursalesByUsuarioOID/" + usuarioOID ; 
    return this.http.get<Sucursal[]>( url  );
}


public getSucursalByID(sucursalId:number , usuarioOID :string) : Observable<Sucursal> {
  let url:string = GlobalConstants.apiURL + "sucursales/getSucursalByID/" + sucursalId + "/" + usuarioOID ; 
  return this.http.get<Sucursal>( url  );
}


public getSucursagetSucursalesByMarcaYEmpresalByID( marcaId:number , empresaId:number , usuarioOID :string) : Observable<Sucursal[]> {

  let url:string = GlobalConstants.apiURL + "sucursales/getSucursalesByMarcaYEmpresa/" + marcaId + "/" + empresaId + "/" + usuarioOID ; 
  return this.http.get<Sucursal[]>( url  );
}


public guardarSucursal( sucursal: Sucursal, usuarioOID:string ): Observable< Sucursal > {
  let url:string = GlobalConstants.apiURL + "sucursales/save" + "/"+ usuarioOID; 
  return this.http.post<Sucursal>( url , JSON.stringify(sucursal), {headers: this.headers});    
} 


public eliminaSucursal( sucursal: Sucursal,usuarioOID:string ): Observable< Sucursal > {
  let url:string = GlobalConstants.apiURL + "sucursales/delete"+ "/" + usuarioOID; 
  return this.http.post<Sucursal>( url , JSON.stringify(sucursal), {headers: this.headers});    
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
