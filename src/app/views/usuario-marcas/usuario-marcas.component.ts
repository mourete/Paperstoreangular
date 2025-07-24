import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/model/empresa';
import { EmpresaService } from 'src/app/service/empresa.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { PuestoService } from 'src/app/service/puesto.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioEmpresa } from 'src/app/model/usuario-empresa';
import { UsuarioMarca } from 'src/app/model/usuario-marca';
import { UsuarioRegion } from 'src/app/model/usuario-region';
import {Message} from 'primeng/api';

@Component({
  selector: 'app-usuario-marcas',
  templateUrl: './usuario-marcas.component.html',
  styleUrls: ['./usuario-marcas.component.scss']
})
export class UsuarioMarcasComponent implements OnInit {

  empresas:Empresa[];
  usuario:Usuario;
  usuarioSession:Usuario;
  usuarioEmpresas:UsuarioEmpresa[];
  usuarioMarcas:UsuarioMarca[];
  usuarioRegiones:UsuarioRegion[];
  msgs: Message[] = [];


  selectedUsuarioEmpresa:UsuarioEmpresa;
  selectedUsuarioMarca:UsuarioMarca;
  selectedUsuarioRegion:UsuarioRegion;

  constructor( public empresaService:EmpresaService ,   public puestoService:PuestoService ,  public usuariosService:UsuariosService ,   public config: DynamicDialogConfig , public ref: DynamicDialogRef ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
     this.getUsuarioByOID(  this.config.data.usuarioOID , this.usuarioSession.usuarioOID  );
     this.getEmpUsuarioNoTodasMarcas(this.config.data.usuarioOID , this.usuarioSession.usuarioOID );
  }



  public getUsuarioByOID ( usuarioOID : string , usuarioConsultaOID: string ){
    this.usuariosService.getUsuarioByOID ( usuarioOID , usuarioConsultaOID ).subscribe(
      (data)=>{
        this.usuario =data;
     }
    );

  }


  public getEmpUsuarioNoTodasMarcas(userOID : string , usuarioConsultaOID :string ){


    this.usuariosService.getEmpUsuarioNoTodasMarcas(  userOID , usuarioConsultaOID   ) .subscribe(
      (data)=>{
         this.usuarioEmpresas=data;
        // this.initFlags();
      }
     );

  }



  public empresaChanged(){
      this.getUsuarioMarcasByEmpresa();
  }


  public getUsuarioMarcasByEmpresa( ){

    if(this.selectedUsuarioEmpresa==null  ){
       return;
    }

    this.usuariosService.getUsuarioMarcasByEmpresa(   this.usuario.usuarioOID  ,  this.selectedUsuarioEmpresa.empresaId  , this.usuarioSession.usuarioOID  ) .subscribe(
      (data)=>{
         this.usuarioMarcas=data;
        // this.initFlags();
      }
     );

  }






  public getUsuarioRegionesByMarca( marcaId: number ){

    if(this.selectedUsuarioEmpresa==null  ){
       return;
    }


    this.usuariosService.getUsuarioRegionesByMarca(   this.usuario.usuarioOID  ,  marcaId , this.usuarioSession.usuarioOID ) .subscribe(
      (data)=>{
         this.usuarioRegiones=data;

         if( this.selectedUsuarioMarca!=null && this.selectedUsuarioMarca.marcaId==marcaId ){
            if( this.selectedUsuarioMarca.flagTodo ){
              this.setEditRegiones( false   );
            }else{
              this.setEditRegiones( true  );
            }

         }

      }
     );

  }



  public marcaChanged(){

    if( this.selectedUsuarioMarca==null || this.selectedUsuarioMarca.marcaId<=0 ){
       this.usuarioRegiones=[];
       return;
    }


    if(  !this.selectedUsuarioMarca.flagSeleccionada ){

      this.usuarioRegiones=[];
      return;
    }

    this.configRegiones(this.selectedUsuarioMarca.marcaId);


  }



