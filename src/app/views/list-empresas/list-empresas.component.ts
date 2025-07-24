import {Component, OnInit, ViewChild} from '@angular/core';
import { Empresa } from 'src/app/model/empresa';
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import { EmpresaService } from 'src/app/service/empresa.service';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaComponent } from 'src/app/views/empresa/empresa.component';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-list-empresas',
  templateUrl: './list-empresas.component.html',
  styleUrls: ['./list-empresas.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListEmpresasComponent implements OnInit {
@ViewChild('cmEmpresa') cmEmpresa: ContextMenu;
  itemsEmpresa: MenuItem[];
  empresas:Empresa[];
  selectedEmpresa: Empresa;
  usuario:Usuario;
  usuarioOID :string;
  tituloEmpresa: string;

  constructor( public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService   ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.tituloEmpresa = this.usuario.infoHuesped.nbEmpresa;
    this.getEmpresasByUsuarioOID();

    this.itemsEmpresa = [
      {
        label: `Editar ${this.tituloEmpresa}`,
        icon: 'pi pi-pencil',
        command: (event) => {
          this.modificarEmpresa();
        },
      },
      { separator: true },
      {
        label: `Eliminar ${this.tituloEmpresa}`,
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
    this.empresaService.getByUsuarioOID(  this.usuario.usuarioOID ) .subscribe(
      (data)=>{
         this.empresas=data;
      }
     );

  }


  public agregarEmpresa(){

    let ref= this.dialogService.open( EmpresaComponent , {
      header: this.tituloEmpresa,
      width: '90%',
      contentStyle: {"max-height": "550px" , "height" : "500px"  } ,
      data: { empresaId:0  }
  });

  ref.onClose.subscribe(( emp : Empresa  ) => {
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
    header: this.tituloEmpresa,
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

  onRightClick(event: MouseEvent, empresa: any) {
    this.selectedEmpresa = empresa; // Establece la fila seleccionada en la fila sobre la cual se hizo clic derecho.
    this.cmEmpresa.show(event);   // Muestra el menú contextual.
    event.preventDefault();          // Evita que el menú contextual predeterminado del navegador se muestre.
    event.stopPropagation();         // Detiene la propagación del evento para no afectar otros elementos.
  }


  public confirmDeleteEmpresa(){

    this.confirmationService.confirm({
      message: `Está seguro que desea eliminar ${this.tituloEmpresa} ?`,
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

    this.empresaService.eliminaEmpresa( this.selectedEmpresa, this.usuarioOID ).subscribe((data)=>{
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
