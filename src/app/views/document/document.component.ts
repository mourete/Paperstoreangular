import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StatusProjectoService } from '../../service/status-projecto.service';
import { StatusProyecto } from '../../model/status-proyecto';
import { Documento } from '../../model/documento';
import { DocumentService } from '../../service/document.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Message } from 'primeng/api';
import { Usuario } from 'src/app/model/usuario';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  styles: [
    `
      :host ::ng-deep .ui-messages ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: inline-block;
        vertical-align: middle;
        align-items: center;
      }
    `,
  ],
})
export class DocumentComponent implements OnInit {
  @ViewChild('claveInput') claveInput: ElementRef;
  statusProyectos: StatusProyecto[];
  documento: Documento;
  selectedStatusProyecto: StatusProyecto;
  msgs: Message[] = [];
  usuario: Usuario;
  usuarioOID: string;

  profileRegion = this.fb.group({
    clave: ['', Validators.required],
    nombre: ['', Validators.required],
    estatus: [''],
    observaciones: [''],
  });

  public convertToUpperCase(input: HTMLInputElement, val: string) {
    // Save caret position
    const start = input.selectionStart;
    const end = input.selectionEnd;
    setTimeout(() => {
      // Restore caret position after returning the converted string
      input.setSelectionRange(start, end);
    });
    // Return the input string converted to uppercase
    return val.toUpperCase();
  }

  constructor(
    private statusProjectoService: StatusProjectoService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private documentService: DocumentService,
    private fb: FormBuilder
  ) {}

  get clave() { return this.profileRegion.get('clave'); }
  get nombre() { return this.profileRegion.get('nombre'); }




  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuario.usuarioOID;
    this.documento = new Documento();

    this.getAllStatusProyect();
    if (this.config.data.documentoId > 0) {
      this.getDocumento(this.config.data.documentoId);
    } else {
      this.documento = new Documento();
      this.documento.statusId = 1;
      this.documento.activa = 1;
    }
  }

  public getDocumento(documentoId: number) {
    this.documentService
      .getByDocumentoId(documentoId, this.usuarioOID)
      .subscribe((data) => {
        this.documento = data;
        

    

        if (this.statusProyectos != null)
          this.statusProyectos.forEach((element, index) => {
            if (element.statusProyectoId == this.documento.statusId) {
              this.selectedStatusProyecto = element;
              console.log(this.selectedStatusProyecto);
            }
          });
        
      });
  }

  public getAllStatusProyect() {
    this.statusProjectoService.getAll().subscribe((data) => {
      this.statusProyectos = data;
      this.selectedStatusProyecto = this.statusProyectos[0];
    });
  }

  public guadarDocumento() {
    this.msgs = [];
    if (this.documento.clave == null || this.documento.clave == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar la clave del documento',
        summary: 'Validation failed',
      });
    }

    if (this.documento.nombre == null || this.documento.nombre == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar el nombre del documento',
        summary: 'Validation failed',
      });
    }

    if (this.msgs.length > 0) {
      return;
    }

    this.documento.activa = 1;
    this.documento.statusId = this.selectedStatusProyecto.statusProyectoId;
    console.log("this.check.statusProyectoId" + this.selectedStatusProyecto.statusProyectoId);

    this.documentService
      .guardarDocumento(this.documento, this.usuarioOID)
      .subscribe((data) => {
        console.log(data);
        this.ref.close(this.documento);

        //aqui debe actualizar.
      });
  }

  public cancelar() {
    this.ref.close();
  }

  onSubmit() {

    console.warn(this.profileRegion.value);

    console.warn(this.documento);


    this.guadarDocumento();

  }

  convertirAMayusculas() {
    const claveValue: string = this.profileRegion.get('clave').value;
    this.profileRegion.get('clave').setValue(claveValue.toUpperCase());
  }
}
