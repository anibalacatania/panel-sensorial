# Panel Sensorial

App web para análisis sensorial. Los evaluadores puntúan cada muestra y las respuestas se guardan automáticamente en una planilla de Google Sheets.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | La app |
| `diseno.csv` | Diseño: `Valuador,Muestra,NombreProducto,CodigoProducto` |
| `atributos.csv` | Atributos: columna `Nombre` |
| `Codigo.gs` | Script que recibe los datos en Google Sheets (no se sube a GitHub, va en Apps Script) |

Para un panel nuevo, reemplazá `diseno.csv` y `atributos.csv` en el repositorio. Si no están, la app pide subirlos a mano.

## 1. Guardar en la nube (Google Sheets)

1. Creá una planilla nueva en Google Sheets.
2. **Extensiones → Apps Script**. Borrá lo que haya y pegá el contenido de `Codigo.gs`. Guardá.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autorizá los permisos (aparece "Google no verificó esta app" → *Configuración avanzada → Ir a…*; es tu propio script).
5. Copiá la URL que termina en `/exec` y pegala en `index.html`, en `GOOGLE_SCRIPT_URL`.
6. Probala abriéndola en el navegador: tiene que decir `"ok":true`.

> Si después cambiás `Codigo.gs`: **Implementar → Administrar implementaciones → ✏️ → Versión: Nueva**. Así la URL se mantiene igual.

Las respuestas aparecen en la hoja **Respuestas**, una fila por muestra evaluada. Columnas: `id, Sesion, Valuador, Orden, NombreProducto, CodigoProducto, Muestra, timestamp` + un atributo por columna.

- Si un evaluador vuelve atrás y corrige, la fila **se actualiza** (no se duplica).
- Si se corta internet, las respuestas quedan guardadas en el dispositivo y **se suben solas** cuando vuelve la conexión.

## 2. Publicar gratis en GitHub Pages

1. Creá una cuenta en github.com (si no tenés) → **New repository** → nombre p. ej. `panel-sensorial` → **Public** → Create.
2. **Add file → Upload files** → arrastrá `index.html`, `diseno.csv` y `atributos.csv` → **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
4. En 1–2 minutos la app queda en:
   `https://TU-USUARIO.github.io/panel-sensorial/`

Para cambiar el diseño o los atributos: en el repo, abrí el CSV → ✏️ editar (o subí uno nuevo con el mismo nombre) → Commit. Se actualiza en un minuto.

> Nota: con repositorio público, cualquiera puede ver los CSV del diseño (los códigos de muestra). Las **respuestas** no quedan en GitHub: van a tu planilla privada.
