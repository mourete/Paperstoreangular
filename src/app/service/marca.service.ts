import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../model/marca';
import { GlobalConstants } from '../model/global-constants';



@Injectable({
  providedIn: 'root'
})
export class MarcaService {


  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }


public getByUsuarioOID(usuarioOID:string) : Observable<Marca[]> {
    let url:string = GlobalConstants.apiURL + "marcas/getMarcasByUsuarioOID/" + usuarioOID ;
    return this.http.get<Marca[]>( url  );
}


public getMarcasByEmpresaYUsuario(usuarioOID:string , empresaId: number  ) : Observable<Marca[]> {
   let url:string = GlobalConstants.apiURL + "marcas/getMarcasByEmpresaYUsuario/" + usuarioOID + "/" + empresaId ;
   return this.http.get<Marca[]>( url  );
}


public getByMarcaId(marcaId:number, usuarioOID:string) : Observable<Marca> {
  let url:string = GlobalConstants.apiURL + "marcas/byMarcaId/" + marcaId + "/" + usuarioOID;
  return this.http.get<Marca>( url  );
}


public guardarMarca( marca: Marca, usuarioOID:string ): Observable< Marca > {
  let url:string = GlobalConstants.apiURL + "marcas/save"  +"/" + usuarioOID;
  return this.http.post<Marca>( url , JSON.stringify(marca), {headers: this.headers});
}
public eliminarMarca(marca: Marca, usuarioOID:string): Observable< Marca > {
  let url:string = GlobalConstants.apiURL + "marcas/delete/" + "/" + usuarioOID;
  return this.http.post<Marca>( url , JSON.stringify(marca), {headers: this.headers});
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
