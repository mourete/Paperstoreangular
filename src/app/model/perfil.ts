import { Modulo } from "./modulo";

export class Perfil {


    nombre:string;
    descripcion:string;
	clave:string;
  moduloId:number;
    modulos: Modulo[];
  perfilId: number;
  activo: number;
  moduloConcat: string;
  usuarioOID? : String;

}
