/**
 * Panel Sensorial — receptor de respuestas en Google Sheets
 *
 * Pegar este código en: Planilla de Google > Extensiones > Apps Script
 * Luego: Implementar > Nueva implementación > Tipo "Aplicación web"
 *   - Ejecutar como: Yo
 *   - Quién tiene acceso: Cualquier usuario
 * Copiar la URL que termina en /exec y pegarla en index.html (GOOGLE_SCRIPT_URL).
 *
 * - Crea la hoja "Respuestas" si no existe.
 * - Arma los encabezados solos a partir de los datos (atributos incluidos).
 * - Si llega un atributo nuevo, agrega la columna.
 * - Si llega el mismo "id" dos veces (el evaluador volvió atrás y corrigió),
 *   ACTUALIZA la fila en vez de duplicarla.
 */

const NOMBRE_HOJA = 'Respuestas';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const filas = Array.isArray(data) ? data : [data];
    const hoja = obtenerHoja_();
    filas.forEach(f => guardarFila_(hoja, f));
    return json_({ ok: true, guardadas: filas.length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Para probar que la URL funciona: abrirla en el navegador
function doGet() {
  return json_({ ok: true, mensaje: 'Panel Sensorial activo' });
}

function obtenerHoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(NOMBRE_HOJA) || ss.insertSheet(NOMBRE_HOJA);
}

function guardarFila_(hoja, obj) {
  // 1) Encabezados: los existentes + los nuevos que traiga este objeto
  let headers = [];
  if (hoja.getLastColumn() > 0) {
    headers = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(String);
  }
  const nuevos = Object.keys(obj).filter(k => headers.indexOf(k) === -1);
  if (nuevos.length) {
    hoja.getRange(1, headers.length + 1, 1, nuevos.length).setValues([nuevos]);
    headers = headers.concat(nuevos);
    hoja.setFrozenRows(1);
  }

  const fila = headers.map(h => (obj[h] === undefined ? '' : obj[h]));

  // 2) ¿Ya existe este id? -> actualizar
  const colId = headers.indexOf('id') + 1;
  if (colId > 0 && obj.id && hoja.getLastRow() > 1) {
    const encontrado = hoja.getRange(2, colId, hoja.getLastRow() - 1, 1)
      .createTextFinder(String(obj.id)).matchEntireCell(true).findNext();
    if (encontrado) {
      hoja.getRange(encontrado.getRow(), 1, 1, headers.length).setValues([fila]);
      return;
    }
  }

  // 3) Si no, agregar al final
  hoja.appendRow(fila);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
