import {Component, Input, NgModule, OnInit} from '@angular/core';
import {Seccion} from 'src/app/model/seccion';
import {DocumentoInstancia} from 'src/app/model/documento-instancia';
import {DocumentoInstanciaService} from 'src/app/service/documento-instancia.service';
import {ActivatedRoute} from '@angular/router';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {SeccionInstancia} from 'src/app/model/seccion-instancia';
import {GlobalConstants} from 'src/app/model/global-constants';
import {DatePipe} from '@angular/common';
import {OpcionInstancia} from 'src/app/model/opcion-instancia';
import {ConceptoInstancia} from 'src/app/model/concepto-instancia';
import {SeccionService} from 'src/app/service/seccion.service';
import {SeccionInstanciaService} from 'src/app/service/seccion-instancia.service';
import {Usuario} from 'src/app/model/usuario';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms'; // Asegurarse de que FormsModule esté importado
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserModule} from '@angular/platform-browser';
import {FileUploadModule} from 'primeng/fileupload';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MultiSelectModule,
    FileUploadModule,
  ],
  declarations: [],
  bootstrap: [],
})
export class AppModule {
}


@Component({
  selector: 'app-display-document-instancia',
  templateUrl: './display-document-instancia.component.html',
  styleUrls: ['./display-document-instancia.component.scss'],
  styles: [`
    :host ::ng-deep button {
      margin-right: .25em;
    }

    :host ::ng-deep .ui-message,
    :host ::ng-deep .ui-inputtext {
      margin-right: .25em;
    }

    :host ::ng-deep .custom-message,
    :host ::ng-deep img {
      align-self: center;
      font-size: 16px;
      margin-left: .5em;
    }


    :host ::ng-deep .ui-messages ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      display: inline-block;
      vertical-align: middle;
      align-items: center;
    }


    :host ::ng-deep button {
      margin-right: .25em;
    }

    :host ::ng-deep .p-component-overlay-enter .pi.pi-lock {
      animation: enter 150ms forwards;
    }

    :host ::ng-deep .p-component-overlay-leave .pi.pi-lock {
      animation: leave 150ms forwards;
    }

    @keyframes enter {
      from {
        color: transparent;
      }
      to {
        color: var(--text-color);
      }
    }

    @keyframes leave {
      from {
        color: var(--text-color);
      }
      to {
        color: transparent;
      }
    }


  `],

  providers: [DialogService, ConfirmationService, MessageService, DatePipe]
})
export class DisplayDocumentInstanciaComponent implements OnInit {
  myVariable: any;
  readOnly: boolean;
  documentoInstanciaOID: string;
  usuarioOID: string;
  documentoId: number;
  verImagen : number;
  seccionOID: string;
  documentoInstancia: DocumentoInstancia;
  seccionInstancia: SeccionInstancia;
  errores: string[];
  msgs: Message[] = [];
  secciones: Seccion[];
  seccionesInstancias: SeccionInstancia[];
  alerta: string;
  tipoAlerta: number;
  image: string;
  verImage: number;
  isClicked: Boolean = false;
  blockedDocument: boolean = false;

  usuario: Usuario;

  nombreInstancia: string;
  sucursal: string;

  apiURLImagen: string;
  region: string;
  auxClouse: Boolean = false;
  tituloRegion: string;
  tituloSucursal: string;
  selectedFiles;


  
  @Input() public varDocumentoId: number;
  @Input() public varVerImage: number;
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


  @Input() public varDocumentoInstanciaOID: string;
  @Input() public varSeccionOID: string;
   @Input() public varReadOnly: string;
  @Input() public varNombreInstancia: string;
  

 
  noEditable: boolean;
  sucursalId: number;
  proyectoId: number;
  regionId: number;
  documentos: DocumentoInstancia[];
  selectedDocumento: DocumentoInstancia;
  proyecto: string;



