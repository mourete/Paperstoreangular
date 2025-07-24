import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { Documento } from '../../model/documento';
import { Opcion } from 'src/app/model/opcion';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Concepto } from 'src/app/model/concepto';
import { Seccion } from 'src/app/model/seccion';
import { DialogService } from 'primeng/dynamicdialog';
import { ConceptoComponent } from '../concepto/concepto.component';
import { SeccionComponent } from '../seccion/seccion.component';
import { ConceptoService } from '../../service/concepto.service';
import { ConfirmationService } from 'primeng/api';
import { SeccionService } from '../../service/seccion.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-display-document',
  templateUrl: './display-document.component.html',
  styleUrls: ['./display-document.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class DisplayDocumentComponent implements OnInit {
  documentoId: number;
  documento: Documento;
  concepto: Concepto;
  seccion: Seccion;
  selectedOption: Opcion;
  disabled: boolean = true;
  usuarioOID: string;
  usuario: Usuario;
  selectedOptions: any[] = [];


  items: MenuItem[];
  itemsConcepto: MenuItem[];

  @Input() public varDocumentoId: string;
  @Input() public varDocumento: Documento;

  constructor(
    private documentService: DocumentService,
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private conceptoService: ConceptoService,
    private seccionService: SeccionService
  ) {
    this.documentoId = this.actRoute.snapshot.params.documentoId;
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuario.usuarioOID;

    if (this.documentoId == undefined || this.documentoId <= 0) {
      this.documentoId = Number(this.varDocumentoId);
    }

    this.getDocumentForConfig();
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.editarSeccion();
        },
      },
      {
        label: 'Eliminar sección',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteSeccion();
        },
      },
      { separator: true },
      {
        label: 'Agregar concepto',
        icon: 'pi pi-plus',
        command: (event) => {
          this.agregarConcepto(0);
        },
      },
      { separator: true },
      {
        label: 'Agregar sección arriba',
        icon: 'pi pi-plus',
        command: (event) => {
          this.agregarSeccion(1);
        },
      },
      {
        label: 'Agregar sección abajo',
        icon: 'pi pi-plus',
        command: (event) => {
          this.agregarSeccion(2);
        },
      },
    ];

    this.itemsConcepto = [
      {
        label: 'Editar concepto',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.editarConcepto();
        },
      },
      { separator: true },
      {
        label: 'Eliminar concepto',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteConcepto();
        },
      },
      { separator: true },
      {
        label: 'Agregar concepto',
        icon: 'pi pi-plus',
        command: (event) => {
          this.agregarConcepto(0);
        },
      },
      { separator: true },
      {
        label: 'Agregar concepto arriba',
        icon: 'pi pi-plus',
        command: (event) => {
          this.agregarConcepto(1);
        },
      },
      {
        label: 'Agregar concepto abajo',
        icon: 'pi pi-plus',
        command: (event) => {
          this.agregarConcepto(2);
        },
      },
      {
        label: 'Subirlo',
        icon: 'pi pi-arrow-up',
        command: (event) => {
          this.changeConceptoOrder(1)
        }
      },
      {
        label: 'Bajarlo',
        icon: 'pi pi-arrow-down',
        command: (event) => {
          this.changeConceptoOrder(0)
        }
      }
    ];
  }

  public editarSeccion() {
    const ref = this.dialogService.open(SeccionComponent, {
      header: 'Editar sección',
      width: '70%',
      contentStyle: { 'max-height': '350px', overflow: 'auto' },
      data: { seccion: this.seccion },
    });

    ref.onClose.subscribe((secTmp: Seccion) => {
      if (secTmp) {
        this.refreshSeccion(secTmp);
      }
    });
  }

  public delete() {}

  public agregarConcepto(dir: number) {
    let ordenActual: number = 1;

    if (dir == 1 || dir == 2) {
      ordenActual = this.concepto.orden;

      if (dir == 1) {
      } else {
        ordenActual += 1;
      }
    } else {
      if (
        this.concepto != null &&
        this.seccion.conceptos != null &&
        this.seccion.conceptos.length > 0
      ) {
        //Verificamos si el concepto pertenece a la seccion
        for (var i = 0; i < this.seccion.conceptos.length; i++) {
          let conceptoTmp = this.seccion.conceptos[i];

          if (this.concepto.conceptoOID == conceptoTmp.conceptoOID) {
            ordenActual = i + 1 + 1;
            break;
          }
        }
      }
    }

    let ref = this.dialogService.open(ConceptoComponent, {
      header: 'Agregar concepto',
      width: '90%',
      contentStyle: { 'max-height': '550px', height: '500px;' },
      data: { seccion: this.seccion, orden: ordenActual },
    });

    ref.onClose.subscribe((conTmp: Concepto) => {
      if (conTmp) {
        this.addConceptoMem(conTmp);
      }
    });
  }

  public addConceptoMem(concep: Concepto) {
    if (concep == null) {
      return;
    }

    if (this.seccion.conceptos == null || this.seccion.conceptos.length <= 0) {
      this.seccion.conceptos = [];
      this.seccion.conceptos.push(concep);
    } else {
      this.seccion.conceptos.unshift(concep);
    }
  }

  public clickBotonEditarConcepto() {
    if (this.concepto == null) {
      return;
    }

    if (
      this.seccion == null ||
      this.seccion.conceptos == null ||
      this.seccion.conceptos.length <= 0
    ) {
      return;
    }

    for (var i = 0; i < this.seccion.conceptos.length; i++) {
      let conceptoTmp = this.seccion.conceptos[i];

      if (this.concepto.conceptoOID == conceptoTmp.conceptoOID) {
        this.editarConcepto();
      }
    }
  }

  public editarConcepto() {
    const ref = this.dialogService.open(ConceptoComponent, {
      header: 'Editar concepto',
      width: '70%',
      contentStyle: { 'max-height': '400px', overflow: 'auto' },
      data: { seccion: this.seccion, concepto: this.concepto },
    });

    ref.onClose.subscribe((conTmp: Concepto) => {
      if (conTmp) {
        this.refreshConcepto(conTmp);
      }
    });
  }

  public refreshConcepto(conTmp: Concepto) {
    this.concepto.descripcion = conTmp.descripcion;
    this.concepto.requerida = conTmp.requerida;
    this.concepto.enabled = conTmp.enabled;
    this.concepto.conceptoOID = conTmp.conceptoOID;
    this.concepto.visible = conTmp.visible;
  }

  public refreshSeccion(secTmp: Seccion) {
    this.seccion.nombre = secTmp.nombre;
  }

  public agregarSeccion(dir: number) {
    let ordenActual: number = 1;
    if (dir == 1 || dir == 2) {
      ordenActual = this.seccion.orden;
      if (dir == 1) {
      } else {
        ordenActual += 1;
      }
    }

    let ref2 = this.dialogService.open(SeccionComponent, {
      header: 'Agregar sección',
      width: '70%',
      contentStyle: { 'max-height': '350px', overflow: 'auto' },
      data: { documentoId: this.documentoId, orden: ordenActual },
    });

    ref2.onClose.subscribe((secTmp: Seccion) => {
      if (secTmp) {
        this.addSeccionToMem(secTmp);
      }
    });
  }

  public addSeccionToMem(sec: Seccion) {
    if (sec == null) {
      return;
    }

    if (this.documento.secciones == null) {
      this.documento.secciones = [];
    }

    let orden = sec.orden;

    this.documento.secciones.splice(orden - 1, 0, sec);
  }

  public onClickMenuSeccion(sec: Seccion) {
    this.seccion = sec;
  }

  public onClickMenuConcepto(sec: Seccion, con: Concepto) {
    this.concepto = con;
    this.seccion = sec;
  }

  public getDocumentForConfig() {
    this.disabled = true;
    this.documentService.getDocumentForConfig(this.documentoId, 0,this.usuarioOID)
      .subscribe(
        (data) => {
          this.documento = data;

          this.disabled = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public deleteConcepto() {
    this.conceptoService
      .deleteConcepto(this.concepto, this.usuarioOID)
      .subscribe((data) => {

        let conceptoTmp = data;
        if (conceptoTmp != null) {
          for (var i = 0; i < this.seccion.conceptos.length; i++) {
            let conceptoTmp = this.seccion.conceptos[i];

            if (this.concepto.conceptoOID == conceptoTmp.conceptoOID) {
              this.seccion.conceptos.splice(i, 1);
              break;
            }
          }
        }
      });
  }

  confirmDeleteConcepto() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar el concepto ?',
      accept: () => {
        this.deleteConcepto();
      },
    });
  }

  confirmDeleteSeccion() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la sección ?',
      accept: () => {
        this.deleteSeccion();
      },
    });
  }

  public deleteSeccion() {
    this.seccionService
      .deleteSeccion(this.seccion, this.usuarioOID)
      .subscribe((data) => {

        let seccionTmp = data;
        if (seccionTmp != null) {
          for (var i = 0; i < this.documento.secciones.length; i++) {
            if (
              this.documento.secciones[i].seccionOID == seccionTmp.seccionOID
            ) {
              this.documento.secciones.splice(i, 1);
              break;
            }
          }
        }
      });
  }

  getSeccion(seccionOID: string): Seccion {
    if (this.documento == null) {
      return null;
    }

    if (this.documento.secciones == null) {
      return null;
    }

    if (this.documento.secciones.length <= 0) {
      return null;
    }

    for (let sec of this.documento.secciones) {
      if (sec.seccionOID == seccionOID) {
        return sec;
      }

      return sec;
    }

    return null;
  }

  public changeConceptoOrder(flagOrder: number) {
    if (this.concepto == null) {
      return;
    }

    this.seccion = this.getSeccion(this.concepto.seccionOID);
    if (this.seccion == null) {
      return;
    }

    let orden: number = this.concepto.orden;

    if (flagOrder == 1) {
      if (this.concepto.orden <= 1) {
        return;
      }

      orden = orden - 1;
    } else if (flagOrder == 0) {
      if (orden >= this.seccion.conceptos.length) {
        return;
      }
      orden = orden + 1;
    }

    this.conceptoService
      .getConceptoByOID(this.concepto.conceptoOID, this.usuarioOID)
      .subscribe((data) => {
        this.concepto = data;
        this.concepto.orden = orden;

        this.conceptoService
          .guardarConcepto(this.concepto, this.usuarioOID)
          .subscribe((data) => {
            //this.getConceptosBySeccionOID( this.seccion.seccionOID  );
            this.getDocumentForConfig();
          });
      });
  }

  public getConceptosBySeccionOID(seccionOID: string) {
    this.conceptoService
      .getConceptoBySeccionOID(seccionOID, this.usuarioOID)
      .subscribe((data) => {
        this.seccion.conceptos = data;
      });
  }

  public onMenuConceptoShow(event) {
    if (this.concepto != null) {
      if (
        this.documento.secciones != null &&
        this.documento.secciones.length > 0
      ) {
        for (var idx = 0; idx < this.documento.secciones.length; idx++) {
          if (
            this.concepto.seccionOID == this.documento.secciones[idx].seccionOID
          ) {
            this.seccion = this.documento.secciones[idx];
            break;
          }
        }
      }
    }
  }

  public onRowSelectConcepto(event) {
    // alert( event.data.seccionOID );
    // this.messageService.add({severity:'info', summary:'Car Selected', detail:'Vin: ' + event.data.vin});

    if (this.concepto == null || this.documento.secciones == null) {
      return;
    }

    for (var i = 0; i < this.documento.secciones.length; i++) {
      let secTmp = this.documento.secciones[i];
      if (secTmp == null) {
        continue;
      }
      if (this.concepto.seccionOID == secTmp.seccionOID) {
        this.seccion = secTmp;
      }
    }
  }
}
