import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {Message} from 'primeng/api';
import {Usuario} from 'src/app/model/usuario';
import {EmpresaService} from 'src/app/service/empresa.service';
import {MarcaService} from 'src/app/service/marca.service';
import {ProyectoService} from 'src/app/service/proyecto.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Empresa} from 'src/app/model/empresa';
import {Marca} from 'src/app/model/marca';
import {Proyecto} from 'src/app/model/proyecto';
import {DatePipe} from '@angular/common';
import {ProyectoRegion} from 'src/app/model/proyecto-region';
import {ProyectoDocumento} from 'src/app/model/proyecto-documento';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  formValidadores: FormGroup;



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
  get clave() { return this.formValidadores.get('clave'); }
  get nombre() { return this.formValidadores.get('nombre'); }




  ngOnInit(): void {
    this.formValidadores = this.fb.group({
      clave: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      descripcion: [''],
      empresa: [''],
      marca: [''],
      diasVigencia: [''],
      cantidadDocumento: ['']
    }, { validators: this.validarFechas });
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuarioSession.usuarioOID;

    if (this.config.data.proyectoId > 0) {
      this.getProyectoById(this.config.data.proyectoId);
    } else {
      this.proyecto = new Proyecto();
      this.proyecto.usuarioCreated = this.usuarioSession.usuarioOID;
      this.proyecto.proyectoId = 0;
      this.proyecto.marcaId = 0;
      this.proyecto.empresaId = 0;
      this.getDocumentos();
      this.getEmpresasByUsuarioOID();
      this.getMarcasByUsuarioOID();
      this.proyecto.activo = 1;
      this.proyecto.flagActivo = true;

    }
  }

  validarFechas(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaIni = new Date(control.value.fechaInicio);
    const fechaFin = new Date(control.value.fechaFin);

    if (fechaIni > fechaFin) {
      return { fechasInvalidas: true };
    }

    return null;
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

        this.getEmpresasByUsuarioOID(this.proyecto.empresaId);
        this.getDocumentos();
        this.formValidadores.patchValue({
          fechaInicio: this.proyecto.fechaIniDate,
          fechaFin: this.proyecto.fechaFinDate,
          clave: this.proyecto.clave,
          nombre: this.proyecto.nombre,
          descripcion: this.proyecto.descripcion,
          diasVigencia: this.proyecto.diasVigencia,
          cantidadDocumento: this.proyecto.cantidadDocumento,
        });
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
    return mydate;
  }

  public getEmpresasByUsuarioOID(id?: number): void {
    this.empresaService.getByUsuarioOID(this.usuarioSession.usuarioOID)
      .subscribe({
        next: (empresas) => {
          this.empresas = empresas;
          if (!this.empresas?.length) return;

          this.selectedEmpresa = this.empresas[0];
          const proyectoEmpresa = this.empresas.find(empresa => empresa.empresaId === this.proyecto.empresaId);
          if (proyectoEmpresa) {
            this.selectedEmpresa = proyectoEmpresa;
            this.empresaChanged(id);
          }

          this.getMarcasByEmpresaYUsuario(id);
          this.formValidadores.patchValue({empresa: this.selectedEmpresa});
        },
        error: (err) => {
          console.error('Error fetching empresas:', err);
          // Handle the error appropriately here
        }
      });
  }

  public empresaChanged(id?: number) {
    const empresaId = id || this.selectedEmpresa.empresaId;
    this.getMarcasByEmpresaYUsuario(empresaId);
  }

  empresaEventChanged(event: {value: Empresa}) {
    const newSelectedEmpresa: Empresa = event.value;
    if (newSelectedEmpresa && this.selectedEmpresa.empresaId !== newSelectedEmpresa.empresaId) {
      this.selectedEmpresa = newSelectedEmpresa;
      this.empresaChanged()
      setTimeout(() => {
        if (this.marcas.length > 0) {
          let primeraMarca = this.marcas[0];
          // Llama al método marcaChanged con la primera marca
          this.marcaChanged({ value: primeraMarca }, true);
        }
      }, 500);
    }
  }

  public getMarcasByEmpresaYUsuario(id?: number): void {
    if (!this.usuarioSession || !this.selectedEmpresa) {
      return;
    }

    this.marcaService.getMarcasByEmpresaYUsuario(
      this.usuarioSession.usuarioOID,
      id
    ).subscribe({
      next: (marcas) => {
        this.marcas = marcas;
        if (!this.marcas?.length) {
          this.selectedMarca = null;
          return;
        }
        this.selectedMarca = this.marcas.find(marca => marca.marcaId === this.proyecto.marcaId) || this.marcas[0];
        this.getRegionesByMarca(id);
        this.formValidadores.patchValue({
          marca: this.selectedMarca
        });
      },
      error: (err) => {
        console.error('Error fetching marcas:', err);
        // Handle the error appropriately here
        this.selectedMarca = null;
      }
    });
  }

  public getRegionesByMarca(id?: number): void {
    if (!this.proyecto || !this.selectedMarca) {
      return;
    }
    const marcaId = id === 1 ? this.selectedMarca.marcaId : this.proyecto.marcaId;
    this.setRegiones(marcaId);
  }

  setRegiones(marcaId: number): void {
    this.proyectoService.getProyectoRegionesByMarca(
      this.proyecto.proyectoId,
      marcaId,
      this.usuarioSession.usuarioOID
    ).subscribe({
      next: (data) => {
        this.displayRegiones(data);
      },
      error: (err) => {
        console.error('Error fetching proyecto regiones:', err);
      }
    });
  }


  public getDocumentos() {
    // if (this.proyecto == null || this.proyecto.marcaId <= 0) {
    //   return;
    // }

    var docProyectos: ProyectoDocumento[] = null;
    this.proyectoService
      .getDocumentosByProyecto(
        this.proyecto.proyectoId,
        this.usuarioSession.usuarioOID
      )
      .subscribe((data) => {
        docProyectos = data;
        console.log('proyecto console')
        console.log(data)
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
    this.proyectoRegiones = [];
    this.proyectoRegionesSelected = [];

    /*this.selectedProyectoRegionesRight = null;
  this.selectedProyectoRegionesLeft = null;*/

    if (proyRegionesTraido == null || proyRegionesTraido.length <= 0) {
      return;
    }

    let regProy: ProyectoRegion;
    for (let i = 0; i < proyRegionesTraido.length; i++) {
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

  public marcaChanged(event: { value: Marca }, isFirstTime: boolean = false) {
    const newSelectedMarca: Marca = event.value;
    if (isFirstTime) {
      this.setRegiones(newSelectedMarca.marcaId);
    } else {
      if (newSelectedMarca && this.selectedMarca.marcaId !== newSelectedMarca.marcaId) {
        this.selectedMarca = newSelectedMarca;
        this.proyecto.marcaId = newSelectedMarca.marcaId;
        this.setRegiones(newSelectedMarca.marcaId);
      }
    }
  }

  public guardarProyecto() {
    this.msgs = [];
    this.proyecto = {
      ...this.proyecto,
      clave: this.formValidadores.get('clave').value || this.proyecto.clave,
      nombre: this.formValidadores.get('nombre').value || this.proyecto.nombre,
      descripcion: this.formValidadores.get('descripcion').value || this.proyecto.descripcion,
      fechaIniDate: this.formValidadores.get('fechaInicio').value || this.proyecto.fechaIniDate,
      fechaFinDate: this.formValidadores.get('fechaFin').value || this.proyecto.fechaFinDate,
      diasVigencia: this.formValidadores.get('diasVigencia').value || this.proyecto.diasVigencia,
      cantidadDocumento: this.formValidadores.get('cantidadDocumento').value || this.proyecto.cantidadDocumento,
      empresaId: this.formValidadores.get('empresa').value.empresaId || this.proyecto.empresaId,
      marcaId: this.formValidadores.get('marca').value.marcaId || this.proyecto.marcaId
    }

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

    if (this.proyecto.flagActivo) {
      this.proyecto.activo = 1;
    } else {
      this.proyecto.activo = 0;
    }

    if (this.proyecto.fechaIniDate != null) {
      this.proyecto.fechaIniText = this.datePipe.transform(
          this.proyecto.fechaIniDate,
          'dd/MM/yyyy'
      );
    }

    if (this.proyecto.fechaFinDate != null) {
      this.proyecto.fechaFinText = this.datePipe.transform(
          this.proyecto.fechaFinDate,
          'dd/MM/yyyy'
      );
    }

    if (
      this.proyectoRegionesSelected != null &&
      this.proyectoRegionesSelected.length > 0
    ) {
      let regionesConcat: string = null;
      for (let i = 0; i < this.proyectoRegionesSelected.length; i++) {
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
  onSubmit() {
    this.guardarProyecto();
  }

  convertirMayusculas($event: Event) {
    this.formValidadores.controls.clave.setValue(($event.target as HTMLInputElement).value.toUpperCase());
  }
}
