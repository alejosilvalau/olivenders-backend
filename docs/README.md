# Bienvenido a la Documentación del Backend de Olivenders

## Descripción General

La API REST de Olivenders gestiona todas las operaciones y datos relacionados con la tienda de varitas mágicas. Permite a administradores y usuarios:

- Gestión de Varitas, Núcleos, Maderas y Escuelas: CRUD completo para cada entidad, incluyendo atributos como nombre, descripción, precio y relaciones entre ellas.

- Gestión de Usuarios (Wizards): Registro, autenticación y administración de perfiles, con roles y permisos.

- Órdenes y Compras: Permite listar, crear, actualizar y eliminar órdenes de compra de varitas, así como gestionar el estado de cada pedido.

- Principios REST: La API sigue los principios REST usando los métodos HTTP estándar para todas las operaciones.
  Ideal para administrar el catálogo, usuarios y ventas de la tienda de varitas de manera segura y eficiente.

## Documentación de los Endpoints de la API Rest

1. Ejecute el proyecto con las instrucciones debajo

2. Acceder a la documentación de la API Rest desde la url `http://localhost:3000/api/docs`

## Instrucciones para Ejecutar el Backend Localmente

### Requisitos Previos

- Node.js y npm instalados
- Instancia de MongoDB en ejecución
- Cuenta de Cloudinary creada
- Puerto 3000 liberado

### Instalación

1. Clonar el repositorio del proyecto:

```bash
git clone https://github.com/alejosilvalau/olivenders-backend.git
cd olivenders-backend
```

2. Instalar las dependencias:

```bash
npm install
```

### Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto y agregar las credenciales

```env
DEFAULT_PORT=3000
FRONTEND_URL=http://localhost:4200
MONGO_URL=mongodb+srv://usuario:contraseña@host/
NODE_ENV=development
```

- Es necesario cambiar el `http://localhost:4200` a uno proveeido por su servidor backend si usted desea hacer un despliegue de la aplicación a producción
- Es necesario cambiar **usuario**, **contraseña** y **host** por su proveedor de MongoDB

#### Configuración de OpenAI

1. Crear cuenta en [Plataforma de Desarrolladores de OpenAI](https://platform.openai.com/docs/overview)

2. Obtener las credenciales necesarias (**endpoint** y **key**)

3. Agregar al archivo `.env` las credenciales de la siguiente manera:

```env
OPENAI_ENDPOINT=tu_openai_endpoint
OPENAI_KEY=tu_openai_key
```

#### Configuración de JSON Web Token

1. Ubicarse en el archivo `.env`

2. Crear una clave para las validaciones de rutas

```env
SECRET_KEY_WEBTOKEN=tu_clave_secreta_larga_y_segura
```

Recomendación:

- Usa una clave larga, con letras, números y símbolos para mayor seguridad.
- **Ejemplo: SECRET_KEY_WEBTOKEN=Kj8!sdf9@2lQwzX7#pLmN4vRt6yBv1sD**

#### Configuración de Cloudinary

1. Crear cuenta de [Cloudinary](https://cloudinary.com/)

2. Obtener las credenciales de la API de Cloudinary a través del [dashboard de claves API](https://cloudinary.com/documentation/developer_onboarding_faq_find_credentials)

3. Agregar al archivo `.env` nuevas credenciales de la siguiente manera:

```env
CLOUDINARY_UPLOAD_PRESET=ml_default
CLOUDINARY_API_SECRET=tu_api_secret
```

#### Ejecutar el Proyecto

1. Iniciar el servidor del Backend:

```bash
npm run start:dev
```

2. Acceder a la aplicación desde la url `http://localhost:3000`
