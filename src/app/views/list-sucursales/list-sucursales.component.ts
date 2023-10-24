import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Sucursal } from 'src/app/model/sucursal';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { SucursalService } from 'src/app/service/sucursal.service';
import { SucursalComponent } from '../sucursal/sucursal.component';
import { UsuarioMarcasComponent } from '../usuario-marcas/usuario-marcas.component';

@Component({
  selector: 'app-list-sucursales',
  templateUrl: './list-sucursales.component.html',
  styleUrls: ['./list-sucursales.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListSucursalesComponent implements OnInit {

  usuarioSession:Usuario;
  usuarioOID :string;
  sucursales:Sucursal[];
  selectedSucursal:Sucursal;
  selectedEmpresa:Empresa;
  selectedMarca:Marca;
  itemsSucursal: MenuItem[];
  empresas:Empresa[];
  marcas:Marca[];

  constructor(public sucursalService:SucursalService ,  public marcaService:MarcaService ,  public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID=this.usuarioSession.usuarioOID;
   // this.getSucursalesByUsuarioOID();
    this.getEmpresasByUsuarioOID();
  }


  public getSucursalesByUsuarioOID(){
    if( this.usuarioSession==null ){
      return;
    }
    this.sucursalService.getSucursalesByUsuarioOID (  this.usuarioSession.usuarioOID ) .subscribe(
      (data)=>{
         console.log( data );
         console.log("Soy yo");
         this.sucursales=data;
      }
     );

  }



  public getEmpresasByUsuarioOID(){
    this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        //this.empresas=data;

        this.empresas = new Array(data.length+1);
        this.empresas[0] = {activo:0, empresaId:0,nombre:"Todas", encargado:"",
        email:"",
        notificaciones:0,
          usuarioCreated:"",
          direccion:"",
        rfc:"",
        activa:"",
        clave:""};

        data.forEach((element, index) => {
          this.empresas[++index] = element;
        });


        if( this.empresas!=null && this.empresas.length>0 ){
          this.selectedEmpresa=this.empresas[0];
          this.getMarcasByEmpresaYUsuario();
        }

     }
    );

  }



  public getMarcasByEmpresaYUsuario(){
    if( this.usuarioSession==null  || this.selectedEmpresa==null  ){
      return;
    }

    this.marcaService.getMarcasByEmpresaYUsuario  (  this.usuarioSession.usuarioOID , this.selectedEmpresa.empresaId  ) .subscribe(
      (data)=>{
        /* console.log( data );
         this.marcas=data;   */

         if(data != null )
         {
           this.marcas = new Array(data.length+1);
         }else
           this.marcas = new Array(1);

        this.marcas[0] = {  marcaId:0,
         nombre:"Todas",
         clave:"",
         empresaId:0,
         encargado:"",
         notificaciones:0,
         activo:0,
         numero:0,
         calle:"",
         colonia:"",
         entreCalle:"",
         cp:"",
         mail:"",
         ciudadId:0,
         estado:"",
         ciudad:"",
         empresa:"",
         usuarioCreated:"",
         usuarioUpdated:"",

         activoText:"",
         flagActivo:true};

         if(data != null )
        data.forEach((element, index) => {
         this.marcas[++index] = element;
        });


         if( this.marcas!=null && this.marcas.length>0 ){
             this.selectedMarca=this.marcas[0];
             this.getSucursagetSucursalesByMarcaYEmpresalByID();
         }else{
            this.selectedMarca=null;
            this.getSucursagetSucursalesByMarcaYEmpresalByID();
         }


      }
     );

  }


  public getSucursagetSucursalesByMarcaYEmpresalByID(){
         this.sucursales=[];
         if(this.selectedEmpresa==null ){
           return;
         }

        var marcaTmpId:number;
        if( this.selectedMarca==null || this.selectedMarca.marcaId<=0 ){
           marcaTmpId=0;
        }else{
          marcaTmpId=this.selectedMarca.marcaId;
        }

        this.sucursalService.getSucursagetSucursalesByMarcaYEmpresalByID  ( marcaTmpId , this.selectedEmpresa.empresaId ,      this.usuarioSession.usuarioOID   ) .subscribe(
          (data)=>{

             console.log( data );
             console.log("Edgar Leal");
             console.log(this.empresas);
             console.log(this.marcas);




             this.sucursales=data;



             this.sucursales.forEach((element, index) => {


              this.marcas.forEach((eleMarca,indx) => {

                if(element.marcaId == eleMarca.marcaId){

                  this.sucursales[index].nombreMarca = eleMarca.nombre;

                }

              });


              this.empresas.forEach((eleEmpresa,indx) => {

                if(element.empresaId == eleEmpresa.empresaId){

                  this.sucursales[index].nombreEmpresa = eleEmpresa.nombre;

                }

              });



             });

            // console.log();

          }
         );



  }





  public agregarSucursal(){

    let ref= this.dialogService.open( SucursalComponent , {
      header: 'Sucursal',
      width: '55%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { regionId:0  }
  });

  ref.onClose.subscribe(( usr : Usuario  ) => {
    if (usr!=null  ) {
      this.getEmpresasByUsuarioOID();
    }
  });



  }


  public modificarSucursal(){
    if( this.selectedSucursal==null   ){
        return;
    }

    let ref= this.dialogService.open( SucursalComponent , {
      header: 'Sucursal',
      width: '55%',
      contentStyle: {"max-height": "550px" , "height" : "500px;"  } ,
      data: { sucursalId : this.selectedSucursal.sucursalId  }
  });


  ref.onClose.subscribe(( usr : Usuario  ) => {
    if (usr!=null  ) {
      this.getEmpresasByUsuarioOID();
    }
  });

  }



  public empresaChanged(){
       this.getMarcasByEmpresaYUsuario();
  }

  public marcaChanged(){
         this.getSucursagetSucursalesByMarcaYEmpresalByID();
  }



  public confirmDeleteSucursal(){

    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la Sucursal ?',
      accept: () => {
         this.deleteSucursal();
      }
  });

  }

  public deleteSucursal() {
    if( this.selectedSucursal==null  ){
      return;
    }

    this.selectedSucursal.usuarioOID = this.usuarioSession.usuarioOID ;

    this.sucursalService.eliminaSucursal( this.selectedSucursal, this.usuarioOID ).subscribe((data)=>{

      this.getEmpresasByUsuarioOID();
        this.selectedSucursal=null ;

    });
    this.sucursales.splice(this.sucursales.indexOf(this.selectedSucursal),1);

  }

  public sucursalChanged(){

  }


  public onClickMenuSucursal(suc:Sucursal){

  }
  public confirmDeleteLista() {
    this.confirmationService.confirm({
        message: 'Está seguro que desea eliminar la lista ?',
        accept: () => {
           this.deleteSucursal();
        }
    });
  }




}
