import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../model/global-constants';
import { DocumentoInstancia } from '../model/documento-instancia';

@Injectable({
  providedIn: 'root'
})
export class DocumentoInstanciaService {

  
  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor( private http : HttpClient ) { }

 
 
public getDocByDocumentInstanceAndSection( documentoId :number ,   documentoInstanciaOID:string , seccionOID : string , usuarioOID:string   ) : Observable<DocumentoInstancia> {
  let url:string = GlobalConstants.apiURL + "documentosInstancia/respuestas/" + documentoId + "/"  + documentoInstanciaOID + "/" + seccionOID + "/" + usuarioOID   ; 
  console.log(url);
  return this.http.get<DocumentoInstancia>( url  );
}


public getDocByDocumentoId( documentoId :number , usuarioOID:string ) : Observable<DocumentoInstancia[]> {  
  let url:string = GlobalConstants.apiURL + "documentosInstancia/" + documentoId  +"/" + usuarioOID ; 
  return this.http.get<DocumentoInstancia[]>( url  );
}


public getByDocIdSucProyReg( documentoId :number , sucursalId:number, proyectoId:number , regionId:number , usuarioOID:string  ) : Observable<DocumentoInstancia[]> {  
  let url:string = GlobalConstants.apiURL + "documentosInstancia/" + documentoId + "/" + sucursalId +"/" + proyectoId + "/" + regionId  +"/" + usuarioOID ; 
  return this.http.get<DocumentoInstancia[]>( url  );
}


public guardarDocumentoInstanciaRespuestas(documento: DocumentoInstancia , usuarioOID:string ): Observable< DocumentoInstancia > {
    let url:string = GlobalConstants.apiURL + "documentosInstancia/respuestas/save"+"/" + usuarioOID;    
    return this.http.post<DocumentoInstancia>( url , JSON.stringify(documento), {headers: this.headers});    
}  

 
public eliminarDocumentoInstancia(documento: DocumentoInstancia, usuarioOID:string  ): Observable< string > {
  let url:string = GlobalConstants.apiURL + "documentosInstancia/delete" +"/" + usuarioOID; 
  return this.http.post<string>( url , JSON.stringify(documento), {headers: this.headers});    
}

public guardarDocumentoInstancia(documento: DocumentoInstancia, usuarioOID:string  ): Observable< DocumentoInstancia > {
  let url:string = GlobalConstants.apiURL + "documentosInstancia/save"+"/" + usuarioOID; 
  return this.http.post<DocumentoInstancia>( url , JSON.stringify(documento), {headers: this.headers});    
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




public upload(file: File, documentoId,documentoInstanciaOID, seccionOID, conceptoOID, conceptoInstanciaOID, usuarioOID:string ): Observable<String> {
  const formData: FormData = new FormData();


 
  formData.append('file', file);
  formData.append('documentoId', documentoId);
  formData.append('documentoInstanciaOID', documentoInstanciaOID);
  formData.append('seccionInstanciaOID', seccionOID);
  formData.append('conceptoOID', conceptoOID);
  formData.append('conceptoInstanciaOID', conceptoInstanciaOID);




 

  let url:string = GlobalConstants.apiURL + "documentosInstancia/saveFile" + "/" + usuarioOID; ; 
    return this.http.post<any>( url , formData); 

 
}





}
