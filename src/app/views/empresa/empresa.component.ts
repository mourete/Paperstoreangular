import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Empresa } from 'src/app/model/empresa';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
import {EmpresaService} from 'src/app/service/empresa.service' ;
import { Usuario } from 'src/app/model/usuario';
import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})

export class EmpresaComponent implements OnInit {

  @ViewChild('claveInput') claveInput: ElementRef;

  empresa:Empresa;
  activa:boolean;
  usuarioSession:Usuario;
  msgs: Message[] = [];



  profileForm = this.fb.group({
    clave: ['',  Validators.required],
    nombre: ['', Validators.required],
    activa: ['',  Validators.required],
    email: ['', Validators.required]
  });

  constructor(private empresaService : EmpresaService ,
              public config: DynamicDialogConfig ,
              public ref: DynamicDialogRef,
              private fb: FormBuilder  ) { }


    get nombre() { return this.profileForm.get('nombre'); }


    get email() { return this.profileForm.get('email'); }


    get clave() { return this.profileForm.get('clave'); }



  ngOnInit(): void {

    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));

    if( this.config.data.empresaId >0  ){
         this.getEmpresaById(  this.config.data.empresaId);
  }else{
     this.empresa=new Empresa();
     this.empresa.usuarioCreated=this.usuarioSession.usuarioOID;
      this.activa = true;
  }


  }


  public getEmpresaById ( empresaId : number ){

        this.empresaService.getByEmpresaId( empresaId , this.usuarioSession.usuarioOID ).subscribe(
          (data)=>{

            this.empresa=data;
            if( this.empresa!=null ) {
               if( this.empresa.activo==1 ){
                 this.activa=true;
               }else{
                 this.activa=false;
               }

            }
         }
        );

  }


public guardarEmpresa(){


  this.msgs=[];
  if(  this.empresa.nombre ==null ||this.empresa.nombre=="" ){
    this.msgs.push({severity:'error', detail: "Se requiere capturar el nombre de la empresa"  , summary:'Validation failed'});
    return;
  }

  if(  this.empresa.clave ==null ||this.empresa.clave=="" ){
    this.msgs.push({severity:'error', detail: "Se requiere capturar la clave"  , summary:'Validation failed'});
    return;
  }

  let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');


  if(  this.empresa.email ==null || this.empresa.email=="" ||  !regexpEmail.test(this.empresa.email) )
  {
    this.msgs.push({severity:'error', detail: "Se requiere un correo valido"  , summary:'Validation failed'});
    return;
  }

  if(this.activa==true){
       this.empresa.activo=1;
  }else{
       this.empresa.activo=0;
  }




  this.empresaService.guardarEmpresa(  this.empresa , this.usuarioSession.usuarioOID).subscribe(
    (data)=>{
     // this.empresa=data;
      this.ref.close(this.empresa);
    }

  );

}


public cancelar(){
  this.ref.close();
}



public customPatterns = { 'XX': { pattern: new RegExp('\[a-zA-Z\]'), optional: false} };


onBlurMethod(type : String){

  if(type == "nombre"){

  }

}


onSubmit() {

  console.warn(this.profileForm.value);

  console.warn(this.empresa);


  this. guardarEmpresa();

}

convertirAMayusculas() {
  const claveValue: string = this.profileForm.get('clave').value;
  this.profileForm.get('clave').setValue(claveValue.toUpperCase());
}




}



