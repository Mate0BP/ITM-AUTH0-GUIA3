require('dotenv').config();
const express = require('express');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
const { ManagementClient } = require('auth0');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de motor de vistas EJS y archivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Normalizar issuerBaseURL si el usuario no incluyó el protocolo https://
let issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL || '';
if (issuerBaseURL && !issuerBaseURL.startsWith('http://') && !issuerBaseURL.startsWith('https://')) {
  issuerBaseURL = `https://${issuerBaseURL}`;
}

// Validar si las credenciales mínimas de Auth0 están presentes
const isAuth0Configured = Boolean(
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_ID.trim() !== '' &&
  process.env.AUTH0_CLIENT_ID !== 'tu_client_id_aqui' &&
  issuerBaseURL &&
  issuerBaseURL !== 'https://' &&
  issuerBaseURL !== 'https://tu-tenant.us.auth0.com'
);

if (!isAuth0Configured) {
  console.log('\n======================================================');
  console.log('⚠️  AVISO: Credenciales de Auth0 pendientes en .env');
  console.log('   El servidor arrancó en modo asistente de configuración.');
  console.log(`   Abrí http://localhost:${PORT} en tu navegador para ver la guía.`);
  console.log('======================================================\n');

  // En caso de que aún no hayan credenciales, mostramos la pantalla de configuración asistida
  app.get('*', (req, res) => {
    res.render('setup', {
      port: PORT,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || '',
      clientId: process.env.AUTH0_CLIENT_ID || ''
    });
  });

} else {
  // Configuración de Auth0 OpenID Connect para inicio de sesión en aplicación web
  const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET || 'clave_secreta_de_sesion_aleatoria_minimo_32_caracteres_123456',
    baseURL: process.env.AUTH0_BASE_URL || `http://localhost:${PORT}`,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: issuerBaseURL,
    clientSecret: process.env.AUTH0_CLIENT_SECRET || undefined,
  };

  app.use(auth(authConfig));

  // Instanciador seguro del cliente de la Management API de Auth0
  function getManagementClient() {
    const domain = issuerBaseURL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const m2mClientId = process.env.AUTH0_M2M_CLIENT_ID;
    const m2mClientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

    if (!m2mClientId || !m2mClientSecret || m2mClientId === 'tu_m2m_client_id_aqui') {
      throw new Error(
        'Faltan las credenciales M2M en .env (AUTH0_M2M_CLIENT_ID y AUTH0_M2M_CLIENT_SECRET). ' +
        'Debés autorizar la Management API en Auth0 con los permisos read:users y update:users.'
      );
    }

    return new ManagementClient({
      domain: domain,
      clientId: m2mClientId,
      clientSecret: m2mClientSecret,
    });
  }

  // Ruta 1: Página principal (Punto 1 de la Guía 3)
  app.get('/', (req, res) => {
    const isAuthenticated = req.oidc.isAuthenticated();
    const user = req.oidc.user;
    res.render('index', {
      isAuthenticated,
      user
    });
  });

  // Ruta 2: Ver formulario y datos actuales de user_metadata (Punto 3 de la Guía 3)
  app.get('/perfil', requiresAuth(), async (req, res) => {
    const userId = req.oidc.user.sub;
    let metadata = {};
    let error = null;

    try {
      const management = getManagementClient();
      const userResponse = await management.users.get({ id: userId });
      metadata = userResponse.data.user_metadata || {};
    } catch (err) {
      console.error('Error al obtener user_metadata desde Auth0 Management API:', err.message);
      error = `No se pudieron cargar los datos de Auth0: ${err.message}`;
    }

    res.render('profile', {
      isAuthenticated: true,
      user: req.oidc.user,
      metadata,
      actualizado: req.query.actualizado === 'true',
      error
    });
  });

  // Ruta 3: Consumir la API de Auth0 para actualizar user_metadata (Punto 4 de la Guía 3)
  app.post('/perfil', requiresAuth(), async (req, res) => {
    const userId = req.oidc.user.sub;
    const { tipo_documento, numero_documento, direccion, telefono } = req.body;

    try {
      const management = getManagementClient();

      // Consumo del endpoint de actualización de usuarios de Auth0
      await management.users.update(
        { id: userId },
        {
          user_metadata: {
            tipo_documento: tipo_documento ? tipo_documento.trim() : '',
            numero_documento: numero_documento ? numero_documento.trim() : '',
            direccion: direccion ? direccion.trim() : '',
            telefono: telefono ? telefono.trim() : '',
            actualizado_el: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })
          }
        }
      );

      console.log(`[Auth0 API] user_metadata actualizado exitosamente para el usuario: ${userId}`);
      res.redirect('/perfil?actualizado=true');

    } catch (err) {
      console.error('Error al actualizar user_metadata en Auth0:', err);
      res.render('profile', {
        isAuthenticated: true,
        user: req.oidc.user,
        metadata: { tipo_documento, numero_documento, direccion, telefono },
        actualizado: false,
        error: `Error al guardar en Auth0 Management API: ${err.message}`
      });
    }
  });

  // Ruta 4: Endpoint API auxiliar para consultar el user_metadata en crudo
  app.get('/api/metadata', requiresAuth(), async (req, res) => {
    try {
      const management = getManagementClient();
      const userResponse = await management.users.get({ id: req.oidc.user.sub });
      res.json({
        sub: req.oidc.user.sub,
        email: req.oidc.user.email,
        user_metadata: userResponse.data.user_metadata || {}
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

// Iniciar servidor local
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo localmente en: http://localhost:${PORT}`);
  console.log(`📌 Modo: ${isAuth0Configured ? 'Producción local con Auth0 activo' : 'Asistente de configuración'}\n`);
});
