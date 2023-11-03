import { Component, OnInit } from '@angular/core';
import { DocumentosUsuario } from 'src/app/model/documentos-usuario';
import { DocumentService } from 'src/app/service/document.service';

import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';


@Component({
  selector: 'app-documentos-usuario',
  templateUrl: './documentos-usuario.component.html',
  styleUrls: ['./documentos-usuario.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class DocumentosUsuarioComponent implements OnInit {


  documentosUsuario : DocumentosUsuario;
  usuarioOID: string;
  usuarioSession:Usuario;
  mostrandoInstancia:boolean;


 public currDocumentoId: number;
public  currProyectoId: number;
public currRegionId: number;
public currSucursalId:number;
public currUsuarioOID:string;

public currDocumento:string;
 public currSucursal:string;
public currRegion:string;
public currNumDocumentos:number;
public currNumInstancias:number; 
public currMarca:string;
public currEmpresa:string;


  constructor( public documentService:DocumentService   , private confirmationService: ConfirmationService ,
    public dialogService: DialogService    ,     private actRoute: ActivatedRoute   ) {
        this.usuarioOID=this.actRoute.snapshot.params.usuarioOID;
        this.mostrandoInstancia=false;
     }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.mostrandoInstancia=false;

    if(  this.usuarioOID == undefined ||   this.usuarioOID==null || this.usuarioOID=="" ){
        this.usuarioOID=this.usuarioSession.usuarioOID;
    }

      this.getDocumentosUsuario();
  }


  public getDocumentosUsuario(  ){      
    if( this.usuarioOID==null ){
      return;
    }

    this.documentService.getDocumentosUsuario( this.usuarioOID ).subscribe( 
      (data)=>{
         console.log( data );
         this.documentosUsuario=data;   
        
      }
     );
  
  }


  public backToDocumentList(){

    this.mostrandoInstancia = !this.mostrandoInstancia;
  }

  
  public mostrarInstancia(
           docId:number , proyId:number , regId: number , sucId:number, usrOID:string , doc: string , suc:string, reg:string , cantDoc :number , cantInst:number,  cantMarca: string, cantEmpresa: string 
  ){

      this.currDocumentoId=docId;
       this.currProyectoId=proyId;
       this.currRegionId=regId;
      this.currSucursalId=sucId;
      this.currUsuarioOID=usrOID;
   
      this.currDocumento=doc;
       this.currSucursal=suc;
      this.currRegion=reg;
      this.currNumDocumentos=cantDoc;
      this.currNumInstancias=cantInst;
      this.currMarca = cantMarca;
      this.currEmpresa = cantEmpresa;

      this.mostrandoInstancia=true;
      
  }

 





}
