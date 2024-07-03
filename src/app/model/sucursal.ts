import { Documento } from './documento';

export class Sucursal {


    sucursalId:number;
    marcaId:number;
    empresaId:number;
     ciudadId:number;
     ciudad:string;
     estado:string;
        estadoId:number;
      clave:string;
        nombre:string;
        numero:string;
        calle:string;
        colonia:string;
        cp:string;
        entreCalle:string;
        resonsable:string;
        mail:string;
        activo:number;
        coordenadaX:number;
        coordenadaY:number
        responsable:string;
        usuarioOID:string;
        sucursal:string;
        direccion:string;
        fax:string;
        documentos:Documento[];
        flagActivo:boolean;
        nombreEmpresa : String;
        nombreMarca : String;



}
