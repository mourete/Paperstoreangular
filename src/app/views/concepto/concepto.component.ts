import { Component, OnInit } from '@angular/core';
import { TipoConcepto } from 'src/app/model/tipo-concepto';
import { ConceptoService } from 'src/app/service/concepto.service';
import { ListaService } from 'src/app/service/lista.service';
import { Concepto } from 'src/app/model/concepto';
import { Usuario } from 'src/app/model/usuario';
import { ConceptoFiltra } from 'src/app/model/conceptoFiltra';
import { Seccion } from 'src/app/model/seccion';
import { Lista } from 'src/app/model/lista';
import { TipoLista } from 'src/app/model/tipo-lista';
import { ListasConceptosSecciones } from 'src/app/model/listas-conceptos-secciones';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Opcion } from 'src/app/model/opcion';
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/api';
import { PerfilUsuario } from 'src/app/model/perfil-usuario';
import { ConceptoAlertaPerfil } from 'src/app/model/concepto-alerta-perfil';
import { FormGroup, FormControl, Validators, FormBuilder,} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
import {validarFecha, validarHora} from 'src/app/utils/forms';

@Component({
  selector: 'app-concepto',
  templateUrl: './concepto.component.html',
  styleUrls: ['./concepto.component.scss'],
})

export class ConceptoComponent implements OnInit {
  profileConcepto: FormGroup;
  listas: Lista[];
  listasFiltra: ConceptoFiltra[];
  opciones: Opcion[];
  seccion: Seccion;
  conceptoAlertaPerfilRojo: ConceptoAlertaPerfil[];
  conceptoAlertaPerfilAmarillo: ConceptoAlertaPerfil[];
  //conceptoAlertaPerfil : ConceptoAlertaPerfil;
  conceptoAlertaPerfilRojoSeleccion: ConceptoAlertaPerfil[];
  conceptoAlertaPerfilAmarilloSeleccion: ConceptoAlertaPerfil[];

  catOrders: SelectItem[] = [
    { label: 'Ascendente', value: 1 },
    { label: 'Descendente', value: 2 },
  ];
  usuarioPerfiles: PerfilUsuario[];
  concepto: Concepto;
  selectedTipoConcepto: TipoConcepto;
  selectedLista: Lista;
  selectedListaFiltra: ConceptoFiltra;
  selectedTipoLista: TipoLista;
  selectedOpcion: Opcion;
  requerida: boolean;
  habilitada: boolean;
  buscar: boolean;
  selectedOrder: number;
  usuario: Usuario;
  usuarioOID: string;
  noEditable: boolean;
  filtro: boolean;
  valueFiltrada: String;
  TextFiltrada: String;
  soloParaEditar: String;
  diasAlertaRojo: number;
  diasAlertaAmarillo: number;
  alertaRojo: boolean;
  alertaAmarillo: boolean;
  claveIsDisabled: boolean;

  tiposConcepto: TipoConcepto[] = [
    { tipoConceptoId: 1, nombre: 'Texto' },
    { tipoConceptoId: 2, nombre: 'Entero' },
    { tipoConceptoId: 3, nombre: 'Decimal' },
    { tipoConceptoId: 12, nombre: 'Porcentaje' },
    { tipoConceptoId: 4, nombre: 'Fecha' },
    { tipoConceptoId: 5, nombre: 'Hora' },
    { tipoConceptoId: 6, nombre: 'Opcion Múltiple' },
    { tipoConceptoId: 7, nombre: 'Selección múltiple' },
    { tipoConceptoId: 8, nombre: 'Foto(PNG)/Archivo(PDF)' },
    { tipoConceptoId: 10, nombre: 'Instrucción' },
    { tipoConceptoId: 11, nombre: 'Mensajes' },
    { tipoConceptoId: 13, nombre: 'Vigencia' },
  ];

  tiposLista: TipoLista[] = [{ tipoListaId: 1, nombre: 'Catálogo' }];

  msgs: Message[] = [];

