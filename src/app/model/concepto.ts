import { Opcion } from './opcion';
import { ConceptoFiltra } from './conceptoFiltra';
import { ListasConceptosSecciones } from './listas-conceptos-secciones';
import { ConceptoAlertaPerfil } from './concepto-alerta-perfil';

export class Concepto {

    seccionOID:string;
    conceptoOID : string;
    descripcion : string;
    tipoConceptoId: number;
    orden : number;
    archivoImagen : string;
    clave : string;
    condicionada : number;
    requerida: number;
    opciones : Opcion[];
    activa   : number;
    enabled  : number;
    visible  : number;
    maximo:number;
    minimo:number;
    fechaMaxima:string;
    fechaMinima:string;
    horaMaxima:string;
    horaMinima:string;
    mensajes:string;
    listasConceptosSecciones:ListasConceptosSecciones;
    noEditable: number;
    filtro : number;
    descripcionText : String;
    listaOID : String;
    listaFiltroOID : String;
    listConceptoFiltra : ConceptoFiltra[];
    conceptoAlertaPerfilRojo : ConceptoAlertaPerfil[];
    conceptoAlertaPerfilAmarillo : ConceptoAlertaPerfil[];
        conceptoAlertaPerfilRojoConcat : string;
        conceptoAlertaPerfilAmarilloConcat : string;
        diasAlertaRojo : number;
        diasAlertaAmarillo : number;
        alertaRojo : number;
        alertaAmarillo : number;

    

    


}
