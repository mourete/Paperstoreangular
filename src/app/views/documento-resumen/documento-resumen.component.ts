import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { DocumentoResumen } from 'src/app/model/documento-resumen';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-documento-resumen',
  templateUrl: './documento-resumen.component.html',
  styleUrls: ['./documento-resumen.component.scss']
})
export class DocumentoResumenComponent implements OnInit {
  documentoId:number;
  documentoResumen: DocumentoResumen;
  usuario:Usuario;
  usuarioOID:string;

  constructor(private documentService : DocumentService ,  private actRoute: ActivatedRoute  ) {
    this.documentoId = this.actRoute.snapshot.params.documentoId;
   }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID=this.usuario.usuarioOID;
    this.getDocumentoResumen();
  }


  public getDocumentoResumen(){
    this.documentService.getDocumentoResumen( this.documentoId, this.usuarioOID ).subscribe(
      (data)=>{
         this.documentoResumen=data;
      }

     );

}



}
