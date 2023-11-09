import { Component, OnInit, ViewChild } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import { EmpresaService } from 'src/app/service/empresa.service';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Usuario } from 'src/app/model/usuario';
import { MarcaService } from 'src/app/service/marca.service';
import { MarcaComponent } from '../marca/marca.component';
import { ContextMenu } from 'primeng/contextmenu';


@Component({
  selector: 'app-list-marcas',
  templateUrl: './list-marcas.component.html',
  styleUrls: ['./list-marcas.component.scss'] ,
  providers: [DialogService, ConfirmationService]
})
export class ListMarcasComponent implements OnInit {
  @ViewChild('cmMarcas') cmMarcas: ContextMenu;
  usuarioSession:Usuario;
  marcas:Marca[];
  selectedMarca:Marca;
  empresas:Empresa[];
  itemsMarca: MenuItem[];
  usuarioOID:string;

  constructor( public marcaService:MarcaService ,  public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService  ) { }

    ngOnInit(): void {
      this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
      this.usuarioOID = this.usuarioSession.usuarioOID;
      this.getMarcasByUsuarioOID();

      this.itemsMarca = [
        {
          label: 'Editar Marca',
          icon: 'pi pi-pencil',
          command: (event) => {
            this.modificarMarca();
          },
        },
        { separator: true },
        {
          label: 'Eliminar Marca',
          icon: 'pi pi-trash',
          command: (event) => {
            this.confirmDeleteMarca();
          },
        },
        { separator: true },
      ];
    }



    public getMarcasByUsuarioOID(){
      if( this.usuarioSession==null ){
        return;
      }
      this.marcaService.getByUsuarioOID (  this.usuarioSession.usuarioOID ) .subscribe(
        (data)=>{
           console.log( data );
           this.marcas=data;
        }
       );

    }






    public agregarMarca(){

      let ref= this.dialogService.open( MarcaComponent , {
        header: 'Marca',
        width: '70%',
        contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
        data: { marcaId:0  }
    });

    ref.onClose.subscribe(( usr : Usuario  ) => {
      this.getMarcasByUsuarioOID();

      if (usr!=null  ) {

      }
    });



    }


    public modificarMarca(){
      if( this.selectedMarca==null   ){
          return;
      }

      let ref= this.dialogService.open( MarcaComponent , {
        header: 'Marca',
        width: '70%',
        contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
        data: { marcaId : this.selectedMarca.marcaId  }
    });

    ref.onClose.subscribe(( usr : Usuario  ) => {
      this.getMarcasByUsuarioOID();

      if (usr!=null  ) {

      }
    });

    }

  onRightClick(event: MouseEvent, marca: any) {
    this.selectedMarca = marca; // Establece la fila seleccionada en la fila sobre la cual se hizo clic derecho.
    this.cmMarcas.show(event);   // Muestra el menú contextual.
    event.preventDefault();          // Evita que el menú contextual predeterminado del navegador se muestre.
    event.stopPropagation();         // Detiene la propagación del evento para no afectar otros elementos.
  }




  public confirmDeleteMarca(){
    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la Marca ?',
      accept: () => {
         this.deleteMarca();
      }
  });

  }


  public deleteMarca() {
    if( this.selectedMarca==null  ){
      return;
    }

    this.selectedMarca.usuarioOID = this.usuarioSession.usuarioOID ;

    this.marcaService.eliminarMarca( this.selectedMarca, this.usuarioOID ).subscribe((data)=>{
        this.getMarcasByUsuarioOID();
        this.selectedMarca=null ;

    });
  }


  public marcaChanged(){

  }


  public onClickMenuMarca(marca:Marca){

  }




}
