import { Component, OnInit } from '@angular/core';
import { InfoHuesped } from 'src/app/model/info-huesped';
import { AccountService } from 'src/app/service/account.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-info-huesped',
  templateUrl: './info-huesped.component.html',
  styleUrls: ['./info-huesped.component.scss']
})
export class InfoHuespedComponent implements OnInit {

   listaHuespedes:InfoHuesped[];
   usuarioOID: string;
   selectedHuesped:InfoHuesped;


  constructor( private accountService : AccountService ,
    public config: DynamicDialogConfig , public ref: DynamicDialogRef     ) {

      if( this.config.data.usuarioOID!=null   ){
            this.usuarioOID=this.config.data.usuarioOID;
      }


    }

  ngOnInit(): void {
    this.obtenerHuespedes();
  }


  public obtenerHuespedes(){

    this.accountService.getLicenciasByUserOID( this.usuarioOID ).subscribe(

      (data)=>{
        this.listaHuespedes = data;
      }


    );


  }


  public huespedChanged(){

     this.ref.close(this.selectedHuesped);

  }




}
