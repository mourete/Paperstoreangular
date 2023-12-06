import {Component, OnInit} from '@angular/core';
import {Usuario} from 'src/app/model/usuario';
import {AccountService} from 'src/app/service/account.service'
import {Message} from 'primeng/api';
import {InfoHuesped} from 'src/app/model/info-huesped';
import {DialogService} from 'primeng/dynamicdialog'
import {InfoHuespedComponent} from '../info-huesped/info-huesped.component';
import {UsuarioLog} from 'src/app/model/usuario-log';
import {Router} from "@angular/router";
import {Perfil} from "../../model/perfil";
import {PerfilService} from "../../service/perfil.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService]
})
export class LoginComponent implements OnInit {

  userName:string;
  password:string;
  usuario:Usuario;
  usuarioLog:UsuarioLog;
  perfil:Perfil;
  infoHuespedes:InfoHuesped[];

  msgs: Message[] = [];


  constructor(
    private accountService : AccountService ,
    public dialogService: DialogService ,
    private router: Router,
    public perfilService: PerfilService,
  ) {}



  ngOnInit(): void {
  }




public validateUser(){
  this.msgs=[];
  this.accountService.getByUserAndPassword (  this.userName , this.password   ).subscribe(
    (data)=>{
       this.usuario= data;
       if(  this.usuario==null ){
            this.msgs.push({severity:'error', detail: 'No se encontró un usuario con los datos proporcionados'  , summary:''});
            return;
       }


       if( this.usuario.huesped==0 ){
           this.msgs.push({severity:'error', detail: 'No se encontraron licencias para el usuario'  , summary:'Error de licencia'});
       }else {
           this.getLicenciasByUserOID( this.usuario.usuarioOID );
       }


    }
   );

}



public getLicenciasByUserOID(userOID:string){
  this.accountService.getLicenciasByUserOID( userOID ).subscribe(

    (data)=>{
      this.infoHuespedes = data;

     // if( this.infoHuespedes!=null && this.infoHuespedes.length>0  ){
     //     alert("Numero de licencias :" + this.infoHuespedes.length );
    //  }

      if( this.infoHuespedes.length>1 ){
          this.seleccionarHuesped();
      }else{
        this.loginWithHuesped(this.infoHuespedes[0]);
      }


   }


  );

}



public cancelar(){

}


public login(){
  this.msgs=[];
   if(  this.userName==null || this.userName=="" ){
    this.msgs.push({severity:'error', detail: "Favor de proporcionar el usuario"  , summary:'Validation failed'});
      return;
   }

   if( this.password==null || this.password=="" ){
    this.msgs.push({severity:'error', detail: "Favor de proporcionar el password"  , summary:'Validation failed'});
     return;
   }

   this.validateUser();


}




public seleccionarHuesped(  ){


  let ref= this.dialogService.open( InfoHuespedComponent , {
      header: 'Seleccionar huesped',
      width: '70%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: {  usuarioOID: this.usuario.usuarioOID  }
  });


  ref.onClose.subscribe(( infoHuesped: InfoHuesped   ) => {
    if (infoHuesped!=null  ) {
        this.loginWithHuesped(  infoHuesped  );
    }
  });
}
public loginWithHuesped(infoHuesped: InfoHuesped ){

      var huesped=0;
      var nombreHuesped='';
      if( infoHuesped!=null ){
          huesped=infoHuesped.huespedId;
          nombreHuesped = infoHuesped.nombreHuesped;
      }else{
          huesped=0;
      }

      this.usuario.huesped = huesped;
      this.usuario.huespedNombre = nombreHuesped;
      this.usuario.infoHuesped = infoHuesped;

      this.accountService.usuarioLog(   this.usuario.usuarioOID ,   huesped  ).subscribe (
        (data)=>{
             this.usuarioLog=data;
             this.getPerfil();
             this.setLocalInfo();
             this.router.navigate(['/principal'])
         }
      );


}

getPerfil() {
  const perfiles = this.perfilService.getAll( this.usuario.usuarioOID );
  perfiles.subscribe(data => {
    this.perfil = data[0];
    this.perfil.UsuarioOID = this.usuario.usuarioOID;
    localStorage.setItem('perfil', JSON.stringify(this.perfil));
  })
}


public setLocalInfo(){
     localStorage.setItem('usuario', JSON.stringify(this.usuario));
     localStorage.setItem('usuarioLog', JSON.stringify(this.usuarioLog));
}





}
