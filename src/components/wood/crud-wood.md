# Guia para la creación de CRUD Wood

### Datos de la tarea:

- Encargado: **Lucas Egea**
- Fecha limite: **22/08/2025**
- Hacerlo en la rama **crud-wood**

## Paso a paso: creación de la entidad "wood" y su CRUD

### 1. Modelo
1. Crear archivo del modelo: `src/components/wood/wood.entity.ts`
2. Definir esquema de la entidad `wood` (`id`, `name`, `binomial_name`, `description`, `price`)
    - No tiene que tener las relaciones con otras entidades
    - Tiene que extender **Base Entity**, donde está definido el `id`
    - `name`, `binomial_name` y `description` son tipo **string**
    - `price` es tipo **decimal**
    - Podes basarte de la entidad `school`, ya que es muy parecida

### 2. Controlador

1. Crear archivo: `src/components/wood/wood.controller.ts`
2. Crear el `woodZodSchema`
3. Crear la funcion de sanitización `sanitizeWoodInput`
2. Implementar:
   - `findAll`: Obtener todos los registros
   - `findOne`: Obtener uno por ID
   - `add`: Crear nuevo
   - `update`: Actualizar existente
   - `remove`: Eliminar por ID
   - `findOneByName`: Buscar uno por nombre

### 3. Rutas

1. Crear archivo: `src/components/wood/wood.routes.ts`
2. Definir rutas REST:
  - `GET /` que use la función **findAll**
  - `GET /:id` que use la función **findOne**
  - `POST /` que use la función **add**
    - Tiene que usar las funciones **sanitizeWoodInput** y **sanitizeMongoQuery**
  - `PUT /:id` que use la función **update**
    - Tiene que usar las funciones **sanitizeWoodInput** y **sanitizeMongoQuery**
  - `DELETE /:id` que use la función **remove**
    - Tiene que usar la función **sanitizeMongoQuery**
  - `GET /:name` que use la función **findOneByName**
3. Agregar esto: `app.use('/api/woods', woodRouter);` en **index.ts**
4. Agregar documentación Swagger (referencia: `school.routes.ts`)

### 4. Pruebas

1. Crear archivo: `src/components/wood/wood.http`
2. Probar con sus respectivas URLs con la extension de VS Code **REST Client**:
   - Listar todas las entidades `wood`
   - Obtener una entidad `wood` por ID
   - Crear entidad `wood`
   - Actualizar entidad `wood`
   - Eliminar entidad `wood`
   - Obtener una entidad `wood` por nombre
