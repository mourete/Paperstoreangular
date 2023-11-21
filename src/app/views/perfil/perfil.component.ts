import { Perfil } from './../../model/perfil';
import { Component, OnInit } from '@angular/core';
import { Modulo } from 'src/app/model/modulo';
import { Usuario } from './../../model/usuario';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
import {PerfilService } from 'src/app/service/perfil.service';

import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  usuarioSession:Usuario;
  perfil:Perfil;
  passwordConfirm:string;
  dataArray: string[] = [];
  modulos:Modulo[];
  msgs: Message[] = [];
  moduloSeleccionado :Modulo[]

  
  resultadoAccesos : any[];
  perfilSeleccionados: TreeNode[] = [];
  selectedFiles: TreeNode[] = [];
  accesosModulos: TreeNode[];
  accesosModuloSeleccionados: TreeNode[];
 
  
  profilePerfil = this.fb.group({
    perfil: ['',  Validators.required],
    descripcion: ['', Validators.required],
    flag_modulo: [''],

  });

  constructor( public perfilService:PerfilService ,  private fb: FormBuilder,  
           public config: DynamicDialogConfig , public ref: DynamicDialogRef 
     
      ) { }


  get f() { return this.profilePerfil.controls; }


  onSubmit() {

   
    this.guardarPerfil();

   
  }


  ngOnInit(): void {
    

  this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));   
  if (this.config.data.perfilId > 0) {       
         this.getPerfilByID(this.config.data.perfilId , this.usuarioSession.usuarioOID  );      
  }else{       
     this.perfil=new Perfil();
     this.getModuloPerfilJson();
     
  }

}



public getModuloPerfilJson(){
  var perfilID=0;
  var  sdataArray:string;
 
  if( this.perfil==null || this.perfil.perfilId==0 ){
     perfilID=0;
  }else{
    perfilID=this.perfil.perfilId;
  }

  this.perfilService.getModulosJson(  perfilID  , this.usuarioSession.usuarioOID  ) .subscribe( 
    (data)=>{
        this.resultadoAccesos = data;  
       
        this.accesosModulos = JSON.parse(this.resultadoAccesos[1]) ;
        sdataArray = this.resultadoAccesos[0];
        this.dataArray = sdataArray.split("/");
    
        this.checkNode(this.accesosModulos, this.dataArray);
     
     
      
    }
   );

}












public getPerfilByID ( perfilId : number , usuarioConsultaOID: string ){


  this.perfilService.getPerfilById( perfilId , usuarioConsultaOID ).subscribe(
    (data)=>{
      this.perfil =data;  
      this,this.getModuloPerfilJson();
     
   }
  );

}




  public guardarPerfil(){

    this.msgs=[];
 
    /*if(  this.usuario.nombre ==null ||this.usuario.nombre=="" ){
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

    */

    this.setModuloConcat();

    this.perfil.activo=1;
    this.perfilService.guardarPerfil(  this.perfil, this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.perfil=data;     
        this.ref.close(this.perfil);          
      }
  
    );


  }


  public setModuloConcat(){

    if( this.perfil==null ){
      return;
    }

   // var ue:UsuarioEmpresa;
    var moduloConcat:string=null;
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
              if( moduloConcat==null ){
                moduloConcat= this.dataArray[i] +  "|";
              }else{
                moduloConcat+=  this.dataArray[i] +  "|";
              }
           } 
       }
    }
    console.log("concant: " + moduloConcat.substring(0,moduloConcat.length-1))


    this.perfil.moduloConcat=moduloConcat.substring(0,moduloConcat.length-1);


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
  }

nodeUnselect(event) {
  this.removeNode(event.node);
  this.selectedFiles = [];
  this.checkNode(this.accesosModulos, this.dataArray);
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
