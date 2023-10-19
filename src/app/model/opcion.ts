import { Condicion } from './condicion';

export class Opcion {

    clave:string;
    valor:string;
    tag:string;
    opcionOID : string;
    listaOID : string;
    texto : string;
    orden : number;
    visible:number;
    enabled:number;
    condiciones : Condicion[];
    opcionFiltroOID : string;
    opcionesNombre : string;
    


}
