import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concepto } from '../model/concepto';
import { GlobalConstants } from '../model/global-constants';
import { ConceptoAlertaPerfil } from '../model/concepto-alerta-perfil';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor( private http : HttpClient ) { }


public guardarConcepto(concepto: Concepto ,usuarioOID:string): Observable< Concepto > {
    let url:string = GlobalConstants.apiURL + "conceptos/save" + "/" + usuarioOID;
    return this.http.post<Concepto>( url , JSON.stringify(concepto), {headers: this.headers});
}



public guardarConceptoAlertaPerfil( um : ConceptoAlertaPerfil,usuarioOID:string): Observable< ConceptoAlertaPerfil > {
  let url:string = GlobalConstants.apiURL + "/concepto/saveConceptoAlertaPerfil" + "/" + usuarioOID;
  return this.http.post<ConceptoAlertaPerfil>( url , JSON.stringify(um), {headers: this.headers});
}

public conceptoFiltro(concepto: Concepto, usuarioOID:string ): Observable< Concepto > {

  let url:string = GlobalConstants.apiURL + "conceptos/conceptoFiltro" + "/" + usuarioOID;;
  return this.http.post<Concepto>( url , JSON.stringify(concepto), {headers: this.headers});

}


public deleteConcepto(concepto: Concepto, usuarioOID:string ) {
  let url:string = GlobalConstants.apiURL + "conceptos/delete"+ "/" + usuarioOID;
  return this.http.post<Concepto>( url , JSON.stringify(concepto), {headers: this.headers});
}


public getConceptoByOID(conceptoOID:string, usuarioOID:string) : Observable<Concepto> {
  let url:string = GlobalConstants.apiURL + "conceptos/" + conceptoOID + "/" + usuarioOID;
  return this.http.get<Concepto>( url  );
}

public getConceptoAlertaByPerfil({ conceptoOID, tipoAlerta }: { conceptoOID: string; tipoAlerta: number}, usuarioOID : string) : Observable<ConceptoAlertaPerfil[]> {
  let url:string = GlobalConstants.apiURL + "conceptos/getConceptoAlertaByPerfil/" + conceptoOID + "/" + tipoAlerta + "/" + usuarioOID;
  return this.http.get<ConceptoAlertaPerfil[]>( url );

}

public getConceptoBySeccionOID(seccionOID:string, usuarioOID:string) : Observable<Concepto[]> {
  let url:string = GlobalConstants.apiURL + "conceptos/bySeccionOID/" + seccionOID + "/" + usuarioOID ;
  return this.http.get<Concepto[]>( url  );
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

}






}
