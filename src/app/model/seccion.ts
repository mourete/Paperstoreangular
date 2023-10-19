import { Concepto } from './concepto';
export class Seccion {

    documentoId:number;
    orden: number;
    activa:number;
    enabled:number;    
    seccionOID: string;
    seccionPadreOID: string ;
    nombre : string; 
    clave : string;
    ciclica: number;
    preguntaDominante : string;    
    tipoListaOpcion: string;
    tipoListaOpcionID : number;
    controlUsuario : number;
    filtro : string;
    conceptos : Concepto[];

}
