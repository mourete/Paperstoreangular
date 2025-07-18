export class GlobalConstants {
  //public static apiURL: string = "http://paperstore.com.mx:8085/";
  //public static apiURL: string = "http://3.21.151.73:8085/";
  //public static apiURL: string = "http://localhost:8085/";
  public static apiURL: string = "https://api.paperstore.com.mx/";

    public static CONCEPTO_TIPO_TEXTO : number = 1;
    public static CONCEPTO_TIPO_ENTERO : number = 2;
    public static CONCEPTO_TIPO_DECIMAL : number = 3;
    public static CONCEPTO_TIPO_PORCENTAJE : number = 12;
    public static CONCEPTO_TIPO_FECHA : number = 4;
    public static CONCEPTO_TIPO_HORA  : number = 5;
    public static CONCEPTO_TIPO_OPCION_MULTIPLE : number = 6;
    public static CONCEPTO_TIPO_SELECCION_MULTIPLE : number=7;
    public static CONCEPTO_TIPO_FOTO :number =8;
    public static CONCEPTO_TIPO_PERSONAL:number =9;
    public static CONCEPTO_TIPO_INSTRUCCION :number=10;
    public static CONCEPTO_TIPO_MENSAJE :number=11;
    public static CONCEPTO_TIPO_VIGENCIA :number=13;
    public static CONCEPTO_TIPO_ARCHIVO :number=14;





   public static CURRENT_DOCUMENTO_ID="CURRENT_DOCUMENTO_ID";
   public static CURRENT_PROYECTO_ID="CURRENT_PROYECTO_ID";
   public static CURRENT_REGION_ID="CURRENT_REGION_ID";
   public static CURRENT_SUCURSAL_ID="CURRENT_SUCURSAL_ID";
   public static CURRENT_DOCUMENTO="CURRENT_DOCUMENTO";
   public static CURRENT_SUCURSAL="CURRENT_SUCURSAL";
   public static CURRENT_REGION="CURRENT_REGION";


   public static MENU_DOCUMENTOS="DOCUMENTOS";
   public static MENU_DOCUMENTOSBUSCAR="DOCUMENTOSBUSCAR";
   public static MENU_INSTANCIAS="INSTANCIAS";
   public static MENU_LISTA_DOCUMENTO_USUARIOS_BUSCAR="LISTADOCUMENTOUSUARIOSBUSCAR";
   public static MENU_LISTA_DOCUMENTO_USUARIOS="LISTADOCUMENTOUSUARIOS";
   public static MENU_LISTAS="LISTAS";
   public static MENU_EMPRESAS="EMPRESAS";
   public static MENU_MARCAS="MARCAS";
   public static MENU_REGIONES="REGIONES";
   public static MENU_USUARIOS="USUARIOS";
  public static MENU_PERFIL="PERFILES";
   public static MENU_SUCURSALES="SUCURSALES";
   public static MENU_PROYECTOS="PROYECTOS";
   public static MENU_DASHBOARD = "DASHBOARD_OPERATIVO";
   public static MENU_STORECHECK = "STORECHECK";
}

export const readOnly: Map<number, boolean> = new Map([
  [0, true],
  [1, false]
])
