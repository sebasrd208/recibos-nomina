package com.example.mybatis.service;

import java.io.*;
import java.awt.*;
import java.util.*;
import java.util.List;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.example.mybatis.dto.*;
import com.lowagie.text.Rectangle;
import org.springframework.core.io.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.*;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.*;
import org.springframework.scheduling.annotation.*;
import org.springframework.beans.factory.annotation.*;

@Service
public class EnvioService {

    @Autowired
    DocumentoService servicio;

    @Autowired
    JavaMailSender envioCorreo;

    @Autowired
    EmpleadoService service;

    public byte[] generatePdfSueldo(String numEmpleado) throws Exception {

        SueldoNetoDTO dto = service.obtenerSueldoNeto(numEmpleado);

        if (dto == null || dto.getDatos() == null || dto.getDatos().isEmpty()) {
            return null;
        }

        ByteArrayOutputStream out;
        try (Document document = new Document(PageSize.LETTER)) {

            out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.setMargins(40, 40, 40, 40);
            document.open();

            Font tituloFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD, Color.BLACK);
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font smallFont = new Font(Font.HELVETICA, 10, Font.NORMAL);

            Color lightGray = new Color(230, 230, 230);

            ClassPathResource classPathResource = new ClassPathResource("crunchyroll-logo.png");
            try (InputStream is = classPathResource.getInputStream()) {
                byte[] bytes = is.readAllBytes();
                com.lowagie.text.Image logo = com.lowagie.text.Image.getInstance(bytes);
                logo.scaleToFit(150, 75);
                float x = PageSize.LETTER.getWidth() - 40 - logo.getScaledWidth();
                float y = PageSize.LETTER.getHeight() - 40 - logo.getScaledHeight();
                logo.setAbsolutePosition(x, y);
                document.add(logo);
            }

            // ===== FOR EACH COMPANIA =====
            for (CompaniaDTO datos : dto.getDatos()) {

                int mes = Integer.parseInt(datos.getTrimestre());
                String periodo;

                if (mes <= 3) {
                    periodo = "ENERO - MARZO";
                } else if (mes <= 6) {
                    periodo = "ABRIL - JUNIO";
                } else if (mes <= 9) {
                    periodo = "JULIO - SEPTIEMBRE";
                } else {
                    periodo = "OCTUBRE - DICIEMBRE";
                }

                Paragraph titulo = new Paragraph("MI RECIBO TRIMESTRAL", tituloFont);
                titulo.setAlignment(Element.ALIGN_LEFT);
                document.add(titulo);

                Paragraph periodoPdf = new Paragraph("PERIODO " + periodo, boldFont);
                document.add(periodoPdf);

                document.add(new Paragraph(" "));

                Paragraph nombreCompleto = new Paragraph(
                        datos.getNombre().toUpperCase() + " " + datos.getApellido().toUpperCase(),
                        boldFont
                );
                document.add(nombreCompleto);

                document.add(new Paragraph("No. Empleado: " + datos.getNumEmpleado(), smallFont));
                document.add(new Paragraph("RFC: " + datos.getRfc(), smallFont));
                document.add(new Paragraph("Compañia: " + datos.getCompania(), smallFont));

                document.add(new Paragraph(" "));

                Paragraph nota = new Paragraph(datos.getNota(), smallFont);
                nota.setAlignment(Element.ALIGN_JUSTIFIED);
                document.add(nota);

                document.add(new Paragraph(" "));
            }

            // ===== TABLA DEDUCCIONES =====
            PdfPTable tablaDeducciones = new PdfPTable(new float[]{3, 2});
            tablaDeducciones.setWidthPercentage(95);
            tablaDeducciones.setSpacingAfter(15f);

            PdfPCell hd1 = new PdfPCell(new Phrase("CONCEPTO", headerFont));
            PdfPCell hd2 = new PdfPCell(new Phrase("IMPORTE", headerFont));

            hd1.setBackgroundColor(Color.GRAY);
            hd2.setBackgroundColor(Color.GRAY);

            hd1.setHorizontalAlignment(Element.ALIGN_CENTER);
            hd2.setHorizontalAlignment(Element.ALIGN_CENTER);

            hd1.setPadding(5);
            hd2.setPadding(5);

            tablaDeducciones.addCell(hd1);
            tablaDeducciones.addCell(hd2);

            PdfPCell separator = new PdfPCell();
            separator.setColspan(2);
            separator.setBorder(Rectangle.BOTTOM);
            separator.setBorderWidth(2);
            separator.setFixedHeight(3f);
            tablaDeducciones.addCell(separator);

            // ===== FOR EACH DEDUCCIONES =====
            for (DeduccionesDTO ded : dto.getDeducciones()) {

                String[][] filasDeducciones = {
                        {"Importe Total Trabajo", ded.getBruto()},
                        {"ISR", ded.getISR()},
                        {"IMSS", ded.getIMSS()},
                        {"Fondo Retiro", ded.getFondo()},
                        {"Neto Pagado al Empleado", ded.getNeto()}
                };

                for (int i = 0; i < filasDeducciones.length; i++) {

                    PdfPCell c1 = new PdfPCell(new Phrase(filasDeducciones[i][0]));
                    PdfPCell c2 = new PdfPCell(new Phrase("$ " + filasDeducciones[i][1]));

                    c2.setHorizontalAlignment(Element.ALIGN_RIGHT);

                    if (i % 2 == 0) {
                        c1.setBackgroundColor(lightGray);
                        c2.setBackgroundColor(lightGray);
                    }

                    c1.setPadding(6);
                    c2.setPadding(6);

                    tablaDeducciones.addCell(c1);
                    tablaDeducciones.addCell(c2);
                }
            }

            document.add(tablaDeducciones);

            // ===== TABLA IMPUESTOS =====
            PdfPTable tablaImpuestos = new PdfPTable(new float[]{3, 2});
            tablaImpuestos.setWidthPercentage(95);
            tablaImpuestos.setSpacingAfter(15f);

            PdfPCell hi1 = new PdfPCell(new Phrase("CONCEPTO", headerFont));
            PdfPCell hi2 = new PdfPCell(new Phrase("IMPORTE", headerFont));

            hi1.setBackgroundColor(Color.RED);
            hi2.setBackgroundColor(Color.RED);

            hi1.setHorizontalAlignment(Element.ALIGN_CENTER);
            hi2.setHorizontalAlignment(Element.ALIGN_CENTER);

            hi1.setPadding(5);
            hi2.setPadding(5);

            tablaImpuestos.addCell(hi1);
            tablaImpuestos.addCell(hi2);

            PdfPCell separator2 = new PdfPCell();
            separator2.setColspan(2);
            separator2.setBorder(Rectangle.BOTTOM);
            separator2.setBorderWidth(2);
            separator2.setFixedHeight(3f);
            tablaImpuestos.addCell(separator2);

            // ===== FOR EACH IMPUESTOS =====
            for (ImpuestosDTO imp : dto.getImpuestos()) {

                String[][] filasImpuestos = {
                        {"Total Pagado al Gobierno", imp.getImpuesto()},
                        {"ISR", imp.getISR()},
                        {"IMSS", imp.getIMSS()}
                };

                for (int i = 0; i < filasImpuestos.length; i++) {

                    PdfPCell c1 = new PdfPCell(new Phrase(filasImpuestos[i][0]));
                    PdfPCell c2 = new PdfPCell(new Phrase("$ " + filasImpuestos[i][1]));

                    c2.setHorizontalAlignment(Element.ALIGN_RIGHT);

                    if (i % 2 == 0) {
                        c1.setBackgroundColor(lightGray);
                        c2.setBackgroundColor(lightGray);
                    }

                    c1.setPadding(6);
                    c2.setPadding(6);

                    tablaImpuestos.addCell(c1);
                    tablaImpuestos.addCell(c2);
                }
            }

            document.add(tablaImpuestos);
        }

