import { ConceptoInstancia } from "../../model/concepto-instancia";
import { ConceptoInstanciaSave } from "../../model/concepto-instancia-save";
import { DocumentoInstancia } from "../../model/documento-instancia";
import { DocumentoInstanciaSave } from "../../model/documento-instancia-save";
import { OpcionInstancia } from "../../model/opcion-instancia";
import { OpcionInstanciaSave } from "../../model/opcion-instancia-save";
import { SeccionInstancia } from "../../model/seccion-instancia";
import { SeccionInstanciaSave } from "../../model/seccion-instancia-save";

// documento-mapper.util.ts
export type MapperOptions = {
  /** Si es true, cualquier string null/undefined se normaliza a '' */
  nullToEmpty?: boolean;
};

export class DocumentoMapper {
  // ===== API PÚBLICA =====
  static toDocumentoInstanciaSave(
    doc: DocumentoInstancia,
    opts?: MapperOptions
  ): DocumentoInstanciaSave {
    return {
      documentoId: doc.documentoId,
      documentoInstanciaOID: this.normStr(doc.documentoInstanciaOID, opts),
      usuarioOID: this.normStr(doc.usuarioOID, opts),
      statusInstanciasId: doc.statusInstanciasId,
      statusNombre: this.normStr(doc.statusNombre, opts),
      proyectoId: doc.proyectoId,
      regionId: doc.regionId,
      sucursalId: doc.sucursalId,
      seccionesInstanciaSave: (doc.seccionesInstancia ?? []).map(s =>
        this.toSeccionInstanciaSave(s, opts)
      ),
    };
  }

  // ===== PRIVADOS: SECCIÓN / CONCEPTO / OPCIÓN =====
  private static toSeccionInstanciaSave(
    s: SeccionInstancia,
    opts?: MapperOptions
  ): SeccionInstanciaSave {
    return {
      seccionOID: this.normStr(s.seccionOID, opts),
      seccionInstanciaOID: this.normStr(s.seccionInstanciaOID, opts),
      documentoInstanciaOID: this.normStr(s.documentoInstanciaOID, opts),
      conceptosInstanciaSave: (s.conceptosInstancia ?? []).map(c =>
        this.toConceptoInstanciaSave(c, opts)
      ),
    };
  }

  private static toConceptoInstanciaSave(
    c: ConceptoInstancia,
    opts?: MapperOptions
  ): ConceptoInstanciaSave {
    const base: ConceptoInstanciaSave = {
        conceptoOID: this.normStr(c.conceptoOID, opts),
        conceptoInstanciaOID: this.normStr(c.conceptoInstanciaOID, opts),
        tipoConceptoId: c.tipoConceptoId,
        valor: this.normStr(c.valor, opts),
        valorUrl: this.normStr(c.valorUrl, opts),
        selected: new OpcionInstanciaSave,
        selectedValues: []
    };

    // selected (si existe)
    if (c.selected) {
      base.selected = this.toOpcionInstanciaSave(c.selected, opts);
    }

    // selectedValues puede ser OpcionInstancia[] o string[]
    const mapped = this.mapSelectedValues(c.selectedValues, opts);
    if (typeof mapped !== 'undefined') {
      base.selectedValues = mapped;
    }

    return base;
  }

  private static toOpcionInstanciaSave(
    opt: OpcionInstancia,
    _opts?: MapperOptions
  ): OpcionInstanciaSave {
    return { opcionOID: opt.opcionOID };
  }

  private static mapSelectedValues(
    input: OpcionInstancia[] | string[] | undefined,
    opts?: MapperOptions
  ): OpcionInstanciaSave[] | string[] | undefined {
    if (!input) return undefined;
    if (input.length === 0) return []; // preserva array vacío

    if (this.isStringArray(input)) {
      // Normaliza strings si se pidió
      return input.map(v => this.normStr(v, opts));
    }

    if (this.isOpcionArray(input)) {
      return input.map(o => this.toOpcionInstanciaSave(o, opts));
    }

    return undefined; // caso inesperado
  }

  // ===== HELPERS =====
  private static isStringArray(arr: unknown): arr is string[] {
    return Array.isArray(arr) && arr.every(el => typeof el === 'string');
  }

  private static isOpcionArray(arr: unknown): arr is OpcionInstancia[] {
    return (
      Array.isArray(arr) &&
      arr.every(
        el => typeof el === 'object' && el !== null && 'opcionOID' in (el as any)
      )
    );
  }

  /** Normaliza strings nulos/indefinidos si la opción lo indica */
  private static normStr(value: any, opts?: MapperOptions): any {
    if (!opts?.nullToEmpty) return value;
    return value ?? '';
  }
}