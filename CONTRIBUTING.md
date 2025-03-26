# Contribuir a BigEye

¡Gracias por tu interés en contribuir a BigEye! Este documento proporciona pautas y pasos para contribuir al proyecto.

## Configuración del entorno de desarrollo

1. **Fork y clone**:
   - Haz un fork del repositorio en GitHub
   - Clona tu fork localmente:
     ```bash
     git clone https://github.com/Nostalgic0/bigEye
     cd bigEye
     ```

2. **Instala las dependencias**:
   ```bash
   npm install

3. **Ejecuta la aplicación en modo desarrollo**
    ```bash
    npm start

## Estructura del proyecto

    - main.js: Proceso principal de Electron
    - preload.js: Script de precarga para comunicación segura entre procesos
    - renderer.js: Lógica de la interfaz de usuario
    - index.html: Estructura HTML de la aplicación
    - styles.css: Estilos de la interfaz

## Flujo de trabajo para contribuciones

1. **Crear una rama**:
   - git checkout -b feature/nombre-de-tu-caracteristica
    o
   -  git checkout -b fix/nombre-del-arreglo

2. **Realiza tus cambios**:
   
   - Mantén tus cambios enfocados y relacionados

3. **Prueba tus cambios**

    - Asegúrate de que la aplicación funcione correctamente
    - Verifica que no hayas introducido nuevos errores

4. **Realiza commit de tus cambios**

    - git add .
    - git commit -m "Descripción clara de los cambios"

5. **Push a tu fork**

    - git push origin feature/nombre-de-tu-caracteristica

6. **Crea un Pull Request:**

    - Ve a la página del repositorio original
    - Haz clic en "New pull request"
    - Selecciona "compare across forks"
    - Selecciona tu fork y rama
    - Describe los cambios en detalle

## Reportar errores

Si encuentras un error, por favor crea un issue en GitHub con la siguiente información:

    - Descripción detallada del problema
    - Pasos para reproducirlo
    - Comportamiento esperado vs. comportamiento actual
    - Capturas de pantalla si aplica

## Proponer nuevas características

Las propuestas de nuevas características son bienvenidas. Por favor, crea un issue con:

    - Descripción clara de la característica
    - Justificación (¿por qué sería útil?)
    - Posible implementación o diseño
    - Cualquier referencia o ejemplo relacionado

## Áreas de contribución

    - Mejoras de UI/UX
    - Optimización de rendimiento
    - Nuevas funcionalidades
    - Corrección de bugs
    - Mejoras de accesibilidad
    - Traducciones
    - Documentación

## Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones estarán bajo la misma licencia ISC del proyecto.