import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Message} from 'primeng/api';

import {EmpresaService} from 'src/app/service/empresa.service';
import {MarcaService} from 'src/app/service/marca.service';
import {Marca} from 'src/app/model/marca';
import {Empresa} from 'src/app/model/empresa';
import {Usuario} from 'src/app/model/usuario';
import {Estado} from 'src/app/model/estado';
import {Ciudad} from 'src/app/model/ciudad';

import {CiudadService} from 'src/app/service/ciudad.service';

import {FormBuilder, Validators,} from '@angular/forms';

import {EstadoService} from 'src/app/service/estado.service';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.scss'],
})
export class MarcaComponent implements OnInit, AfterViewInit {
  @ViewChild('claveInput') claveInput: ElementRef;
  marca: Marca;
  empresas: Empresa[];
  msgs: Message[] = [];
  usuarioSession: Usuario;
  selectedEmpresa: Empresa;
  selectedEstado: Estado;
  usuarioOID: string;
  estados: Estado[];
  ciudades: Ciudad[];
  selectedCiudad: Ciudad;
  tituloEmpresa: string;

  profileMarca = this.fb.group({
    clave: ['', Validators.required],
    nombre: ['', Validators.required],
    flagActivo: ['', Validators.required],
    empresa: ['', Validators.required],
    mail: [''],
    calle: [''],
    numero: [''],
    entreCalle: [''],
    colonia: [''],
    cp: [''],
    encargado: [''],
    estadosForm: [''],
    ciudadesForm: [''],
  });

  constructor(
    public estadoService: EstadoService,
    public ciudadService: CiudadService,
    public empresaService: EmpresaService,
    private fb: FormBuilder,
    public marcaService: MarcaService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
  }

  get f() {
    return this.profileMarca.controls;
  }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    this.tituloEmpresa = this.usuarioSession.infoHuesped.nbEmpresa;
    this.usuarioOID = this.usuarioSession.usuarioOID;

    if (this.config.data.marcaId > 0) {
      this.getMarcaByMarcaId(this.config.data.marcaId);
    } else {
      this.marca = new Marca();
      this.marca.usuarioCreated = this.usuarioSession.usuarioOID;
      this.marca.empresaId = 0;
      this.marca.activo = 1;
      this.marca.flagActivo = true;
    }
    this.getEmpresasByUsuarioOID();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getAllEstados();
    }, 100);
  }

  public getAllEstados() {
    this.estadoService.getAllEstados(this.usuarioOID).subscribe((data) => {
      this.estados = data;
      const estado = this.estados.find((item) => item.estadoId == this.marca.estadoId);
      this.selectedEstado = estado;
      this.profileMarca.patchValue({estadosForm: this.selectedEstado});
      this.getCiudadesByEstado(
        estado.estadoId,
        this.usuarioSession.usuarioOID
      );
    });
  }

  public getMarcaByMarcaId(marcaId: number) {
    this.marcaService
      .getByMarcaId(marcaId, this.usuarioOID)
      .subscribe((data) => {
        this.marca = data;
        this.marca.flagActivo = this.marca.activo === 1;
        this.getEmpresasByUsuarioOID();
      });
  }

  public getEmpresasByUsuarioOID() {
    this.empresaService
      .getByUsuarioOID(this.usuarioSession.usuarioOID)
      .subscribe((data) => {
        this.empresas = data;
        if (this.empresas != null && this.empresas.length > 0) {
          if (this.marca != null && this.marca.empresaId <= 0) {
            this.selectedEmpresa = this.empresas[0];
          } else {
            if (this.marca != null) {
              for (let i = 0; i < this.empresas.length; i++) {
                if (this.empresas[i].empresaId == this.marca.empresaId) {
                  this.selectedEmpresa = this.empresas[i];
                  break;
                }
              }
            }
          }
        }
      });
  }

  public guardarMarca() {
    this.msgs = [];

    if (this.marca.clave == null || this.marca.clave == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar la clave de la marca ',
        summary: 'Validation failed',
      });
      return;
    }

    if (this.marca.nombre == null || this.marca.nombre == '') {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere capturar el nombre de la marca ',
        summary: 'Validation failed',
      });
      return;
    }

    if (this.selectedEmpresa == null) {
      this.msgs.push({
        severity: 'error',
        detail: 'Se requiere seleccionar la empresa para la marca ',
        summary: 'Validation failed',
      });
      return;
    }

    this.marca.empresaId = this.selectedEmpresa.empresaId;

    if (this.marca.flagActivo) {
      this.marca.activo = 1;
    } else {
      this.marca.activo = 0;
    }
    this.marca.ciudadId = this.profileMarca.value.ciudadesForm?.ciudadId || this.marca.ciudadId;
    this.marcaService
      .guardarMarca(this.marca, this.usuarioSession.usuarioOID)
      .subscribe((data) => {
        // this.marca = data;
        this.ref.close(this.marca);
      });
  }

  public cancelar() {
    this.ref.close();
  }

  onSubmit() {
    this.guardarMarca();
  }

  public empresaChanged() {
  }

  public estadoChanged() {
    this.marca.estado = this.profileMarca.value.estadosForm.nombre;
    this.selectedEstado = this.profileMarca.value.estadosForm;
    if (this.selectedEstado == null || this.selectedEstado.estadoId <= 0) {
      return;
    }

    this.getCiudadesByEstado(
      this.selectedEstado.estadoId,
      this.usuarioSession.usuarioOID
    );
  }

  public getCiudadesByEstado(estadoId: number, usuarioOID: string) {
    this.ciudadService
      .getCiudadesByEstado(estadoId, usuarioOID)
      .subscribe((data) => {
        this.ciudades = data;
        this.selectedCiudad = this.ciudades.find((item) => {
          return item.ciudadId == this.marca.ciudadId;
        });
        this.profileMarca.patchValue({
          ciudadesForm: this.selectedCiudad,
        })
      });
  }

  convertirAMayusculas() {
    const claveValue: string = this.marca.clave;
    this.marca.clave = claveValue.toUpperCase();
  }
}
