import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';
import { Opcion } from 'src/app/model/opcion';
import { Usuario } from 'src/app/model/usuario';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ListaComponent } from '../lista/lista.component';
import { OpcionComponent } from '../opcion/opcion.component';

@Component({
  selector: 'app-listas-admin',
  templateUrl: './listas-admin.component.html',
  styleUrls: ['./listas-admin.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class ListasAdminComponent implements OnInit {
  listaAccion: string;
  listas: Lista[];
  pantalla: number = 1;
  selectedLista: Lista;
  catalogo: Lista;
  cols: any[];
  opciones: Opcion[];
  selectedOpcion: Opcion;
  opcion: Opcion;
  opcionAccion: string;
  itemsOpcion: MenuItem[];
  itemsLista: MenuItem[];
  estaFiltrada: number = 0;
  usuario: Usuario;
  usuarioOID: string;

  visible: boolean;
  enabled: boolean;

  constructor(
    private listaService: ListaService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuarioOID = this.usuario.usuarioOID;

    this.getAllListas();

    this.cols = [
      { field: 'clave', header: 'Clave' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'accion', header: 'Acción' },
    ];

    this.itemsOpcion = [
      {
        label: 'Editar opción',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.editarOpcion();
        },
      },
      { separator: true },
      {
        label: 'Eliminar opción',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteOpcion();
        },
      },
      { separator: true },
      {
        label: 'Agregar opcion arriba',
        icon: 'pi pi-plus',
        command: (event) => {
          // this.agregarConcepto(1);
        },
      },
      {
        label: 'Agregar opción abajo',
        icon: 'pi pi-plus',
        command: (event) => {
          // this.agregarConcepto(2);
        },
      },
    ];

    this.itemsLista = [
      {
        label: 'Editar Lista',
        icon: 'pi pi-pencil',
        command: (event) => {
          this.editarLista();
        },
      },
      { separator: true },
      {
        label: 'Eliminar lista',
        icon: 'pi pi-trash',
        command: (event) => {
          this.confirmDeleteLista();
        },
      },
      { separator: true },
    ];
  }

  public getAllListas() {
    this.listaService.getAll(this.usuarioOID).subscribe((data) => {
      // console.log('Soy yo');
      console.log(data);
      this.listas = data;
    });
  }

  public getOpcionesByLista(listaOID: string, filtra: number) {
    this.opciones = [];
    this.listaService
      .getOpcionesByLista(listaOID, this.usuarioOID)
      .subscribe((data) => {
        this.opciones = data;
      });

    if (filtra == 1) {
      this.estaFiltrada = 1;
    } else this.estaFiltrada = 0;
  }

  public listaChanged() {
    this.getOpcionesByLista(
      this.selectedLista.listaOID,
      this.selectedLista.filtrada
    );
  }

  public agregarLista_old() {
    this.listaAccion = 'AGREGANDO NUEVA LISTA';
    this.catalogo = new Lista();
    this.catalogo.tipoListaId = 1;
    this.pantalla = 2;
  }

  public guardarLista() {
    this.listaService
      .guardarLista(this.catalogo, this.usuarioOID)
      .subscribe((data) => {
        console.log(data);
        this.pantalla = 1;
        this.catalogo = null;
      });
  }

  public cancelarLista() {
    this.pantalla = 1;
    this.catalogo = null;
  }

  public agregarOpcion_old() {
    this.opcionAccion =
      'AGREGANDO NUEVA OPCION PARA LISTA :' + this.selectedLista.nombre;
    this.opcion = new Opcion();
    this.opcion.listaOID = this.selectedLista.listaOID;
    this.pantalla = 3;
    this.visible = true;
    this.enabled = true;
  }

  public agregarOpcion() {
    let ref = this.dialogService.open(OpcionComponent, {
      header: 'Agregar Opción',
      width: '70%',
      contentStyle: { 'max-height': '550px', overflow: 'auto' },
      data: { lista: this.selectedLista, opcion: null },
    });

    ref.onClose.subscribe((opcTmp: Opcion) => {
      if (opcTmp != null) {
        //REFRESH OPCIN
        this.getOpcionesByLista(
          this.selectedLista.listaOID,
          this.selectedLista.filtrada
        );
      } else {
        alert('No se agrego opcion ');
      }
    });
  }

  public cancelarOpcion() {
    this.pantalla = 1;
    this.opcion = null;
  }

  public guardarOpcion() {
    if (this.visible) {
      this.opcion.visible = 1;
    } else {
      this.opcion.visible = 0;
    }

    if (this.enabled) {
      this.opcion.enabled = 1;
    } else {
      this.opcion.enabled = 0;
    }

    this.listaService
      .guardarOpcion(this.opcion, this.usuarioOID)
      .subscribe((data) => {
        console.log(data);
        this.pantalla = 1;
        this.opcion = null;
      });
  }

  public changeOptionOrder(flagOrder: number) {
    if (flagOrder == 1) {
      if (this.selectedOpcion.orden <= 1) {
        return;
      }

      this.selectedOpcion.orden -= 1;
    } else if (flagOrder == 0) {
      if (this.selectedOpcion.orden >= this.opciones.length) {
        return;
      }
      this.selectedOpcion.orden += 1;
    }

    this.listaService
      .guardarOpcion(this.selectedOpcion, this.usuarioOID)
      .subscribe((data) => {
        console.log(data);
        this.opcion = null;
        this.getOpcionesByLista(
          this.selectedLista.listaOID,
          this.selectedLista.filtrada
        );
      });
  }

  public editarOpcion() {
    if (this.selectedOpcion == null) {
      return;
    }

    let ref2 = this.dialogService.open(OpcionComponent, {
      header: 'Agregar Opción',
      width: '70%',
      contentStyle: { 'max-height': '550px', overflow: 'auto' },
      data: { lista: this.selectedLista, opcion: this.selectedOpcion },
    });

    ref2.onClose.subscribe((opcTmp: Opcion) => {
      // this.refreshSeccion(secTmp);
      if (opcTmp != null) {
        this.getOpcionesByLista(
          this.selectedLista.listaOID,
          this.selectedLista.filtrada
        );
      }
    });

    /*
  this.opcionAccion="EDITANDO OPCION ";
  this.opcion=this.selectedOpcion;
  this.pantalla=3;

  if(this.opcion.visible==1 ){
    this.visible=true;
  }else{
    this.visible=false;
  }

  if(this.opcion.enabled==1 ){
    this.enabled=true;
  }else{
    this.enabled=false;
  } */
  }

  public editarLista_old() {
    if (this.selectedLista == null) {
      return;
    }
    this.listaAccion = 'EDITANDO LISTA ';
    this.catalogo = this.selectedLista;
    this.pantalla = 2;
  }

  public agregarLista() {
    let ref = this.dialogService.open(ListaComponent, {
      header: 'Agregar Lista',
      width: '70%',
      contentStyle: {
        'max-height': '600px',
        overflow: 'auto',
        'min-height': '500px',
      },
      data: { lista: null },
    });

    ref.onClose.subscribe((listaTmp: Lista) => {
      if (listaTmp) {
        // this.refreshSeccion(secTmp);
        this.getAllListas();
      }
    });
  }

  public editarLista() {
    const ref = this.dialogService.open(ListaComponent, {
      header: 'Editar lista',
      width: '70%',
      contentStyle: {
        'max-height': '600px',
        overflow: 'auto',
        'min-height': '500px',
      },
      data: { lista: this.selectedLista },
    });

    ref.onClose.subscribe(() => {
      this.getAllListas();
    });
  }

  public onClickMenuOpcion(opcion: Opcion) {
    this.selectedOpcion = opcion;
  }

  public onClickMenuLista(lista: Lista) {
    this.selectedLista = lista;
  }

  public deleteOpcion() {
    if (this.selectedOpcion == null) {
      return;
    }

    this.listaService
      .deleteOpcion(this.selectedOpcion, this.usuarioOID)
      .subscribe((data) => {
        console.log(data);
        this.getOpcionesByLista(
          this.selectedLista.listaOID,
          this.selectedLista.filtrada
        );
      });
  }

  public deleteLista() {
    if (this.selectedLista == null) {
      return;
    }

    this.listaService
      .deleteLista(this.selectedLista, this.usuarioOID)
      .subscribe((data) => {
        //console.log(data);
        this.getAllListas();
        this.selectedLista = null;
      });
  }

  public confirmDeleteOpcion() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la opción ?',
      accept: () => {
        this.deleteOpcion();
      },
    });
  }

  public confirmDeleteLista() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar la lista ?',
      accept: () => {
        this.deleteLista();
      },
    });
  }
}
