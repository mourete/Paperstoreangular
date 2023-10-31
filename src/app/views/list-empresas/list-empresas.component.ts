import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/model/empresa';
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import { EmpresaService } from 'src/app/service/empresa.service';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaComponent } from 'src/app/views/empresa/empresa.component';

@Component({
  selector: 'app-list-empresas',
  templateUrl: './list-empresas.component.html',
  styleUrls: ['./list-empresas.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListEmpresasComponent implements OnInit {

  itemsEmpresa: MenuItem[];
  empresas:Empresa[];
  selectedEmpresa: Empresa;
  usuario:Usuario;

  constructor( public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService   ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.getEmpresasByUsuarioOID();

    this.itemsEmpresa = [
      {
        label: 'Editar Lista',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.modificarEmpresa();
        },
      },
      { separator: true },
      {
        label: 'Eliminar Lista',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteEmpresa();
        },
      },
      { separator: true },
    ];
  }




  public getEmpresasByUsuarioOID(){
    if( this.usuario==null ){
      return;
    }
    console.log(this.usuario.usuarioOID);
    this.empresaService.getByUsuarioOID(  this.usuario.usuarioOID ) .subscribe(
      (data)=>{
         console.log( data );
         this.empresas=data;
      }
     );

  }


  public agregarEmpresa(){

    let ref= this.dialogService.open( EmpresaComponent , {
      header: 'Empresa',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { empresaId:0  }
  });

  ref.onClose.subscribe(( emp : Empresa  ) => {
    console.log("Entro aqui 2");
    if (emp!=null  ) {

        this.getEmpresasByUsuarioOID();
    }
  });



  }



  public modificarEmpresa(){

  if( this.selectedEmpresa ==null   ){
      return;
  }

  let ref= this.dialogService.open( EmpresaComponent , {
    header: 'Empresa',
    width: '70%',
    contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
    data: { empresaId: this.selectedEmpresa.empresaId  }
  });


  ref.onClose.subscribe(( emp : Empresa  ) => {
    if (emp!=null  ) {

        this.getEmpresasByUsuarioOID();
    }
  });


  }


  public confirmDeleteEmpresa(){

    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la Empresa ?',
      accept: () => {
         this.deleteEmpresa();
      }
  });

  }


  public deleteEmpresa() {
    if( this.selectedEmpresa==null  ){
      return;
    }

    this.selectedEmpresa.usuarioOID = this.usuario.usuarioOID ;

    this.empresaService.eliminaEmpresa( this.selectedEmpresa ).subscribe((data)=>{
      //  this.getMarcasByUsuarioOID();
      this.getEmpresasByUsuarioOID();
        this.selectedEmpresa=null ;

    });
  }



  public onClickMenuEmpresa(empresa:Empresa ){

  }



   public empresaChanged(){

   }





}