        return out.toByteArray();
    }

    @Async
    public void envioCorreoAdjunto(String correo, String numEmpleado){
        try {
            byte[] pdfBytes = generatePdfSueldo(numEmpleado);

            MimeMessage message = envioCorreo.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(correo);
            helper.setSubject("Prueba de la API de correo con archivos adjuntos");
            helper.setText("A continuación encontrará el documento adjunto.");

            helper.addAttachment("Recibo_" + numEmpleado + ".pdf", new ByteArrayResource(pdfBytes));

            envioCorreo.send(message);
        } catch (Exception s) {
            throw new IllegalArgumentException("No se pudo generar el PDF para: " + numEmpleado);
        }
    }

    public String generarPdfBase64(String numEmpleado) throws Exception {
        byte[] pdfBytes = generatePdfSueldo(numEmpleado);
        return Base64.getEncoder().encodeToString(pdfBytes);
    }

    public void guardarPdfEnBD(String numEmpleado) {
        try {
            String pdfBase64 = generarPdfBase64(numEmpleado);
            DocumentoDTO dto = new DocumentoDTO();
            dto.setNumEmpleado(numEmpleado);
            dto.setDocumento(pdfBase64);
            dto.setStatus("1");
            servicio.actualizarDocumenctos(dto);
        } catch (Exception e) {
            DocumentoDTO dto = new DocumentoDTO();
            dto.setNumEmpleado(numEmpleado);
            dto.setDocumento(null);
            dto.setStatus("2");
            servicio.actualizarDocumenctos(dto);
        }
    }

    public ResultadoEnvioDTO procesoEnvioCorreos() {
        long inicio = System.currentTimeMillis();

        List<DocumentoDTO> documentosPendientes = servicio.obtenerStatus();
        List<String> correosEnviados = new ArrayList<>();
        List<String> correosFallidos = new ArrayList<>();

        for (DocumentoDTO doc : documentosPendientes) {
            guardarPdfEnBD(doc.getNumEmpleado());
            try {
                envioCorreoAdjunto(doc.getCorreo(), doc.getNumEmpleado());
                correosEnviados.add(doc.getCorreo());

            } catch (Exception s) {
                correosFallidos.add(doc.getCorreo());
            }

        }

        long fin = System.currentTimeMillis();

        ResultadoEnvioDTO resultado = new ResultadoEnvioDTO();
        resultado.setCorreosEnviados(correosEnviados);
        resultado.setCorreosFallidos(correosFallidos);
        resultado.setTotalEnviados(correosEnviados.size());
        resultado.setTotalFallidos(correosFallidos.size());
        resultado.setTiempoEjecucionMs(fin - inicio);

        return resultado;
    }

    public EnvioDTO procesoEnvioCorreoPorEmpleado(String numEmpleado) {

        long inicio = System.currentTimeMillis();
        EnvioDTO resultado = new EnvioDTO();
        try {
            DocumentoDTO doc = servicio.obtenerPorNumEmpleado(numEmpleado);
            if (doc == null) {
                throw new RuntimeException("No se encontró documento para el empleado: " + numEmpleado);
            }
            guardarPdfEnBD(numEmpleado);
            envioCorreoAdjunto(doc.getCorreo(), numEmpleado);


            resultado.setCorreoEnviado(doc.getCorreo());
        }catch(Exception s){
            DocumentoDTO dto = new DocumentoDTO();
            dto.setDocumento("NO SE PUDO ENVIAR EL DOCUMENTO");
            dto.setStatus("2");

            servicio.actualizarDocumenctos(dto);

            throw new RuntimeException("Error procesando empleado: " + numEmpleado, s);
        }

        long fin = System.currentTimeMillis();

        resultado.setNumEmpleado(numEmpleado);
        resultado.setTiempoEjecucionMs(fin - inicio);

        return resultado;
    }
}
