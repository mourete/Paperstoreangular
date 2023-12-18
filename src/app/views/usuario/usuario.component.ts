import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { Puesto } from 'src/app/model/puesto';
import { Empresa } from 'src/app/model/empresa';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
import {UsuariosService } from 'src/app/service/usuarios.service';
import { PuestoService } from 'src/app/service/puesto.service';
import { EmpresaService } from 'src/app/service/empresa.service';
import { UsuarioEmpresa } from 'src/app/model/usuario-empresa';
import { PerfilUsuario } from 'src/app/model/perfil-usuario';
import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
//import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  usuarioSession:Usuario;
  usuario:Usuario;
  passwordConfirm:string;
  dataArray: string[] = [];


  selectedPuesto:Puesto;
  selectedEmpresa:Empresa;

  puestos:Puesto[];
  empresas:Empresa[];
  msgs: Message[] = [];
  usuarioEmpresas:UsuarioEmpresa[];
  usuarioPerfiles:PerfilUsuario[];
  usuarioPerfilSeleccionado : PerfilUsuario[] = [];
  tipoVentana: 0; //1= VentanaUsario, 2=VerPerfil
  readOnly : boolean;
  resultadoAccesos : any[];
  accesosSeleccionados: TreeNode[] = [];
  selectedFiles: TreeNode[] = [];
  accesos: TreeNode[];


  profileUsuario = this.fb.group({
    userName: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[A-Z0-9.,]*$/)]],
    nombre: ['', Validators.required],
    pass: ['',  Validators.required],
    passwordConfirm:['',  Validators.required],
    mail: ['', Validators.required],
    direccion: [''],
    telefono: [''],
    selectedPuesto: ['',  Validators.required],
    selectedEmpresa: [''],
    flag_seleccionado: [''],
    flag_puesto: [''],
    flagTodasMarcas : [''],
    ciudadesForm : [''],
    listboxPerfil: ['']


  });

  constructor( public empresaService:EmpresaService ,  private fb: FormBuilder,
     public puestoService:PuestoService ,  public usuariosService:UsuariosService ,
      public config: DynamicDialogConfig , public ref: DynamicDialogRef

      ) { }


  get f() { return this.profileUsuario.controls; }


  onSubmit() {






    this.guardarUsuario();


  }


  ngOnInit(): void {

this.readOnly=false;
  this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.config.data.usuarioOID = '4cd877c4-7eff-46da-b67a-738d6d36bcb8';
  if( this.config.data.usuarioOID!=null &&this.config.data.usuarioOID!= ""   ){
    if(this.config.data.tipoVentana==2) this.readOnly=true;

         this.getUsuarioByOID(  this.config.data.usuarioOID , this.usuarioSession.usuarioOID  );

  }else{
     this.usuario=new Usuario();
     this.usuario.usuarioCreated=this.usuarioSession.usuarioOID;
     this.usuario.huesped = this.usuarioSession.huesped;
     this.getAllPuestos();
     //this.getEmpUsuarioByUserOID();
     this.getEmpUsuarioByUserOIDJson();

  }

}


public getEmpUsuarioByUserOID(){
  var userOID=null;

  if( this.usuario==null || this.usuario.usuarioOID==null || this.usuario.usuarioOID==""   ){
      userOID=null;
  }else{
      userOID=this.usuario.usuarioOID;
  }

  this.usuariosService.getEmpUsuarioByUserOID(  userOID  , this.usuarioSession.usuarioOID  ) .subscribe(
    (data)=>{

       this.usuarioEmpresas=data;

       //this.initFlags();
    }
   );

}

