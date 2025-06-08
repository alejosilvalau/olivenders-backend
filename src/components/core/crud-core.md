# Guia para la creación de CRUD Core

### Datos de la tarea:

- Encargado: **Marisol Avila**
- Fecha limite: **22/06/2025**
- Hacerlo en la rama **crud-core**

## Paso a paso: creación de la entidad "core" y su CRUD

### 1. Modelo (Ya hecho 👌)

1. Crear archivo del modelo: `src/components/core/core.entity.ts`
2. Definir esquema de la entidad `core` (`id`, `name`, `description`, `price`)
   - No tiene que tener las relaciones con otras entidades
   - Tiene que extender **Base Entity**, donde está definido el `id`
   - `name` y `description` son tipo **string**
   - `price` es tipo **decimal**
   - Podes basarte de la entidad `school`, ya que es muy parecida

### 2. Controlador

1. Crear archivo: `src/components/core/core.controller.ts`
2. Crear el `coreZodSchema`
3. Crear la funcion de sanitización `sanitizeCoreInput`
4. Implementar:
   - `findAll`: Obtener todos los registros
   - `findOne`: Obtener uno por ID
   - `add`: Crear nuevo
   - `update`: Actualizar existente
   - `remove`: Eliminar por ID
   - `findOneByName`: Buscar uno por nombre

### 3. Rutas

1. Crear archivo: `src/components/core/core.routes.ts`
2. Definir rutas REST:

- `GET /` que use la función **findAll**
- `GET /:id` que use la función **findOne**
- `POST /` que use la función **add**
  - Tiene que usar las funciones **sanitizeCoreInput** y **sanitizeMongoQuery**
- `PUT /:id` que use la función **update**
  - Tiene que usar las funciones **sanitizeCoreInput** y **sanitizeMongoQuery**
- `DELETE /:id` que use la función **remove**
  - Tiene que usar la función **sanitizeMongoQuery**
- `GET /:name` que use la función **findOneByName**

3. Agregar esto: `app.use('/api/cores', coreRouter);` en **index.ts**
4. Agregar documentación Swagger (referencia: `school.routes.ts`)

### 4. Pruebas

1. Crear archivo: `src/components/core/core.http`
2. Probar con sus respectivas URLs con la extension de VS Code **REST Client**:
   - Listar todas las entidades `core`
   - Obtener una entidad `core` por ID
   - Crear entidad `core`
   - Actualizar entidad `core`
   - Eliminar entidad `core`
   - Obtener una entidad `core` por nombre
