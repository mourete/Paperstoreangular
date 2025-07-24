import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { InputTextModule} from "primeng/inputtext";
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
  profileForm: FormGroup;

  constructor(private listaService : ListaService ,
              public config: DynamicDialogConfig ,
              public ref: DynamicDialogRef,
              private fb: FormBuilder
              ) {

    this.profileForm = this.fb.group({
      clave: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[A-Z0-9]*$')]],
      nombre: ['', Validators.required],
      filtro: [false],
      filtrada: [false],
      selectedLista: [null]
    });
  }


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
      this.profileForm.valueChanges.subscribe(val => {
          if (this.catalogo) {
              this.catalogo.clave = val.clave;
              this.catalogo.nombre = val.nombre;
              this.catalogo.filtro = val.filtro;
              this.catalogo.filtrada = val.filtrada;
              this.catalogo.listaFiltroOID = val.lista;
          }
      });


  }



  public getListaByOID( listaOID : string ){
    this.catalogo=null;

    this.listaService.getListaByListaOID( listaOID , this.usuarioSession.usuarioOID).subscribe(
      (data)=>{

          this.catalogo =data;
          if (this.catalogo) {
              this.profileForm.patchValue({
                  clave: this.catalogo.clave,
                  nombre: this.catalogo.nombre,
                  filtro: this.catalogo.filtro === 1,
                  filtrada: this.catalogo.filtrada === 1,
                  selectedLista: {
                      listaOID: this.catalogo.listaFiltroOID,
                      nombre: this.catalogo.nombreLista
                  }
              });
          }

          if(this.catalogo.filtro == 1)
            this.filtro = true ;

          if(this.catalogo.filtrada == 1){
            this.filtrada = true ;

            this.listaService.getListaFiltro(this.usuarioSession.usuarioOID).subscribe(
              (data)=>{
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
    this.profileForm.get('filtro').setValue(e.checked);
  }


  public clickFiltrada(e) {

    if(e.checked){

      this.listaService.getListaFiltro(this.usuarioSession.usuarioOID).subscribe(
        (data)=>{
            this.listaFiltrada = data;
            this.selectedLista = this.listaFiltrada[0];
        });
   //  this.conceptoFiltro(e.checked);
    }
  }



  public guardarLista() {
      if (this.profileForm.valid) {
          const formValues = this.profileForm.value;

          this.catalogo.clave = formValues.clave.toUpperCase();
          this.catalogo.nombre = formValues.nombre;
          this.catalogo.filtro = formValues.filtro ? 1 : 0;
          this.catalogo.filtrada = formValues.filtrada ? 1 : 0;
          this.catalogo.listaFiltroOID = formValues.selectedLista ? formValues.selectedLista.listaOID : null;
          this.catalogo.nombreLista = formValues.selectedLista ? formValues.selectedLista.nombre : '';

          if (formValues.filtrada) {
          this.catalogo.listaFiltroOID = this.selectedLista ? this.selectedLista.listaOID : null;
          this.catalogo.nombreLista = this.selectedLista ? this.selectedLista.nombre : '';
      } else {
          this.catalogo.listaFiltroOID = null;
          this.catalogo.nombreLista = "";
      }

          if(formValues.selectedLista){
            this.catalogo.listaFiltroOID = formValues.selectedLista.listaOID;
            this.catalogo.nombreLista = formValues.selectedLista.nombre;
          }
          else {
              this.catalogo.listaFiltroOID = null;
              this.catalogo.nombreLista = null;
          }

      this.listaService.guardarLista(this.catalogo, this.usuarioSession.usuarioOID).subscribe((data) => {
          this.ref.close(this.catalogo);
      });
      } else {
          this.msgs = [];
          this.msgs.push({severity:'error', summary:'Error', detail:'Faltan campos por rellenar'});

}

 }


 public cancelarLista(){
  this.ref.close(null);
 }

 onSubmit() {

 if (this.profileForm.valid) {
   this.guardarLista();
 }else{
   this.msgs = [];
   this.msgs.push({severity:'error', summary:'Error', detail:'Faltan campos por rellenar'});
 }

}

 convertirAMayusculas() {

   const claveValue = this.profileForm.get('clave').value;
   this.profileForm.get('clave').setValue(claveValue.toUpperCase(), { emitEvent: false });
 }


}
