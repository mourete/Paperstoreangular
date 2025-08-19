import { Seccion } from './seccion';
import { SeccionInstanciaSave } from './seccion-instancia-save';

export class DocumentoInstanciaSave {

      documentoId:number;
   documentoInstanciaOID;
  
   usuarioOID:string;
   statusInstanciasId:number;
   statusNombre:string;
   seccionesInstanciaSave:SeccionInstanciaSave[];
   proyectoId :number;
   regionId:number;
   sucursalId:number;

}