  constructor(
    private conceptoService: ConceptoService,
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private listaService: ListaService
  ) {}

  get clave() {
    return this.profileConcepto.get('clave');
  }

  //get f() { return this.profileConcepto.controls; }

  opcionesCambia() {
    this.filtro = false;
  }

  ngOnInit(): void {
    this.profileConcepto = this.fb.group({
      tipoConcepto: [''],
      descripcion: ['', Validators.required],
      clave: ['', Validators.required],
      requerido: [''],
      habilitada: [''],
      buscar: [''],
      noEditable: [''],
      textMaximo: [''],
      maximo: [''],
      minimo: [''],
      flagSeleccionadoRojo: [''],
      flagSeleccionadoAmarillo: [''],
      fechaMinima: [''],
      fechaMaxima: [''],
      horaMinima: [''],
      horaMaxima: [''],
      mensaje: [''],
      catalogo: [''],
      tipoListaCtr: [''],
      opcionesLista: [''],
      diasAlertaRojo: [''],
      diasAlertaAmarillo: [''],
      orden: [''],
      conceptoFiltro: [''],
      filtro: [''],
      alertaRojo: [''],
      alertaAmarillo: [''],
      listboxAmarillo: [''],
      listboxRojo: [''],
    });
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuario.usuarioOID;
    this.getAllListas();
    this.concepto = new Concepto();

    this.habilitada = true;
    this.noEditable = false;
    this.buscar = true;
    this.selectedTipoConcepto = this.tiposConcepto[0];

    this.profileConcepto.get('maximo').valueChanges.subscribe(() => {
      this.checkInput();
    });
    this.profileConcepto.get('minimo').valueChanges.subscribe(() => {
      this.checkInput();
    });

    this.profileConcepto.get('fechaMinima').valueChanges.subscribe(() => {
      this.revisarFechaMin();
    });
    this.profileConcepto.get('fechaMaxima').valueChanges.subscribe(() => {
      this.revisarFechaMax();
    });

    this.profileConcepto.get('horaMinima').valueChanges.subscribe(() => {
      this.revisarHoraMin();
    });
    this.profileConcepto.get('horaMaxima').valueChanges.subscribe(() => {
      this.revisarHoraMax();
    });

    if (this.config.data.concepto != null) {
      if (this.config.data.concepto.conceptoOID != null) {
        this.getConceptoByOID(this.config.data.concepto.conceptoOID);
      }
    } else {
      this.concepto.orden = this.config.data.orden;
    }

    this.profileConcepto.get('orden').valueChanges.subscribe((newOrder) => {
      this.selectedOrder = newOrder;
      this.ordenarOpciones();
    });
  }

  onOrderChange() {
    this.ordenarOpciones();
  }

  ordenarOpciones() {
    const selectedOrder = this.profileConcepto.get('orden').value;
    if (!this.opciones || selectedOrder === undefined) {
      return;
    }

    if (this.selectedOrder === 1) {
      this.opciones.sort((a, b) => a.orden- b.orden);
    } else if (this.selectedOrder === 2) {
      this.opciones.sort((a, b) => b.orden - a.orden);
    }
  }


  private getTipoConcepto(idTipCon: number): TipoConcepto {
    for (var idx = 0; idx < this.tiposConcepto.length; idx++) {
      if (idTipCon == this.tiposConcepto[idx].tipoConceptoId) {
        return this.tiposConcepto[idx];
      }
    }
    return null;
  }

  public listaChanged() {
    this.getOpcionesByLista(this.selectedLista.listaOID);
    this.conceptoFiltro(this.filtro);
    this.ordenarOpciones();
  }

  public cancelar() {
    this.ref.close();
  }

  public clickFiltro(e) {
    if (e.checked) {
      this.conceptoFiltro(e.checked);
    }
  }

