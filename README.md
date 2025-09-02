# SalesHarmony 🚀

**Plataforma de Conciliación Multi-Marketplace para PyMEs Chilenas**

SalesHarmony es una aplicación web profesional diseñada para resolver el problema crítico de conciliar ventas con pagos efectivos en múltiples marketplaces (MercadoLibre, Falabella), con integraciones para SII, sistemas ERP y conciliación asistida por IA.

## 🎯 Objetivos Principales

- **Resolver discrepancias rápidamente** entre ventas y pagos
- **Visibilidad financiera en tiempo real** de todos los marketplaces
- **Identificar problemas** antes de que afecten el flujo de caja
- **Generar reportes contables** detallados y exportables
- **Simplificar configuración** de conexiones con marketplaces y ERPs

## 🏗️ Arquitectura

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para diseño responsive
- **shadcn/ui** para componentes
- **Chart.js** y **Recharts** para visualizaciones
- **React Query** para manejo de estado servidor
- **React Router** para navegación

### Backend (Integrado)
- **Supabase** como backend-as-a-service
- **PostgreSQL** base de datos
- **Row Level Security (RLS)** para seguridad
- **RESTful API** con Supabase client
- **Autenticación JWT** integrada

## 📱 Estructura de Navegación

### 🏠 Centro de Conciliación (HOME)
Panel principal con:
- **Alertas Críticas**: Discrepancias que requieren atención inmediata
- **KPIs Principales**: Tasa de conciliación, tiempo de resolución
- **Sugerencias de IA**: Acciones automatizadas recomendadas
- **Estado por Canal**: Falabella, MercadoLibre, Web
- **Actividad en Tiempo Real**: Timeline de resoluciones

### 📋 Ventas
Análisis detallado por producto:
- Resumen de ventas por período
- Ventas recientes con estados de conciliación
- Gráficos de timeline por marketplace
- Distribución por canal

### 📋 Transacciones
Vista completa de transacciones:
- Tabla detallada con filtros avanzados
- Estados de SII y conciliación
- Indicadores visuales para ítems críticos
- Exportación de datos

### 🧾 Facturación SII
Integración completa con Servicio de Impuestos Internos:
- Panel de progreso mensual
- Estado de conexión SII
- Validación XML automática
- Cálculo de IVA
- Creación de notas de crédito

### 📊 Reportes
Sistema de reportes descargables:
- Reportes de conciliación
- Análisis de discrepancias
- Formatos PDF, Excel, CSV

### ⚙️ Configuración
Centro de configuración técnica:
- Datos de empresa
- Gestión de usuarios y permisos
- Conexiones ERP (Softland, Nubox)
- Estado de canales
- Claves API

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y npm
- Cuenta Supabase
- Claves API de marketplaces

### Setup Local
```bash
# Clonar repositorio
git clone <YOUR_GIT_URL>
cd salesharmony

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 🎨 Sistema de Diseño

### Colores Principales
```css
:root {
  --primary: 217 91% 60%;      /* Azul corporativo */
  --secondary: 210 40% 50%;    /* Gris azulado */
  --success: 142 76% 36%;      /* Verde éxito */
  --warning: 38 92% 50%;       /* Amarillo advertencia */
  --destructive: 0 84% 60%;    /* Rojo error */
}
```

### Componentes UI
- **Tarjetas KPI**: Valores destacados con indicadores de cambio
- **Tablas**: Filtros, ordenamiento, paginación con shadcn DataTable
- **Gráficos**: Chart.js y Recharts para visualizaciones
- **Alertas**: Banners coloridos por prioridad
- **Modales**: Confirmaciones y formularios con shadcn Dialog

## 🔧 Funcionalidades Principales

### 🤖 IA y Automatización
- **Conciliación Automática**: Matching inteligente de transacciones
- **Detección de Anomalías**: Identificación de patrones sospechosos
- **Sugerencias Inteligentes**: Acciones recomendadas basadas en datos

### 📊 Análisis Contable
- Análisis detallado de timing de pagos
- Desglose tributario completo (IVA, neto, comisiones)
- Registro de auditoría para trazabilidad
- Visualización de discrepancias contables

### 🔍 Insights Operacionales
- Análisis de logística y tiempos de entrega
- Performance de couriers y costos
- Desglose de comisiones por marketplace

### 📈 Performance de Productos
- Análisis detallado por marketplace
- Alertas de stock y recomendaciones
- Tendencias de ventas

## 🔒 Seguridad

- **Autenticación Supabase** con JWT
- **Row Level Security (RLS)** en base de datos
- **Validación de tipos** con TypeScript
- **Sanitización de inputs** con Zod
- **Políticas de acceso** granulares

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Coverage
npm run test:coverage

# Tests específicos
npm run test -- --testNamePattern="SalesTable"
```

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn)
│   ├── layout/         # Layout y navegación
│   ├── dashboard/      # Componentes dashboard
│   ├── erp/           # Integración ERP
│   └── sii/           # Integración SII
├── pages/             # Páginas principales
├── hooks/             # Custom hooks
├── lib/               # Utilidades
├── types/             # Definiciones TypeScript
├── integrations/      # Clientes externos (Supabase)
└── providers/         # Context providers
```

## 🌍 Localización Chilena

- **Formatos**: DD/MM/YYYY, $ CLP con separadores de miles
- **Terminología**: "boleta", "factura", "nota crédito"
- **Validación RUT**: Formato y dígito verificador chileno
- **Integración SII**: Formatos XML específicos de Chile

## 🚀 Deployment

### Desarrollo Local
```bash
npm run dev
# Aplicación disponible en http://localhost:8080
```

### Producción (Lovable)
1. Abrir [Lovable Project](https://lovable.dev/projects/5e245834-13c1-4afe-bcc5-2c1179a5c8ce)
2. Click en Share -> Publish
3. Dominio personalizado en Project > Settings > Domains

### Deployment Manual
```bash
npm run build
# Subir dist/ a hosting estático
```

## 📚 Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Radix UI, Lucide Icons
- **Gráficos**: Chart.js, Recharts
- **Estado**: React Query, Zustand
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build**: Vite
- **Testing**: Jest, React Testing Library

## 🤝 Funcionalidades por Rol

### Usuario Regular
- Ver dashboard personal
- Exportar reportes básicos
- Configurar conexiones básicas

### Administrador
- Gestión completa de usuarios
- Acceso a análisis avanzados
- Configuración de integraciones
- Auditoría completa

## 📞 Integraciones

### Marketplaces
- **MercadoLibre**: API OAuth, webhooks de ventas
- **Falabella**: API REST, sincronización inventario

### ERPs
- **Softland**: Integración contable
- **Nubox**: Sincronización datos financieros

### Gobierno
- **SII**: Facturación electrónica, validación RUT

## 🔄 Roadmap

### Q1 2024
- [ ] Integración Amazon Chile
- [ ] App móvil (React Native)
- [ ] Dashboard ejecutivo

### Q2 2024
- [ ] IA predictiva de flujo de caja
- [ ] Integración bancos chilenos
- [ ] Módulo de inventario

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo Licencia MIT - ver archivo [LICENSE](LICENSE) para detalles.

---

**SalesHarmony** - Simplificando la conciliación multi-marketplace para PyMEs chilenas 🇨🇱

### 📧 Contacto
Para soporte técnico o consultas comerciales, contactar al equipo de desarrollo.