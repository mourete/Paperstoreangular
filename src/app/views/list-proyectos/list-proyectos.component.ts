import {Component, OnInit, ViewChild} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Proyecto } from 'src/app/model/proyecto';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { ProyectoComponent } from '../proyecto/proyecto.component';
import {ContextMenu} from "primeng/contextmenu";

@Component({
  selector: 'app-list-proyectos',
  templateUrl: './list-proyectos.component.html',
  styleUrls: ['./list-proyectos.component.scss'] ,
  providers: [DialogService, ConfirmationService]
})
export class ListProyectosComponent implements OnInit {
  @ViewChild('cmProyectos') cmProyectos: ContextMenu;
   usuarioSession:Usuario;
   proyectos:Proyecto[];
   selectedProyecto:Proyecto;
   itemsProyecto: MenuItem[];
   empresas:Empresa[];
   marcas:Marca[];

  usuarioOID:string;

  selectedEmpresa:Empresa;
  selectedMarca:Marca;


  constructor( public marcaService:MarcaService ,  public proyectoService:ProyectoService ,  public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID=this.usuarioSession.usuarioOID;
    this.getEmpresasByUsuarioOID();

    this.itemsProyecto = [
      {
        label: 'Editar Proyecto',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.modificarProyecto();
        },
      },
      { separator: true },
      {
        label: 'Eliminar Proyecto',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteProyecto();
        },
      },
      { separator: true },
    ];
  }

  onRightClick(event: MouseEvent, proyectos: any) {
    this.selectedProyecto =proyectos; // Establece la fila seleccionada en la fila sobre la cual se hizo clic derecho.
    this.cmProyectos.show(event);   // Muestra el menú contextual.
    event.preventDefault();          // Evita que el menú contextual predeterminado del navegador se muestre.
    event.stopPropagation();         // Detiene la propagación del evento para no afectar otros elementos.
  }


  public confirmDeleteProyecto() {

    this.confirmationService.confirm({
        message: 'Está seguro que desea eliminar el proyecto ?',
        accept: () => {
           this.eliminarProyecto();
        }
    });
  }


  public eliminarProyecto(   ){
    if( this.selectedProyecto==null  ){
      return;
    }

    this.selectedProyecto.usuarioOID = this.usuarioSession.usuarioOID;

    this.proyectoService.eliminarProyecto ( this.selectedProyecto, this.usuarioOID ).subscribe((data)=>{

      this.getEmpresasByUsuarioOID();
      this.selectedProyecto=null ;



  });
  this.proyectos.splice(this.proyectos.indexOf(this.selectedProyecto),1);

}


  public getEmpresasByUsuarioOID(){
    this.empresaService.getByUsuarioOID( this.usuarioOID ).subscribe(
      (data)=>{

        //this.empresas[0] = new Empresa();

        this.empresas = new Array(data.length+1);
        this.empresas[0] = {activo:0, empresaId:0,nombre:"Todas", encargado:"",
        email:"",
        notificaciones:0,
          usuarioCreated:"",
          direccion:"",
        rfc:"",
        activa:"",
        clave:""};

        data.forEach((element, index) => {
          this.empresas[++index] = element;
        });
       // this.empresas=data;
        if( this.empresas!=null && this.empresas.length>0 ){
          this.selectedEmpresa=this.empresas[0];
          this.getMarcasByEmpresaYUsuario();
        }

     }
    );

  }



  public getProyectosByUsuarioOID(){
    if( this.usuarioSession==null ){
      return;
    }



    this.proyectoService.getByUsuario (  this.usuarioSession.usuarioOID ) .subscribe(
      (data)=>{
         this.proyectos=data;
      }
     );

  }



  public agregarProyecto(){

    let ref= this.dialogService.open( ProyectoComponent , {
      header: 'Proyecto',
      width: '70%',

      contentStyle: {"max-height": "550px" , "height" : "550px;"  } ,
      data: { proyectoId:0  }
  });

  ref.onClose.subscribe(( proy : Proyecto  ) => {
    if (proy!=null  ) {
      this.getEmpresasByUsuarioOID();
    }
  });



  }

  public modificarProyecto(){
    if( this.selectedProyecto==null   ){
        return;
    }

    let ref= this.dialogService.open( ProyectoComponent , {
      header: 'Proyecto',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "550px;"  } ,
      data: { proyectoId : this.selectedProyecto.proyectoId  }
  });

  ref.onClose.subscribe(( proy : Proyecto  ) => {
    if (proy!=null  ) {
      this.getEmpresasByUsuarioOID();
    }
  });


  }




  public onClickMenuProyecto(proyecto:Proyecto){

  }


  public proyectoChanged(){

  }


  public empresaChanged(){
    this.getMarcasByEmpresaYUsuario();
}

public marcaChanged(){
      this.getProyectosByEmpresaYMarca();
}



public getMarcasByEmpresaYUsuario(){
  if( this.usuarioSession==null  || this.selectedEmpresa==null  ){
    return;
  }

  this.marcaService.getMarcasByEmpresaYUsuario  (  this.usuarioSession.usuarioOID , this.selectedEmpresa.empresaId  ) .subscribe(
    (data)=>{

       //this.marcas=data;
        if(data != null )
        {
          this.marcas = new Array(data.length+1);
        }else
          this.marcas = new Array(1);

       this.marcas[0] = {  marcaId:0,
        nombre:"Todas",
        clave:"",
        empresaId:0,
        encargado:"",
        notificaciones:0,
        activo:0,
        numero:0,
        calle:"",
        colonia:"",
        entreCalle:"",
        cp:"",
        mail:"",
        ciudadId:0,
        estado:"",
        ciudad:"",
        empresa:"",
        usuarioCreated:"",
        usuarioUpdated:"",

        activoText:"",
        flagActivo:true};

        if(data != null )
       data.forEach((element, index) => {
        this.marcas[++index] = element;
       });


       if( this.marcas!=null && this.marcas.length>0 ){
         this.selectedMarca=this.marcas[0];
         this.getProyectosByEmpresaYMarca();
       }else{
         this.selectedMarca=null;
         this.getProyectosByEmpresaYMarca();
       }


    }
   );

}


public getProyectosByEmpresaYMarca(){

  this.proyectos=[];
  if(this.selectedEmpresa==null ){
    return;
  }

 var marcaTmpId:number;

 if( this.selectedMarca==null || this.selectedMarca.marcaId<=0 ){
    marcaTmpId=0;
 }else{
    marcaTmpId=this.selectedMarca.marcaId;
 }

 this.proyectoService.getByEmpresaYMarca   ( this.usuarioSession.usuarioOID  , this.selectedEmpresa.empresaId ,  marcaTmpId  ) .subscribe(
   (data)=>{
      this.proyectos=data;
   }
  );



}








}
