import { AppLayout } from '@/components/layout/AppLayout'
import { DataTable } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Filter, Search } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

interface Transaction {
  id: string
  cliente_rut: string
  producto_sku: string
  monto: number
  comision: number
  estado_sii: 'emitida' | 'pendiente' | 'rechazada'
  canal: string
  fecha: string
  requiere_atencion: boolean
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'cliente_rut',
    header: 'Cliente (RUT)',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('cliente_rut')}</div>
    ),
  },
  {
    accessorKey: 'producto_sku',
    header: 'Producto (SKU)',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('producto_sku')}</div>
    ),
  },
  {
    accessorKey: 'canal',
    header: 'Canal',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('canal')}</Badge>
    ),
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('monto'))
      const formatted = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'comision',
    header: 'Comisión',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('comision'))
      const formatted = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(amount)
      return <div className="text-sm text-muted-foreground">{formatted}</div>
    },
  },
  {
    accessorKey: 'estado_sii',
    header: 'Estado SII',
    cell: ({ row }) => {
      const estado = row.getValue('estado_sii') as string
      const statusMap = {
        'emitida': 'success',
        'pendiente': 'pending',
        'rechazada': 'error'
      } as const
      return (
        <StatusBadge 
          status={statusMap[estado as keyof typeof statusMap] || 'warning'} 
          showIcon 
        />
      )
    },
  },
  {
    accessorKey: 'requiere_atencion',
    header: 'Estado',
    cell: ({ row }) => {
      const requiereAtencion = row.getValue('requiere_atencion')
      return requiereAtencion ? (
        <Badge variant="destructive" className="text-xs">
          ⚠️ Requiere Atención
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">
          ✅ OK
        </Badge>
      )
    },
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('fecha'))
      return <div className="text-sm">{date.toLocaleDateString('es-CL')}</div>
    },
  },
]

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: '1',
    cliente_rut: '12.345.678-9',
    producto_sku: 'SM-G998B',
    monto: 899990,
    comision: 89999,
    estado_sii: 'emitida',
    canal: 'Falabella',
    fecha: '2024-01-15',
    requiere_atencion: false
  },
  {
    id: '2',
    cliente_rut: '98.765.432-1',
    producto_sku: 'IPH-14-256',
    monto: 1299990,
    comision: 129999,
    estado_sii: 'pendiente',
    canal: 'MercadoLibre',
    fecha: '2024-01-14',
    requiere_atencion: true
  },
  {
    id: '3',
    cliente_rut: '11.222.333-4',
    producto_sku: 'SAM-TAB-S8',
    monto: 599990,
    comision: 59999,
    estado_sii: 'rechazada',
    canal: 'Web',
    fecha: '2024-01-13',
    requiere_atencion: true
  },
]

const Transacciones = () => {
  const headerActions = (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filtros</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Exportar</span>
      </Button>
    </div>
  )

  return (
    <AppLayout 
      title="Transacciones" 
      description="Vista detallada de todas las transacciones con filtros por canal, estado y fechas"
      actions={headerActions}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Transacciones</CardDescription>
              <CardTitle className="text-2xl">2,847</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Requieren Atención</CardDescription>
              <CardTitle className="text-2xl text-destructive">23</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Monto Total</CardDescription>
              <CardTitle className="text-2xl">$2.847.590.000</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Comisiones</CardDescription>
              <CardTitle className="text-2xl">$284.759.000</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Detalladas</CardTitle>
            <CardDescription>
              Tabla completa de transacciones con indicadores visuales para ítems que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={mockTransactions}
              searchKey="cliente_rut"
              searchPlaceholder="Buscar por RUT de cliente..."
              pageSize={10}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Transacciones