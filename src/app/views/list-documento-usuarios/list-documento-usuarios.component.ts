import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Sucursal } from 'src/app/model/sucursal';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { ActivatedRoute } from '@angular/router';
import { ListDocumentosUsuarios } from 'src/app/model/list-documento-usuarios';
import { DocumentService } from 'src/app/service/document.service';

import { UsuarioMarcasComponent } from '../usuario-marcas/usuario-marcas.component';

@Component({
  selector: 'app-list-documento-usuarios',
  templateUrl: './list-documento-usuarios.component.html',
  styleUrls: ['./list-documento-usuarios.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListDocumentoUsuariosComponent implements OnInit {


 
  usuarioOID: string;
  usuarioSession:Usuario;
  mostrandoInstancia:boolean;


  public currDocumentoId: number;
  public  currProyectoId: number;
  public  currProyecto:string;
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


  documentosUsuariosList:ListDocumentosUsuarios[];
  //selectedSucursal:Sucursal;
  selectedDocumentoUsuario:ListDocumentosUsuarios;
  selectedEmpresa:Empresa;
  selectedMarca:Marca;
  itemsSucursal: MenuItem[];
  empresas:Empresa[];
  marcas:Marca[];

  constructor(public documentService:DocumentService    ,  public marcaService:MarcaService ,  public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService  ,     private actRoute: ActivatedRoute ) {
      this.usuarioOID=this.actRoute.snapshot.params.usuarioOID;
      this.mostrandoInstancia=false;

     }

   
  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuarioSession.usuarioOID;
    if(  this.usuarioOID == undefined ||   this.usuarioOID==null || this.usuarioOID=="" ){
        this.usuarioOID=this.usuarioSession.usuarioOID;
    }
    
    this.getEmpresasByUsuarioOID();
  }

  



  public getEmpresasByUsuarioOID(){
    this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        //this.empresas=data; 
        
        this.empresas = new Array(data.length+1);
        this.empresas[0] = {activo:0, empresaId:0,nombre:"Todas", encargado:"",
        email:"",
        notificaciones:0,
          usuarioCreated:"",
          direccion:"",
        rfc:"",	  
        activa:"",
        clave:""};

        data.forEach((element, index) => {
          this.empresas[++index] = element;
        });


        if( this.empresas!=null && this.empresas.length>0 ){
          this.selectedEmpresa=this.empresas[0];  
          this.getMarcasByEmpresaYUsuario();         
        }

     }
    );
  
  }



  public getMarcasByEmpresaYUsuario(){
    if( this.usuarioSession==null  || this.selectedEmpresa==null  ){
      return;
    }

    this.marcaService.getMarcasByEmpresaYUsuario  (  this.usuarioSession.usuarioOID , this.selectedEmpresa.empresaId  ) .subscribe( 
      (data)=>{
        /* console.log( data );
         this.marcas=data;   */
         
         if(data != null )
         {
           this.marcas = new Array(data.length+1);
         }else
           this.marcas = new Array(1);
 
        this.marcas[0] = {  marcaId:0,
         nombre:"Todas",
         clave:"",
         empresaId:0,
         encargado:"",
         notificaciones:0,
         activo:0,
         numero:0,
         calle:"",
         colonia:"",
         entreCalle:"",
         cp:"",
         mail:"",
         ciudadId:0,
         estado:"",
         ciudad:"",
         empresa:"",
         usuarioCreated:"",
         usuarioUpdated:"",
     
         activoText:"",
         flagActivo:true};
        
         if(data != null )
        data.forEach((element, index) => {
         this.marcas[++index] = element;
        });


         if( this.marcas!=null && this.marcas.length>0 ){
             this.selectedMarca=this.marcas[0];                 
             this.getSucursagetSucursalesByMarcaYEmpresalByID();
         }else{
            this.selectedMarca=null;
            this.getSucursagetSucursalesByMarcaYEmpresalByID();
         }


      }
     );
  
  }

  /*public getDocumentosUsuario(  ){      
    if( this.usuarioOID==null ){
      return;
    }

    this.documentService.getDocumentosUsuario( this.usuarioOID ).subscribe( 
      (data)=>{
         console.log( data );
         this.documentosUsuario=data;   
        
      }
     );
  
  }*/


  public getSucursagetSucursalesByMarcaYEmpresalByID(){
         this.documentosUsuariosList=[];
         if(this.selectedEmpresa==null ){
           return;
         }

        var marcaTmpId:number;
        if( this.selectedMarca==null || this.selectedMarca.marcaId<=0 ){
           marcaTmpId=0;
        }else{
          marcaTmpId=this.selectedMarca.marcaId;
        }

        this.documentService.getDocumentosUsuarioList(  marcaTmpId , this.selectedEmpresa.empresaId,  this.usuarioSession.usuarioOID ).subscribe( 
          (data)=>{
             console.log( data );
                    
             this.documentosUsuariosList=data;  

            

             this.documentosUsuariosList.forEach((element, index) => {


              this.marcas.forEach((eleMarca,indx) => {

                if(element.marcaId == eleMarca.marcaId){

                  this.documentosUsuariosList[index].marca = eleMarca.nombre;

                }

              });


              this.empresas.forEach((eleEmpresa,indx) => {

                if(element.empresaId == eleEmpresa.empresaId){

                  this.documentosUsuariosList[index].empresa = eleEmpresa.nombre;
                  
                }

              });

              
                
             });
             
            // console.log();

          }
         );



  }
  
 
   public empresaChanged(){
       this.getMarcasByEmpresaYUsuario();
  }

  public marcaChanged(){
         this.getSucursagetSucursalesByMarcaYEmpresalByID();
  }


  public sucursalChanged(){

  }


  public onClickMenuSucursal(suc:Sucursal){

  }
  public backToDocumentList(){

    this.mostrandoInstancia = !this.mostrandoInstancia;
  }

  public mostrarInstancia(docId:number , proyId:number , regId: number 
    , sucId:number, usrOID:string , doc: string , suc:string, reg:string , cantDoc :number , cantInst:number,  cantMarca: string, cantEmpresa: string , proyecto : string
){

this.currDocumentoId=docId;
this.currProyectoId=proyId;
this.currProyecto=proyecto;
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
