import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayDocumentComponent } from './views/display-document/display-document.component';
import { DocumentComponent } from './views/document/document.component';
import { SeccionComponent } from './views/seccion/seccion.component';
import { DocumentoResumen } from './model/documento-resumen';
import { DocumentoResumenComponent } from './views/documento-resumen/documento-resumen.component';
import { ListasAdminComponent } from './views/listas-admin/listas-admin.component';
import { DisplayDocumentInstanciaComponent } from './views/display-document-instancia/display-document-instancia.component';
import { DocumentoInstanciaComponent } from './views/documento-instancia/documento-instancia.component';
import { ListDocumentsComponent } from './views/list-documents/list-documents.component';
import { ListDocumentsBuscarComponent } from './views/list-documents-buscar/list-documents-buscar.component';
import { ListDocumentoInstanciasComponent } from './views/list-documento-instancias/list-documento-instancias.component';
import { DocumentosUsuarioComponent } from './views/documentos-usuario/documentos-usuario.component';
import { LoginComponent } from './views/login/login.component';
import { PrincipalComponent } from './views/principal/principal.component';


const routes: Routes = [{ path: 'displayDocument/:documentoId' , component : DisplayDocumentComponent  },
                        { path: 'documento' , component : DocumentComponent  },
                        { path: 'login' , component : LoginComponent  },
                        { path: 'seccion' , component : SeccionComponent  },
                        { path: 'documentoResumen/:documentoId' , component : DocumentoResumenComponent  },
                        { path: 'listasAdmin' , component : ListasAdminComponent  },
                        { path: 'documentoInstancia/:documentoId/:usuarioOID' , component : DocumentoInstanciaComponent  },
                        { path: 'displayDocumentInstancia/:documentoId/:documentoInstanciaOID/:seccionOID/:usuarioOID' , component : DisplayDocumentInstanciaComponent  } ,
                        { path: 'documentosAdmin' , component : ListDocumentsComponent  },
                        { path: 'documentosBuscarAdmin' , component : ListDocumentsBuscarComponent  },
                        { path: 'instanciasAdmin/:documentoId/:proyectoId/:regionId/:sucursalId/:usuarioOID/:documento/:sucursal/:region/:numDocumentos/:numInstancias' , component : ListDocumentoInstanciasComponent  },
                        { path: 'documentosUsuario/:usuarioOID' , component : DocumentosUsuarioComponent  },
                        { path: 'principal' , component : PrincipalComponent  },



                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
