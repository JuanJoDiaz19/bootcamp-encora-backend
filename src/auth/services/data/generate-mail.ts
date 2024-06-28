import { SendPQR } from "src/auth/dto/send-pqr.dto";

export default function generateEmail(pqr: SendPQR){ 
    return `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Recepción de PQR</title>
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
        .pqr-summary {
            margin-top: 20px;
        }
        .pqr-item {
            border-bottom: 1px solid #dddddd;
            padding: 10px 0;
        }
        .pqr-item:last-child {
            border-bottom: none;
        }
        .pqr-item span {
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
            <h1>📄 Confirmación de Recepción de PQR 📥</h1>
        </div>
        <div class="content">
            <p>Hola ${pqr.name} 👋,</p>
            <p>Gracias por enviar tu PQR. A continuación, encontrarás el resumen de tu solicitud:</p>
            <div class="pqr-summary">
                <div class="pqr-item">
                    <span><strong>Descripción:</strong> ${pqr.description}</span>
                </div>
                <div class="pqr-item">
                    <span><strong>Email:</strong> ${pqr.email}</span>
                </div>
                <div class="pqr-item">
                    <span><strong>Nombre:</strong> ${pqr.name}</span>
                </div>
                <div class="pqr-item">
                    <span><strong>Política de Privacidad Aceptada:</strong> ${pqr.privacyPolicy ? 'Sí' : 'No'}</span>
                </div>
                <div class="pqr-item">
                    <span><strong>Tipo de PQR:</strong> ${pqr.type}</span>
                </div>
            </div>
            <p>Nos pondremos en contacto contigo lo antes posible para dar respuesta a tu solicitud.</p>
            <p>Si tienes alguna pregunta adicional o necesitas asistencia, no dudes en contactarnos.</p>
            <p>¡Gracias por tu confianza!</p>
            <p>Atentamente,<br>El equipo de Atención al Cliente</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Atención al Cliente. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
    `
}