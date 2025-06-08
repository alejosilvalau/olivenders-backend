# Guia para la creación de CRUD Question

### Datos de la tarea:

- Encargado: **Juan Pablo Cisneros**
- Fecha limite: **22/08/2025**
- Hacerlo en la rama **crud-question**

## Paso a paso: creación de la entidad "question" y su CRUD

### 1. Modelo

1. Crear archivo del modelo: `src/components/question/question.entity.ts`
2. Definir esquema de la entidad `question` (`id`, `question`)
   - No tiene que tener las relaciones con otras entidades
   - Tiene que extender **Base Entity**, donde está definido el `id`
   - `question` (atributo) es de tipo **string**
   - Podes basarte de la entidad `school`, ya que es muy parecida

### 2. Controlador

1. Crear archivo: `src/components/question/question.controller.ts`
2. Crear el `questionZodSchema`
3. Crear la funcion de sanitización `sanitizeQuestionInput`
4. Implementar:
   - `findAll`: Obtener todos los registros
   - `findOne`: Obtener uno por ID
   - `add`: Crear nuevo
   - `update`: Actualizar existente
   - `remove`: Eliminar por ID

### 3. Rutas

1. Crear archivo: `src/components/question/question.routes.ts`
2. Definir rutas REST:

- `GET /` que use la función **findAll**
- `GET /:id` que use la función **findOne**
- `POST /` que use la función **add**
  - Tiene que usar las funciones **sanitizeQuestionInput** y **sanitizeMongoQuery**
- `PUT /:id` que use la función **update**
  - Tiene que usar las funciones **sanitizeQuestionInput** y **sanitizeMongoQuery**
- `DELETE /:id` que use la función **remove**
  - Tiene que usar la función **sanitizeMongoQuery**

3. Agregar esto: `app.use('/api/questions', questionRouter);` en **index.ts**
4. Agregar documentación Swagger (referencia: `school.routes.ts`)

### 4. Pruebas

1. Crear archivo: `src/components/question/question.http`
2. Probar con sus respectivas URLs con la extension de VS Code **REST Client**:
   - Listar todas las entidades `question`
   - Obtener una entidad `question` por ID
   - Crear entidad `question`
   - Actualizar entidad `question`
   - Eliminar entidad `question`
