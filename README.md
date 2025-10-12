# 🗂️ Kanban + Timesheets Lite — Equipo DELTA

**Semana 1 – Arranque y estructura base del proyecto**  
📅 Fecha: 9 al 13 de octubre de 2025  

---

## 🧭 1. Descripción general

**Kanban + Timesheets Lite** es una aplicación web que combina un tablero tipo Trello con un sistema de registro de horas trabajadas (*timesheets*).

El objetivo de la **Semana 1** fue **arrancar el entorno de desarrollo** y lograr que la aplicación funcione en local con:
- Un **login simulado** (estructura preparada para conectar con Firebase Auth en la Semana 2).  
- Un **primer tablero con tres columnas**: **Por hacer**, **En curso** y **Hecho**.  
- Una **estructura visual y técnica funcional** con React + TypeScript.

---

## 👥 2. Equipo y roles

| Miembro | Rol Semana 1 |
|----------|---------------|
| **Ivan Bascones**  | Coordinador | https://github.com/ivanBasCub |
| **Jonatan Albornoz**  | Frontend | https://github.com/electroalbor |
| **Gerard Pastor** | Datos / Modelo | https://github.com/gpastoraltarriba |
| **Alberto García Martín**  | QA / Pruebas | https://github.com/albertogarciamartin |
| **Davide Mazzocchetti** | Documentación / Demo | https://github.com/DvdMzz17 |

> 🔄 Los roles rotan semanalmente para que todos pasen por cada área del proyecto.

---

## ⚙️ 3. Cómo ejecutar el proyecto

**Requisitos previos**
- Node.js 20 o superior  
- npm (instalado junto con Node)
- Git y una cuenta de GitHub
- Navegador (Chrome o Edge recomendado)

**Pasos para ejecutar:**
```bash
git clone https://github.com/Nexeus-Big-Data-Labs/202509-delta.git
cd 202509-delta
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

> ⚙️ *El archivo `.env.local` y la configuración de Firebase se implementarán en la Semana 2.*

---

## 💻 4. Estructura del proyecto

```
src/
  pages/
    Login.tsx
    Boards.tsx
    BoardView.tsx
  components/
    Header.tsx
  lib/
    firebase.ts (pendiente de implementación)
  router.tsx
  main.tsx
```

---

## 🗃️ 5. Modelo de datos (planeado para Firestore)

Colecciones iniciales definidas para la próxima fase:

- **users** → { uid, nombre, email, foto }  
- **boards** → { id, name, createdAt }  
- **lists** → { id, boardId, name, order }

> Al crear un tablero, se generarán automáticamente tres listas:  
> **Por hacer**, **En curso** y **Hecho**.

---

## ✅ 6. Checklist — Definition of Done (Semana 1)

| Tarea | Estado |
|---|---|
| Roles asignados en README | ✅ |
| Proyecto creado con Vite + TypeScript | ✅ |
| Estructura base con rutas funcionales | ✅ |
| Login funcional (modo simulado) | ✅ |
| Pantalla de tableros creada | ✅ |
| Creación automática de tres columnas | ✅ |
| Navegación a `/board/:id` operativa | ✅ |
| README actualizado | ✅ |
| Mini demo lista para revisión | ✅ |

---

## 📆 7. Plan de trabajo — Semana 1

| Día | Objetivo principal |
|-----|--------------------|
| **Lunes** | Asignación de roles, configuración del entorno, creación del proyecto React + Vite |
| **Martes** | Configuración inicial del router y estructura base |
| **Miércoles** | Implementación de pantallas: Login, Boards, BoardView |
| **Jueves** | Creación del componente Header y revisión visual |
| **Viernes** | Revisión, limpieza de código y grabación de la demo |

---

## 🗃️ 8. Funcionalidades implementadas (Semana 1)

✅ Configuración inicial con **React + Vite + TypeScript**  
✅ Navegación entre pantallas (Login → Boards → BoardView)  
✅ **Login simulado** (estructura lista para Firebase Auth)  
✅ Pantalla de tableros con creación simulada  
✅ Tablero visual con tres columnas (Por hacer / En curso / Hecho)  
✅ Componente **Header** reutilizable con botón de cierre de sesión  
✅ **README actualizado**  
✅ Preparación de la **demo de revisión**

---

## 🎥 9. Demo de la semana

La demo mostrará:
1. Inicio de sesión simulado.  
2. Navegación hacia la vista de tableros.  
3. Creación de un tablero de ejemplo.  
4. Visualización de las tres columnas:  
   - Por hacer  
   - En curso  
   - Hecho  

🎬 *Duración estimada: 2–3 minutos.*

> La demo se centra en mostrar el flujo básico de la aplicación, no el código interno.

---

## 🧾 10. Acta de la semana 1

**Completado:**
- Proyecto creado con React + Vite.  
- Rutas y componentes principales funcionando.  
- Login simulado con navegación completa.  
- Primer tablero visible con las tres columnas.  
- README actualizado.  

**Bloqueos / Riesgos:**
- Sin bloqueos críticos esta semana.  
- Configuración de Firebase pendiente.  

**Decisiones tomadas:**
- Usar Google Auth como login principal (a implementar en Semana 2).  
- Mantener Firebase como backend.  
- Definir estructura de componentes desde el inicio.

---

## 🚀 11. Próximos pasos

- Conectar la app con **Firebase Auth** (login real).  
- Crear y guardar **tableros reales** en Firestore.  
- Implementar la **creación de tarjetas** dentro de cada columna.  
- Añadir **responsable y fecha límite** a las tarjetas.  
- Continuar con la **rotación de roles** para la Semana 2.


---

✅ **Conclusión:**  
Este README refleja el trabajo realizado en la Semana 1:  
- Se ha construido una base sólida del frontend con React + TypeScript.  
- Se simula el flujo de usuario completo (login → tableros → columnas).  
- El proyecto está listo para integrar Firebase y continuar la evolución funcional en la Semana 2.