  constructor(
    private seccionInstanciaService: SeccionInstanciaService,
    private seccionService: SeccionService,
    private documentoInstanciaService: DocumentoInstanciaService,
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.documentoInstanciaOID = this.actRoute.snapshot.params.documentoInstanciaOID;
    this.seccionOID = this.actRoute.snapshot.params.seccionOID;
    this.documentoId = this.actRoute.snapshot.params.documentoId;
    this.usuarioOID = this.actRoute.snapshot.params.usuarioOID;
    this.alerta = this.actRoute.snapshot.params.alerta;
    this.tipoAlerta = this.actRoute.snapshot.params.tipoAlerta;
    this.image = this.actRoute.snapshot.params.image;
    this.verImage = this.actRoute.snapshot.params.verImage;
   

  }

  clearFile(event, valorConcepto) {

        valorConcepto.valor = '';
        valorConcepto.nombreFile = '';
        event.target.value = '';
  }


  selectFile(event, documentoId, documentoInstanciaOID, seccionOID, conceptoOID, conceptoInstanciaOID, valorConcepto) {
    
    console.log('documentoInstanciaOID' + documentoInstanciaOID);
    this.selectedFiles = event.target.files;
    valorConcepto.nombreFile = event.target.files[0].name;
    console.log('File' + event.target.files[0].name);
    this.upload(documentoId, documentoInstanciaOID, seccionOID, conceptoOID, conceptoInstanciaOID, valorConcepto);

    event.target.value = '';

      }
      selectFile2(event) {
    console.log('selectFile');
  }


  upload(documentoId, documentoInstanciaOID, seccionOID, conceptoOID, conceptoInstanciaOID, valorConcepto) {


    let currentFile = this.selectedFiles.item(0);
    console.log('upload sec' + currentFile);

    this.seccionService.upload(currentFile, documentoId, documentoInstanciaOID, seccionOID, conceptoOID, conceptoInstanciaOID, this.usuarioOID).subscribe(
      event => {


        console.log(event['urlTemp']);

        valorConcepto.valor = event['url'];
        valorConcepto.valorUrl = event['url'];


      },
      err => {
        console.log('Could not upload the file!');
        currentFile = undefined;

      });

    this.selectedFiles = undefined;


  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.tituloRegion = this.usuario.infoHuesped.nbRegion;
    this.tituloSucursal = this.usuario.infoHuesped.nbSucursal;
    this.usuarioOID = this.usuario.usuarioOID;
    this.apiURLImagen = this.usuario.infoHuesped.pathImagenWeb;
    this.readOnly = false;
    this.noEditable = false;
    var elem = document.getElementById('quitar');
    
    if (this.documentoInstanciaOID == undefined || this.documentoInstanciaOID == null || this.documentoId == undefined) {
   
      this.documentoInstanciaOID = this.varDocumentoInstanciaOID;
      this.seccionOID = this.varSeccionOID;
      this.documentoId = this.varDocumentoId;
      this.verImage = this.varVerImage;
      this.usuarioOID = this.varUsuarioOID;
      this.nombreInstancia = this.varNombreInstancia;
      this.sucursal = this.varSucursal;
      this.sucursalId = this.varSucursalId;
      this.proyecto = this.varProyecto;
      this.proyectoId = this.varProyectoId;
      this.regionId = this.varRegionId;
      this.region = this.varRegion;
      this.alerta = this.varAlerta;
      this.tipoAlerta = this.varTipoAlerta;
      if(this.image != null){ this.varImage = this.usuario.infoHuesped.pathImagenWeb + this.image;} else  this.varImage = '0';
      console.log(" this.varVerImage;#");
      console.log( this.varVerImage)
      
    }

    //Validar cuando entre a instancia cuando el nro de documentos es igual a 1
     if(this.varNumDocumentos == 1){
          this.getByDocIdSucProyReg();
        

     }
     else{this.getSeccionesInstancias();}

     console.log('varImage' +  this.varImage);

  }

  
  public getByDocIdSucProyReg(){

    this.documentoInstanciaService.getByDocIdSucProyReg(this.documentoId, this.sucursalId , this.proyectoId , this.regionId, this.usuarioOID  ).subscribe(
      (data)=>{
    
         console.log( data );
         this.documentos=data;
          this.getIrInstancia();
          this.getSeccionesInstancias();
     
    }
  );
  }

