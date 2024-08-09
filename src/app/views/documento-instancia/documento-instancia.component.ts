import { Component, OnInit } from '@angular/core';
import { DocumentoInstancia } from 'src/app/model/documento-instancia';
import { DocumentoInstanciaService } from  'src/app/service/documento-instancia.service';
import { ActivatedRoute } from '@angular/router';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { GlobalConstants } from 'src/app/model/global-constants';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-documento-instancia',
  templateUrl: './documento-instancia.component.html',
  styleUrls: ['./documento-instancia.component.scss']
})
export class DocumentoInstanciaComponent implements OnInit {
  [x: string]: any;

  selectedFiles;
  documentoInstancia: DocumentoInstancia;
  documentoId:number;
  usuarioOID:string;
  usuario : Usuario;
  proyectoId : number;
  regionId : number;
  sucursalId: number;
  alerta:string;
  tipoAlerta:number;
  image:string;
  apiURLImagen: string;
  selectedFileName:string;
  errorNombre: boolean = false;
  errorObservaciones: boolean = false;


  constructor( private documentoInstanciaService : DocumentoInstanciaService ,
    private actRoute: ActivatedRoute ,  public ref: DynamicDialogRef ,
    public config: DynamicDialogConfig

 ) {

  }



  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuario.usuarioOID;
    console.log("this.usuario.usuarioOID =" +  this.usuario.usuarioOID );
    console.log("this.usuarioOID =" +  this.usuarioOID );
    if( this.config.data != null  && this.config.data.update>0){



      this.documentoId=this.config.data.documento.documentoId;
     // this.usuarioOID=this.config.data.documento.usuarioOID;
      this.proyectoId=this.config.data.documento.proyectoId;
      this.regionId=this.config.data.documento.regionId;
      this.sucursalId=this.config.data.documento.sucursalId;
      this.alerta=this.config.data.documento.alerta;
      this.tipoAlerta=this.config.data.documento.tipoAlerta;
      this.image=this.config.data.documento.imagePath;


      this.documentoInstancia=this.config.data.documento;
     /* this.documentoInstancia.usuarioOID=this.usuarioOID;
      this.documentoInstancia.documentoId=this.documentoId;
      this.documentoInstancia.statusInstanciasId=1;
      this.documentoInstancia.activa=1;

      this.documentoInstancia.proyectoId=this.proyectoId;
      this.documentoInstancia.regionId=this.regionId;
      this.documentoInstancia.sucursalId=this.sucursalId;

      this.documentoInstancia.nombre = */




    }else{

      this.documentoId=this.config.data.documentoId;
      //this.usuarioOID=this.config.data.usuarioOID;
      this.proyectoId=this.config.data.proyectoId;
      this.regionId=this.config.data.regionId;
      this.sucursalId=this.config.data.sucursalId;


      this.documentoInstancia=new DocumentoInstancia();
      this.documentoInstancia.usuarioOID=this.usuarioOID;
      this.documentoInstancia.documentoId=this.documentoId;
      this.documentoInstancia.statusInstanciasId=2;
      this.documentoInstancia.activa=1;

      this.documentoInstancia.proyectoId=this.proyectoId;
      this.documentoInstancia.regionId=this.regionId;
      this.documentoInstancia.sucursalId=this.sucursalId;
      this.documentoInstancia.alerta=this.alerta;
      this.documentoInstancia.tipoAlerta=this.tipoAlerta;
      this.documentoInstancia.imagePath=this.image;

      1


    }
    //Obtener el nombre del archivo
    const segments = this.documentoInstancia.imagePath.split('/');
    if(segments.length>0){
   // Tomar el último segmento como el nombre del archivo
         const nombreArchivo = segments[segments.length - 1];
         this.selectedFileName= nombreArchivo;
    }else this.selectedFileName= "Seleccionar archivo..";


  }

public guadarDocumentoInstancia(   ){

  console.log("this.usuario.usuarioOID =" +  this.usuario.usuarioOID );
  console.log("this.usuarioOID =" +  this.usuarioOID );
  this.documentoInstanciaService.guardarDocumentoInstancia ( this.documentoInstancia , this.usuarioOID).subscribe((data)=>{

    //console.log("bien");
    this.documentoInstancia=data;
    console.log("DocumentoInstancia" + this.documentoInstancia )
    this.ref.close(this.documentoInstancia );

});


}

public cancelar(){
  this.ref.close();
}

clearFile(event, documentoInstancia){
  this.selectedFileName ='';
  documentoInstancia.imagePath = '';
  event.target.value = '';
  //const fileInput = document.querySelector('input[type="file"]');
  //if (fileInput) {
  //    fileInput.value = ''; }
}


selectFile(event, documentoInstancia,  documentoId) {
console.log("selectFile" + this.documentoInstancia.documentoInstanciaOID);



  this.selectedFiles = event.target.files;
  this.selectedFileName = event.target.files[0].name;
  console.log("selectFile" + event.target.files[0].name);
  this.selectedFileName = event.target.files[0].name
  this.upload( this.documentoInstancia.documentoInstanciaOID,  this.documentoInstancia.documentoId);

  event.target.value = '';

}




upload( documentoInstanciaOID, documentoId ) {


  let currentFile = this.selectedFiles.item(0);
  console.log("upload doc" + currentFile);
  this.documentoInstanciaService.upload(currentFile, documentoId, documentoInstanciaOID,  "*", "*", "*",this.usuarioOID).subscribe(

    event => {

      this.documentoInstancia.imagePath = event['url'];

    },
    err => {
      // console.log('Could not upload the file!');
      currentFile = undefined;

    });

  this.selectedFiles = undefined;
}

  validateFields() {
    const forbiddenChars = /[{}\[\]]/;

    // Validación para el campo nombre
    if (forbiddenChars.test(this.documentoInstancia.nombre)) {
      this.errorNombre = true;
    } else {
      this.errorNombre = false;
    }

    // Validación para el campo observaciones
    if (forbiddenChars.test(this.documentoInstancia.observaciones)) {
      this.errorObservaciones = true;
    } else {
      this.errorObservaciones = false;
    }
  }

}
