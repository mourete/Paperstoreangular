import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lista } from '../model/lista';
import { Opcion } from '../model/opcion';
import { GlobalConstants } from '../model/global-constants';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  endpoint: String;
  controller:String = "listas/";
  wsGetAll:String = "all";
  wsGetOpciones="opciones"
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }

  public getAll( usuarioOID:string) : Observable<Lista[]> {
      let url:string = GlobalConstants.apiURL + this.controller + this.wsGetAll+"/" + usuarioOID;
      return this.http.get<Lista[]>( url  );
  }


  public getListaFiltro(usuarioOID:string) : Observable<Lista[]> {
    let url:string = GlobalConstants.apiURL + this.controller + "listaFiltro/"+ usuarioOID;
    return this.http.get<Lista[]>( url  );
  }


  public getListaByListaOID(listaOID:string,  usuarioOID:string) : Observable<Lista> {
    let url:string = GlobalConstants.apiURL  + this.controller + listaOID +"/" + usuarioOID;
    return this.http.get<Lista>( url  );
  }

  public getOpcionByOpcionOID(opcionOID:string,  usuarioOID:string) : Observable<Opcion> {
    let url:string = GlobalConstants.apiURL  + this.controller + "opciones/byOpcionOID/"+  opcionOID +"/" + usuarioOID;
    return this.http.get<Opcion>( url  );
  }

  public getOpcionesByLista(listaOID:string,  usuarioOID:string) : Observable<Opcion[]> {
    let url:string = GlobalConstants.apiURL  + this.controller + "opciones/"+  listaOID + "/"  + usuarioOID ;
    return this.http.get<Opcion[]>( url  );
  }

  public guardarLista(lista: Lista,  usuarioOID:string ): Observable< Lista > {
    let url:string = GlobalConstants.apiURL + "listas/save" +"/" + usuarioOID;
    return this.http.post<Lista>( url , JSON.stringify(lista), {headers: this.headers});
}


public guardarOpcion(opcion: Opcion ,  usuarioOID:string): Observable< Opcion > {
  let url:string = GlobalConstants.apiURL + "listas/opciones/save"+"/" + usuarioOID;
  return this.http.post<Opcion>( url , JSON.stringify(opcion), {headers: this.headers});
}

public deleteOpcion(opcion: Opcion,  usuarioOID:string ) {
  let url:string = GlobalConstants.apiURL + "listas/opciones/delete"+"/" + usuarioOID;
  return this.http.post<Opcion>( url , JSON.stringify(opcion), {headers: this.headers});
}

public deleteLista(lista: Lista,  usuarioOID:string ) {
  let url:string = GlobalConstants.apiURL + "listas/delete"+"/" + usuarioOID;
  return this.http.post<Lista>( url , JSON.stringify(lista), {headers: this.headers});
}




}
