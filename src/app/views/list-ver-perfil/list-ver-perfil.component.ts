import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {ListVerPerfil} from "../../model/list-verPerfil";
import { Puesto } from 'src/app/model/puesto';
import { Empresa } from 'src/app/model/empresa';
import {Message} from 'primeng/api';
import {UsuariosService } from 'src/app/service/usuarios.service';
import { PuestoService } from 'src/app/service/puesto.service';
import { EmpresaService } from 'src/app/service/empresa.service';
import { UsuarioEmpresa } from 'src/app/model/usuario-empresa';
import { PerfilUsuario } from 'src/app/model/perfil-usuario';
import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import {Usuario} from "../../model/usuario";

@Component({
  selector: 'app-list-ver-perfil',
  templateUrl: './list-ver-perfil.component.html',
  styleUrls: ['./list-ver-perfil.component.scss']
})
export class ListVerPerfilComponent implements OnInit {
  listVerPerfil: ListVerPerfil | null;
  usuarioSession:ListVerPerfil;
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
  resultadoAccesos : any[];
  accesosSeleccionados: TreeNode[] = [];
  selectedFiles: TreeNode[] = [];
  accesos: TreeNode[];

  profileListVerPerfil = this.fb.group({
    userName: [''],
    nombre: [''],
    pass: [''],
    passwordConfirm:[''],
    mail: [''],
    direccion: [''],
    telefono: [''],
    selectedPuesto: [''],
    selectedEmpresa: [''],
    flag_seleccionado: [''],
    flag_puesto: [''],
    flagTodasMarcas : [''],
    ciudadesForm : [''],
    listboxPerfil: ['']

  });

  constructor(
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      public empresaService:EmpresaService,
      private fb: FormBuilder,
      public puestoService:PuestoService,
      public usuariosService:UsuariosService
  ) { }

  get f() { return this.profileListVerPerfil.controls; }


  onSubmit() {

    this.guardarUsuario();

  }

  ngOnInit(): void {


    this.usuarioSession = JSON.parse(localStorage.getItem('listVerPerfil'));
    if( this.config.data.usuarioOID!=null &&this.config.data.usuarioOID!= ""   ){
      this.getUsuarioByOID(  this.config.data.usuarioOID , this.usuarioSession.usuarioOID  );
    }else{
      this.listVerPerfil=new Usuario();
      this.listVerPerfil.usuarioCreated=this.usuarioSession.usuarioOID;
      this.listVerPerfil.huesped = this.usuarioSession.huesped;
      this.getAllPuestos();
      //this.getEmpUsuarioByUserOID();
      this.getEmpUsuarioByUserOIDJson();

    }

  }

  public getEmpUsuarioByUserOID(){
    var userOID=null;

    if( this.listVerPerfil==null || this.listVerPerfil.usuarioOID==null || this.listVerPerfil.usuarioOID==""   ){
      userOID=null;
    }else{
      userOID=this.listVerPerfil.usuarioOID;
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

    if( this.listVerPerfil==null || this.listVerPerfil.usuarioOID==null ){
      userOID="*";
    }else{
      userOID=this.listVerPerfil.usuarioOID;
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

    if( this.listVerPerfil==null || this.listVerPerfil.usuarioOID==null || this.listVerPerfil.usuarioOID==""   ){
      userOID="*";
    }else{
      userOID=this.listVerPerfil.usuarioOID;
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
          if(  this.listVerPerfil.puestoId>0 ){
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


  public setCurrentPuesto(){
    if( this.puestos==null || this.puestos.length<=0 ){
      return;
    }

    for( var  i=0; i<this.puestos.length; i++  ){
      if( this.puestos[i].puestoId==this.listVerPerfil.puestoId  ){
        this.selectedPuesto=this.puestos[i];

      }

    }


  }


  public getUsuarioByOID ( usuarioOID : string , usuarioConsultaOID: string ){


    this.usuariosService.getUsuarioByOID ( usuarioOID , usuarioConsultaOID ).subscribe(
        (data)=>{
          this.listVerPerfil =data;
          this.passwordConfirm=this.listVerPerfil.pass;
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
    if(  this.listVerPerfil.nombre ==null ||this.listVerPerfil.nombre=="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el nombre del listVerPerfil "  , summary:'Validation failed'});
      return;
    }

    if(  this.listVerPerfil.userName ==null ||this.listVerPerfil.userName =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el listVerPerfil "  , summary:'Validation failed'});
      return;
    }


    if(  this.listVerPerfil.pass ==null ||this.listVerPerfil.pass =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el password del listVerPerfil "  , summary:'Validation failed'});
      return;
    }


    if(  this.passwordConfirm ==null ||this.passwordConfirm =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar la confirmación del password "  , summary:'Validation failed'});
      return;
    }


    if(  this.listVerPerfil.pass!=this.passwordConfirm  ){
      this.msgs.push({severity:'error', detail: "La confirmación del password es incorrecta "  , summary:'Validation failed'});
      return;
    }



    if(  this.listVerPerfil.mail ==null ||this.listVerPerfil.mail =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el correo del listVerPerfil "  , summary:'Validation failed'});
      return;
    }
    if(  this.dataArray ==null ||this.dataArray.length ==0 ){
      this.msgs.push({severity:'error', detail: "Se requiere accesos al listVerPerfil "  , summary:'Validation failed'});
      return;
    }
    if(  this.usuarioPerfilSeleccionado ==null ||this.usuarioPerfilSeleccionado.length ==0 ){
      console.log(this.usuarioPerfilSeleccionado.length);

      this.msgs.push({severity:'error', detail: "Se requiere puestos del listVerPerfil "  , summary:'Validation failed'});
      return;
    }

    if(  this.accesosSeleccionados ==null ||this.accesosSeleccionados.length ==0 ){
      console.log(this.accesosSeleccionados.length);
      this.msgs.push({severity:'error', detail: "Se requiere seleccionar accesos al menos a una empresa"  , summary:'Validation failed'});
      return;
    }

    if( this.selectedPuesto!=null ){
      this.listVerPerfil.puestoId=this.selectedPuesto.puestoId;
    }

    if( this.listVerPerfil.usuarioOID!=null && this.listVerPerfil.usuarioOID!="" ){
      this.listVerPerfil.usuarioUpdated=this.usuarioSession.usuarioOID;
      this.listVerPerfil.huesped =this.usuarioSession.huesped;

    }



    this.setEmpresasConcat();
    this.setPerfilesConcat();
    this.listVerPerfil.activo=1;
    this.usuariosService.guardarUsuario(  this.listVerPerfil, this.usuarioSession.usuarioOID ).subscribe(
        (data)=>{
          this.listVerPerfil=data;
          this.ref.close(this.listVerPerfil);
        }

    );


  }


  public setEmpresasConcat(){

    if( this.listVerPerfil==null ){
      return;
    }

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
    console.log("concant: " + empresasConcat.substring(0,empresasConcat.length-1))


    this.listVerPerfil.empresasConcat=empresasConcat.substring(0,empresasConcat.length-1);


  }




  public setPerfilesConcat(){

    if( this.listVerPerfil==null ){
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

    this.listVerPerfil.perfilesConcat=perfilesConcat;
  }

  public cerrar(){
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
