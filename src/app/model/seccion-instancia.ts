import { ConceptoInstancia } from './concepto-instancia';

export class SeccionInstancia {


    seccionOID: string;
    seccionPadreOID : string;
    seccionInstanciaOID : string;
    documentoInstanciaOID: string;
    nombre : string;
    ciclica : number;
    conceptoDominante : string;
    orden: number;
    listaCiclo: string;
    conceptoDominanteCiclo: string;
    tipoListaOpcionCicloId : number;
    otros: number;
    codigoBarra: number;
    seleccionada: number;
    enabled: number;
    controlUsuario: number;
    conceptosInstancia: ConceptoInstancia[];
    tipoAlerta: number;
  

   


}
