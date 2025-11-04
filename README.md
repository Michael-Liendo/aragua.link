# 🔗 AragualLink - URL Shortener & Linktree

Un acortador de URLs moderno y personalizable con funcionalidad de Linktree, construido con tecnologías de vanguardia. Perfecto para crear enlaces cortos personalizados y páginas de enlaces tipo bio.

## 📋 Tabla de Contenidos

- [Características Actuales](#-características-actuales)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)

## ✨ Características Actuales

### 🔐 Sistema de Autenticación
- ✅ Registro de usuarios con validación completa
- ✅ Login/logout con JWT tokens
- ✅ Gestión de sesiones segura
- ✅ Validación de formularios con Zod

### 👥 Gestión de Usuarios
- ✅ Perfiles de usuario completos
- ✅ Sistema de administración
- ✅ CRUD completo de usuarios

### 🎨 Interfaz de Usuario
- ✅ Diseño moderno con TailwindCSS
- ✅ Componentes reutilizables con shadcn/ui
- ✅ Responsive design
- ✅ Dark/Light mode ready
- ✅ Iconografía con Lucide React

### 🛠️ Infraestructura
- ✅ Monorepo con workspaces de npm
- ✅ Shared package para tipos y validaciones
- ✅ Base de datos PostgreSQL
- ✅ Migraciones y seeds automatizados
- ✅ Build optimizado y eficiente

## 🏗️ Arquitectura

```
aragualink/
├── shared/          # Tipos, esquemas y utilidades compartidas
│   ├── src/
│   │   ├── schema/  # Validaciones con Zod
│   │   ├── utils/   # Utilidades compartidas
│   │   └── constants/ # Constantes globales
├── server/          # Backend API con Fastify
│   ├── src/
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── routes/     # Definición de rutas
│   │   ├── repository/ # Acceso a datos
│   │   ├── middlewares/ # Middleware personalizado
│   │   └── config/     # Configuración
│   ├── migrations/  # Migraciones de BD
│   └── seeds/       # Datos de ejemplo
└── client/          # Frontend con React + Vite
    ├── src/
    │   ├── components/ # Componentes UI
    │   ├── pages/     # Páginas de la aplicación
    │   ├── services/  # Servicios API
    │   ├── features/  # Funcionalidades por dominio
    │   └── utils/     # Utilidades del cliente
    └── public/        # Assets estáticos
```

## 🛠️ Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Fastify** - Framework web rápido y eficiente
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos relacional
- **Knex.js** - Query builder y migraciones
- **Zod** - Validación de esquemas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework de CSS
- **shadcn/ui** - Componentes UI
- **React Router** - Enrutamiento
- **Formik** - Gestión de formularios

### DevOps & Tools
- **npm workspaces** - Monorepo
- **Biome** - Linter y formateador
- **tsx** - Ejecutor de TypeScript
- **Concurrently** - Ejecutor de scripts paralelos

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm 8+

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd aragualink
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb aragualink_dev

# Copiar variables de entorno
cp server/.env.example server/.env
cp client/.env.example client/.env

# Editar server/.env con tus credenciales de BD
```

4. **Ejecutar migraciones**
```bash
npm run db:migrate
npm run db:seed
```

5. **Iniciar en desarrollo**
```bash
npm run dev
```

## 📖 Uso

### Desarrollo
```bash
# Iniciar todos los servicios
npm run dev

# Servicios individuales
npm run dev:shared   # Watcher de tipos compartidos
npm run dev:server   # API en http://localhost:3000
npm run dev:client   # Frontend en http://localhost:5173
```

### Producción
```bash
# Build completo
npm run build

# Iniciar servidor
npm run start
```

### Base de Datos
```bash
# Crear migración
npm run db:make:migration nombre_migracion

# Ejecutar migraciones
npm run db:migrate

# Crear seed
npm run db:make:seed nombre_seed

# Ejecutar seeds
npm run db:seed
```

## 🗺️ Roadmap

### 🎯 Próximas Funcionalidades

#### 🔗 URL Shortener
- [ ] **Acortador de URLs**
  - [ ] Generación de enlaces cortos personalizados
  - [ ] Slugs personalizables
  - [ ] QR codes automáticos
  - [ ] Expiración de enlaces
  - [ ] Protección con contraseña

- [ ] **Analytics de Enlaces**
  - [ ] Tracking de clicks
  - [ ] Geolocalización de visitantes
  - [ ] Dispositivos y navegadores
  - [ ] Referrers y fuentes de tráfico
  - [ ] Gráficos de estadísticas

#### 🌳 Linktree/Bio Links
- [ ] **Páginas de Bio**
  - [ ] Múltiples enlaces en una página
  - [ ] Personalización de diseño
  - [ ] Temas predefinidos
  - [ ] Colores y fuentes personalizables
  - [ ] Avatar y descripción

- [ ] **Tipos de Enlaces**
  - [ ] Enlaces simples
  - [ ] Enlaces con iconos
  - [ ] Enlaces destacados
  - [ ] Botones de redes sociales
  - [ ] Embeds (YouTube, Spotify, etc.)

#### 📊 Analytics y Reportes
- [ ] **Dashboard de Estadísticas**
  - [ ] Total de clicks por enlace
  - [ ] Clicks en tiempo real
  - [ ] Top enlaces
  - [ ] Métricas de conversión
  - [ ] Exportación de datos

#### 🎨 Personalización
- [ ] **Temas y Diseño**
  - [ ] Editor visual de temas
  - [ ] Plantillas prediseñadas
  - [ ] CSS personalizado
  - [ ] Fondos personalizados
  - [ ] Animaciones

#### 🔒 Funcionalidades Premium
- [ ] **Características Avanzadas**
  - [ ] Dominios personalizados
  - [ ] Retargeting pixels
  - [ ] A/B testing de enlaces
  - [ ] Integración con analytics
  - [ ] API para desarrolladores

## 🤝 Contribuir

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: pruebas
chore: tareas de mantenimiento
```

### Flujo de Desarrollo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commits con mensajes descriptivos
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- TypeScript estricto
- Validación con Zod
- Componentes funcionales en React
- CSS con TailwindCSS
- Tests unitarios (próximamente)

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Michael** - Desarrollador Principal

---

**¿Tienes preguntas o sugerencias?** ¡Abre un issue o contribuye al proyecto! 🚀