public getEmpUsuarioByUserOIDJson(){
  var userOID="*";
  var  sdataArray:string;

  if( this.usuario==null || this.usuario.usuarioOID==null ){
      userOID="*";
  }else{
      userOID=this.usuario.usuarioOID;
  }
  console.log(userOID);
  this.usuariosService.getEmpUsuarioByUserOIDJson(  userOID  , this.usuarioSession.usuarioOID  ) .subscribe(
    (data)=>{
        this.resultadoAccesos = data;

        this.accesos = JSON.parse(this.resultadoAccesos[1]) ;
        sdataArray = this.resultadoAccesos[0];
        this.dataArray = sdataArray.split("/");

        this.checkNode(this.accesos, this.dataArray);
        this.getAllPuestos();
     // this.getEmpUsuarioByUserOID();


    }
   );

}




public getPerfilesByUsuarioOID(){
  var userOID="*";

  if( this.usuario==null || this.usuario.usuarioOID==null || this.usuario.usuarioOID==""   ){
      userOID="*";
  }else{
      userOID=this.usuario.usuarioOID;
  }

  this.usuariosService.getPerfilesByUsuarioOID (  userOID, this.usuarioSession.usuarioOID    ) .subscribe(
    (data)=>{

       this.usuarioPerfiles=data;

       this.initFlagsPerfiles();
    }

   );

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



  public getAllPuestos (  ){
    this.puestoService.getAllPuestos (this.usuarioSession.usuarioOID).subscribe(
      (data)=>{
        this.puestos=data;
        if(  this.usuario.puestoId>0 ){
            this.setCurrentPuesto();

        }
        this.getPerfilesByUsuarioOID();
     }
    );

}



public getEmpresasByUsuarioOID(){

  this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
    (data)=>{
      this.empresas=data;
      console.log( "getEmpresasByUsuarioOID:" + this.empresas);

   }
  );

}
/*
public getAllEmpresas (  ){

  this.empresaService.getAll().subscribe(
    (data)=>{
      this.empresas=data;
   }
  );

}*/



  public setCurrentPuesto(){
    if( this.puestos==null || this.puestos.length<=0 ){
      return;
    }

    for( var  i=0; i<this.puestos.length; i++  ){
      if( this.puestos[i].puestoId==this.usuario.puestoId  ){
        this.selectedPuesto=this.puestos[i];

      }

    }


  }


