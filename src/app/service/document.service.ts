import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../model/documento';
import { GlobalConstants } from '../model/global-constants';
import { DocumentoResumen } from '../model/documento-resumen';
import { DocumentosUsuario } from '../model/documentos-usuario';
import { ListDocumentosUsuarios } from '../model/list-documento-usuarios';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor( private http : HttpClient ) { }

  public getDocumentTest() : Observable<Documento> {
      let url:string = GlobalConstants.apiURL + "documentos/1"; 
      return this.http.get<Documento>( url  );
  }

  public getAll(usuarioOID:string) : Observable<Documento[]> {
    let url:string = GlobalConstants.apiURL + "documentos/all"  + "/" + usuarioOID; 
    return this.http.get<Documento[]>( url  );
}


public getAllActives(usuarioOID:string) : Observable<Documento[]> {
  let url:string = GlobalConstants.apiURL + "documentos/allActives"  + "/" + usuarioOID; 
  console.log(GlobalConstants.apiURL + "documentos/allActives"  + "/" + usuarioOID );
  return this.http.get<Documento[]>( url  );
}



public getDocumentForConfig(documentoId:number, usuarioOID:string) : Observable<Documento> {
    let url:string = GlobalConstants.apiURL + "documentos/design/" + documentoId + "/" + usuarioOID; 
    return this.http.get<Documento>( url  );
}
 
public getDocumentoResumen(documentoId:number, usuarioOID:string) : Observable<DocumentoResumen> {
   
  let url:string = GlobalConstants.apiURL + "documentos/resumen/" + documentoId  + "/" + usuarioOID; 
  return this.http.get<DocumentoResumen>( url  );
}


public getDocumentosUsuario( usuarioOID : string ) : Observable<DocumentosUsuario> {
  let url:string = GlobalConstants.apiURL + "documentos/documentosUsuario/" + usuarioOID ; 
  return this.http.get<DocumentosUsuario>( url  );
}

public getDocumentosUsuarioList(marcaId: number , empresaId : number,  usuarioOID : string ) : Observable<ListDocumentosUsuarios[]> {
  let url:string = GlobalConstants.apiURL + "documentos/documentosUsuarioList/" + usuarioOID  + "/"  + marcaId + "/"  + empresaId; 
  return this.http.get<ListDocumentosUsuarios[]>( url  );
}

  public guardarDocumento(documento: Documento, usuarioOID:string ): Observable< Documento > {
    let url:string = GlobalConstants.apiURL + "documentos/save"; 
    return this.http.post<Documento>( url , JSON.stringify(documento), {headers: this.headers});    
}  

public deleteDocumento(documentoId:number, usuarioOID:string ): Observable< string > {
  let url:string = GlobalConstants.apiURL + "documentos/delete/" + documentoId  + "/" + usuarioOID;  
  return this.http.post<string>( url , JSON.stringify(documentoId), {headers: this.headers});    
}  
 
public getByDocumentoId(documentoId:number, usuarioOID:string) : Observable<Documento> {
    let url:string = GlobalConstants.apiURL + "documentos/byDocumentoId/" + documentoId  + "/" + usuarioOID ; 
    return this.http.get<Documento>( url  );
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
