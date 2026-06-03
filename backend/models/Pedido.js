import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    nombre: String,
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precio: {
      type: Number,
      required: true
    },
    descuento: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  direccionEnvio: {
    direccion: {
      type: String,
      required: true
    },
    ciudad: String,
    departamento: String,
    codigoPostal: String,
    telefono: String,
    notas: String
  },
  metodoPago: {
    type: String,
    required: true,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'pse']
  },
  estadoPago: {
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'pagado', 'fallido', 'reembolsado']
  },
  subtotal: {
    type: Number,
    required: true
  },
  iva: {
    type: Number,
    required: true
  },
  descuentoTotal: {
    type: Number,
    default: 0
  },
  costoEnvio: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    default: 'procesando',
    enum: ['procesando', 'confirmado', 'enviado', 'entregado', 'cancelado']
  },
  fechaEstimadaEntrega: Date,
  fechaEntrega: Date,
  tracking: String,
  notas: String,
  historial: [{
    estado: String,
    fecha: {
      type: Date,
      default: Date.now
    },
    comentario: String
  }]
}, {
  timestamps: true
});

// Calcular totales antes de guardar
pedidoSchema.pre('save', function(next) {
  // Calcular subtotal
  this.subtotal = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  
  // Calcular IVA (19%)
  this.iva = this.subtotal * 0.19;
  
  // Calcular total
  this.total = this.subtotal + this.iva + this.costoEnvio - this.descuentoTotal;
  
  next();
});

// Agregar evento al historial
pedidoSchema.methods.agregarHistorial = function(estado, comentario = '') {
  this.historial.push({
    estado,
    comentario,
    fecha: new Date()
  });
};

// Índices
pedidoSchema.index({ usuario: 1, createdAt: -1 });
pedidoSchema.index({ estado: 1 });

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
