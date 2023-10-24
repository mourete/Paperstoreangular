import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';
import { DialogService } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { Usuario } from 'src/app/model/usuario';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Message } from 'primeng';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})

export class ListaComponent implements OnInit {

  @ViewChild('claveInput') claveInput: ElementRef;
  catalogo:Lista;
  listaAccion:string;
  filtro : boolean = false;
  filtrada : boolean = false;
  selectedLista : Lista;
  listaFiltrada:Lista[];
  usuarioSession:Usuario;
  msgs: Message[] = [];

  profileForm = this.fb.group({
    clave: ['',  Validators.required],
    nombre: ['', Validators.required]

  });

  constructor(private listaService : ListaService ,
              public config: DynamicDialogConfig ,
              public ref: DynamicDialogRef,
              private fb: FormBuilder
              ) { }


    get clave() { return this.profileForm.get('clave'); }
    get nombre() { return this.profileForm.get('nombre'); }




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

 onSubmit() {

  console.warn(this.profileForm.value);

  console.warn(this.catalogo);


  this.guardarLista();

}

 convertirAMayusculas() {
  const claveValue: string = this.catalogo.clave;
  this.catalogo.clave = claveValue.toUpperCase();
}


}
