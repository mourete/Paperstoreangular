import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/api';
import { Usuario } from 'src/app/model/usuario';
import { EmpresaService } from 'src/app/service/empresa.service';
import { MarcaService } from 'src/app/service/marca.service';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/model/empresa';
import { Marca } from 'src/app/model/marca';
import { Proyecto } from 'src/app/model/proyecto';
import { DatePipe } from '@angular/common';
import { ProyectoRegion } from 'src/app/model/proyecto-region';
import { ProyectoDocumento } from 'src/app/model/proyecto-documento';
import { convertirAMayusculas } from 'src/app/utils/forms';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss'],
  providers: [DatePipe],
})
export class ProyectoComponent implements OnInit {
  @ViewChild('claveInput') claveInput: ElementRef;
  empresas: Empresa[];
  marcas: Marca[];
  msgs: Message[] = [];
  usuarioSession: Usuario;
  usuarioOID: string;
  selectedEmpresa: Empresa;
  selectedMarca: Marca;
  proyecto: Proyecto;
  proyectoRegiones: ProyectoRegion[];
  proyectoRegionesSelected: ProyectoRegion[];

  selectedProyectoRegionesRight: ProyectoRegion[];
  selectedProyectoRegionesLeft: ProyectoRegion[];

  proyectoDocumentos: ProyectoDocumento[];
  proyectoDocumentosSelected: ProyectoDocumento[];

  selectedProyectoDocumentosRight: ProyectoDocumento[];
  selectedProyectoDocumentosLeft: ProyectoDocumento[];

  formValidadores = this.fb.group({
    clave: ['', Validators.required],
    nombre: ['', Validators.required],
  });

  convertirMayusculas(event: any) {
    this.proyecto.clave = event.target.value.toUpperCase();
  };

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public proyectoService: ProyectoService,
    public empresaService: EmpresaService,
    public marcaService: MarcaService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  get f() { return this.formValidadores.controls; };

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuarioSession.usuarioOID;

