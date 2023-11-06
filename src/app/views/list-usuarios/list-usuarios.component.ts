import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import { UsuariosService } from 'src/app/service/usuarios.service';
import { UsuarioComponent } from 'src/app/views/usuario/usuario.component';
import { UsuarioMarcasComponent } from '../usuario-marcas/usuario-marcas.component';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListUsuariosComponent implements OnInit {

  itemsUsuario: MenuItem[];
  usuarios:Usuario[];
  selectedUsuario:Usuario;
  usuarioSession:Usuario;

  constructor( public usuariosService: UsuariosService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService  ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));

    this.getUsuariosByUsuarioConsulta();

  }



  public getUsuariosByUsuarioConsulta(){
    if( this.usuarioSession==null ){
      return;
    }
    this.usuariosService.getUsuariosByUsuarioConsulta(this.usuarioSession.usuarioOID,this.usuarioSession.usuarioOID,) .subscribe(
      (data)=>{
         console.log( data );
         this.usuarios=data;
      }
     );

  }




  public agregarUsuario(){

    let ref= this.dialogService.open( UsuarioComponent , {
      header: 'Usuario',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { usuarioId:null  }
  });

  ref.onClose.subscribe(( usr : Usuario  ) => {
    if (usr!=null  ) {

    }
  });



  }


  public modificarUsuario(){
    if( this.selectedUsuario==null   ){
        return;
    }

    let ref= this.dialogService.open( UsuarioComponent , {
      header: 'Usuario',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { usuarioOID : this.selectedUsuario.usuarioOID  }
  });


  ref.onClose.subscribe((  ) => {
    // console.log("Entro aqui 2");
   // if (emp!=null  ) {

      this.getUsuariosByUsuarioConsulta();
   // }
  });

  }




  public configurarMarcas(){
    if( this.selectedUsuario==null   ){
        return;
    }

    let ref= this.dialogService.open( UsuarioMarcasComponent , {
      header: 'Usuario',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { usuarioOID : this.selectedUsuario.usuarioOID  }
  });

  }



public confirmDeleteUsuario(){

}


public usuarioChanged(){

}


public onClickMenuUsuario(usr:Usuario){

}




}