  public getIrInstancia(){
    
    if(this.documentos == null){
      console.log( "guadarDocumentoInstancia" );
      this.guadarDocumentoInstancia();
    }
    else{
      this.selectedDocumento = this.documentos[0]; 
    }
    this.documentoInstanciaOID = this.selectedDocumento.documentoInstanciaOID;
    this.nombreInstancia= this.selectedDocumento.nombre;
    this.clickEditarDocInstancia();
  }

  public clickEditarDocInstancia(){
    if( this.selectedDocumento==null ){
      return;
    }

    this.seccionService.getPrimeraSeccion(this.documentoId, this.usuarioOID  ).subscribe(
      (data)=>{
         let secTmp=data;
         if( secTmp==null ){
           return;
         }
        this.seccionOID=secTmp.seccionOID;
           }
     );
  }

public guadarDocumentoInstancia(){
  var doc: DocumentoInstancia;
  var docInst : string;
  
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
        


  this.documentoInstanciaService.guardarDocumentoInstancia ( doc, this.usuarioOID).subscribe((data)=>{
    console.log("guadarDocumentoInstancia2" )
    console.log( data );
    this.selectedDocumento=data;
    this.seccionService.getPrimeraSeccion( this.documentoId , this.usuarioOID).subscribe(

       (data)=>{

        console.log("getPrimeraSeccion" )

         console.log( data );

         var  seccion:Seccion=data;
         this.documentoInstanciaOID = this.selectedDocumento.documentoInstanciaOID ;
         this.seccionOID = seccion.seccionOID ;
         this.documentoId = this.documentoId;
         this.usuarioOID = this.usuarioOID;
         this.nombreInstancia = this.selectedDocumento.nombre;
         this.sucursalId = this.selectedDocumento.sucursalId;
         this.proyecto = this.varProyecto;
         this.proyectoId = this.selectedDocumento.proyectoId;
         this.regionId = this.selectedDocumento.regionId;
         this.alerta =this.selectedDocumento.alerta;
         this.image = this.usuario.infoHuesped.pathImagenWeb + this.selectedDocumento.imagePath;
         console.log();
         console.log( "seccion.seccionOID ");
         console.log( );
         console.log( "this.documentoId" );
         console.log(  );
         console.log( "this.usuarioOID");
         console.log( this.usuarioOID);
         console.log( "this.currReadOnly,");
         //console.log( this.currReadOnly,);
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

         
          /* this.displayDocumentoInstancia( this.selectedDocumento.documentoInstanciaOID , seccion.seccionOID , this.documentoId , this.usuarioOID , this.currReadOnly,   this.selectedDocumento.nombre,this.selectedDocumento.alerta,this.selectedDocumento.tipoAlerta, this.selectedDocumento.imagePath );
*/
         }

      })
  });
}
  
  public getSeccionesInstancias() {

    this.seccionInstanciaService.getAll(this.documentoInstanciaOID, this.documentoId, this.usuarioOID).subscribe((data) => {
      console.log(data);
      this.seccionesInstancias = data;
      this.getDocumentoInstancia();
    });

  }


  public getSecciones() {

    this.seccionService.getSeccionesActivas(this.documentoId, this.usuarioOID).subscribe((data) => {
      console.log(data);
      this.secciones = data;
      this.getDocumentoInstancia();
    });

  }


  public validarRespuestas(): boolean {


    if (this.documentoInstancia.seccionesInstancia == null) {
      return false;
    }

    if (this.seccionInstancia == null || this.seccionInstancia.conceptosInstancia == null || this.seccionInstancia.conceptosInstancia.length <= 0) {
      return;
    }

    this.msgs = [];

    for (var idx = 0; idx < this.seccionInstancia.conceptosInstancia.length; idx++) {
      var ci = this.seccionInstancia.conceptosInstancia[idx];


      if (ci.requerida) {


        if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_OPCION_MULTIPLE) {
          if (ci.selected == null) {
            var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> es requerida ';
            this.msgs.push({severity: 'error', detail: msg, summary: ''});
          }

        } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_SELECCION_MULTIPLE) {

          if (ci.selectedValues == null || ci.selectedValues.length <= 0) {
            var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> es requerida ';
            this.msgs.push({severity: 'error', detail: msg, summary: ''});
          }


        } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_TEXTO){
          if (ci.valor == null || ci.valor.trim() === '') {
            const msg = 'La pregunta <strong>' + ci.descripcion + '</strong> es requerida.';
            this.msgs.push({severity: 'error', detail: msg, summary: ''});
          } else {
            const forbiddenChars = /[[\]{}]/;
            if (forbiddenChars.test(ci.valor)) {
              const msg = 'La pregunta <strong>' + ci.descripcion + '</strong> no debe contener los siguientes caracteres:  [ ] { }';
              this.msgs.push({severity: 'error', detail: msg, summary: ''});
            }
          }

        }else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_ENTERO ||
                ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_FECHA ||
                ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_VIGENCIA ||
                ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_HORA ||
                ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_PORCENTAJE ||
                ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_DECIMAL) {

          if (ci.valor == null || ci.valor == '') {
            var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> es requerida ';
            this.msgs.push({severity: 'error', detail: msg, summary: ''});
          }

        }

      }


      if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_TEXTO) {

        if (ci.valor != '' && ci.valor.length > ci.maximo) {
          var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> no puede pasar su longitud permitida de ' + ci.maximo + ' caracteres';
          this.msgs.push({severity: 'error', detail: msg, summary: ''});
        }


      }


      if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_FECHA) {


      }


      if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_ENTERO || ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_PORCENTAJE) {


        var numbers = /^[0-9]+$/;

        if ((ci.valor != null && ci.valor != '') && ci.valor.match(numbers) == null) {

          var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> no permite letras, solo permite números ';
          this.msgs.push({severity: 'error', detail: msg, summary: ''});

        }

        if (ci.minimo > 0) {

          if (parseInt(ci.valor) < ci.minimo) {

            var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> no puede ser menor que su minimo ' + ci.minimo;
            this.msgs.push({severity: 'error', detail: msg, summary: ''});

          }


        }

        if (ci.maximo > 0) {

          if (parseInt(ci.valor) > ci.maximo) {

            var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> no puede ser mayor que su maximo ' + ci.maximo;
            this.msgs.push({severity: 'error', detail: msg, summary: ''});

          }


        }

        if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_PORCENTAJE) {

          if (0 > parseInt(ci.valor) || parseInt(ci.valor) > 100) {

            var msg = 'La pregunta <strong>' + ci.descripcion + '</strong> es de tipo porcentaje, no puede superar de 100% ni 0% ';
            this.msgs.push({severity: 'error', detail: msg, summary: ''});

          }

        }

      }


    }


    if (this.msgs.length > 0) {
      return false;
    }


    return true;


  }


  public configRespuestasForDB() {

    if (this.seccionInstancia?.conceptosInstancia.length <= 0 || this.documentoInstancia?.seccionesInstancia === null) {
      return;
    }

    for (const ci of this.seccionInstancia.conceptosInstancia) {
      if (ci.valueAsDate === null) {
        if (ci.tipoConceptoId === GlobalConstants.CONCEPTO_TIPO_OPCION_MULTIPLE) {
          // alert( ci.selected );
        }
      } else {
        switch (ci.tipoConceptoId) {
          case GlobalConstants.CONCEPTO_TIPO_FECHA: {
            ci.valor = this.datePipe.transform(ci.valueAsDate, 'yyyy/MM/dd');
            break;
          }
          case GlobalConstants.CONCEPTO_TIPO_HORA: {
            ci.valor = this.datePipe.transform(ci.valueAsDate, 'shortTime');
            break;
          }
          case GlobalConstants.CONCEPTO_TIPO_VIGENCIA: {
            ci.valor = this.datePipe.transform(ci.valueAsDate, 'yyyy/MM/dd');
            break;
          }
          default: {
            break;
          }
        }
      }

    }
  }

  public validarRequeirdaOpcionySeleccionMultiple(ci: ConceptoInstancia) {


  }


  public configRespuestasForView() {

    if (this.documentoInstancia == null) {
      return false;
    } else {
      console.log("readOnly");
      console.log(this.documentoInstancia.readOnly);
      console.log("noEditable");
      console.log(this.documentoInstancia.noEditable);
      if (this.documentoInstancia.noEditable==1) this.noEditable = true;
      if (this.documentoInstancia.readOnly==1) this.readOnly = true;

      if (this.documentoInstancia.imagePath != '0') {
        this.documentoInstancia.imagePath = this.usuario.infoHuesped.pathImagenWeb + this.documentoInstancia.imagePath;
      } else {
        this.documentoInstancia.imagePath = 'assets/img/NoImagen.png';
      }

    }
    if (this.documentoInstancia.seccionesInstancia == null) {
      return false;
    }


    if (this.seccionInstancia == null || this.seccionInstancia.conceptosInstancia == null || this.seccionInstancia.conceptosInstancia.length <= 0) {
      return;
    }


    for (var idx = 0; idx < this.seccionInstancia.conceptosInstancia.length; idx++) {
      var ci = this.seccionInstancia.conceptosInstancia[idx];
     
      ci.readOnly=this.readOnly;
      if(ci.noEditable==1 && !this.readOnly ){
        if(this.noEditable)
           ci.readOnly = true;
      }
     
      if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_FECHA) {


        if (ci.valor != null && ci.valor != '') {
          let date = this.getFechaFromString(ci.valor);
          if (date != null) {
            ci.valueAsDate = date;
          }

        }
      } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_VIGENCIA) {


        if (ci.valor != null && ci.valor != '') {
          let date = this.getFechaFromString(ci.valor);
          if (date != null) {
            ci.valueAsDate = date;
          }

        }
      } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_FOTO) {


        if (ci.valor != null && ci.valor != '') {
          ci.valor = this.usuario.infoHuesped.pathImagenWeb + ci.valor;

          // Dividir la URL en segmentos usando '/'
          const segments = ci.valor.split('/');
          if (segments.length > 0) {
            // Tomar el último segmento como el nombre del archivo
            const nombreArchivo = segments[segments.length - 1];
            ci.nombreFile = nombreArchivo;
          } else {
            ci.nombreFile = 'Seleccione un Archivo';
          }


        }


      } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_HORA) {

        if (ci.valor != null && ci.valor != '') {
          let date = this.getHoraFromString(ci.valor);
          if (date != null) {
            ci.valueAsDate = date;
          }
        }

      } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_SELECCION_MULTIPLE) {

        ci.selectedValues = [];

        var selectedValues: OpcionInstancia[] = [];
        if (ci.opcionesInstancia != null && ci.opcionesInstancia.length > 0) {
          for (var i = 0; i < ci.opcionesInstancia.length; i++) {
            var oi = ci.opcionesInstancia[i];
            if (oi.seleccionado == 1) {
              selectedValues.push(oi);
            }
          }
        }

        if (selectedValues != null && selectedValues.length > 0) {
          ci.selectedValues = selectedValues;
        }

      } else if (ci.tipoConceptoId == GlobalConstants.CONCEPTO_TIPO_OPCION_MULTIPLE) {


        var selected: OpcionInstancia = null;
        if (ci.opcionesInstancia != null && ci.opcionesInstancia.length > 0) {
          for (var i = 0; i < ci.opcionesInstancia.length; i++) {
            var oi = ci.opcionesInstancia[i];
            if (oi.seleccionado == 1) {
              selected = oi;
              ci.selected = oi;
              if (ci.filtro == 1) {
                this.listaChanged(ci);
              }
              break;
            }
          }
        }


        if (selected != null) {
          ci.selected = selected;
        } else {
          if (ci.opcionesInstancia != null && ci.opcionesInstancia.length > 0) {
            selected = ci.opcionesInstancia[0];
            ci.selected = selected;
          }
        }


      }


    }


    return true;


  }


  public getFechaFromString(fecha: string): Date {

    var parts = fecha.split('/');
    new Date();
    var mydate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

    return mydate;

  }


  public getHoraFromString(fecha: string): Date {
    if (fecha == null || fecha == '') {
      return null;
    }

    var parts = fecha.split(':');
    if (parts == null || parts.length <= 1) {
      return null;
    }


    var mydate = new Date();
    let hour = parseInt(parts[0]);
    if (fecha.includes('PM') || fecha.includes('pm')) {
      hour = hour + 12;
    }

    mydate.setHours(hour);
    mydate.setMinutes(parseInt(parts[1]));
    // mydate.setUTCHours(parseInt(  parts[0]  ) );

    console.log(mydate.toDateString());
    return mydate;

  }


  public guardarSeccion(nextSeccionOID: string) {


    this.configRespuestasForDB();
    if (!this.validarRespuestas()) {

      return;
    }
    if (nextSeccionOID == null) {
      this.blockedDocument = true;
    }
    const documentoInstancia: DocumentoInstancia = this.modifyDocumentInstance(this.documentoInstancia);
    this.documentoInstanciaService.guardarDocumentoInstanciaRespuestas(documentoInstancia, this.usuarioOID).subscribe((data) => {


      this.myVariable = data;
      this.documentoInstancia = this.myVariable;
      this.blockedDocument = false;
      if (nextSeccionOID != null && nextSeccionOID != '') {

        this.seccionOID = nextSeccionOID;
        this.getDocumentoInstancia();
        this.isClicked = true;
      }
    });

  }

  public modifyDocumentInstance(documento: DocumentoInstancia): DocumentoInstancia {
    const modifiedDocumento: DocumentoInstancia = JSON.parse(JSON.stringify(documento));
    modifiedDocumento.seccionesInstancia.forEach(seccion => {
      seccion.conceptosInstancia.forEach(concepto => {
        if (concepto.tipoConceptoId === GlobalConstants.CONCEPTO_TIPO_SELECCION_MULTIPLE) {
          // @ts-ignore
          concepto.selectedValues = concepto.selectedValues.map(opcion => opcion.opcionOID);
        }
      });
    });
    return modifiedDocumento;
  }


  public getDocumentoInstancia() {
    
    console.log(this.documentoId, this.documentoInstanciaOID, this.seccionOID, this.usuarioOID);
    this.documentoInstanciaService.getDocByDocumentInstanceAndSection(this.documentoId, this.documentoInstanciaOID, this.seccionOID, this.usuarioOID).subscribe(
      (data) => {

        this.documentoInstancia = data;
       
        if (this.documentoInstancia != null) {
          if (this.documentoInstancia.seccionesInstancia != null && this.documentoInstancia.seccionesInstancia.length > 0) {
            this.seccionInstancia = this.documentoInstancia.seccionesInstancia[0];
            console.log("this.seccionInstancia" + this.documentoInstancia.seccionesInstancia[0]);
            this.configRespuestasForView();
          }

        }

      }
    );

  }


  public cambiarSeccion(event, sec: SeccionInstancia) {
    //  alert( event.collapsed );

    if (!event.collapsed && this.auxClouse) {
      //  this.guardarSeccion();
      // this.seccionOID= sec.seccionOID;
      // this.getDocumentoInstancia();
      this.guardarSeccion(sec.seccionOID);

    }

    this.auxClouse = true;

  }


  public listaChanged(ci: ConceptoInstancia) {
    var oi: OpcionInstancia = ci.selected;

    console.log('entro a combox' + oi.texto);
    if (ci.filtro == 1) {
      var ciFiltroOid: string = ci.conceptoFiltroOID;
      var cis: ConceptoInstancia[] = this.seccionInstancia.conceptosInstancia;


      cis.forEach((ciFiltra) => {
        if (ci.conceptoFiltroOID == ciFiltra.conceptoOID) {
          console.log(oi.texto);
          this.seccionInstanciaService.getOpciones(ciFiltra.listaOID, oi.opcionOID, this.usuarioOID).subscribe
          ((data) => {
            ciFiltra.opcionesInstancia = data;
          });


        }
      });
    }
  }


}
