import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';
import { DialogService } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})

export class ListaComponent implements OnInit {


  catalogo:Lista;
  listaAccion:string;
  filtro : boolean = false;
  filtrada : boolean = false;
  selectedLista : Lista;
  listaFiltrada:Lista[];
  usuarioSession:Usuario;
  

  constructor(private listaService : ListaService , public config: DynamicDialogConfig , public ref: DynamicDialogRef    ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    if( this.config.data.lista != null  ){
      if( this.config.data.lista.listaOID!=null   ){
        this.listaAccion="MODIFICANDO LISTA";
         this.getListaByOID(this.config.data.lista.listaOID);
        
      } 
    }else{       
        this.catalogo=new Lista();
        this.listaAccion="AGREGANDO LISTA";
        this.catalogo.tipoListaId=1;
    }



  }



  public getListaByOID( listaOID : string ){
    this.catalogo=null;
    
    this.listaService.getListaByListaOID( listaOID , this.usuarioSession.usuarioOID).subscribe( 
      (data)=>{
          console.log(data);
          console.log("Soy yo leal"); 
          this.catalogo =data;         
          if(this.catalogo.filtro == 1)
            this.filtro = true ;

          if(this.catalogo.filtrada == 1){
            this.filtrada = true ;

            this.listaService.getListaFiltro(this.usuarioSession.usuarioOID).subscribe( 
              (data)=>{
                  //console.log(data);
                  this.listaFiltrada = data;

                  this.listaFiltrada.forEach((element) => {
                    
                    if( this.catalogo.listaFiltroOID == element.listaOID)
                        this.selectedLista = element;
                  });
                  
              });

          }



      }
     ); 
  
  }


  public clickFiltro(e) {
    console.log(e.checked);
 
    if(e.checked){
   //  this.conceptoFiltro(e.checked);
    }
  }


  public clickFiltrada(e) {
    console.log(e.checked);
 
    if(e.checked){

      this.listaService.getListaFiltro(this.usuarioSession.usuarioOID).subscribe( 
        (data)=>{
           // console.log(data);
            this.listaFiltrada = data;
            this.selectedLista = this.listaFiltrada[0];
        });
   //  this.conceptoFiltro(e.checked);
    }
  }



  public guardarLista(){   

    console.log("Ando aqui");


    console.log(this.filtro);
    
    if(this.filtro){
      this.catalogo.filtro = 1;
    }else{
      this.catalogo.filtro = 0;
    }


    if(this.filtrada){
      this.catalogo.filtrada = 1;
      console.log(this.selectedLista);
      this.catalogo.listaFiltroOID = this.selectedLista.listaOID;
      this.catalogo.nombreLista = this.selectedLista.nombre;
    }else{
      this.catalogo.filtrada = 0;
      this.catalogo.listaFiltroOID = null;
      this.catalogo.nombreLista = "";
    }

    this.listaService.guardarLista ( this.catalogo,this.usuarioSession.usuarioOID ).subscribe((data)=>{
      console.log(data);   
      this.ref.close(this.catalogo);         
    }); 
 }


 public cancelarLista(){
  this.ref.close(null);   
 }




}
