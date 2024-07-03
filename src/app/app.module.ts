import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import {DialogService, DynamicDialogComponent, DynamicDialogModule} from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table'
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule } from 'primeng/fileupload';
import {InputTextModule} from 'primeng/inputtext';
import {DisplayDocumentComponent } from './views/display-document/display-document.component';
// import {DisplayDocumentBuscarComponent } from './views/display-document-buscar/display-document-buscar.component';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PanelModule} from 'primeng/panel';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {DocumentComponent} from './views/document/document.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SeccionComponent} from './views/seccion/seccion.component';
import {ConceptoComponent} from './views/concepto/concepto.component';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuModule} from 'primeng/menu';
import {ListboxModule} from 'primeng/listbox';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { DocumentoResumenComponent } from './views/documento-resumen/documento-resumen.component';
import { ListasAdminComponent } from './views/listas-admin/listas-admin.component';
import {ContextMenuModule} from 'primeng/contextmenu';
import { ListaComponent } from './views/lista/lista.component';
import { OpcionComponent } from './views/opcion/opcion.component';
import { DisplayDocumentInstanciaComponent } from './views/display-document-instancia/display-document-instancia.component';
import { DocumentoInstanciaComponent } from './views/documento-instancia/documento-instancia.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ListDocumentsComponent } from './views/list-documents/list-documents.component';
import { ListDocumentoInstanciasComponent } from './views/list-documento-instancias/list-documento-instancias.component';
// import { ListDocumentoInstanciasCajaComponent } from './views/list-documento-instancias-caja/list-documento-instancias-caja.component';
import { DocumentosUsuarioComponent } from './views/documentos-usuario/documentos-usuario.component';
import { LoginComponent } from './views/login/login.component';
import { InfoHuespedComponent } from './views/info-huesped/info-huesped.component';
import { PrincipalComponent } from './views/principal/principal.component';
import {MenubarModule} from 'primeng/menubar';
import { ListEmpresasComponent } from './views/list-empresas/list-empresas.component';
import { EmpresaComponent } from './views/empresa/empresa.component';
import { ListUsuariosComponent } from './views/list-usuarios/list-usuarios.component';
import { UsuarioComponent } from './views/usuario/usuario.component';
import { PerfilComponent} from "./views/perfil/perfil.component";
import { ListPerfilComponent} from "./views/list-perfil/list-perfil.component";
import { MarcaComponent } from './views/marca/marca.component';
import { ListMarcasComponent } from './views/list-marcas/list-marcas.component';
import { RegionComponent } from './views/region/region.component';
import { ListRegionesComponent } from './views/list-regiones/list-regiones.component';
import { UsuarioMarcasComponent } from './views/usuario-marcas/usuario-marcas.component';
import { ListSucursalesComponent } from './views/list-sucursales/list-sucursales.component';
import { ListDocumentoUsuariosComponent } from './views/list-documento-usuarios/list-documento-usuarios.component';
// import { ListDocumentoUsuariosBuscarComponent } from './views/list-documento-usuarios-buscar/list-documento-usuarios-buscar.component';
import { SucursalComponent } from './views/sucursal/sucursal.component';
import { ProyectoComponent } from './views/proyecto/proyecto.component';
import { ListProyectosComponent } from './views/list-proyectos/list-proyectos.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { TreeModule } from 'primeng/tree'
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {StoreCheckComponent} from './views/storeCheck/storeCheck.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import {TreeTableModule} from 'primeng/treetable';
import {BlockUIModule} from 'primeng/blockui';



@NgModule({
  declarations: [
    AppComponent,
    DisplayDocumentComponent,
    // DisplayDocumentBuscarComponent,
    DocumentComponent,
    SeccionComponent,
    ConceptoComponent,
    DocumentoResumenComponent,
    ListasAdminComponent,
    ListaComponent,
    OpcionComponent,
    DisplayDocumentInstanciaComponent,
    DocumentoInstanciaComponent,
    ListDocumentsComponent,
    ListDocumentoInstanciasComponent,
    // ListDocumentoInstanciasCajaComponent,
   DocumentosUsuarioComponent,
    LoginComponent,
    InfoHuespedComponent,
    PrincipalComponent,
    ListEmpresasComponent,
    EmpresaComponent,
    ListUsuariosComponent,
    UsuarioComponent,
    PerfilComponent,
    ListPerfilComponent,
    MarcaComponent,
    ListMarcasComponent,
    RegionComponent,
    ListRegionesComponent,
    UsuarioMarcasComponent,
    ListSucursalesComponent,
    ListDocumentoUsuariosComponent,
    // ListDocumentoUsuariosBuscarComponent,
    SucursalComponent,
    ProyectoComponent,
    ListProyectosComponent,
    DashboardComponent,
    StoreCheckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule ,
    HttpClientModule ,
    TableModule ,
    FormsModule ,
    ButtonModule ,
    FileUploadModule,
    InputTextModule ,
    DropdownModule ,
    PanelModule ,
    CalendarModule ,
    CheckboxModule ,
    InputTextareaModule ,
    ToolbarModule,
    ListboxModule,
    MultiSelectModule,
    DialogModule,
    MenuModule,
    SplitButtonModule,
    ContextMenuModule,
    InputSwitchModule,
    TreeTableModule,
    TreeModule,
     ConfirmDialogModule,
    BrowserAnimationsModule,
    MessageModule ,
    MessagesModule,
    MenubarModule,
    InputNumberModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    AngularFileUploaderModule,
    BlockUIModule,
    DynamicDialogModule
  ],
  providers: [
      DynamicDialogComponent,
      DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
