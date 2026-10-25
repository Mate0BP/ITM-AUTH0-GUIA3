# Guía Paso a Paso para Configurar Auth0 (Guía 3 ITM)

Esta guía te explica exactamente qué clics hacer en tu panel de Auth0 ([manage.auth0.com](https://manage.auth0.com)) para dejar todo listo.

---

## 📌 Paso 1: Configurar la Aplicación Web (Login en Local)

1. Ingresá a [Auth0 Dashboard](https://manage.auth0.com).
2. En el menú lateral izquierdo, andá a **Applications** > **Applications**.
3. Hacé clic en el botón superior derecho **Create Application**.
4. Completá:
   * **Name:** `ITM Guia 3 Web`
   * **Application Type:** Seleccioná **Regular Web Applications**.
   * Hacé clic en **Create**.
5. En la pestaña **Settings**, bajá hasta la sección **Application URIs**:
   * **Allowed Callback URLs:** Poné exactamente:
     ```
     http://localhost:3000/callback
     ```
   * **Allowed Logout URLs:** Poné exactamente:
     ```
     http://localhost:3000
     ```
   * **Allowed Web Origins:** Poné:
     ```
     http://localhost:3000
     ```
6. Bajá hasta el final de la página y hacé clic en **Save Changes**.
7. En la parte superior de esa misma pestaña **Settings**, copiá estos 3 datos y pegalos en tu archivo `.env`:
   * **Domain** -> ponelo en `AUTH0_ISSUER_BASE_URL=https://tu-tenant.us.auth0.com`
   * **Client ID** -> ponelo en `AUTH0_CLIENT_ID`
   * **Client Secret** -> ponelo en `AUTH0_CLIENT_SECRET`

---

## 📌 Paso 2: Personalizar el Universal Login con el Logo del ITM (Punto 2 de la Guía)

1. En el menú lateral izquierdo de Auth0, andá a **Branding** > **Universal Login**.
2. Hacé clic en la pestaña **Customization Options** o **Look & Feel**.
3. En la sección **Logo**:
   * Podés subir el logo oficial del ITM o pegar una URL de imagen institucional (ejemplo del ITM: `https://raw.githubusercontent.com/antigravity/assets/main/itm-logo.png` o subir la imagen del ITM desde tu computadora).
4. En la sección **Colors**:
   * **Primary Color:** Poné `#003865` (Azul institucional ITM).
5. Hacé clic en **Save Changes** en la esquina superior derecha.
6. Hacé clic en **Preview** o **Try** para ver cómo quedó la pantalla de login con el logo y colores del ITM.
7. 📸 **Captura requerida:** Tomá la captura de pantalla de esta vista con el logo del ITM para la **Evidencia del Punto 2**.

---

## 📌 Paso 3: Configurar la Management API (Para guardar en `user_metadata`)

Para que Node.js pueda guardar datos en `user_metadata` mediante la Management API v2 de Auth0, necesitamos credenciales Machine-to-Machine (M2M):

1. En el menú lateral izquierdo, andá a **Applications** > **APIs**.
2. Vas a ver una API llamada **Auth0 Management API** (viene por defecto). Hacé clic sobre ella.
3. Andá a la pestaña **Machine to Machine Applications** (o **API Explorer**).
4. Buscá en la lista tu aplicación o hacé clic en **Authorize** junto a la aplicación que quieras usar (o usá la aplicación por defecto del *API Explorer*).
5. Desplegá la flecha hacia abajo para ver los permisos (**Scopes**) y activá marcando las casillas:
   * ☑️ `read:users`
   * ☑️ `update:users`
   * ☑️ `read:users_app_metadata` (opcional recomendado)
   * ☑️ `update:users_app_metadata` (opcional recomendado)
6. Hacé clic en **Update** o **Save** para guardar los permisos.
7. Copiá el **Client ID** y el **Client Secret** de esa aplicación M2M autorizada y pegalos en tu `.env`:
   * `AUTH0_M2M_CLIENT_ID=...`
   * `AUTH0_M2M_CLIENT_SECRET=...`

---

## 📌 Paso 4: Probar la Aplicación en Local

1. Abrí una terminal en la carpeta del proyecto y ejecutá:
   ```bash
   npm run dev
   ```
2. Abrí tu navegador en:
   ```
   http://localhost:3000
   ```
3. Hacé clic en **Iniciar Sesión con Auth0**.
4. Te redirigirá al Universal Login de Auth0 (con el logo del ITM). Iniciá sesión o creá un usuario de prueba.
5. Al regresar, vas a ver tu sesión activa. Hacé clic en **Modificar mis Datos (user_metadata)**.
6. Diligenciá los 4 campos:
   * Tipo de documento
   * Número de documento
   * Dirección
   * Teléfono
7. Hacé clic en **Guardar en user_metadata**.
8. Verás la alerta verde de éxito y los datos actualizados tanto en el formulario como en el bloque JSON inferior.
9. En Auth0 Dashboard podés ir a **User Management** > **Users**, abrir tu usuario y comprobar en la pestaña *Details* que la sección `user_metadata` contiene exactamente los datos guardados.

---

## 📌 Paso 5: Subir a GitHub y Compartir con el Docente

1. Inicializá el repositorio si no lo hiciste:
   ```bash
   git init
   git add .
   git commit -m "feat: implementacion completa guia 3 auth0 nodejs"
   ```
   *(Recordá que `.env` está en `.gitignore` por seguridad y no se subirá).*
2. Creá un repositorio en tu GitHub y hacé push:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/itm-auth0-guia3.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub, andá a **Settings** > **Collaborators** > **Add people** y agregá al correo del docente:
   **`jonathansanchez2948@correo.itm.edu.co`**
4. 📸 Tomá captura de la pantalla de colaboradores donde se vea agregada la invitación al docente para la **Evidencia del Punto 5**.
