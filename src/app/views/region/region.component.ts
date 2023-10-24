import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { Marca } from 'src/app/model/marca';
import { Empresa } from 'src/app/model/empresa';
import { Usuario } from 'src/app/model/usuario';
import { RegionService } from 'src/app/service/region.service';
import { Region } from 'src/app/model/region';
import { SucursalRegion } from 'src/app/model/sucursal-region';


import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
import { convertirAMayusculas } from 'src/app/utils/forms';



@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

  @ViewChild('claveInput') claveInput: ElementRef;
  selectedMarca:Marca;
  selectedEmpresa:Empresa;
  region:Region;
  empresas:Empresa[];
  marcas:Marca[];
  msgs: Message[] = [];
  usuarioSession:Usuario;

  sucursalesRegion:SucursalRegion[];
  sucursalesRegionSelected:SucursalRegion[];

  selectedSucursalRegionLeft:SucursalRegion[];
  selectedSucursalRegionRight:SucursalRegion[];

  auxVar :  Boolean = true;


  profileRegion = this.fb.group({
    clave: ['',  Validators.required],
    nombre: ['', Validators.required],
    flagActivo: ['',  Validators.required],
    empresa:['',  Validators.required],
    marca: ['',  Validators.required]
  });
  
  convertirMayuscula = convertirAMayusculas(this.profileRegion.get('clave'));

  constructor( public regionService:RegionService ,  public empresaService:EmpresaService ,  private fb: FormBuilder , public marcaService:MarcaService ,     public config: DynamicDialogConfig , public ref: DynamicDialogRef ) { }


  get f() { return this.profileRegion.controls; }


  ngOnInit(): void {

    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));


    if( this.config.data.regionId >0){


     // this.getEmpresasByUsuarioOID();
      this.getRegionByRegionId(  this.config.data.regionId, this.usuarioSession.usuarioOID );

    }else{
       this.region=new Region();
       this.region.usuarioCreated=this.usuarioSession.usuarioOID;
       this.region.marcaId=0;
       this.region.regionId=0;
       this.getMarcasByUsuarioOID();
       this.getEmpresasByUsuarioOID();
       this.region.activo=1;
       this.region.flagActivo=true;
       this.auxVar = false;


    }




  }



  public getMarcasByUsuarioOID(){
    if( this.usuarioSession==null ){
      return;
    }
    this.marcaService.getByUsuarioOID (  this.usuarioSession.usuarioOID ) .subscribe(
      (data)=>{
         console.log( data );
         this.marcas=data;

         if( this.marcas!=null && this.marcas.length>0 ){
           if( this.region!=null && this.region.regionId<=0  ){
                this.selectedMarca=this.marcas[0];
               // this.region.marcaId =  this.selectedMarca.marcaId;
           }else{
              for( var i=0;i<this.marcas.length;i++ ){
                  if(  this.marcas[i].marcaId==this.region.marcaId ){
                     this.selectedMarca=this.marcas[i];
                     this.getSucursalesByRegionMarca();
                     break;
                  }
              }


           }

         }


      }
     );

  }




  public getRegionByRegionId ( regionId : number , usuario : string){




    this.regionService.getByRegionId ( regionId , usuario).subscribe(
      (data)=>{



        if(data != null ){

          this.region =data;


          this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
            (data)=>{
              this.empresas=data;
              if( this.empresas!=null && this.empresas.length>0 ){
                this.selectedEmpresa=this.empresas[0];
                console.log("Marcos");

                if( this.region.empresaId>0 ){
                  if(  this.empresas!=null && this.empresas.length>0 ){
                     var empresaTmp:Empresa;

                     for(  var i=0;i< this.empresas.length;i++ ){
                         empresaTmp= this.empresas[i];
                         if( empresaTmp.empresaId== this.region.empresaId ){
                             this.selectedEmpresa=empresaTmp;
                            // this.empresaChanged();
                             break;
                         }

                     }


                  }

               }


                //this.getMarcasByEmpresaYUsuario();
              }

           }
          );

          this.getMarcasByUsuarioOID();




          if( this.region.activo==1 ){
              this.region.flagActivo=true;
          }else{
              this.region.flagActivo=true;
          }

        }else{
          this.region=new Region();
          this.region.regionId=0;
        }






     }
    );

  }


  public getEmpresasByUsuarioOID(){
    this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.empresas=data;
        if( this.empresas!=null && this.empresas.length>0 ){
          this.selectedEmpresa=this.empresas[0];

          if( this.region.empresaId>0 ){
            if(  this.empresas!=null && this.empresas.length>0 ){
               var empresaTmp:Empresa;
               for(  var i=0;i< this.empresas.length;i++ ){
                   empresaTmp= this.empresas[i];
                   if( empresaTmp.empresaId== this.region.empresaId ){
                       this.selectedEmpresa=empresaTmp;
                       this.empresaChanged();
                       break;
                   }

               }


            }

         }


          this.getMarcasByEmpresaYUsuario();
        }

     }
    );

  }







  public guadarRegion(){



    this.msgs=[];

    if(  this.region.clave ==null ||this.region.clave=="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar la clave de la región "  , summary:'Validation failed'});
      return;
    }

    if(  this.region.nombre ==null ||this.region.nombre =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el nombre de la región "  , summary:'Validation failed'});
      return;
    }


    if(  this.selectedEmpresa ==null   ){
      this.msgs.push({severity:'error', detail: "Se requiere seleccionar la empresa para la región "  , summary:'Validation failed'});
      return;
    }

    if( this.selectedEmpresa!=null ){
      this.region.empresaId=this.selectedEmpresa.empresaId;
    }

    if( this.selectedMarca!=null ){
       this.region.marcaId=this.selectedMarca.marcaId;
    }


    if( this.region.flagActivo ){
       this.region.activo=1;
    }else{
       this.region.activo=0;
    }


   if(  this.sucursalesRegionSelected !=null && this.sucursalesRegionSelected.length>0 ){
      var sucursalConcat:string=null;
      for(  var i=0;i< this.sucursalesRegionSelected.length ; i++ ){
          if(  sucursalConcat==null ){
              sucursalConcat=""+  this.sucursalesRegionSelected[i].sucursalId;
          }else{
            sucursalConcat+="|"+  this.sucursalesRegionSelected[i].sucursalId;
          }

      }

      this.region.sucursalesConcat=sucursalConcat;
      this.region.usuarioCreated=this.usuarioSession.usuarioOID;



   }


   if(!this.auxVar)
      this.region.regionId = 0;




    this.regionService.guardarRegion(  this.region, this.usuarioSession.usuarioOID  ).subscribe(
      (data)=>{
        this.region=data;
        this.ref.close(this.region);
      }

    );


  }




  public empresaChanged(){
     //this.getSucursalesByRegionMarca();
     this.getMarcasByEmpresaYUsuario();
  }

  public marcaChanged(){
       this.getSucursalesByRegionMarca();

  }


  public getMarcasByEmpresaYUsuario(){
    if( this.usuarioSession==null  || this.selectedEmpresa==null  ){
      return;
    }

    this.marcaService.getMarcasByEmpresaYUsuario  (  this.usuarioSession.usuarioOID , this.selectedEmpresa.empresaId  ) .subscribe(
      (data)=>{
         console.log( data );
         this.marcas=data;

         if( this.marcas!=null && this.marcas.length>0 ){
             this.selectedMarca=this.marcas[0];
             this.getSucursalesByRegionMarca();
         }


      }
     );

  }






  public getSucursalesByRegionMarca(){


    if( this.region==null ){
       return;
    }

    if(this.region.regionId<=0)
         this.region.regionId = this.selectedEmpresa.empresaId;




    var sucRegiones:SucursalRegion[]=null;
    this.regionService.getSucursalesByRegionMarca(  this.usuarioSession.usuarioOID , this.region.regionId ,  this.selectedMarca.marcaId  ).subscribe(
      (data)=>{

         sucRegiones=data;
         this.displaySucursales( sucRegiones );
      }

    );





  }



  public displaySucursales(sucRegiones:SucursalRegion[]){

    this.sucursalesRegion=[];
    this.sucursalesRegionSelected=[];

       if( sucRegiones==null || sucRegiones.length<=0 ){
          return;
       }

       var sucReg:SucursalRegion;
       for(  var i=0; i< sucRegiones.length; i++   ){
          sucReg= sucRegiones[i];
          if( sucReg==null ){
            continue;
          }

          if( sucReg.seleccionada==1 ){
               this.sucursalesRegionSelected.push( sucReg  );
          }else{
               this.sucursalesRegion.push( sucReg );
          }

       }

  }



  public addSucursal(){


    if( this.sucursalesRegion==null || this.sucursalesRegion.length<=0 ){
      return;
    }

   if( this.selectedSucursalRegionLeft==null  || this.selectedSucursalRegionLeft.length<=0 ){
      return
   }

   if( this.sucursalesRegionSelected==null ){
     this.sucursalesRegionSelected=[];
   }

   this.sucursalesRegionSelected=this.sucursalesRegionSelected.concat( this.selectedSucursalRegionLeft  );

   var  lstSelected=  this.selectedSucursalRegionLeft;
   this.sucursalesRegion = this.sucursalesRegion.filter(function(x) {
    var sucReg:SucursalRegion;
    for(  var i=0; i< lstSelected.length; i++   ){
      sucReg= lstSelected[i];
      if( sucReg.sucursalId==x.sucursalId ){
           return false;
      }

   }

   return true;

  });

  this.selectedSucursalRegionLeft=[];







  }


  public removeSucursal(){


    if( this.sucursalesRegionSelected==null || this.sucursalesRegionSelected.length<=0 ){
      return;
   }

   if( this.selectedSucursalRegionRight==null || this.selectedSucursalRegionRight.length<=0  ){
      return
   }


   if( this.sucursalesRegion==null ){
    this.sucursalesRegion=[];
  }

  this.sucursalesRegion=this.sucursalesRegion.concat( this.selectedSucursalRegionRight  );

  var  lstSelected=  this.selectedSucursalRegionRight;
  this.sucursalesRegionSelected = this.sucursalesRegionSelected.filter(function(x   ) {
    var sucReg:SucursalRegion;


    for(  var i=0; i< lstSelected.length; i++   ){

      sucReg= lstSelected [i];
      if( sucReg.sucursalId==x.sucursalId ){
           return false;
      }

    }

   return true;

  });

  this.selectedSucursalRegionRight=[];



  }


  public cancelar(){
    this.ref.close();
  }


  onSubmit() {

    console.warn(this.profileRegion.value);

    console.warn(this.region);


    this. guadarRegion();

  }

}