public getUsuarioByOID ( usuarioOID : string , usuarioConsultaOID: string ){



  this.usuariosService.getUsuarioByOID ( usuarioOID , usuarioConsultaOID ).subscribe(
    (data)=>{

      this.usuario =data;
      this.passwordConfirm=this.usuario.pass;
      this.getEmpUsuarioByUserOIDJson();

   }
  );

}






  public puestoChanged(){

  }


  public empresaChanged(){

  }


  public guardarUsuario(){

    this.msgs=[];
    console.log("huesped: " + this.usuarioSession.usuarioOID);
    console.log("huesped1: " + this.usuarioSession.huesped);
    if(  this.usuario.nombre ==null ||this.usuario.nombre=="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el nombre del usuario "  , summary:'Validation failed'});
      return;
    }

    if(  this.usuario.userName ==null ||this.usuario.userName =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el usuario "  , summary:'Validation failed'});
      return;
    }


    if(  this.usuario.pass ==null ||this.usuario.pass =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el password del usuario "  , summary:'Validation failed'});
      return;
    }


    if(  this.passwordConfirm ==null ||this.passwordConfirm =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar la confirmación del password "  , summary:'Validation failed'});
      return;
    }


    if(  this.usuario.pass!=this.passwordConfirm  ){
       this.msgs.push({severity:'error', detail: "La confirmación del password es incorrecta "  , summary:'Validation failed'});
       return;
    }



    if(  this.usuario.mail ==null ||this.usuario.mail =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el correo del usuario "  , summary:'Validation failed'});
      return;
    }
    if(  this.dataArray ==null ||this.dataArray.length ==0 ){
      this.msgs.push({severity:'error', detail: "Se requiere accesos al usuario "  , summary:'Validation failed'});
      return;
    }
    if(  this.usuarioPerfilSeleccionado ==null ||this.usuarioPerfilSeleccionado.length ==0 ){
      console.log(this.usuarioPerfilSeleccionado.length);

      this.msgs.push({severity:'error', detail: "Se requiere puestos del usuario "  , summary:'Validation failed'});
      return;
    }

    if(  this.accesosSeleccionados ==null ||this.accesosSeleccionados.length ==0 ){
      console.log(this.accesosSeleccionados.length);
      this.msgs.push({severity:'error', detail: "Se requiere seleccionar accesos al menos a una empresa"  , summary:'Validation failed'});
      return;
    }

    if( this.selectedPuesto!=null ){
       this.usuario.puestoId=this.selectedPuesto.puestoId;
    }

    if( this.usuario.usuarioOID!=null && this.usuario.usuarioOID!="" ){
       this.usuario.usuarioUpdated=this.usuarioSession.usuarioOID;
       this.usuario.huesped =this.usuarioSession.huesped;

    }



    this.setEmpresasConcat();
    this.setPerfilesConcat();
    this.usuario.activo=1;
    this.usuariosService.guardarUsuario(  this.usuario, this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.usuario=data;
        this.ref.close(this.usuario);
      }

    );


  }


  public setEmpresasConcat(){

    if( this.usuario==null ){
      return;
    }

    var ue:UsuarioEmpresa;
    var empresasConcat:string=null;
    var todasMarcas:number;
    if( this.dataArray!=null && this.dataArray.length>0  ){

       for( var i=0;i< this.dataArray.length; i++  ){

          /* ue=this.usuarioEmpresas[i];
           if(ue==null){
             continue;
           }

           if( !ue.flagSeleccionada ){
              continue;
           }

           todasMarcas=0;
           if( ue.flagTodasMarcas ){
             todasMarcas=1;
           }
 */        if(this.dataArray[i]!=null && this.dataArray[i].length>0)
           {
              if( empresasConcat==null ){
                  empresasConcat= this.dataArray[i] +  "|";
              }else{
                  empresasConcat+=  this.dataArray[i] +  "|";
              }
           }
       }
    }
    console.log("concant: " + empresasConcat.substring(0,empresasConcat.length-1))


    this.usuario.empresasConcat=empresasConcat.substring(0,empresasConcat.length-1);


  }




  public setPerfilesConcat(){

    if( this.usuario==null ){
      return;
    }

    var pu:PerfilUsuario;
    var perfilesConcat:string=null;

    if( this.usuarioPerfilSeleccionado!=null && this.usuarioPerfilSeleccionado.length>0  ){

       for( var i=0;i< this.usuarioPerfilSeleccionado.length; i++  ){
           pu=this.usuarioPerfilSeleccionado[i];
           if(pu==null){
             continue;
           }

          /* if( !pu.flagSeleccionado ){
              continue;
           }
 */

           if( perfilesConcat==null ){
              perfilesConcat= "" + pu.perfilId  ;
           }else{
              perfilesConcat+= "|" +  pu.perfilId ;
           }


       }
    }

   this.usuario.perfilesConcat=perfilesConcat;
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
                    if(!this.accesosSeleccionados.includes(nodes[i].children[j])){
                        this.accesosSeleccionados.push(nodes[i].children[j]);


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
            if(this.accesosSeleccionados.includes(nodes[i].children[j])) {
                c++;
            }
            if(nodes[i].children[j].partialSelected){
              nodes[i].partialSelected = true;

            }
        }
        if(c == 0) {}
        else if(c == count) {
            nodes[i].partialSelected = false;
            if(!this.accesosSeleccionados.includes(nodes[i])){
                this.accesosSeleccionados.push(nodes[i]);
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
  this.checkNode(this.accesos, this.dataArray);
  }

nodeUnselect(event) {
  this.removeNode(event.node);
  this.selectedFiles = [];
  this.checkNode(this.accesos, this.dataArray);
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


}
