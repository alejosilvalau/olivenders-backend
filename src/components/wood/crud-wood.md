# Guia para la creación de CRUD Wood

### Datos de la tarea:

- Encargado: **Lucas Egea**

- Fecha limite: **22/08/2025**

## Paso a paso: creación de la entidad "wood" y su CRUD

### 1. Modelo

<div style="margin-left: 2em;">
  <input type="checkbox"> Definir esquema de la entidad `wood` (`tipo`, `origen`, `dureza`, etc.)<br>
  <input type="checkbox"> Crear archivo del modelo: `src/components/wood/wood.model.ts`<br>
  <input type="checkbox"> Configurar integración con base de datos (Mongoose, Sequelize, etc.)<br>
</div>

### 2. Controlador

<div style="margin-left: 2em;">
  <input type="checkbox"> Crear archivo: `src/components/wood/wood.controller.ts`<br>
  <input type="checkbox"> Implementar: <br>
  <ul style="list-style: none;">
    <li><input type="checkbox"> `findAll`: Obtener todos los registros</li>
    <li><input type="checkbox"> `findOne`: Obtener uno por ID</li>
    <li><input type="checkbox"> `add`: Crear nuevo</li>
    <li><input type="checkbox"> `update`: Actualizar existente</li>
    <li><input type="checkbox"> `remove`: Eliminar por ID</li>
    <li><input type="checkbox"> `findByName`: Buscar por nombre</li>
  </ul>
</div>

### 3. Rutas

<div style="margin-left: 2em;"> 
  <input type="checkbox"> Crear archivo: `src/components/wood/wood.routes.ts`<br> 
  <input type="checkbox"> Definir rutas REST:<br> 
  <ul style="list-style: none;"> 
    <li><input type="checkbox"> `GET /api/woods`</li> 
    <li><input type="checkbox"> `GET /api/woods/:id`</li> 
    <li><input type="checkbox"> `POST /api/woods`</li> 
    <li><input type="checkbox"> `PUT /api/woods/:id`</li> 
    <li><input type="checkbox"> `DELETE /api/woods/:id`</li> 
  </ul> 
  <input type="checkbox"> Conectar rutas con el controlador<br> 
  <input type="checkbox"> Agregar documentación Swagger (referencia: `school.routes.ts`)<br> 
</div>

### 4. Registro de rutas

<div style="margin-left: 2em;"> 
  <input type="checkbox"> Importar y registrar en `app.ts` o `server.ts`<br> 
</div>

### 5. Pruebas

<div style="margin-left: 2em;">
  <input type="checkbox"> Crear archivos de test (por ejemplo, `wood.controller.test.ts`)<br>
  <input type="checkbox"> Probar:<br>
  <ul style="list-style: none;">
    <li><input type="checkbox"> Crear `wood`</li>
    <li><input type="checkbox"> Listar todos</li>
    <li><input type="checkbox"> Obtener por ID</li>
    <li><input type="checkbox"> Actualizar</li>
    <li><input type="checkbox"> Eliminar</li>
  </ul>
  <input type="checkbox"> Usar Jest y/o Supertest<br>
</div>

### 6. Validaciones y middlewares

<div style="margin-left: 2em;"> 
  <input type="checkbox"> Agregar validaciones (similar a `sanitizeSchoolInput`)<br> 
  <input type="checkbox"> Incluir sanitización de queries si aplica<br> 
</div>

### 7. Documentación

<div style="margin-left: 2em;"> 
<input type="checkbox"> Documentar el esquema y los endpoints en Swagger/OpenAPI<br> 
</div>
