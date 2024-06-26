import { Order } from "src/orders/entities/order.entity";

export default function generateEmail(order: Order): string {

    let productsHtml = '';

    for (const item of order.items) {
        productsHtml += `
            <div class="order-item">
                <span><strong>Producto:</strong> ${item.product.name}</span>
                <span><strong>Cantidad:</strong> ${item.quantity}</span>
                <span><strong>Precio:</strong> $${item.product.price * item.quantity}</span>
            </div>
        `;
    }

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra FitNest</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #212121; /* Cambia el color del fondo del header a negro */
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .order-summary {
            margin-top: 20px;
        }
        .order-item {
            border-bottom: 1px solid #dddddd;
            padding: 10px 0;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .order-item span {
            display: block;
        }
        .footer {
            background-color: #212121; /* Cambia el color del fondo del footer a negro */
            color: white;
            text-align: center;
            padding: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Confirmación de Compra 🏋️‍♀️</h1>
            <h2>FitNest</h2>
        </div>
        <div class="content">
            <p>Hola ${order.user.first_name} 👋,</p>
            <p>Gracias por tu compra en FitNest. A continuación, encontrarás el resumen de tu orden:</p>
            <div class="order-summary">
                ${productsHtml}
            </div>
            <p><strong>Total:</strong> ${order.total_price}</p>
            <p>Nos complace informarte que tus productos 🚚 ya están en camino y estarán llegando próximamente 📦.</p>
            <p>Esperamos que disfrutes de tus nuevos productos. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
            <p>¡Gracias por confiar en FitNest! 🖤</p>
            <p>Atentamente,<br>El equipo de FitNest</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 FitNest. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>


    `;
}