import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog'
import { EmpresaService } from 'src/app/service/empresa.service';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Usuario } from 'src/app/model/usuario';
import { MarcaService } from 'src/app/service/marca.service';
import { RegionService } from 'src/app/service/region.service';
import { Region } from 'src/app/model/region';
import { RegionComponent } from '../region/region.component';
import { MarcaComponent } from '../marca/marca.component';


@Component({
  selector: 'app-list-regiones',
  templateUrl: './list-regiones.component.html',
  styleUrls: ['./list-regiones.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ListRegionesComponent implements OnInit {

  usuarioSession:Usuario;
  usuarioOID :string;
  marcas:Marca[];

  empresas:Empresa[];
  regiones:Region[];
  itemsRegion: MenuItem[];

  selectedRegion:Region;

  constructor(public regionService:RegionService ,  public marcaService:MarcaService ,  public empresaService: EmpresaService , private confirmationService: ConfirmationService ,
    public dialogService: DialogService ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID=this.usuarioSession.usuarioOID;
    this.getRegionesByUsuarioOID();
    this.itemsRegion = [
      {
        label: 'Editar Región',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.modificarRegion();
        },
      },
      { separator: true },
      {
        label: 'Eliminar Region',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteRegion();
        },
      },
      { separator: true },
    ];
  }


  public getRegionesByUsuarioOID(){
    if( this.usuarioSession==null ){
      return;
    }
    this.regionService.getByUsuarioOID (  this.usuarioSession.usuarioOID ) .subscribe(
      (data)=>{
         console.log( data );
         this.regiones=data;
      }
     );

  }



  public agregarRegion(){

    let ref= this.dialogService.open( RegionComponent , {
      header: 'Región',
      width: '90%',
      height : '80%',

      contentStyle: {"max-height": "80%" , "height" : "80%"  } ,
      data: { regionId:0  }
  });

  ref.onClose.subscribe(( usr : Usuario  ) => {
    if (usr!=null  ) {
      this.getRegionesByUsuarioOID();
    }
  });



  }


  public modificarRegion(){
    if( this.selectedRegion==null   ){
        return;
    }

    console.log(this.selectedRegion);
    //console.log("Edgarleal");

    let ref= this.dialogService.open( RegionComponent , {
      header: 'Región',
      width: '90%',
      contentStyle: {"max-height": "800px" , "height" : "550px;"  } ,
      data: { regionId : this.selectedRegion.regionId  }
  });

  ref.onClose.subscribe(( usr : Usuario  ) => {
    if (usr!=null  ) {
      this.getRegionesByUsuarioOID();
    }
  });

  }







  public confirmDeleteRegion(){

    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la Región ?',
      accept: () => {
         this.deleteRegion();
      }
  });

  }


  public deleteRegion() {
    if( this.selectedRegion==null  ){
      return;
    }

    this.selectedRegion.usuarioOID = this.usuarioSession.usuarioOID ;

    this.regionService.eliminaRegion( this.selectedRegion, this.usuarioOID ).subscribe((data)=>{
      //  this.getMarcasByUsuarioOID();
      this.getRegionesByUsuarioOID();
        this.selectedRegion=null ;

    });
  }



  public regionChanged(){

  }


  public onClickMenuRegion(region:Region){

  }




}