    if (this.config.data.proyectoId > 0) {
      this.getProyectoById(this.config.data.proyectoId);
      console.log('Ando aqui ');
    } else {
      this.proyecto = new Proyecto();
      this.proyecto.usuarioCreated = this.usuarioSession.usuarioOID;
      this.proyecto.marcaId = 0;
      this.proyecto.proyectoId = 0;
      this.getMarcasByUsuarioOID();
      this.getEmpresasByUsuarioOID(1);
      this.proyecto.activo = 1;
      this.proyecto.flagActivo = true;
    }
  }

  public getProyectoById(proyectoId: number) {
    this.proyectoService
      .getProyectoById(proyectoId, this.usuarioOID)
      .subscribe((data) => {
        this.proyecto = data;
        if (this.proyecto.activo == 1) {
          this.proyecto.flagActivo = true;
        } else {
          this.proyecto.flagActivo = true;
        }

        if (this.proyecto.fechaIniText != null) {
          this.proyecto.fechaIniDate = this.getFechaFromString(
            this.proyecto.fechaIniText
          );
        }

        if (this.proyecto.fechaFinText != null) {
          this.proyecto.fechaFinDate = this.getFechaFromString(
            this.proyecto.fechaFinText
          );
        }

        this.getEmpresasByUsuarioOID(1);
        this.getDocumentos();
      });
  }

  public getFechaFromString(fecha: string): Date {
    var parts = fecha.split('/');
    new Date();
    var mydate = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0])
    );
    console.log(mydate.toDateString());
    return mydate;
  }

  public getEmpresasByUsuarioOID(id: number) {
    this.empresaService
      .getByUsuarioOID(this.usuarioSession.usuarioOID)
      .subscribe((data) => {
        this.empresas = data;
        if (this.empresas != null && this.empresas.length > 0) {
          this.selectedEmpresa = this.empresas[0];
          if (this.proyecto.empresaId > 0) {
            if (this.empresas != null && this.empresas.length > 0) {
              var empresaTmp: Empresa;
              for (var i = 0; i < this.empresas.length; i++) {
                empresaTmp = this.empresas[i];
                if (empresaTmp.empresaId == this.proyecto.empresaId) {
                  this.selectedEmpresa = empresaTmp;
                  console.log('Entro aqui');
                  this.empresaChanged(id);
                  break;
                }
              }
            }
          } else {
            //this.getRegionesByMarca(1);

            console.log('Ando aqui en creacion ');
          }

          this.getMarcasByEmpresaYUsuario(id);
        }
      });
  }

  public empresaChanged(id: number) {
    console.log('Ando entrando aqui');
    this.getMarcasByEmpresaYUsuario(id);
  }

  public getMarcasByEmpresaYUsuario(id: number) {
    if (this.usuarioSession == null || this.selectedEmpresa == null) {
      return;
    }

    this.marcaService
      .getMarcasByEmpresaYUsuario(
        this.usuarioSession.usuarioOID,
        this.selectedEmpresa.empresaId
      )
      .subscribe((data) => {
        this.marcas = data;

        if (this.marcas != null && this.marcas.length > 0) {
          if (id == 1) {
            this.marcas.forEach((element, index) => {
              //console.log(element);
              if (this.proyecto.marcaId == element.marcaId) {
                this.selectedMarca = element;
              }
            });
          } else {
            console.log('Emtre aqui 22');
            this.selectedMarca = this.marcas[0];
          }

          this.getRegionesByMarca(id);
        } else {
          this.selectedMarca = null;
          console.log('No debo entrar aqui');
        }
      });
  }

  public getRegionesByMarca(id: number) {
    let marcaId;
    if (this.proyecto == null) {
      return;
    }

    console.log('Ando aqui en regiones');

    console.log(this.selectedMarca.marcaId);
    console.log(this.proyecto.marcaId);

    console.log(this.proyecto.proyectoId);

    if (id == 1) {
      marcaId = this.selectedMarca.marcaId;
    } else marcaId = this.proyecto.marcaId;

    var regProyectos: ProyectoRegion[] = null;
    this.proyectoService
      .getProyectoRegionesByMarca(
        this.proyecto.proyectoId,
        this.selectedMarca.marcaId,
        this.usuarioSession.usuarioOID
      )
      .subscribe((data) => {
        regProyectos = data;
        this.displayRegiones(regProyectos);
      });
  }

  public getDocumentos() {
    if (this.proyecto == null || this.proyecto.marcaId <= 0) {
      return;
    }

    var docProyectos: ProyectoDocumento[] = null;
    this.proyectoService
      .getDocumentosByProyecto(
        this.proyecto.proyectoId,
        this.usuarioSession.usuarioOID
      )
      .subscribe((data) => {
        docProyectos = data;
        this.displayDocumentos(docProyectos);
      });
  }

  public displayDocumentos(proyDocumentosTraido: ProyectoDocumento[]) {
    this.proyectoDocumentos = [];
    this.proyectoDocumentosSelected = [];

    if (proyDocumentosTraido == null || proyDocumentosTraido.length <= 0) {
      return;
    }

    var docProy: ProyectoDocumento;
    for (var i = 0; i < proyDocumentosTraido.length; i++) {
      docProy = proyDocumentosTraido[i];
      if (docProy == null) {
        continue;
      }

      if (docProy.seleccion == 1) {
        this.proyectoDocumentosSelected.push(docProy);
      } else {
        this.proyectoDocumentos.push(docProy);
      }
    }
  }

  public displayRegiones(proyRegionesTraido: ProyectoRegion[]) {
    console.log('Ando aqui en display');
    this.proyectoRegiones = [];
    this.proyectoRegionesSelected = [];

    /*this.selectedProyectoRegionesRight = null;
  this.selectedProyectoRegionesLeft = null;*/

    if (proyRegionesTraido == null || proyRegionesTraido.length <= 0) {
      return;
    }

    var regProy: ProyectoRegion;
    for (var i = 0; i < proyRegionesTraido.length; i++) {
      regProy = proyRegionesTraido[i];
      if (regProy == null) {
        continue;
      }

      if (regProy.seleccionada == 1) {
        this.proyectoRegionesSelected.push(regProy);
      } else {
        this.proyectoRegiones.push(regProy);
      }
    }
  }

  public validarCampos(): boolean {
    return false;
  }

  public marcaChanged() {
    this.getRegionesByMarca(1);
  }

  public guadarProyecto() {
    this.msgs = [];

    if (this.proyecto.clave == null || this.proyecto.clave == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar la clave del proyecto ',
        summary: 'Validation failed',
      });
      return;
    }

    if (this.proyecto.nombre == null || this.proyecto.nombre == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar el nombre del proyecto ',
        summary: 'Validation failed',
      });
      return;
    }

    if (this.selectedEmpresa == null) {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere seleccionar la empresa para el poryecto ',
        summary: 'Validation failed',
      });
      return;
    }

    if (this.selectedEmpresa != null) {
      this.proyecto.empresaId = this.selectedEmpresa.empresaId;
    }

    if (this.selectedMarca != null) {
      this.proyecto.marcaId = this.selectedMarca.marcaId;
    }

    if (this.proyecto.flagActivo) {
      this.proyecto.activo = 1;
    } else {
      this.proyecto.activo = 0;
    }

    if (this.proyecto.fechaIniDate != null) {
      let dateAsString = this.datePipe.transform(
        this.proyecto.fechaIniDate,
        'dd/MM/yyyy'
      );
      this.proyecto.fechaIniText = dateAsString;
    }

    if (this.proyecto.fechaFinDate != null) {
      let dateAsString = this.datePipe.transform(
        this.proyecto.fechaFinDate,
        'dd/MM/yyyy'
      );
      this.proyecto.fechaFinText = dateAsString;
    }

    if (
      this.proyectoRegionesSelected != null &&
      this.proyectoRegionesSelected.length > 0
    ) {
      var regionesConcat: string = null;
      for (var i = 0; i < this.proyectoRegionesSelected.length; i++) {
        if (regionesConcat == null) {
          regionesConcat = '' + this.proyectoRegionesSelected[i].regionId;
        } else {
          regionesConcat += '|' + this.proyectoRegionesSelected[i].regionId;
        }
      }

      this.proyecto.allRegiones = regionesConcat;
      this.proyecto.usuarioCreated = this.usuarioSession.usuarioOID;
    } else {
      this.proyecto.allRegiones = '';
      this.proyecto.usuarioCreated = this.usuarioSession.usuarioOID;
    }

    this.setDocumentosSelected();

    this.proyectoService
      .saveProyecto(this.proyecto, this.usuarioOID)
      .subscribe((data) => {
        this.proyecto = data;
        this.ref.close(this.proyecto);
      });
  }

  public setDocumentosSelected(): string {
    if (this.proyecto == null) {
      return null;
    }

    var documentosConcat: string = null;
    if (
      this.proyectoDocumentosSelected != null &&
      this.proyectoDocumentosSelected.length > 0
    ) {
      for (var i = 0; i < this.proyectoDocumentosSelected.length; i++) {
        if (documentosConcat == null) {
          documentosConcat =
            '' + this.proyectoDocumentosSelected[i].documentoId;
        } else {
          documentosConcat +=
            '|' + this.proyectoDocumentosSelected[i].documentoId;
        }
      }

      this.proyecto.allDocumentos = documentosConcat;
      this.proyecto.usuarioCreated = this.usuarioSession.usuarioOID;
    } else {
      this.proyecto.allDocumentos = '';
      this.proyecto.usuarioCreated = this.usuarioSession.usuarioOID;
    }

    return documentosConcat;
  }

  public getMarcasByUsuarioOID() {
    if (this.usuarioSession == null) {
      return;
    }
    this.marcaService
      .getByUsuarioOID(this.usuarioSession.usuarioOID)
      .subscribe((data) => {
        console.log(data);
        this.marcas = data;

        if (this.marcas != null && this.marcas.length > 0) {
          if (this.proyecto != null && this.proyecto.proyectoId <= 0) {
            this.selectedMarca = this.marcas[0];
          } else {
            for (var i = 0; i < this.marcas.length; i++) {
              if (this.marcas[i].marcaId == this.proyecto.marcaId) {
                this.selectedMarca = this.marcas[i];
                //this.getSucursalesByRegionMarca();
                break;
              }
            }
          }
        }
      });
  }

  public addRegion() {
    if (this.proyectoRegiones == null || this.proyectoRegiones.length <= 0) {
      return;
    }

    if (
      this.selectedProyectoRegionesLeft == null ||
      this.selectedProyectoRegionesLeft.length <= 0
    ) {
      return;
    }

    if (this.proyectoRegionesSelected == null) {
      this.proyectoRegionesSelected = [];
    }

    this.proyectoRegionesSelected = this.proyectoRegionesSelected.concat(
      this.selectedProyectoRegionesLeft
    );

    var lstSelected = this.selectedProyectoRegionesLeft;
    this.proyectoRegiones = this.proyectoRegiones.filter(function (x) {
      var proyReg: ProyectoRegion;
      for (var i = 0; i < lstSelected.length; i++) {
        proyReg = lstSelected[i];
        if (proyReg.regionId == x.regionId) {
          return false;
        }
      }

      return true;
    });

    this.selectedProyectoRegionesLeft = [];
  }

  public removeRegion() {
    if (
      this.proyectoRegionesSelected == null ||
      this.proyectoRegionesSelected.length <= 0
    ) {
      return;
    }

    if (
      this.selectedProyectoRegionesRight == null ||
      this.selectedProyectoRegionesRight.length <= 0
    ) {
      return;
    }

    if (this.proyectoRegiones == null) {
      this.proyectoRegiones = [];
    }

    this.proyectoRegiones = this.proyectoRegiones.concat(
      this.selectedProyectoRegionesRight
    );

    var lstSelected = this.selectedProyectoRegionesRight;
    this.proyectoRegionesSelected = this.proyectoRegionesSelected.filter(
      function (x) {
        var proyReg: ProyectoRegion;

        for (var i = 0; i < lstSelected.length; i++) {
          proyReg = lstSelected[i];
          if (proyReg.regionId == x.regionId) {
            return false;
          }
        }

        return true;
      }
    );

    this.selectedProyectoRegionesRight = [];
  }

  public addDocumento() {
    if (
      this.proyectoDocumentos == null ||
      this.proyectoDocumentos.length <= 0
    ) {
      return;
    }

    if (
      this.selectedProyectoDocumentosLeft == null ||
      this.selectedProyectoDocumentosLeft.length <= 0
    ) {
      return;
    }

    if (this.proyectoDocumentosSelected == null) {
      this.proyectoDocumentosSelected = [];
    }

    this.proyectoDocumentosSelected = this.proyectoDocumentosSelected.concat(
      this.selectedProyectoDocumentosLeft
    );

    var lstSelected = this.selectedProyectoDocumentosLeft;
    this.proyectoDocumentos = this.proyectoDocumentos.filter(function (x) {
      var proyDoc: ProyectoDocumento;
      for (var i = 0; i < lstSelected.length; i++) {
        proyDoc = lstSelected[i];
        if (proyDoc.documentoId == x.documentoId) {
          return false;
        }
      }

      return true;
    });

    this.selectedProyectoDocumentosLeft = [];
  }

  public removeDocumento() {
    if (
      this.proyectoDocumentosSelected == null ||
      this.proyectoDocumentosSelected.length <= 0
    ) {
      return;
    }

    if (
      this.selectedProyectoDocumentosRight == null ||
      this.selectedProyectoDocumentosRight.length <= 0
    ) {
      return;
    }

    if (this.proyectoDocumentos == null) {
      this.proyectoDocumentos = [];
    }

    this.proyectoDocumentos = this.proyectoDocumentos.concat(
      this.selectedProyectoDocumentosRight
    );

    var lstSelected = this.selectedProyectoDocumentosRight;
    this.proyectoDocumentosSelected = this.proyectoDocumentosSelected.filter(
      function (x) {
        var proyDoc: ProyectoDocumento;

        for (var i = 0; i < lstSelected.length; i++) {
          proyDoc = lstSelected[i];
          if (proyDoc.documentoId == x.documentoId) {
            return false;
          }
        }

        return true;
      }
    );

    this.selectedProyectoDocumentosRight = [];
  }

  public cancelar() {
    this.ref.close();
  }
}
