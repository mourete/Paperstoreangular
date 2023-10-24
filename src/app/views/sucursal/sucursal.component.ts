import {Message} from 'primeng/api';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Sucursal } from 'src/app/model/sucursal';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { SucursalService } from 'src/app/service/sucursal.service';
import { Estado } from 'src/app/model/estado';
import { EstadoService } from 'src/app/service/estado.service';
import { Ciudad } from 'src/app/model/ciudad';
import { CiudadService } from 'src/app/service/ciudad.service';
import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss']
})
export class SucursalComponent implements OnInit {

  @ViewChild('claveInput') claveInput: ElementRef;
  usuarioSession:Usuario;
  sucursal:Sucursal;
  selectedEmpresa:Empresa;
  selectedMarca:Marca;
  selectedEstado:Estado;
  selectedCiudad:Ciudad;

  empresas:Empresa[];
  marcas:Marca[];
  msgs: Message[] = [];
  estados:Estado[];
  ciudades:Ciudad[];
  marcasAux:Marca[];
  auxEdit : Boolean = true;
  ciudad:Boolean = false;

  profileSucursal = this.fb.group({
    clave: ['',  Validators.required],
    nombre: ['', Validators.required],
    flagActivo: ['',  Validators.required],
    empresa:['',  Validators.required],
    mail: [''],
    calle: [''],
    numero: [''],
    entreCalle: [''],
    colonia: [''],
    cp: [''],
    encargado: [''],
    marca: [''],
    estadosForm : [''],
    ciudadesForm: [''],
    telefono:[''],
    fax : [''],
    coordenadaX : [''],
    coordenadaY : [''],
    responsable : [''],



  });

  constructor( public ciudadService:CiudadService ,  private fb: FormBuilder,  public estadoService: EstadoService ,   public sucursalService:SucursalService ,  public empresaService:EmpresaService , public marcaService: MarcaService ,     public config: DynamicDialogConfig , public ref: DynamicDialogRef  ) { }

