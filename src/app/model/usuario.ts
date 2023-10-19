import { InfoHuesped } from "./info-huesped";

export class Usuario {
     
     usuarioOID: string;
     userName:string;
     nombre:string;
     pass:string;
     huesped:number;
     apellidoMaterno:string;
	apellidoPaterno:string;
	direccion:string;
	colonia:string;
	cp:string;
	ciudadId:number;
	activo:number;
	nroEmpleado:number;
	puestoId:number;
	mail:string;
	telefono:string;
	usuarioCreated:string; 
	usuarioUpdated:string;
	empresasConcat:string;
	perfilesConcat:string;
	huespedNombre:string;
	perfilId:number;

	infoHuesped: InfoHuesped;
	
}
