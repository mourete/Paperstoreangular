import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
 
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { Marca } from 'src/app/model/marca';
import { Empresa } from 'src/app/model/empresa';
import { Usuario } from 'src/app/model/usuario';
import { Estado } from 'src/app/model/estado';
import { Ciudad } from 'src/app/model/ciudad';

import { CiudadService } from 'src/app/service/ciudad.service';


import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';

import { EstadoService } from 'src/app/service/estado.service';


 


@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.scss']
})
export class MarcaComponent implements OnInit {

  marca:Marca;
  empresas:Empresa[];
  msgs: Message[] = [];
  usuarioSession:Usuario;
  selectedEmpresa:Empresa;
  selectedEstado:Estado;
  usuarioOID:string;

  estados:Estado[];
  ciudades:Ciudad[];
  selectedCiudad:Ciudad;

  profileMarca = this.fb.group({
    clave: ['',  Validators.required],
    nombre: ['', Validators.required],
    flagActivo: ['',  Validators.required],
    empresa:['',  Validators.required],
    mail: [''],
    calle: [''],
    numero: [''],
    entreCalle: [''],
    colonia: [''],
    cp: [''],
    encargado: [''],
    estadosForm : [''],
    ciudadesForm : ['']

  });

  constructor(public estadoService: EstadoService ,  public ciudadService:CiudadService , public empresaService:EmpresaService ,   private fb: FormBuilder , public marcaService:MarcaService ,     public config: DynamicDialogConfig , public ref: DynamicDialogRef ) { }


  get f() { return this.profileMarca.controls; }


  ngOnInit(): void {

    this.usuarioSession = JSON.parse
    (localStorage.getItem('usuario'));
    this.usuarioOID=this.usuarioSession.usuarioOID;



   
    if( this.config.data.marcaId >0   ){       
           this.getMarcaByMarcaId(  this.config.data.marcaId );      
    }else{       
       this.marca=new Marca();
       this.marca.usuarioCreated=this.usuarioSession.usuarioOID;
       this.marca.empresaId=0;
       this.marca.activo=1;
       this.marca.flagActivo=true;
    
    }

    this.getAllEstados();
  
    this.getEmpresasByUsuarioOID();
 
    




  }


  public getAllEstados( ){

    this.estadoService.getAllEstados (this.usuarioOID ).subscribe(
      (data)=>{

        this.estados=data;  
        
        this.getCiudadesByEstado(this.estados[0].estadoId,  this.usuarioSession.usuarioOID);
     }
    );
  
  }


  public getMarcaByMarcaId ( marcaId : number ){


    this.marcaService.getByMarcaId ( marcaId, this.usuarioOID ).subscribe(
      (data)=>{
        this.marca =data;  
        if( this.marca.activo==1 ){
            this.marca.flagActivo=true;
        }else{
            this.marca.flagActivo=false;
        }

        this.getEmpresasByUsuarioOID();
         
     }
    );
  
  }
  



  public getEmpresasByUsuarioOID(){
    this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.empresas=data;        
        if( this.empresas!=null && this.empresas.length>0 ){
          
          if( this.marca!=null && this.marca.empresaId<=0 ){
            this.selectedEmpresa=this.empresas[0];
            
          }else{
             if( this.marca!=null ){

               for(  var i=0;i< this.empresas.length;i++ ){
                  if( this.empresas[i].empresaId==this.marca.empresaId ){
                    this.selectedEmpresa=this.empresas[i];
                    break;
                  }
               }              

             }



          } 
        }

     }
    );
  
  }





  public guadarMarca(){

    this.msgs=[];

    if(  this.marca.clave ==null ||this.marca.clave=="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar la clave de la marca "  , summary:'Validation failed'});
      return;
    }

    if(  this.marca.nombre ==null ||this.marca.nombre =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el nombre de la marca "  , summary:'Validation failed'});
      return;
    }    
  

    if(  this.selectedEmpresa ==null   ){
      this.msgs.push({severity:'error', detail: "Se requiere seleccionar la empresa para la marca "  , summary:'Validation failed'});
      return;
    }   

  
    if( this.selectedEmpresa!=null ){
       this.marca.empresaId=this.selectedEmpresa.empresaId;
    }

 
    if( this.marca.flagActivo ){
       this.marca.activo=1;
    }else{
      this.marca.activo=0;
    }

    
    this.marcaService.guardarMarca(  this.marca, this.usuarioOID ).subscribe(
      (data)=>{
        this.marca=data;     
        this.ref.close(this.marca);          
      }
  
    );


  }




  public cancelar(){
    this.ref.close();
  }





  onSubmit() {

    console.warn(this.profileMarca.value);
  
    console.warn(this.marca);
  
  
    this. guadarMarca();
  
  }


  public empresaChanged(){

  }


  public estadoChanged(){
    if(this.selectedEstado==null || this.selectedEstado.estadoId<=0  ){
      return;
    }
   
    this.getCiudadesByEstado(this.selectedEstado.estadoId,this.usuarioSession.usuarioOID);


  }


  public getCiudadesByEstado( estadoId: number , usuarioOID:string ){
    console.log("Entro aqui");
    this.ciudadService.getCiudadesByEstado ( estadoId , usuarioOID ).subscribe(
      (data)=>{
        this.ciudades=data; 
        
        var  ciudadTmp:Ciudad;

        ciudadTmp=this.ciudades[0];

        this.selectedCiudad=ciudadTmp;
        
       /* if( this.selectedCiudad.ciudadId >0  && this.ciudades!=null && this.ciudades.length>0 ){
          console.log("Entro aqui 2");
          var  ciudadTmp:Ciudad;
            for(  var i=0;i<this.ciudades.length;i++ ){
                  ciudadTmp=this.ciudades[i];
                  if( ciudadTmp.ciudadId==this.sucursal.ciudadId ){
                      
                      this.selectedCiudad=ciudadTmp;
                      break;
                  }

            }
        

        } */


     }
    );
  
  }














}