  get f() { return this.profileSucursal.controls; }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));



    if( this.config.data.sucursalId >0   ){

          this.getSucursalById(  this.config.data.sucursalId );
          this.ciudad = true;

    }else{
       this.sucursal=new Sucursal();
       this.sucursal.usuarioOID=this.usuarioSession.usuarioOID;
       this.sucursal.marcaId=0;
       this.sucursal.empresaId=0;
       this.sucursal.activo=1;
       this.sucursal.flagActivo=true;
       this.auxEdit = false;
       this.getEmpresasByUsuarioOID(this.auxEdit);

       this.estadoService.getAllEstados (  this.usuarioSession.usuarioOID ).subscribe(
        (data)=>{

          this.estados=data;

          this.getCiudadesByEstado(this.estados[0].estadoId, this.usuarioSession.usuarioOID);
       }
      );

    }

    //this.getAllEstados( this.ciudad);











  }



  public getSucursalById(sucId:number  ){
    console.log("ENTRE");

    this.sucursalService.getSucursalByID(  sucId ,  this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.sucursal=data;


        this.estadoService.getAllEstados (  this.usuarioSession.usuarioOID ).subscribe(
          (data)=>{

            this.estados=data;

            var estadoTmp:Estado;
            if(  this.sucursal.estadoId>0 ){
                if( this.estados!=null && this.estados.length>0 ){
                    for( var i=0;i< this.estados.length;i++  ){
                        estadoTmp=this.estados[i];
                        if( estadoTmp!=null  && estadoTmp.estadoId== this.sucursal.estadoId ){
                              this.selectedEstado=estadoTmp;
                              this.estadoChanged(  );
                              break
                        }


                    }

                }

            }

            /*if(!check)
              this.getCiudadesByEstado(this.estados[0].estadoId);*/
         }
        );



        if( this.sucursal.activo==1 ){
          this.sucursal.flagActivo=true;
        }else{
            this.sucursal.flagActivo=true;
        }



      this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
        (data)=>{
          console.log("ENTRE2");
          this.empresas=data;



          if(  this.empresas!=null && this.empresas.length>0 ){
            var empresaTmp:Empresa;
            for(  var i=0;i< this.empresas.length;i++ ){
                empresaTmp= this.empresas[i];
                if( empresaTmp.empresaId== this.sucursal.empresaId ){
                    this.selectedEmpresa=empresaTmp;
                    this.empresaChanged( this.sucursal.marcaId );
                    break;
                }

            }


         }

       }
      );


     }
    );

  }


  /*public getAllEstados( check : any ){
    this.estadoService.getAllEstados (   ).subscribe(
      (data)=>{

        this.estados=data;

        /*if(!check)
          this.getCiudadesByEstado(this.estados[0].estadoId);*/
    // }
 //   );

  //}


  public getEmpresasByUsuarioOID(auxEdit : Boolean){
    this.empresaService.getByUsuarioOID( this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.empresas=data;
        if( this.empresas!=null && this.empresas.length>0 ){
          this.selectedEmpresa=this.empresas[0];
          if(!auxEdit){
            this.getMarcasByEmpresaYUsuario(0);
          }

        }

     }
    );

  }



  public getMarcasByEmpresaYUsuario(idMarca : any ){
    if( this.usuarioSession==null  || this.selectedEmpresa==null  ){
      return;
    }

    this.marcaService.getMarcasByEmpresaYUsuario  (  this.usuarioSession.usuarioOID , this.selectedEmpresa.empresaId  ) .subscribe(
      (data)=>{

         this.marcasAux = data;

         if(idMarca == 0){

            if( this.marcasAux!=null && this.marcasAux.length>0 ){
              this.selectedMarca=this.marcasAux[0];
            }

         }else{


           const elementAux = this.marcasAux[0];

            for (let index = 0; index < this.marcasAux.length; index++) {
              const element = this.marcasAux[index];
              if(element.marcaId == idMarca){
                 this.selectedMarca=element;
                /* this.marcasAux[0] = element;
                 this.marcasAux[index] = elementAux;*/
              }



            }

           /*this.marcas.forEach((element, index) => {

              if(element.marcaId == idMarca)
                  this.selectedMarca=element;

            });*/

         }

         this.marcas=this.marcasAux;


      }
     );

  }



  public guadarSucursal(){


    this.msgs=[];

    if(  this.sucursal.clave ==null ||this.sucursal.clave=="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar la clave de la sucursal "  , summary:'Validation failed'});
      return;
    }

    if(  this.sucursal.nombre ==null ||this.sucursal.nombre =="" ){
      this.msgs.push({severity:'error', detail: "Se requiere capturar el nombre de la sucursal "  , summary:'Validation failed'});
      return;
    }

    console.log(this.selectedMarca);

    if(  this.selectedMarca ==null || this.selectedMarca.marcaId<=0   ){
      this.msgs.push({severity:'error', detail: "Se requiere seleccionar la marca para la región "  , summary:'Validation failed'});
      return;
    }


    this.sucursal.marcaId=this.selectedMarca.marcaId;


   if( this.selectedCiudad!=null && this.selectedCiudad.ciudadId>0 ){
       this.sucursal.ciudadId=this.selectedCiudad.ciudadId;

   }


  if( this.selectedEstado!=null && this.selectedEstado.estadoId!=null ){
      this.sucursal.estadoId=this.selectedEstado.estadoId;
  }




    if( this.sucursal.flagActivo ){
       this.sucursal.activo=1;
    }else{
       this.sucursal.activo=0;
    }


    this.sucursalService.guardarSucursal(  this.sucursal, this.usuarioSession.usuarioOID ).subscribe(
      (data)=>{
        this.sucursal=data;
        this.ref.close(this.sucursal);
      }

    );



  }



  public cancelar(){
    this.ref.close();
  }




  public empresaChanged(idMarca : any){
    this.getMarcasByEmpresaYUsuario(idMarca);
  }





  public estadoChanged(){
    if(this.selectedEstado==null || this.selectedEstado.estadoId<=0  ){
      return;
    }

    this.getCiudadesByEstado(this.selectedEstado.estadoId, this.usuarioSession.usuarioOID);


  }


  onSubmit() {

  /*  console.warn(this.profileSucursal.value);

    console.warn(this.sucursal);*/


    this. guadarSucursal();

  }


  public getCiudadesByEstado( estadoId: number , usuarioOID:string ){
    console.log("Entro aqui Siempre");
    this.ciudadService.getCiudadesByEstado ( estadoId , usuarioOID ).subscribe(
      (data)=>{
        this.ciudades=data;

        var  ciudadTmp:Ciudad;
        var aux = false;

        ciudadTmp=this.ciudades[0];

       // this.selectedCiudad=ciudadTmp;

        console.log(this.ciudad);

        console.log(this.sucursal.ciudadId);


        this.ciudades.forEach(element => {

          if(this.sucursal.ciudadId == element.ciudadId){
                this.selectedCiudad = element;
                aux = true;
          }


        });

        if(!aux)
          this.selectedCiudad=ciudadTmp;


       /* if( this.selectedCiudad.ciudadId >0  && this.ciudades!=null && this.ciudades.length>0 ){
          console.log("Entro aqui 2");
          var  ciudadTmp:Ciudad;
            for(  var i=0;i<this.ciudades.length;i++ ){
                  ciudadTmp=this.ciudades[i];
                  if( ciudadTmp.ciudadId==this.sucursal.ciudadId ){

                      this.selectedCiudad=ciudadTmp;
                      break;
                  }

            }


        } */


     }
    );

  }
  convertirAMayusculas() {
    const claveValue: string = this.sucursal.clave;
    this.sucursal.clave = claveValue.toUpperCase();
  }


}
