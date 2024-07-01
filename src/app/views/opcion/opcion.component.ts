import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Opcion } from 'src/app/model/opcion';
import { Usuario } from 'src/app/model/usuario';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { ListaService } from 'src/app/service/lista.service';
import { of } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Message} from "primeng/api";

@Component({
  selector: 'app-opcion',
  templateUrl: './opcion.component.html',
  styleUrls: ['./opcion.component.scss']
})

export class OpcionComponent implements OnInit {

  @ViewChild('claveInput') claveInput: ElementRef;
  opcion:Opcion = new Opcion();
  opcionAccion:string;
  msgs: Message[] = [];
  visible:boolean;
  enabled:boolean;
  ponderacion:boolean;
  soyFiltro : boolean = false;
  selectedOpcion  : Opcion;
  opcionFiltrada : Opcion[];
  type : boolean = false;
  usuarioSession:Usuario;
  usuarioOID:string;
  claveError: boolean = false;
  esClaveValida: boolean = true;



  constructor(private listaService : ListaService ,
              public config: DynamicDialogConfig ,
              public ref: DynamicDialogRef   ) { }


    onClaveChange() {
        this.convertirAMayusculas();
        this.verificarClave();
    }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuarioSession.usuarioOID;
    if( this.config.data.lista==null ){
      return;
    }

    if( this.config.data.opcion != null  ){
      if( this.config.data.opcion.opcionOID!=null   ){
        this.opcionAccion="MODIFICANDO OPCION";

        this.type = true;
        this.getOpcionByOpcionOID(this.config.data.opcion.opcionOID);

      }
    }else{
       // console.log("1");
        this.opcion=new Opcion();
        this.opcionAccion="AGREGANDO OPCIÓN";
        this.opcion.listaOID=this.config.data.lista.listaOID;

        this.visible=true;
        this.enabled=true;
        this.ponderacion=false;
        this.opcion.orden=1;
    }

    this.soyFiltro = this.config.data.lista.filtrada == 1 ? true : false;


    if(this.soyFiltro){
      // console.log("2");
      this.getOpcionesByLista(this.config.data.lista.listaFiltroOID, this.type);
      // console.log("Entre");
      console.log(this.config.data.lista.listaFiltroOID);
    }


  }



  public getOpcionesByLista( listaOID : string , type : boolean){
    this.opcionFiltrada=[];
    // console.log("Perturbado");
    this.listaService.getOpcionesByLista  ( listaOID ,this.usuarioOID).subscribe(
      (data)=>{
          this.opcionFiltrada =data;

          // console.log("Lista que llamo con la informacion de arriba");
          console.log(this.opcionFiltrada);

          // console.log("Opcion seleccionada");
          console.log(this.config.data.opcion);

          if(type && data != null){

            this.opcionFiltrada.forEach(element => {

               console.log(element.opcionOID);



                if(this.config.data.opcion.opcionFiltroOID == element.opcionOID){
                    // console.log("Entre");

                    this.selectedOpcion = element;
                }
            });

            if(this.selectedOpcion == null){
              this.selectedOpcion = this.opcionFiltrada[0];
            }

          }else if(data != null){
              // console.log("3");
              this.selectedOpcion = this.opcionFiltrada[0];
          }

      }
     );

  }


  public getOpcionByOpcionOID( opcionOID : string ){
    this.opcion=null;

    this.listaService.getOpcionByOpcionOID  ( opcionOID, this.usuarioOID ).subscribe(
      (data)=>{
         this.opcion =data;
         if(this.opcion==null){
           return;
         }


         if( this.opcion.enabled==1 ){
           this.enabled=true;
         }else{
           this.enabled=false;
         }

         if( this.opcion.visible==1 ){
           this.visible=true;
         }else{
           this.visible=false;
         }

        if( this.opcion.ponderacion==1 ){
          this.visible=true;
        }else{
          this.visible=false;
        }



      }
     );

  }




  public cancelarOpcion(){
    this.opcion=null;
    this.ref.close(null);
  }


  public guardarOpcion(){


    if(this.visible){
      this.opcion.visible=1;
    }else{
      this.opcion.visible=0;
    }

    if(this.enabled){
      this.opcion.enabled=1;
    }else{
      this.opcion.enabled=0;
    }

    if(this.ponderacion){
      this.opcion.ponderacion=1;
    }else{
      this.opcion.ponderacion=0;
    }

    //console.log(this.selectedOpcion);

    if(this.selectedOpcion != null)
        this.opcion.opcionFiltroOID = this.selectedOpcion.opcionOID;

   /* console.log(this.opcion);
    console.log("Edgar");*/

    this.listaService.guardarOpcion ( this.opcion,this.usuarioOID ).subscribe((data)=>{
      console.log(data);
      this.ref.close(this.opcion);
    });
  }

    convertirAMayusculas() {
        if (this.opcion && this.opcion.clave) {
            this.opcion.clave = this.opcion.clave.toUpperCase();
        }
    }
    verificarClave(){
        const clave = this.opcion.clave || '';
        this.esClaveValida = clave.length >= 10;
    }

}