 public configRegiones(marcaId:number){
      this.getUsuarioRegionesByMarca( this.selectedUsuarioMarca.marcaId  );
 }




  public marcaSwitchChange(event,um:UsuarioMarca){
      this.selectedUsuarioMarca=um;
      if( um.flagSeleccionada ){
        this.configRegiones(um.marcaId);
      }else{
        this.usuarioRegiones=[];
      }

      this.guardarUsuarioMarcas();


  }


  public marcaSwitchTodoChange(event,um:UsuarioMarca){
    this.selectedUsuarioMarca=um;
    if( um.flagTodo ){
        this.setEditRegiones( false );
    }else{
      this.setEditRegiones( true );
      // this.usuarioRegiones=[];
    }


}


public regionSwitchChange(event,ur:UsuarioRegion ) {
   this.guardarUsuarioRegiones();
}


public guardarUsuarioRegiones(  ){

  var ur:UsuarioRegion;
  var regionesConcat:string=null;

  if( this.usuarioRegiones!=null && this.usuarioRegiones.length>0  ){

     for( var i=0;i< this.usuarioRegiones.length; i++  ){
         ur=this.usuarioRegiones[i];
         if(ur==null){
           continue;
         }

         if( !ur.flagSeleccionada ){
            continue;
         }



      if( regionesConcat==null ){
        regionesConcat= "" + ur.regionId ;
      }else{
        regionesConcat+= "|" +  ur.regionId ;
      }


     }
  }


  ur=new UsuarioRegion();
  ur.usuarioOID=this.usuario.usuarioOID;
  ur.regionesConcatenadas= regionesConcat;
  ur.marcaId= this.selectedUsuarioMarca.marcaId;
  ur.usuarioCreated=this.usuarioSession.usuarioOID;

  alert( ur.regionesConcatenadas );
  this.usuariosService.guardarUsuarioRegiones( ur , this.usuarioSession.usuarioOID).subscribe(
     (data)=>{

     }
  );





}






public setEditRegiones( flag:boolean ){
   if( this.usuarioRegiones==null || this.usuarioRegiones.length<=0 ){
     return;
   }

   var ur:UsuarioRegion;
   for( var i=0; i< this.usuarioRegiones.length; i++   ){
        ur=this.usuarioRegiones[i];
        if(  flag ){
           ur.flagEditable=true;
        }else{
          ur.flagEditable=false;
          ur.flagSeleccionada=true;
        }


   }


}





public guardarUsuarioMarcas(){

  if( this.usuarioMarcas==null   ){
    return;
  }

  var um:UsuarioMarca;
  var marcasConcat:string=null;
  var todasRegiones:number;
  if( this.usuarioMarcas!=null && this.usuarioMarcas.length>0  ){

     for( var i=0;i< this.usuarioMarcas.length; i++  ){
         um=this.usuarioMarcas[i];
         if(um==null){
           continue;
         }

         if( !um.flagSeleccionada ){
            continue;
         }

         todasRegiones=0;
         if( um.flagTodo ){
               todasRegiones=1;
         }


      if( marcasConcat==null ){
        marcasConcat= um.marcaId + "@" + todasRegiones;
      }else{
        marcasConcat+= "|" +  um.marcaId + "@" + todasRegiones;
      }


     }
  }


  um=new UsuarioMarca();
  um.usuarioOID=this.usuario.usuarioOID;
  um.marcasConcat= marcasConcat;
  um.empresaId=this.selectedUsuarioEmpresa.empresaId;
  um.usuarioCreated=this.usuarioSession.usuarioOID;


  alert( um.marcasConcat );
  this.usuariosService.guardarUsuarioMarcas(  um , this.usuarioSession.usuarioOID).subscribe(
    (data)=>{
       // alert("se guardo usuario marca");
    }

  );




}



  public cancelar(){
    this.ref.close();
  }






}
