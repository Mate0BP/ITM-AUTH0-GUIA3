# Taller Evaluativo No. 3 - Autenticación y Consumo de Auth0 con Node.js
**Institución Universitaria ITM**  
**Asignatura:** Aplicaciones y servicios web  
**Docente:** Jonathan Sánchez Giraldo (`jonathansanchez2948@correo.itm.edu.co`)  

---

## 📌 Descripción del Proyecto

Aplicación web desarrollada en **Node.js** con **Express** y **EJS** que implementa el flujo de autenticación oficial con **Auth0**, personalización visual del **Universal Login** con los lineamientos del ITM, y consumo de la **Auth0 Management API v2** para consultar y persistir información de perfil en la propiedad `user_metadata` del usuario autenticado.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js** (v18+)
* **Express.js** (Servidor HTTP y enrutamiento)
* **express-openid-connect** (Librería oficial de Auth0 para flujo de autenticación OpenID Connect)
* **auth0** (SDK oficial para consumo de la Auth0 Management API v2)
* **EJS** (Motor de plantillas dinámicas del lado del servidor)
* **Bootstrap 5.3** (Diseño responsivo y estilizado institucional)
* **dotenv** (Gestión segura de variables de entorno)

---

## 🚀 Instalación y Ejecución Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copiá el archivo `.env.example` a `.env` o editá directamente `.env`:
   ```env
   PORT=3000
   AUTH0_SECRET=clave_secreta_de_sesion_aleatoria_minimo_32_caracteres_123456
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_CLIENT_ID=tu_client_id_regular_web_app
   AUTH0_CLIENT_SECRET=tu_client_secret_regular_web_app
   AUTH0_ISSUER_BASE_URL=https://tu-tenant.us.auth0.com

   AUTH0_M2M_CLIENT_ID=tu_m2m_client_id
   AUTH0_M2M_CLIENT_SECRET=tu_m2m_client_secret
   ```

3. **Iniciar el servidor:**
   * Modo desarrollo (con recarga automática):
     ```bash
     npm run dev
     ```
   * Modo normal:
     ```bash
     npm start
     ```

4. **Acceder a la aplicación:**
   Abrí en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura del Proyecto

```
.
├── Guia 3 - Actividad.pdf       # Documento oficial de la actividad
├── package.json                 # Dependencias y scripts
├── .env.example                 # Plantilla de variables de entorno
├── .env                         # Variables de entorno privadas (ignorado en git)
├── .gitignore                   # Exclusión de node_modules y .env
├── server.js                    # Servidor Express, middleware Auth0 y rutas
├── public/                      # Estilos CSS y recursos estáticos
│   └── css/
│       └── style.css            # Estilos con identidad visual ITM
├── views/                       # Vistas EJS
│   ├── index.ejs                # Página principal (Login / Estado de sesión)
│   ├── profile.ejs              # Formulario con los 4 campos y visor de user_metadata
│   ├── setup.ejs                # Asistente de configuración guiada
│   └── partials/                # Navbar y Footer reutilizables
└── informe/                     # Material para la entrega académica
    ├── DIAGRAMA.md              # Diagrama de flujo Mermaid y explicaciones
    └── guia_paso_a_paso_auth0.md# Guía detallada para configurar el panel de Auth0
```

---

## 📋 Puntos Evaluados en la Guía

* **Punto 1:** Configurar el formulario de logueo de Auth0 en una aplicación local Node.js.
* **Punto 2:** Modificar el Universal Login de Auth0 desde *Branding* con el logo y colores del ITM.
* **Punto 3:** Formulario de modificación de datos personales (Tipo de documento, Número de documento, Dirección, Teléfono) prellenados con `user_metadata`.
* **Punto 4:** Consumo de la Management API de Auth0 con permisos M2M para persistir los cambios en `user_metadata`.
* **Punto 5:** Versionado en GitHub compartido con `jonathansanchez2948@correo.itm.edu.co` y entrega del documento con diagrama de flujo y evidencias.
