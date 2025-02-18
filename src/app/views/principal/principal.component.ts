import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver
} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AccountService} from 'src/app/service/account.service'
import {Modulo} from 'src/app/model/modulo';
import {Usuario} from 'src/app/model/usuario';
import {UsuarioLog} from 'src/app/model/usuario-log';
import {Router} from "@angular/router";
import {GlobalConstants} from 'src/app/model/global-constants';
import {DocumentosUsuarioComponent} from '../documentos-usuario/documentos-usuario.component';
import {ListDocumentoUsuariosComponent} from '../list-documento-usuarios/list-documento-usuarios.component';
import {ListDocumentsBuscarComponent} from '../list-documents-buscar/list-documents-buscar.component';
import {ListDocumentsComponent} from '../list-documents/list-documents.component';
import {ListEmpresasComponent} from '../list-empresas/list-empresas.component';
import {ListUsuariosComponent} from '../list-usuarios/list-usuarios.component';
import {ListMarcasComponent} from '../list-marcas/list-marcas.component';
import {ListRegionesComponent} from '../list-regiones/list-regiones.component';
import {ListasAdminComponent} from '../listas-admin/listas-admin.component';
import {ListSucursalesComponent} from '../list-sucursales/list-sucursales.component';
import {ListProyectosComponent} from '../list-proyectos/list-proyectos.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {StoreCheckComponent} from '../storeCheck/storeCheck.component';
import {ListPerfilComponent} from "../list-perfil/list-perfil.component";
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {UsuarioComponent} from "../usuario/usuario.component";
// import { DisplayDocumentBuscarComponent } from '../display-document-buscar/display-document-buscar.component';


