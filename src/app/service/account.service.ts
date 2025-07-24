import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Usuario } from '../model/usuario';
import { GlobalConstants } from '../model/global-constants';
import { InfoHuesped } from '../model/info-huesped';
import { UsuarioLog } from '../model/usuario-log';
import { Modulo } from '../model/modulo';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor( private http : HttpClient ) { }


  public getByUserAndPassword(userName: string, password: string): Observable<Usuario> {
    const url = GlobalConstants.apiURL + 'account/users/login'; // nuevo endpoint
    const body = {
      username: userName,
      password: password
    };

    return this.http.post<Usuario>(url, body, { headers: this.headers });
  }

public getLicenciasByUserOID( usuarioOID: string  ) : Observable<InfoHuesped[]> {
  let url:string = GlobalConstants.apiURL + "account/licencias/getByUserOID/" + usuarioOID;
  return this.http.get<InfoHuesped[]>( url  );
}

public usuarioLog (  usuarioOID: string , huespedId: number ) : Observable<UsuarioLog> {
  let url:string = GlobalConstants.apiURL + "account/usuarioLog/" + usuarioOID + "/" + huespedId ;
  return this.http.get<UsuarioLog>( url  );

}


public getModulosByUserOID(  usuarioOID: string  ) : Observable<Modulo[]> {
  let url:string = GlobalConstants.apiURL + "account/modulos/getByUserOID/" + usuarioOID;

  console.log("account/modulos/getByUserOID/" + usuarioOID);
  return this.http.get<Modulo[]>( url  );
}


public logOff (  usuarioLogOID: string , ip:string )  {
  let url:string = GlobalConstants.apiURL + "account/logOff/" + usuarioLogOID + "/" + ip;
  return this.http.get<UsuarioLog>( url  );

}


public getModuloPredeterminado(  usuarioOID: string  ) : Observable<Modulo> {
  let url:string = GlobalConstants.apiURL + "account/modulos/default/getByUserOID/" + usuarioOID;
  return this.http.get<Modulo>( url  );
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
