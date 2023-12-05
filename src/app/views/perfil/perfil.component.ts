import { Perfil } from './../../model/perfil';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Modulo } from 'src/app/model/modulo';
import { Usuario } from './../../model/usuario';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef, DialogService} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
import {PerfilService } from 'src/app/service/perfil.service';
import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {PerfilUsuario} from "../../model/perfil-usuario";
import {PuestoService} from "../../service/puesto.service";
import {Puesto} from "../../model/puesto";
import {UsuarioEmpresa} from "../../model/usuario-empresa";



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {


  perfilSession: Perfil;
  perfil:Perfil;
  puestos:Puesto[];
  dataArray: string[] = [];
  modulos:Modulo[];
  selectedPuesto:Puesto;
  msgs: Message[] = [];
  moduloSeleccionado :Modulo;
  resultadoAccesos : any[];
  perfilSeleccionados: TreeNode[] = [];
  selectedFiles: TreeNode[] = [];
  accesosModulos: TreeNode[];
  accesosModuloSeleccionados: TreeNode[] = [];
  usuarioPerfiles:PerfilUsuario[];
  usuarioPerfilSeleccionado : PerfilUsuario[] = [];
  profilePerfil: FormGroup;
    noEditable: boolean;


  constructor( public perfilService:PerfilService ,  private fb: FormBuilder,
           public config: DynamicDialogConfig , public ref: DynamicDialogRef,
               public dialogService: DialogService, public puestoService:PuestoService
      ) {

    this.profilePerfil = this.fb.group({
      clave: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[A-Z0-9]*$')]],
      perfilName: ['', Validators.required],
      descripcion: [''],
        noEditable: [''],
        readOnly: [''],
        activa: [''],
        dashboard: [''],
      flag_modulo: ['']
    })
  }

  get clave() { return this.profilePerfil.get('clave'); }
  get f() { return this.profilePerfil.controls; }


  onSubmit() {

    this.guardarPerfil();

  }


  ngOnInit(): void {

    const perfilSession = localStorage.getItem('perfil');
    if(perfilSession){
      this.perfilSession = JSON.parse(perfilSession);
    }

  if (this.config && this.config.data && this.config.data.perfilId ) {
      this.getPerfilByID(this.config.data.perfilId , this.perfilSession.perfilId  );

  }else{
    this.perfil=new Perfil();
    this.perfil.perfilCreated=this.perfilSession.perfilId;
    this.perfil.huesped = this.perfilSession.huesped;
    this.getAll();
     this.getModuloPerfilJson();

  }

  this.profilePerfil.valueChanges.subscribe( val => {
    if(this.perfil){
      this.perfil.clave = val.clave;
      this.perfil.perfilName = val.perfilName;
      this.perfil.descripcion = val.descripcion;
      this.perfil.noEditable = val.noEditable;
      this.perfil.readOnly = val.readOnly;
      this.perfil.activa = val.activa;
      this.perfil.dashboard = val.dashboard;
      this.perfil.flag_modulo = val.flag_modulo;
    }
  });

  this.noEditable = false;

}



public getModuloPerfilJson(){
  var perfilID="*";
  var  sdataArray:string;

  if( this.perfil==null || this.perfil.perfilId==null ){
     perfilID="*";
  }else{
    perfilID=this.perfil.perfilId;
  }

  this.perfilService.getPerfilModulosJson(  perfilID  , this.perfilSession.perfilId  ) .subscribe(
    (data)=>{
        this.resultadoAccesos = data;

        this.accesosModulos = JSON.parse(this.resultadoAccesos[1]) ;
        sdataArray = this.resultadoAccesos[0];
        this.dataArray = sdataArray.split("/");

        this.checkNode(this.accesosModulos, this.dataArray);
        this.getAll()



    }
   );

}


public getPerfilByID(perfilId: string, perfilConsultaID: string){


  this.perfilService.getPerfilById( perfilId , perfilConsultaID ).subscribe(
    (data)=>{

      this.perfil =data;

      this.getModuloPerfilJson();
   },

  );
}

  public empresaChanged(){

  }


  public initFlagsPerfiles() {
    if( this.usuarioPerfiles==null || this.usuarioPerfiles.length<=0 ){
      return;
    }


    var pu:PerfilUsuario;
    for( var i=0;i< this.usuarioPerfiles.length;i++ ){
      pu=this.usuarioPerfiles[i];
      if(pu==null){
        continue;
      }

      if(pu.seleccionado==1){
        this.usuarioPerfilSeleccionado.push(pu);
      }
    }
  }

  public getAll (  ){
    this.puestoService.getAllPuestos (this.perfilSession.perfilId).subscribe(
      (data)=>{
        this.puestos=data;
        if(  this.perfil.puestoId>0 ){
          this.setCurrentPuesto();


        }
        this.getPerfilesByUsuarioOID();

      }
    );

  }

  public setCurrentPuesto(){
    if( this.puestos==null || this.puestos.length<=0 ){
      return;
    }

    for( var  i=0; i<this.puestos.length; i++  ){
      if( this.puestos[i].puestoId==this.perfil.puestoId  ){
        this.selectedPuesto=this.puestos[i];

      }

    }


  }

  public getPerfilesByUsuarioOID(){
    var perfilID="*";

    if( this.perfil==null || this.perfil.usuarioOID==null || this.perfil.usuarioOID==""   ){
      perfilID="*";
    }else{
      perfilID=this.perfil.perfilId;
    }

    this.perfilService.getPerfilesByPerfilID (  perfilID, this.perfilSession.perfilId    ) .subscribe(
      (data)=>{

        this.usuarioPerfiles=data;

        this.initFlagsPerfiles();
      }

    );

  }





  public guardarPerfil(){

    this.msgs=[];

    if(!this.perfilSession) {

      if( this.moduloSeleccionado!=null ){
         this.perfil.ModuloId=this.moduloSeleccionado.moduloId;
      }

      if( this.perfil.perfilId!=null && this.perfil.perfilId!="" ){
         this.perfil.perfilUpdated=this.perfilSession.perfilId;
         this.perfil.huesped =this.perfil.huesped;

      }
      if (this.noEditable) {
        this.perfil.noEditable = 1;
      } else {
        this.perfil.noEditable = 0;
      }


      this.setModuloConcat();

      this.perfil.Activo = 1;
      this.perfilService.guardarPerfil(this.perfil, this.perfilSession.perfilId).subscribe(
        (data) => {
          this.perfil = data;
          this.ref.close(this.perfil);
        }
      );

    }
  }


  public setModuloConcat(){

    if( this.perfil==null){
      return;
    }

   // var ue:UsuarioEmpresa;
    var ue:UsuarioEmpresa;
    var empresasConcat:string=null;
    var todasMarcas:number;
    if( this.dataArray!=null && this.dataArray.length>0  ){

       for( var i=0;i< this.dataArray.length; i++  ){

         if(this.dataArray[i]!=null && this.dataArray[i].length>0)
           {
              if( empresasConcat==null ){
                empresasConcat= this.dataArray[i] +  "|";
              }else{
                empresasConcat+=  this.dataArray[i] +  "|";
              }
           }
       }
    }

    if (empresasConcat) {
      this.perfil.moduloConcat = empresasConcat.substring(0, empresasConcat.length - 1);
    }

  }




  public cancelar(){
    this.ref.close();
  }


  checkNode(nodes:TreeNode[], str:string[]) {

    for(let i=0 ; i < nodes.length ; i++) {
       if(!nodes[i].leaf && nodes[i].children.length>0) {
          if(nodes[i].children[0].leaf) {

           for(let j=0 ; j < nodes[i].children.length ; j++) {

                if(str.includes(nodes[i].children[j].key)) {
                    if(!this.accesosModuloSeleccionados.includes(nodes[i].children[j])){
                        this.accesosModuloSeleccionados.push(nodes[i].children[j]);


                    }
                }
            }
          }
        }
        if (nodes[i].leaf) {
           return;
        }
        this.checkNode(nodes[i].children, str);
        let count = nodes[i].children.length;
        let c = 0;
        for(let j=0 ; j < nodes[i].children.length ; j++) {
            if(this.accesosModuloSeleccionados.includes(nodes[i].children[j])) {
                c++;
            }
            if(nodes[i].children[j].partialSelected){
              nodes[i].partialSelected = true;

            }
        }
        if(c == 0) {}
        else if(c == count) {
            nodes[i].partialSelected = false;
            if(!this.accesosModuloSeleccionados.includes(nodes[i])){
                this.accesosModuloSeleccionados.push(nodes[i]);
            }
        }
        else {
            nodes[i].partialSelected = true;
        }
    }

}
nodeSelect(event) {
  this.addNode(event.node);
  this.selectedFiles = [];
  this.checkNode(this.accesosModulos, this.dataArray);
  this.profilePerfil.get('flag_modulo').setValue(this.dataArray)
  }

nodeUnselect(event) {
  this.removeNode(event.node);
  this.selectedFiles = [];
  this.checkNode(this.accesosModulos, this.dataArray);
  this.profilePerfil.get('flag_modulo').setValue(this.dataArray)
}

removeNode(node: TreeNode) {
  if(node.leaf) {
      this.dataArray.splice(this.dataArray.indexOf(node.key),1);
      return;
  }
  for(let i=0 ; i < node.children.length ; i++){
      this.removeNode(node.children[i]);
  }
}

addNode(node: TreeNode) {
  if(node.leaf) {

      if(!this.dataArray.includes(node.key)){
          this.dataArray.push( node.key);

      }
      return;
  }
  for(let i=0 ; i < node.children.length ; i++) {
      this.addNode(node.children[i]);
  }
}

  convertirAMayusculas() {

    const claveValue = this.profilePerfil.get('clave').value;
    this.profilePerfil.get('clave').setValue(claveValue.toUpperCase(), { emitEvent: false });
  }


}
