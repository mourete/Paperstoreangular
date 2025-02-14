import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { DocumentoInstanciaService } from 'src/app/service/documento-instancia.service';
import { DocumentoInstancia } from 'src/app/model/documento-instancia'
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import {DocumentComponent } from 'src/app/views/document/document.component';
import { ActivatedRoute } from '@angular/router';
import { DocumentoInstanciaComponent } from '../documento-instancia/documento-instancia.component';
import { AppStore } from 'src/app/model/app-store';
import { Router } from "@angular/router";
import { SeccionService } from 'src/app/service/seccion.service';
import { Seccion } from 'src/app/model/seccion';
import { GlobalConstants } from 'src/app/model/global-constants';
import {PrincipalComponent } from 'src/app/views/principal/principal.component';
import { ListDocumentoUsuariosComponent } from '../list-documento-usuarios/list-documento-usuarios.component';
import { Usuario } from 'src/app/model/usuario';
import {ContextMenu} from "primeng/contextmenu";


@Component({
  selector: 'app-list-documento-instancias',
  templateUrl: './list-documento-instancias.component.html',
  styleUrls: ['./list-documento-instancias.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListDocumentoInstanciasComponent implements OnInit {
  @ViewChild('cmDocumentos') cmDocumentos: ContextMenu;
  itemsDocumento: MenuItem[];
  documentos:DocumentoInstancia[];
  selectedDocumento:DocumentoInstancia;
  usuario : Usuario;
  documentoId : number;
  proyectoId:number;
  regionId:number;
  sucursalId:number;
  usuarioOID:string;
  readOnly:string;
  documento:string;
  sucursal:string;
  region:string;
  alerta:string;
  proyecto:string;
  tipoAlerta:number;
  image:string;
  marcaName : string;
  empresaName : string;
  //apiURLImagen :string;
  numDocumentos:number;
  numInstancias:number;
  currDocumentoInstanciaOID:string;
  currSeccionOID:string;
  currDocumentoId:number;
  currUsuarioOID:string;
  currReadOnly:string;
  currNombre: string;
  curtipoAlerta:number;
  currAlerta:string;
  currImage: string;
  desplegandoDocumento:boolean;
  tituloRegion: string;
  tituloMarca: string;
  tituloSucursal: string;

  //'instanciasAdmin/:documentoId/:proyectoId/:regionId/:sucursalId/:usuarioOID/:documento/:sucursal/:region/:numDocumentos/:numInstancias'+

  @Input() public varDocumentoId: number;
  @Input() public varProyectoId: number;
  @Input() public varProyecto: string;
  @Input() public varRegionId: number;
  @Input() public varSucursalId:number;
  @Input() public varUsuarioOID:string;
  @Input() public varDocumento:string;
  @Input() public varSucursal:string;
  @Input() public varRegion:string;
  @Input() public varProyecton:string;
  @Input() public varNumDocumentos:number;
  @Input() public varNumInstancias:number;
  @Input() public varEmpresa:string;
  @Input() public varMarca:string;
  @Input() public varTipoAlerta:number;
  @Input() public varAlerta:string;
  @Input() public varImage:string;


  constructor(public principal : PrincipalComponent,  public documentoInstanciaService: DocumentoInstanciaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService    ,     private actRoute: ActivatedRoute , private router: Router , private seccionService : SeccionService  ) {

       this.documentoId=this.actRoute.snapshot.params.documentoId;
       this.proyectoId=this.actRoute.snapshot.params.proyectoId;
       this.sucursalId=this.actRoute.snapshot.params.sucursalId;
       this.regionId=this.actRoute.snapshot.params.regionId;
       this.usuarioOID=this.actRoute.snapshot.params.usuarioOID;
       this.documento=this.actRoute.snapshot.params.documento;
       this.sucursal=this.actRoute.snapshot.params.sucursal;
       this.region=this.actRoute.snapshot.params.region;
       this.proyecto=this.actRoute.snapshot.params.proyecto;
       this.numDocumentos= Number( this.actRoute.snapshot.params.numDocumentos );
       this.numInstancias= Number( this.actRoute.snapshot.params.numInstancias );
       this.desplegandoDocumento=false;

    }

  ngOnInit(): void {

    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.tituloMarca = this.usuario.infoHuesped.nbMarca;
    this.tituloRegion = this.usuario.infoHuesped.nbEmpresa;
    this.tituloSucursal = this.usuario.infoHuesped.nbSucursal;
 
    this.image = this.usuario.infoHuesped.pathImagenWeb;
    this. itemsDocumento = [
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
      {
        label: 'Contestar Instancia',
        icon: 'pi pi-file',
        command: (event) => {
          this.clickEditarDocInstancia();
        },
      },
      { separator: true },
    ];

    if( this.documentoId == undefined || this.documentoId<=0  ){

       this.documentoId=this.varDocumentoId;
       this.proyectoId=this.varProyectoId;
       this.proyecto=this.varProyecto;
       this.sucursalId=this.varSucursalId;
       this.regionId=this.varRegionId;
       this.usuarioOID=this.varUsuarioOID;
       this.documento=this.varDocumento;
       this.sucursal=this.varSucursal;
       this.region=this.varRegion;
       this.numDocumentos= this.varNumDocumentos;
       this.numInstancias= this.varNumInstancias;
       this.marcaName =  this.varMarca;
       this.empresaName = this.varEmpresa;
       this.alerta = this.varAlerta;
       this.tipoAlerta = this.varTipoAlerta;
       this.image = this.varImage;
      // this.apiURLImagen =   GlobalConstants.apiURLImage;
    }


    this.getByDocIdSucProyReg();
    /*
    localStorage.setItem( GlobalConstants.CURRENT_DOCUMENTO_ID   ,  String( this.documentoId)  );
    localStorage.setItem( GlobalConstants.CURRENT_PROYECTO_ID    ,  S   )
     */


  }


  public backToInstanciasList(){

    this.desplegandoDocumento = !this.desplegandoDocumento;

    this.getByDocIdSucProyReg();

  }

  public backToDocumentList(){

    // console.log("Hola");

    //var currentTemplate="instancias";

    // console.log("Hola aqui ando");

    this.principal.setCurrentComponent(ListDocumentoUsuariosComponent);




  }

  public getByDocIdSucProyReg(){

    this.documentoInstanciaService.getByDocIdSucProyReg(this.documentoId, this.sucursalId , this.proyectoId , this.regionId, this.usuarioOID  ).subscribe(
      (data)=>{
         console.log( data );
         this.documentos=data;
   
    
     //Si la cantidad de docuemento instancia es igual a 1, redireccionamos el documento a la ventana de instancia
     //if(this.varNumDocumentos == 1){
     //     this.getIrInstancia();

     //}
    }
  );
  }

  /*public getIrInstancia(){
    
    if(this.documentos == null){
      this.guadarDocumentoInstancia();
    }
    else{
     
      console.log(this.documentos[0]);
      this.selectedDocumento = this.documentos[0];
      this.clickEditarDocInstancia();
    }
  }*/
  public eliminarDocumento(   ){

    this.documentoInstanciaService.eliminarDocumentoInstancia ( this.selectedDocumento, this.usuarioOID ).subscribe((data)=>{

      var instanciaDelete:String=data;


  });
  this.documentos.splice(this.documentos.indexOf(this.selectedDocumento),1);

}

/*public guadarDocumentoInstancia(){
  var doc: DocumentoInstancia;
  var docInst : string;
  if(this.selectedDocumento == null) { 
    console.log("selectedDocumento" + this.selectedDocumento )
        doc = new DocumentoInstancia();
        doc.nombre = this.proyecto + "-" + this.sucursal;
        doc.observaciones= this.proyecto + "-" + this.sucursal;
        doc.alerta = '-1' ;
        doc.tipoAlerta= -1; 
        doc.imagePath='';
        doc.documentoId=this.documentoId;
        doc.regionId =  this.regionId;
        doc.proyectoId =  this.proyectoId;
        doc.sucursalId = this.sucursalId;
        doc.usuarioOID = this.usuarioOID;
        

  }
 
  this.documentoInstanciaService.guardarDocumentoInstancia ( doc, this.usuarioOID).subscribe((data)=>{
    console.log("data" )
    console.log( data );
    this.selectedDocumento=data;
    docInst = this.selectedDocumento.documentoInstanciaOID
//if (docInst != null  ) {
  console.log("entre datos de primera seccion");
  console.log(docInst);
  //if( this.selectedDocumento!=null && this.selectedDocumento.documentoInstanciaOID!=null ){
    console.log("entre datos de primera seccion2");
     this.seccionService.getPrimeraSeccion( this.documentoId , this.usuarioOID).subscribe(

       (data)=>{

       

         console.log( data );

         var  seccion:Seccion=data;
         console.log(this.selectedDocumento.documentoInstanciaOID );
         console.log( "seccion.seccionOID ");
         console.log( seccion.seccionOID );
         console.log( "this.documentoId" );
         console.log( this.documentoId );
         console.log( "this.usuarioOID");
         console.log( this.usuarioOID);
         console.log( "this.currReadOnly,");
         console.log( this.currReadOnly,);
         console.log( "this.selectedDocumento.nombre");
         console.log( this.selectedDocumento.nombre);
         console.log("this.selectedDocumento.alerta");
         console.log(this.selectedDocumento.alerta);
         console.log("this.selectedDocumento.tipoAlerta");
         console.log(this.selectedDocumento.tipoAlerta);
         console.log(" this.selectedDocumento.imagePath" );
         console.log( this.selectedDocumento.imagePath );

         if( seccion!=null ){
           //var url:string="displayDocumentInstancia/"+ this.documentoId  + "/"+ doc.documentoInstanciaOID  +"/"+ seccion.seccionOID + "/" + this.usuarioOID ;

         
           this.displayDocumentoInstancia( this.selectedDocumento.documentoInstanciaOID , seccion.seccionOID , this.documentoId , this.usuarioOID , this.currReadOnly,   this.selectedDocumento.nombre,this.selectedDocumento.alerta,this.selectedDocumento.tipoAlerta, this.selectedDocumento.imagePath );

         }

      })
  });
  


//}
 //     }

}*/
  public agregarDocumentoInstancia(){

    

    //alert("Region:" + this.regionId )
    let ref= this.dialogService.open( DocumentoInstanciaComponent , {
        header: 'Documento',
        width: '90%',
        contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
        data: { documentoId:this.documentoId ,
                usuarioOID : this.usuarioOID ,
                proyectoId : this.proyectoId ,
                proyecto: this.proyecto ,
                regionId : this.regionId ,
                sucursalId : this.sucursalId,
                alerta:this.alerta,
                tipoAlerta : this.tipoAlerta,
                image : this.image,
                update : 0  }
    });


    ref.onClose.subscribe((doc: DocumentoInstancia ) => {



      if (doc!=null  ) {

         if( doc!=null && doc.documentoInstanciaOID!=null ){
            this.seccionService.getPrimeraSeccion( this.documentoId , this.usuarioOID).subscribe(

              (data)=>{

                // console.log("entre datos de primera seccion");

                console.log( data );

                var  seccion:Seccion=data;

                if( seccion!=null ){
                  //var url:string="displayDocumentInstancia/"+ this.documentoId  + "/"+ doc.documentoInstanciaOID  +"/"+ seccion.seccionOID + "/" + this.usuarioOID ;

                  this.displayDocumentoInstancia( doc.documentoInstanciaOID , seccion.seccionOID , this.documentoId , this.usuarioOID , this.currReadOnly, doc.nombre,doc.alerta,doc.tipoAlerta, doc.imagePath );

                }

             }


            );

         }

      }
    });



  }



 public clickEditarDocInstancia(){
    if( this.selectedDocumento==null ){
      return;
    }

    this.seccionService.getPrimeraSeccion(this.documentoId, this.usuarioOID  ).subscribe(
      (data)=>{
         console.log( data );
         let secTmp=data;
         if( secTmp==null ){
           return;
         }

         this.displayDocumentoInstancia( this.selectedDocumento.documentoInstanciaOID , secTmp.seccionOID , this.documentoId , this.usuarioOID, this.readOnly   , this.selectedDocumento.nombre, this.selectedDocumento.alerta, this.selectedDocumento.tipoAlerta, this.selectedDocumento.imagePath);
      }
     );




  }


  /**
   * displayDocumentoInstancia
   */
  public displayDocumentoInstancia(docInstOID:string,secOID:string,docId:number,usrOID:string,usrReadOnly:string, nombreCurr:string, alerta:string, tipoAlerta:number, imagePath:string) {
    this.desplegandoDocumento=true;
    this.currDocumentoInstanciaOID=docInstOID;
    this.currSeccionOID=secOID;
    this.currDocumentoId=docId;
    this.currUsuarioOID=usrOID;
    this.currReadOnly=usrReadOnly;
    this.currNombre =   nombreCurr;
    this.currAlerta=alerta;
    this.curtipoAlerta=tipoAlerta;
    this.currImage =   imagePath;
    
  }


  public modificarDocumento(){


    if( this.selectedDocumento==null   ){
        return;
    }

     let ref= this.dialogService.open( DocumentoInstanciaComponent , {
      header: 'Editar Documento',
      width: '90%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { documento: this.selectedDocumento, update : 1   }
  });


  ref.onClose.subscribe(( ) => {
   //if (emp!=null  ) {

        this.getByDocIdSucProyReg();
    //}
  });


  }


  public documentoChanged(){

  }

  onRightClick(event: MouseEvent, documentos: any) {
    this.selectedDocumento = documentos; // Establece la fila seleccionada en la fila sobre la cual se hizo clic derecho.
    this.cmDocumentos.show(event);   // Muestra el menú contextual.
    event.preventDefault();          // Evita que el menú contextual predeterminado del navegador se muestre.
    event.stopPropagation();         // Detiene la propagación del evento para no afectar otros elementos.
  }



  public confirmDeleteDocumento() {

    this.confirmationService.confirm({
        message: 'Está seguro que desea eliminar el documento ?',
        accept: () => {
           this.eliminarDocumento();
        }
    });
  }


  public onClickMenuDocumento(documentoInstancia:DocumentoInstancia){

  }












}
