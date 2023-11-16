import { Seccion } from './seccion';
import { SeccionInstancia } from './seccion-instancia';

export class DocumentoInstancia {

   fechaCreacion:Date;
   noEditable: number;
   documentoId:number;
   documentoInstanciaOID;
   documento: number;
   nombre : string;
   observaciones : string;
   plantilla : number;
   activa: number;
   usuarioOID:string;
   statusInstanciasId:number;
   statusNombre:string;
   seccionesInstancia:SeccionInstancia[];
   imagePath:string;
   alerta:string;
   proyectoId :number;
   proyecto :string;
   regionId:number;
   sucursalId:number;
   tipoAlerta: number;
   readOnly: number;

}
