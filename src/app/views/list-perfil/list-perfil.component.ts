import {Component, OnInit, ViewChild} from '@angular/core';
import { Perfil } from './../../model/perfil';
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import {PerfilService } from 'src/app/service/perfil.service';
import { Usuario } from 'src/app/model/usuario';
import { PerfilComponent } from 'src/app/views/perfil/perfil.component';
import { ContextMenu } from 'primeng/contextmenu';


@Component({
  selector: 'app-perfil',
  templateUrl: './list-perfil.component.html',
  styleUrls: ['./list-perfil.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListPerfilComponent implements OnInit {
@ViewChild('cmPerfil') cmPerfil: ContextMenu;
  itemsPerfil: MenuItem[];
  perfil:Perfil[];
  selectedPerfil: Perfil;
  usuario:Usuario;
  usuarioOID :string;

  constructor( public perfilService: PerfilService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService   ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.getModuloPerfilJson();

    this.itemsPerfil = [
      {
        label: 'Editar Lista',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.modificarPerfil();
        },
      },
      { separator: true },
      {
        label: 'Eliminar Lista',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeletePerfil();
        },
      },
      { separator: true },
    ];
  }




  public getModuloPerfilJson(){
    if( this.usuario==null ){
      return;
    }
    console.log(this.usuario.usuarioOID);
    //this.perfilService.getPerfiles(  this.usuario.usuarioOID ) .subscribe(
      (data)=>{
         console.log( data );
         this.perfil=data;
      }
     //);

  }


  public agregarPerfil(){

    let ref= this.dialogService.open( ListPerfilComponent , {
      header: 'Perfil',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { empresaId:0  }
  });

  ref.onClose.subscribe(( emp : Perfil  ) => {
    // console.log("Entro aqui 2");
    if (emp!=null  ) {

        this.getModuloPerfilJson();
    }
  });



  }



  public modificarPerfil(){

  if( this.selectedPerfil ==null   ){
      return;
  }

  let ref= this.dialogService.open( PerfilComponent , {
    header: 'Perfil',
    width: '70%',
    contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
    data: { empresaId: this.selectedPerfil.perfilId  }
  });


  ref.onClose.subscribe(( emp : Perfil  ) => {
    if (emp!=null  ) {

        this.getModuloPerfilJson();
    }
  });


  }

  onRightClick(event: MouseEvent, empresa: any) {
    this.selectedPerfil = empresa; // Establece la fila seleccionada en la fila sobre la cual se hizo clic derecho.
    this.cmPerfil.show(event);   // Muestra el menú contextual.
    event.preventDefault();          // Evita que el menú contextual predeterminado del navegador se muestre.
    event.stopPropagation();         // Detiene la propagación del evento para no afectar otros elementos.
  }


  public confirmDeletePerfil(){

    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la Empresa ?',
      accept: () => {
         this.deletePerfil();
      }
  });

  }


  public deletePerfil() {
    if( this.selectedPerfil==null  ){
      return;
    }

    this.selectedPerfil.usuarioOID = this.usuario.usuarioOID ;

    this.perfilService.eliminaPerfil( this.selectedPerfil, this.usuarioOID ).subscribe((data)=>{
      //  this.getMarcasByUsuarioOID();
      this.getModuloPerfilJson();
        this.selectedPerfil=null ;

    });
  }



  public onClickMenuPerfil(perfil:Perfil ){

  }



   public perfilChanged(){

   }





}
