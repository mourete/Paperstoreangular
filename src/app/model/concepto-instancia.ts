import { Opcion } from './opcion';
import { OpcionInstancia } from './opcion-instancia';

export class ConceptoInstancia {

    conceptoOID : string;
    conceptoInstanciasOID : string;
    descripcion:string;
    condicionada:number;
    enabled:number;
    noEditable:number;
    tipoConceptoId : number;
    valor : string;
    valorUrl : string;
    nroDecimales: number;
    minimo: number;
    maximo:number;
    requerida:number;
    filtro:number;
    filtrada:number;
    conceptoFiltroOID: string;
    listaOID : string;
    otros: number;
    codigoBarra: number;
    tipoListaOpcionId : number;
    conceptoDominanteOID : string;
    opcionesInstancia: OpcionInstancia[];
    valueAsDate:Date;
    selected:OpcionInstancia;
    selectedValues: OpcionInstancia[] | string[];
    tipoAlerta: number;
    nombreFile:string;
    readOnly:boolean;


}
