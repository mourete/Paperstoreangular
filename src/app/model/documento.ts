import { Seccion  } from './seccion'

export class Documento {
    documentoId : number;
    nombre : string;
    clave:String;
    statusId  : number;
    estatus:string;
    plantilla: string;
    operacion : number;    
	observaciones : string;	    
    secciones : Seccion[]
    activa:number;
    cantidadDocumento:number;
    cantidadInstancias:number;
    proyectoId:number;
    regionId:number;
    sucursalId:number;

    
}