@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit, OnDestroy {

    @ViewChild('workarea', {read: ViewContainerRef}) workarea: ViewContainerRef;

    currentTemplate: string;

    items: MenuItem[];
    rawModulos: Modulo[];
    //mapModulos:{};
    usuario: Usuario;
    usuarioLog: UsuarioLog;
    mapModulos: Map<string, Modulo>;
    componentClass: any;
    urlReporte: string;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private accountService: AccountService,
        private router: Router,
        public dialogService: DialogService,
    ) {
    }
    ref: DynamicDialogRef;


    ngOnInit(): void {
        this.currentTemplate = "";
        this.usuario = JSON.parse(localStorage.getItem('usuario'));

        this.items = [
            {
                label: 'File',
                items: [{
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                            label: 'Project', command: (event) => {
                                this.listasAdmin();
                            }
                        },
                        {
                            label: 'Other', command: (event) => {
                                this.documentosAdmin();
                            }
                        }

                    ]
                },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },

            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {label: 'Delete', icon: 'pi pi-fw pi-trash'},
                    {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
                ]
            }
        ];


        this.getRawModulosByUserOID(this.usuario.usuarioOID);

    }
    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }


    public listasAdmin() {
        this.currentTemplate = "listasAdmin";
    }

    public documentosAdmin() {
        this.currentTemplate = "documentosAdmin";
    }

    openVerPerfil() {

        if( this.usuario==null   ){
          return;
        }

        let ref= this.dialogService.open( UsuarioComponent , {
          header: 'Ver Perfil',
          width: '90%',
          contentStyle: {"max-height": "650px" , "height" : "500px;"  } ,
          data: { usuarioOID : this.usuario.usuarioOID, tipoVentana : 2  }
        });


        ref.onClose.subscribe((  ) => {

          // }
        });

        // this.ref = this.dialogService.open(ListVerPerfilComponent, {
        //     header: 'Ver Perfil',
        //     width: '70%',
        //     data: {
        //         usuario: this.usuario
        //     }
        // })
    }


    public selectCurrentTemplate(menu: Modulo) {

        
        let menuId = menu.objetoId.trim() !== "" ? menu.objetoId : menu.titulos;
        menuId = menuId.toUpperCase()

        if (menuId == GlobalConstants.MENU_LISTAS) {
            this.currentTemplate = "listasAdmin";
            this.componentClass = ListasAdminComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_DOCUMENTOS) {
            //  this.currentTemplate="documentosAdmin";
            this.componentClass = ListDocumentsComponent;
            this.setCurrentComponent(this.componentClass);
        } else if (menuId == GlobalConstants.MENU_DOCUMENTOSBUSCAR) {
            //  this.currentTemplate="documentosAdmin";
            this.componentClass = ListDocumentsBuscarComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_EMPRESAS) {
            //  this.currentTemplate="empresasAdmin";
            this.componentClass = ListEmpresasComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_USUARIOS) {
            //this.currentTemplate="usuariosAdmin";
            this.componentClass = ListUsuariosComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_PERFIL) {
            this.componentClass = ListPerfilComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_MARCAS) {
            // this.currentTemplate="marcas";
            this.componentClass = ListMarcasComponent
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_REGIONES) {
            //this.currentTemplate="regiones";
            this.componentClass = ListRegionesComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_SUCURSALES) {
            this.componentClass = ListSucursalesComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_INSTANCIAS) {
            this.currentTemplate = "instancias";
            this.componentClass = DocumentosUsuarioComponent;
            this.setCurrentComponent(this.componentClass);

        // } else if (menuId == GlobalConstants.MENU_LISTA_DOCUMENTO_USUARIOS_BUSCAR) {
        //     this.componentClass = ListDocumentoUsuariosBuscarComponent;
        //     this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_LISTA_DOCUMENTO_USUARIOS) {
            this.componentClass = ListDocumentoUsuariosComponent;
            this.setCurrentComponent(this.componentClass);


        } else if (menuId == GlobalConstants.MENU_PROYECTOS) {
            this.componentClass = ListProyectosComponent;
            this.setCurrentComponent(this.componentClass);

        } else if (menuId == GlobalConstants.MENU_STORECHECK) {
            this.componentClass = StoreCheckComponent;
            this.urlReporte = menu.url;
            localStorage.setItem('urlReporte',JSON.stringify(this.urlReporte));
            console.log(this.urlReporte);
            console.log(menu);
            this.setCurrentComponent(this.componentClass);


        } else if (menuId == GlobalConstants.MENU_DASHBOARD) {
            this.componentClass = DashboardComponent;
            this.urlReporte = menu.url;
            localStorage.setItem('urlReporte',JSON.stringify(this.urlReporte));
            console.log(this.urlReporte);
            console.log(menu);
            this.setCurrentComponent(this.componentClass);
        } else {

            this.currentTemplate = "";
        }


        console.log(menuId);
    }


    public setCurrentComponent(currentComponent: any) {

        this.workarea.remove();
        let componentClass = currentComponent;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const component = this.workarea.createComponent(componentFactory);


    }


    public armaMenu() {
        this.items = [];
        if (this.mapModulos == null || this.mapModulos.size <= 0) {
            return;
        }

        var modulo: Modulo = this.mapModulos.get("1");

        let menuItemsTmp: MenuItem[] = null;
        let mapItemsMenuByParent = new Map<string, MenuItem>();
        this.rawModulos.forEach(modulo => {


            var menuItem: MenuItem = {
                label: modulo.nombre,
                command: null,
                items: menuItemsTmp
            }

            if (modulo.objetoId != null && modulo.objetoId != "") {

                menuItem.command = (event) => {
                    this.selectCurrentTemplate(modulo);
                }

            }

            if (modulo.moduloPadreId <= 0) {


                this.items.push(menuItem);


                mapItemsMenuByParent.set(String(modulo.moduloId), menuItem);

            } else {

                let menuItemParent: MenuItem = mapItemsMenuByParent.get(String(modulo.moduloPadreId));
                if (menuItemParent != null) {
                    if (menuItemParent.items == null || menuItemParent.items.length <= 0) {
                        menuItemParent.items = [];

                        menuItemParent.items[0] = menuItem;


                    } else {

                        menuItemParent.items[menuItemParent.items.length++] = menuItem;
                        // menuItemParent.items.push( [menuItem]  );

                    }
                }
                mapItemsMenuByParent.set(String(modulo.moduloId), menuItem);

            }

        });
    }


    public getRawModulosByUserOID(userOID: string) {
        this.accountService.getModulosByUserOID(userOID).subscribe(
            (data) => {
                this.rawModulos = data;

                if (this.rawModulos == null || this.rawModulos.length <= 0) {
                    return;
                }
                     
                this.setArbolModulos();
                this.armaMenu();
                this.setUserDefaultOption();
                //this.setUserDefaultOption();

            }
        );

    }

    public setUserDefaultOption() {

        this.accountService.getModuloPredeterminado(this.usuario.usuarioOID).subscribe(
            (data) => {
                // console.log("Modulo predeterminado");
                console.log(data);
                let moduloTmp: Modulo = data;
                if (moduloTmp != null && moduloTmp.objetoId != null) {
                    this.selectCurrentTemplate(moduloTmp);
                }
            }
        );

    }


    public setArbolModulos() {
        if (this.rawModulos == null || this.rawModulos.length <= 0) {
            return;
        }

        this.mapModulos = new Map<string, Modulo>();
        this.rawModulos.forEach(element => {
            this.mapModulos.set(String(element.moduloId), element);
        });

    }


    public logOff() {


        this.usuarioLog = JSON.parse(localStorage.getItem('usuarioLog'));
        if (this.usuarioLog == null) {
            return;
        }


        this.accountService.logOff(this.usuarioLog.usuariosLogOID, this.usuarioLog.ip).subscribe(
            (data) => {

                localStorage.removeItem('usuario');
                localStorage.removeItem('usuarioLog');
                this.router.navigate(['/login'])


            }
        );
    }


}
