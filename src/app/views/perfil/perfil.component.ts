import {Perfil} from './../../model/perfil';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Modulo} from 'src/app/model/modulo';
import {Usuario} from './../../model/usuario';
import {DynamicDialogConfig} from 'primeng/dynamicdialog'
import {DynamicDialogRef, DialogService} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/api';
import {PerfilService} from 'src/app/service/perfil.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {TreeNode} from 'primeng/api';
import {MessageService} from 'primeng/api';
import {PerfilUsuario} from "../../model/perfil-usuario";
import {PuestoService} from "../../service/puesto.service";
import {Puesto} from "../../model/puesto";
import {UsuarioEmpresa} from "../../model/usuario-empresa";
import {Empresa} from "../../model/empresa";


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {


  perfilSession: Perfil;
  perfil: Perfil;
  dataArray: string[] = [];
  selectedPuesto: Puesto;
  selectedEmpresa: Empresa;
  puestos: Puesto[];
  modulos: Modulo[];
  msgs: Message[] = [];
  moduloSeleccionado: Modulo;
  profilePerfil: FormGroup;
  usuarioEmpresas: UsuarioEmpresa[];
  usuarioPerfiles: PerfilUsuario[];
  usuarioPerfilSeleccionado: PerfilUsuario[] = [];
  resultadoAccesos: any[];
  accesosModuloSeleccionados: TreeNode[] = [];
  accesosModulos: TreeNode[];
  noEditable: number;
  activo: number;
  readOnly : number;


  constructor(public perfilService: PerfilService, private fb: FormBuilder,
              public config: DynamicDialogConfig, public ref: DynamicDialogRef,
              public dialogService: DialogService, public puestoService: PuestoService
  ) {

    this.profilePerfil = this.fb.group({
      clave: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[A-Z0-9]*$')]],
      nombre: ['', Validators.required],
      descripcion: [''],
      noEditable: [''],
      readOnly: [''],
      accesoMovil: [''],
      activo: [''],
    })
  }

  get clave() {
    return this.profilePerfil.get('clave');
  }

  get f() {
    return this.profilePerfil.controls;
  }


  onSubmit() {

    this.guardarPerfil();

  }


  ngOnInit(): void {

    const perfilSession = localStorage.getItem('perfil');
    if (perfilSession) {

      this.perfilSession = JSON.parse(perfilSession);
    }

    if (this.config.data.perfil) {
      this.perfil = this.config.data.perfil;
      this.getPerfilModulosJson()
      this.profilePerfil.patchValue({
        clave: this.perfil.clave ?? '',
        nombre: this.perfil.nombre ?? '',
        descripcion: this.perfil.descripcion ?? '',
        noEditable: this.perfil.noEditable ?? 0,
        readOnly: this.perfil.readOnly ?? 0,
        accesoMovil: this.perfil.accesoMovil ?? 0,
        activo: this.perfil.activo ?? 0,
      });
    } else {
      this.perfil = new Perfil();
      this.perfil.perfilCreated = this.perfilSession.UsuarioOID;
      this.perfil.huesped = this.perfilSession.huesped;
      // this.getAllPuestos();
      this.noEditable = 0;
      this.activo = 0;
      this.readOnly = 0;
      this.getPerfilModulosJson();

    }

    this.profilePerfil.valueChanges.subscribe(val => {
      if (this.perfil) {
        this.perfil.clave = val.clave;
        this.perfil.nombre = val.nombre;
        this.perfil.descripcion = val.descripcion;
        this.perfil.noEditable = val.noEditable;
        this.perfil.readOnly = val.readOnly;
        this.perfil.accesoMovil = val.accesoMovil;
        this.perfil.activo = val.activo;
      }
    });


  }

  public getPerfilModulosJson() {
    let userOID: number;
    let sdataArray: string;

    if (this.perfil == null || this.perfil.UsuarioOID == null) {
      userOID = this.perfilSession.perfilId;
    } else {

      userOID = this.perfil.perfilId;

    }
    this.perfilService.getPerfilModulosJson(userOID, this.perfilSession.UsuarioOID).subscribe(
      (data) => {
        this.resultadoAccesos = data;

        this.accesosModulos = JSON.parse(this.resultadoAccesos[1]);
        sdataArray = this.resultadoAccesos[0];
        this.dataArray = sdataArray.split("/");

        this.checkNode(this.accesosModulos, this.dataArray);
        // this.getAllPuestos();

      }
    );

  }

  // public getAllPuestos() {
  //   this.puestoService.getAllPuestos(this.perfilSession.UsuarioOID).subscribe(
  //     (data) => {
  //       this.puestos = data;
  //       if (this.perfil.puestoId > 0) {
  //         this.setCurrentPuesto();
  //
  //
  //       }
  //       this.getPerfilesByUsuarioOID();
  //
  //     }
  //   );
  //
  // }


  public getPerfilByID(UsuarioOID: number, perfilConsultaID: string) {


    this.perfilService.getPerfilById(UsuarioOID, perfilConsultaID).subscribe(
      (data) => {

        this.perfil = data;

        this.getPerfilModulosJson();
      },
    );
  }

  public empresaChanged() {

  }


  public initFlagsPerfiles() {
    if (this.usuarioPerfiles == null || this.usuarioPerfiles.length <= 0) {
      return;
    }


    var pu: PerfilUsuario;
    for (var i = 0; i < this.usuarioPerfiles.length; i++) {
      pu = this.usuarioPerfiles[i];
      if (pu == null) {
        continue;
      }

      if (pu.seleccionado == 1) {
        this.usuarioPerfilSeleccionado.push(pu);
      }
    }
  }


  public setCurrentPuesto() {
    if (this.puestos == null || this.puestos.length <= 0) {
      return;
    }

    for (var i = 0; i < this.puestos.length; i++) {
      if (this.puestos[i].puestoId == this.perfil.puestoId) {
        this.selectedPuesto = this.puestos[i];

      }

    }


  }

  public getPerfilesByUsuarioOID() {
    var perfilID = "*";

    if (this.perfil == null || this.perfil.UsuarioOID == null || this.perfil.UsuarioOID == "") {
      perfilID = "*";
    } else {
      perfilID = this.perfil.UsuarioOID;
    }

    this.perfilService.getPerfilesByPerfilID(perfilID, this.perfilSession.UsuarioOID).subscribe(
      (data) => {

        this.usuarioPerfiles = data;

        this.initFlagsPerfiles();
      }
    );

  }


  public guardarPerfil() {

    this.msgs = [];

    if (!this.perfilSession) {

      if (this.moduloSeleccionado != null) {
        this.perfil.moduloId = this.moduloSeleccionado.moduloId;
      }

      if (this.perfil.UsuarioOID != null && this.perfil.UsuarioOID != "") {
        this.perfil.perfilUpdated = this.perfilSession.UsuarioOID;
        this.perfil.huesped = this.perfilSession.huesped;

      }
      if (this.noEditable) {
        this.perfil.noEditable = 1;
      } else {
        this.perfil.noEditable = 0;
      }

      if(this.activo){
        this.perfil.activo=1;
      }else{
        this.perfil.activo=0;
      }

      if(this.readOnly){
        this.perfil.readOnly=1;
      }else{
        this.perfil.readOnly=0;
      }

      this.setEmpresasConcat();
      this.setModuloConcat();

      this.perfilService.guardarPerfil(this.perfil, this.perfilSession.UsuarioOID).subscribe(
        (data) => {
          this.perfil = data;
          this.ref.close(this.perfil);
        }
      );

    }
  }

  public setModuloConcat() {

    if (this.perfil == null) {
      return;
    }

    var pu: PerfilUsuario;
    var perfilesConcat: string = null;

    if (this.usuarioPerfilSeleccionado != null && this.usuarioPerfilSeleccionado.length > 0) {

      for (var i = 0; i < this.usuarioPerfilSeleccionado.length; i++) {
        pu = this.usuarioPerfilSeleccionado[i];
        if (pu == null) {
          continue;
        }

        /* if( !pu.flagSeleccionado ){
            continue;
         }
*/

        if (perfilesConcat == null) {
          perfilesConcat = "" + pu.perfilId;
        } else {
          perfilesConcat += "|" + pu.perfilId;
        }


      }
    }

    this.perfil.perfilesConcat = perfilesConcat;
  }


  public setEmpresasConcat() {

    if (this.perfil == null) {
      return;
    }

    // var ue:UsuarioEmpresa;
    var ue: UsuarioEmpresa;
    var empresasConcat: string = null;
    var todasMarcas: number;
    if (this.dataArray != null && this.dataArray.length > 0) {

      for (var i = 0; i < this.dataArray.length; i++) {

        if (this.dataArray[i] != null && this.dataArray[i].length > 0) {
          if (empresasConcat == null) {
            empresasConcat = this.dataArray[i] + "|";
          } else {
            empresasConcat += this.dataArray[i] + "|";
          }
        }
      }
    }

    if (empresasConcat) {
      this.perfil.empresasConcat = empresasConcat.substring(0, empresasConcat.length - 1);
    }

  }


  public cancelar() {
    this.ref.close();
  }


  checkNode(nodes: TreeNode[], str: string[]) {

    for (let i = 0; i < nodes.length; i++) {

      if (!nodes[i].leaf && nodes[i].children.length > 0) {
        if (nodes[i].children[0].leaf) {

          for (let j = 0; j < nodes[i].children.length; j++) {

            if (str.includes(nodes[i].children[j].data)) {

              if (!this.accesosModuloSeleccionados.includes(nodes[i].children[j])) {
                this.accesosModuloSeleccionados.push(nodes[i].children[j]);


              }
            }
          }
        }
      }
      if (nodes[i].leaf) {
        return;
      }
      this.checkNode(nodes[i].children, str);
      let count = nodes[i].children.length;
      let c = 0;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (this.accesosModuloSeleccionados.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected) {
          nodes[i].partialSelected = true;

        }
      }
      if (c == 0) {
      } else if (c == count) {
        nodes[i].partialSelected = false;
        if (!this.accesosModuloSeleccionados.includes(nodes[i])) {
          this.accesosModuloSeleccionados.push(nodes[i]);
        }
      } else {
        nodes[i].partialSelected = true;
      }
    }

  }

  nodeSelect(event) {
    this.addNode(event.node);
    // this.updateFormControl();
  }

  nodeUnselect(event) {
    this.removeNode(event.node);
    this.updateFormControl();
  }

  updateFormControl() {
    const selectedValues = this.accesosModuloSeleccionados.map(node => node.data);
    this.profilePerfil.get('moduloId').setValue(selectedValues);
  }

  removeNode(node: TreeNode) {
    if (node.leaf) {
      this.dataArray.splice(this.dataArray.indexOf(node.key), 1);
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      this.removeNode(node.children[i]);
    }
  }

  addNode(node: TreeNode) {
    if (node.leaf) {

      if (!this.dataArray.includes(node.key)) {
        this.dataArray.push(node.key);

      }
      return;
    }
    if (node?.children !== undefined) {
      for (let i of node.children) {
        this.addNode(i)
      }
    }
  }

  convertirAMayusculas() {

    const claveValue = this.profilePerfil.get('clave').value;
    this.profilePerfil.get('clave').setValue(claveValue.toUpperCase(), {emitEvent: false});
  }


}
