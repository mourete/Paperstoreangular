import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from '../model/region';
import { GlobalConstants } from '../model/global-constants';
import { SucursalRegion } from '../model/sucursal-region';



@Injectable({
  providedIn: 'root'
})
export class RegionService {


  endpoint: String;
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor( private http : HttpClient ) { }



public getByUsuarioOID(usuarioOID:string) : Observable<Region[]> {
    let url:string = GlobalConstants.apiURL + "regiones/getRegionesByUsuarioOID/" + usuarioOID ;
    return this.http.get<Region[]>( url  );
}


public getByRegionId(regionId:number, usuario : string) : Observable<Region> {
  let url:string = GlobalConstants.apiURL + "regiones/byRegionId/" + regionId + "/" + usuario;
  return this.http.get<Region>( url  );
}



public eliminaRegion( region: Region, usuarioOID:string ): Observable< Region > {
  let url:string = GlobalConstants.apiURL + "regiones/delete"+ "/" + usuarioOID;
  return this.http.post<Region>( url , JSON.stringify(region), {headers: this.headers});
}

public guardarRegion( region: Region,usuarioOID:string ): Observable< Region > {
  let url:string = GlobalConstants.apiURL + "regiones/save"+ "/" + usuarioOID;
  return this.http.post<Region>( url , JSON.stringify(region), {headers: this.headers});
}



public getSucursalesByRegionMarca(usuarioOID:string  , regionId :number , marcaId:number  ) : Observable<SucursalRegion[]> {
  let url:string = GlobalConstants.apiURL + "regiones/getSucursalesByRegionMarca/" + usuarioOID + "/" +  regionId + "/"  + marcaId ;
  return this.http.get<SucursalRegion[]>( url  );
}


public sucursalRegion( sr: SucursalRegion, usuarioOID:string ): Observable< SucursalRegion > {
  let url:string = GlobalConstants.apiURL + "regiones/sucursalRegion/save"+ "/" + usuarioOID;
  return this.http.post<SucursalRegion>( url , JSON.stringify(sr), {headers: this.headers});
}


public validarRegion( regionId: number,usuarioOID:string ): Observable< Region > {
  let url:string = GlobalConstants.apiURL + "regiones/validarRegion/" +  regionId + "/" + usuarioOID ;
  return this.http.get<Region>( url  );
}


public saveAllSucursales( region: Region,usuarioOID:string ): Observable< Region > {
  let url:string = GlobalConstants.apiURL + "/regiones/sucursalRegion/saveAll" + "/" + usuarioOID;
  return this.http.post<Region>( url , JSON.stringify(region), {headers: this.headers});
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
  // return throwError(errorMessage);
}
















}
