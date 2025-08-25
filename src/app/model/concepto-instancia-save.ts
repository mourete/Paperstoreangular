import { Opcion } from './opcion';
import { OpcionInstanciaSave } from './opcion-instancia-save';

export class ConceptoInstanciaSave {

    conceptoOID : string;
    conceptoInstanciaOID : string;
    tipoConceptoId : number;
    valor : string;
    valorUrl : string;
    selected:OpcionInstanciaSave;
    selectedValues: OpcionInstanciaSave[] | string[];

}
