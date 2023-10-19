import { Component, OnInit } from '@angular/core';
 
import { Seccion } from '../../model/seccion'
import { SeccionService } from '../../service/seccion.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog'; 
import { Usuario } from 'src/app/model/usuario';


@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.scss']
 
})
export class SeccionComponent implements OnInit {
 
  seccion: Seccion; 
  documentoId: number;
  usuarioSession:Usuario;
  usuarioOID :string;

  constructor( private seccionService : SeccionService ,  private actRoute: ActivatedRoute , public config: DynamicDialogConfig , public ref: DynamicDialogRef ) {
 
     
    
  }  

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID=this.usuarioSession.usuarioOID;
       this.documentoId = this.config.data.documentoId;
       this.seccion=new Seccion();     
       this.seccion.documentoId=this.documentoId;       
       this.seccion.orden=1
       this.seccion.activa=1;
       this.seccion.ciclica=0;
       this.seccion.enabled=1; 


       if( this.config.data.seccion != null  ){
        if( this.config.data.seccion.seccionOID!=null   ){
           this.seccion.nombre=this.config.data.seccion.nombre;
           this.seccion.clave=this.config.data.seccion.clave;
           this.seccion.seccionOID = this.config.data.seccion.seccionOID  ;          
        } 
    }else{
      
       this.seccion.orden=this.config.data.orden;
    }


  }
 

public guadarSeccion() {
  this.seccionService.guardarSeccion ( this.seccion, this.usuarioSession.usuarioOID ).subscribe((data)=>{
    
      this.seccion=data;        
      this.config.data.seccion=this.seccion; //Emi
      this.ref.close(this.seccion);
     
     
  });
}

public cancelar(){
  this.ref.close();
}



}