  public conceptoFiltro(type: boolean) {
    //this.config.data.seccion

    if (this.selectedLista == null) return;

    this.concepto.listaOID = this.selectedLista.listaOID;
    //this.concepto.seccionOID ;
    this.concepto.seccionOID = this.config.data.seccion.seccionOID;

    if (type && this.selectedLista.filtro == 1) {
      this.conceptoService
        .conceptoFiltro(this.concepto, this.usuarioOID)
        .subscribe((data) => {
          this.listasFiltra = data.listConceptoFiltra;

          this.selectedListaFiltra = this.listasFiltra[0];

          /* this.valueFiltrada = data.listaFiltroOID; //listaOID
      this.TextFiltrada = data.descripcionText;*/
        });
    }

    //
  }

  onSubmit() {
    console.warn(this.profileConcepto.value);
    this.guardarConcepto();
  }

  public guardarConcepto() {
    this.msgs = [];
    if (this.concepto.descripcion == null || this.concepto.descripcion == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar la descripción del concepto',
        summary: 'Validation failed',
      });
      return;
    }

    if (
      this.selectedLista == null &&
      (this.selectedTipoConcepto.tipoConceptoId == 6 ||
        this.selectedTipoConcepto.tipoConceptoId == 7)
    ) {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere seleccionar el catalogo',
        summary: 'Validation failed',
      });
      return;
    }

    if (
      this.concepto.maximo < this.concepto.minimo &&
      (this.concepto.tipoConceptoId == 2 ||
        this.concepto.tipoConceptoId == 3 ||
        this.concepto.tipoConceptoId == 5)
    ) {
      this.msgs.push({
        severity: 'error',
        detail: 'El maximo no puede ser menor que el minimo',
        summary: 'Validation failed',
      });
      return;
    }

    if (
      this.concepto.maximo != undefined &&
      this.concepto.maximo == this.concepto.minimo &&
      this.selectedTipoConcepto.tipoConceptoId == 2
    ) {
      this.msgs.push({
        severity: 'error',
        detail: 'El maximo y el minimo no pueden ser iguales',
        summary: 'Validation failed',
      });
      return;
    }

    if (
      '' + this.concepto.maximo != '' &&
      this.concepto.maximo == 0 &&
      this.selectedTipoConcepto.tipoConceptoId == 1
    ) {
      this.msgs.push({
        severity: 'error',
        detail: 'La longitud no puede ser cero',
        summary: 'Validation failed',
      });
      return;
    }

    if (
      this.concepto.maximo <= 0 &&
      this.selectedTipoConcepto.tipoConceptoId == 2
    ) {
      this.msgs.push({
        severity: 'error',
        detail: 'El maximo no puede ser menor ni igual que cero',
        summary: 'Validation failed',
      });
      return;
    }

    if (this.concepto.minimo < 0) {
      this.msgs.push({
        severity: 'error',
        detail: 'El minimo no puede ser menor que cero',
        summary: 'Validation failed',
      });
      return;
    }

    this.seccion = this.config.data.seccion;
    this.concepto.seccionOID = this.seccion.seccionOID;
    this.concepto.tipoConceptoId = this.selectedTipoConcepto.tipoConceptoId;

    if (this.requerida) {
      this.concepto.requerida = 1;
    } else {
      this.concepto.requerida = 0;
    }

    if (this.habilitada) {
      this.concepto.enabled = 1;
    } else {
      this.concepto.enabled = 0;
    }
    if (this.buscar) {
      this.concepto.buscar = 1;
    } else {
      this.concepto.buscar = 0;
    }

    if (this.noEditable) {
      this.concepto.noEditable = 1;
    } else {
      this.concepto.noEditable = 0;
    }

    if (this.filtro) {
      this.concepto.filtro = 1;
      // this.concepto.listaOID = this.valueFiltrada;
    } else {
      this.concepto.filtro = 0;
      // this.concepto.listaOID ="";
    }

    this.concepto.visible = 1;
    this.concepto.activa = 1;

    if (
      this.selectedTipoConcepto.tipoConceptoId == 6 ||
      this.selectedTipoConcepto.tipoConceptoId == 7
    ) {
      //es opcion o seleccion multiple
      let lcs = new ListasConceptosSecciones();
      lcs.listaOID = this.selectedLista.listaOID;
      lcs.tipoListaOpcionId = this.selectedTipoLista.tipoListaId;
      lcs.tipoOrdenId = this.selectedOrder;
      lcs.filtro = this.concepto.filtro;

      if (lcs.filtro == 1) {
        lcs.conceptoFiltroOID = this.selectedListaFiltra.conceptoOID;
      }

      this.concepto.listasConceptosSecciones = lcs;
    }
    if (this.selectedTipoConcepto.tipoConceptoId == 13) {
      if (this.alertaAmarillo) {
        this.concepto.alertaAmarillo = 1;
      } else {
        this.concepto.alertaAmarillo = 0;
      }

      if (this.alertaRojo) {
        this.concepto.alertaRojo = 1;
      } else {
        this.concepto.alertaRojo = 0;
      }
      //this.concepto.diasAlertaAmarillo=this.diasAlertaAmarillo;
      //this.concepto.diasAlertaRojo = this.diasAlertaRojo;
      var sPerfilRojo: string;
      var sPerfilAmarillo: string;
      sPerfilRojo = this.getPerfilesConcat(
        this.conceptoAlertaPerfilRojoSeleccion
      );
      sPerfilAmarillo = this.getPerfilesConcat(
        this.conceptoAlertaPerfilAmarilloSeleccion
      );

      this.concepto.conceptoAlertaPerfilRojoConcat = sPerfilRojo;
      this.concepto.conceptoAlertaPerfilAmarilloConcat = sPerfilAmarillo;
    }

    this.conceptoService
      .guardarConcepto(this.concepto, this.usuarioOID)
      .subscribe((data) => {
        if (data != null) {
          this.concepto = data;
          this.ref.close(this.concepto);
        } else {
          this.ref.close(null);
        }
      });
  }

  public getConceptoByOID(conceptoOID: string) {
    this.conceptoService
      .getConceptoByOID(conceptoOID, this.usuarioOID)
      .subscribe((data) => {
        this.concepto = data;
        this.claveIsDisabled = this.concepto.clave != undefined;
        this.soloParaEditar = this.concepto.listaOID;

        this.getConceptoAlertaByPerfil();

        this.refreshConcepto();
      });
  }

  public getOpcionesByLista(listaOID: string) {
    this.opciones = [];
    this.listaService.getOpcionesByLista(listaOID, this.usuario.usuarioOID)
      .subscribe((data) => {
        this.opciones = data;
        this.ordenarOpciones();
      });
  }

  public refreshConcepto() {
    this.selectedTipoConcepto = this.getTipoConcepto(
      this.concepto.tipoConceptoId
    );
    if (this.concepto.requerida == 1) {
      this.requerida = true;
    } else {
      this.requerida = false;
    }

    if (this.concepto.enabled == 1) {
      this.habilitada = true;
    } else {
      this.habilitada = false;
    }
    if (this.concepto.buscar == 1) {
      this.buscar = true;
    } else {
      this.buscar = false;
    }
    if (this.concepto.noEditable == 1) {
      this.noEditable = true;
    } else {
      this.noEditable = false;
    }

    if (this.selectedTipoConcepto.tipoConceptoId == 13) {
      if (this.concepto.alertaAmarillo == 1) {
        this.alertaAmarillo = true;
      } else {
        this.alertaAmarillo = false;
      }
      if (this.concepto.alertaRojo == 1) {
        this.alertaRojo = true;
      } else {
        this.alertaRojo = false;
      }
    }

    if (
      this.selectedTipoConcepto.tipoConceptoId == 6 ||
      this.selectedTipoConcepto.tipoConceptoId == 7
    ) {
      this.selectedTipoLista = this.tiposLista[0];
    }

    if (
      this.concepto.listasConceptosSecciones != null &&
      this.concepto.listasConceptosSecciones.listaConceptoSeccionOID != null &&
      this.listas != null
    ) {
      for (var idx = 0; idx < this.listas.length; idx++) {
        if (
          this.concepto.listasConceptosSecciones.listaOID ==
          this.listas[idx].listaOID
        ) {
          this.selectedLista = this.listas[idx];
          this.getOpcionesByLista(this.selectedLista.listaOID);
          break;
        }
      }
    }

    if (this.concepto.filtro == 1) {
      this.filtro = true;

      let aux = this.concepto.listaOID;

      this.concepto.listaOID = this.selectedLista.listaOID;

      this.conceptoService
        .conceptoFiltro(this.concepto, this.usuarioOID)
        .subscribe((data) => {
          this.listasFiltra = data.listConceptoFiltra;

          this.listasFiltra.forEach((element) => {
            if (element.conceptoOID == this.soloParaEditar) {
              this.selectedListaFiltra = element;
            }
          });

          this.concepto.listaOID = aux;
        });
    } else {
      this.filtro = false;
    }
  }

  public tipoConceptoChanged() {
    this.concepto = new Concepto();
    this.concepto.tipoConceptoId = this.selectedTipoConcepto.tipoConceptoId;
    if (
      this.selectedTipoConcepto.tipoConceptoId == 6 ||
      this.selectedTipoConcepto.tipoConceptoId == 7
    ) {
      this.selectedTipoLista = this.tiposLista[0];
    }
    if (this.selectedTipoConcepto.tipoConceptoId == 13) {
      this.getConceptoAlertaByPerfil();
    }

    this.filtro = false;
  }

  public clonarConcepto(conOrig: Concepto): Concepto {
    var conceptoTmp: Concepto;
    conceptoTmp = new Concepto();
    conceptoTmp.seccionOID = conOrig.seccionOID;
    conceptoTmp.tipoConceptoId = conOrig.tipoConceptoId;
    conceptoTmp.orden = conOrig.orden;
    conceptoTmp.activa = conOrig.activa;
    conceptoTmp.enabled = conOrig.enabled;
    conceptoTmp.visible = conOrig.visible;
    conceptoTmp.requerida = conOrig.requerida;
    conceptoTmp.descripcion = conOrig.descripcion;
    conceptoTmp.conceptoOID = conOrig.conceptoOID;
    conceptoTmp.maximo = conOrig.maximo;
    conceptoTmp.minimo = conOrig.minimo;

    return conceptoTmp;
  }

  public getAllListas() {
    this.listaService.getAll(this.usuarioOID).subscribe((data) => {
      this.listas = data;
      this.selectedLista = this.listas[0];
    });
  }

  public getConceptoAlertaByPerfil() {
    var conceptoOID = null;

    if (
      this.concepto == null ||
      this.concepto.conceptoOID == null ||
      this.concepto.conceptoOID == ''
    ) {
      conceptoOID = '*';
    } else {
      conceptoOID = this.concepto.conceptoOID;
    }

    if (this.concepto.tipoConceptoId == 13) {
      this.conceptoService
        .getConceptoAlertaByPerfil(
          { conceptoOID, tipoAlerta: 1 },
          this.usuarioOID
        )
        .subscribe((data) => {
          this.conceptoAlertaPerfilAmarillo = data;

          this.conceptoAlertaPerfilAmarilloSeleccion =
            this.initFlagsConceptoAlerta(
              this.conceptoAlertaPerfilAmarillo,
              this.conceptoAlertaPerfilAmarilloSeleccion
            );

          this.conceptoService
            .getConceptoAlertaByPerfil(
              { conceptoOID, tipoAlerta: 2 },
              this.usuarioOID
            )
            .subscribe((data) => {
              this.conceptoAlertaPerfilRojo = data;
              this.conceptoAlertaPerfilRojoSeleccion =
                this.initFlagsConceptoAlerta(
                  this.conceptoAlertaPerfilRojo,
                  this.conceptoAlertaPerfilRojoSeleccion
                );
            });
        });
    }
  }

  public initFlagsConceptoAlerta(
    conceptoAlerta: ConceptoAlertaPerfil[],
    conceptoAlertaSeleccion: ConceptoAlertaPerfil[]
  ): ConceptoAlertaPerfil[] {
    if (conceptoAlerta == null || conceptoAlerta.length <= 0) {
      return;
    }
    conceptoAlertaSeleccion = [];
    var pu: ConceptoAlertaPerfil;

    for (var i = 0; i < conceptoAlerta.length; i++) {
      pu = conceptoAlerta[i];
      if (pu == null) {
        continue;
      }
      if (pu.seleccionado == '1') {
        //pu.flagSeleccionado=true;
        conceptoAlertaSeleccion.push(pu);
      } else {
        // pu.flagSeleccionado=false;
      }
    }
    return conceptoAlertaSeleccion;
  }

  public getPerfilesConcat(varConceptoPerfil: ConceptoAlertaPerfil[]): string {
    if (this.concepto == null) {
      return;
    }

    var pu: ConceptoAlertaPerfil;
    var perfilesConcat: string = null;

    if (varConceptoPerfil != null && varConceptoPerfil.length > 0) {
      for (var i = 0; i < varConceptoPerfil.length; i++) {
        pu = varConceptoPerfil[i];
        if (pu == null) {
          continue;
        }

        if (perfilesConcat == null) {
          perfilesConcat = '' + pu.perfilId;
        } else {
          perfilesConcat += '|' + pu.perfilId;
        }
      }
    }
    return perfilesConcat;
  }

  convertirAMayusculas() {
    const claveValue: string = this.profileConcepto.get('clave').value;
    this.profileConcepto.get('clave').setValue(claveValue.toUpperCase());
  }

  checkInput() {
    const min = this.profileConcepto.get('minimo').value;
    const max = this.profileConcepto.get('maximo').value;

    if (min !== null && max !== null) {
      const parseMin = parseFloat(min);
      const parseMax = parseFloat(max);

      if (parseMin > parseMax) {
        this.profileConcepto.get('maximo').setErrors({ maxError: true });
      } else {
        this.profileConcepto.get('maximo').setErrors(null);
      }
    }
  }

  revisarFechaMin() {
    const fechaMin = this.profileConcepto.get('fechaMinima').value;
    const fechaMax = this.profileConcepto.get('fechaMaxima').value;
    if (
      fechaMin !== undefined &&
      fechaMax !== undefined &&
      !validarFecha(fechaMin, fechaMax)
    ) {
      this.profileConcepto.get('fechaMinima').setErrors({ dateError: true });
    } else {
      this.profileConcepto.get('fechaMinima').setErrors(null);
    }
  }
  revisarFechaMax() {
    const fechaMin = this.profileConcepto.get('fechaMinima').value;
    const fechaMax = this.profileConcepto.get('fechaMaxima').value;
    if (
      fechaMin !== undefined &&
      fechaMax !== undefined &&
      !validarFecha(fechaMin, fechaMax)
    ) {
      this.profileConcepto.get('fechaMaxima').setErrors({ dateError: true });
    } else {
      this.profileConcepto.get('fechaMaxima').setErrors(null);
    }
  }

  revisarHoraMin() {
    const horaMin = this.profileConcepto.get('horaMinima').value;
    const horaMax = this.profileConcepto.get('horaMaxima').value;
    if (horaMin !== undefined &&
      horaMax !== undefined &&
      !validarHora(horaMin, horaMax))
    {
      this.profileConcepto.get('horaMinima').setErrors({ dateError: true });
    } else {
      this.profileConcepto.get('horaMinima').setErrors(null);
    }
  }
  revisarHoraMax() {
    const horaMin = this.profileConcepto.get('horaMinima').value;
    const horaMax = this.profileConcepto.get('horaMaxima').value;
    if (horaMin !== undefined &&
      horaMax !== undefined &&
      !validarHora(horaMin, horaMax))
    {
      this.profileConcepto.get('horaMaxima').setErrors({ dateError: true });
    } else {
      this.profileConcepto.get('horaMaxima').setErrors(null);
    }
  }

}
