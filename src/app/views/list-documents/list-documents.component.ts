import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/service/document.service';
import { Documento } from 'src/app/model/documento'
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import {DocumentComponent } from 'src/app/views/document/document.component';
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router";
import { Usuario } from 'src/app/model/usuario';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListDocumentsComponent implements OnInit {
  @ViewChild('cmDocumentos') cmDocumentos: ContextMenu;
  itemsDocumento: MenuItem[];
  documentos:Documento[];
  selectedDocumento:Documento;
  designing:boolean;
  usuarioSession:Usuario;
  usuarioOID :string;

  constructor(public documentService: DocumentService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService ,   public router: Router  ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID=this.usuarioSession.usuarioOID;
     this.designing=false;
     this.getAllDocumentsActives();

     this.itemsDocumento = [
      {
        label: 'Editar Documento',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.modificarDocumento();
        },
      },
      { separator: true },
      {
        label: 'Eliminar Documento',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteDocumento();
        },
      },
      { separator: true },
      {
        label: 'Diseñar Documento',
        icon: 'pi pi-file',
        command: (event) => {
          this.designDocumento();
        },
      },
    ];
  }



  public getAllDocumentsActives(){
    this.documentService.getAllActives(this.usuarioOID).subscribe(
      (data)=>{
         this.documentos=data;
      }
     );

  }


  public agregarDocumento(){

    let ref= this.dialogService.open( DocumentComponent , {
        header: 'Documento',
        width: '90%',
        contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
        data: { documentoId:0  }
    });

    ref.onClose.subscribe((doc: Documento ) => {
      if (doc!=null  ) {
        this.getAllDocumentsActives();
      }
    });



  }


  public documentoChanged(){

  }


  public designDocumento(){
     //this.router.navigate(["/displayDocument/" + this.selectedDocumento.documentoId   ]);
     this.designing=true;
  }


  public backToDocumentList(){
     this.designing=false;
  }



  public modificarDocumento(){
    if( this.selectedDocumento==null   ){
        return;
    }

    let ref= this.dialogService.open( DocumentComponent , {
      header: 'Documento',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { documentoId: this.selectedDocumento.documentoId  }
  });


  ref.onClose.subscribe((doc: Documento ) => {

    if (doc!=null  ) {
      this.getAllDocumentsActives();
    }
  });


  }


  public onClickMenuDocumento(documento:Documento){

  }

  onRightClick(event: MouseEvent, documento: any) {
    this.selectedDocumento = documento; // Establece la fila seleccionada en la fila sobre la cual se hizo clic derecho.
    this.cmDocumentos.show(event);   // Muestra el menú contextual.
    event.preventDefault();          // Evita que el menú contextual predeterminado del navegador se muestre.
    event.stopPropagation();         // Detiene la propagación del evento para no afectar otros elementos.
  }




  public eliminarDocumento() {
    if( this.selectedDocumento==null  ){
      return;
    }

    this.documentService.deleteDocumento( this.selectedDocumento.documentoId , this.usuarioOID).subscribe((data)=>{
        var result=data;
        if(  result='0'  ){
           this.getAllDocumentsActives();
        }


    });
  }


  public confirmDeleteDocumento() {
    this.confirmationService.confirm({
        message: 'Está seguro que desea eliminar el documento ?',
        accept: () => {
           this.eliminarDocumento();
        }
    });
  }




}
