package com.example.mybatis.service;

import java.io.*;
import java.awt.*;
import java.util.*;
import java.util.List;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.example.mybatis.dto.*;
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

    @Async
    public void envioCorreoAdjunto(String correo, String numEmpleado){

        try {

            byte[] pdfBytes = generatePdfSueldoNeto(numEmpleado);

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
        byte[] pdfBytes = generatePdfSueldoNeto(numEmpleado);
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

    public byte[] generatePdfSueldoNeto(String numEmpleado) throws Exception {

        SueldoNetoDTO dto = service.obtenerSueldo(numEmpleado);

        if (dto == null || dto.getEmpleado() == null) {
            return null;
        }

        ByteArrayOutputStream out;
        try (Document document = new Document(PageSize.LETTER)) {

            out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);

            document.setMargins(40, 40, 40, 40);
            document.open();

            Font tituloFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font smallFont = new Font(Font.HELVETICA, 10, Font.NORMAL);

            Color lightGray = new Color(230, 230, 230);
            ClassPathResource resource = new ClassPathResource("crunchyroll-logo.png");

            try (InputStream is = resource.getInputStream()) {
                byte[] bytes = is.readAllBytes();

                com.lowagie.text.Image logo = com.lowagie.text.Image.getInstance(bytes);
                logo.scaleToFit(150, 75);

                float x = PageSize.LETTER.getWidth() - 40 - logo.getScaledWidth();
                float y = PageSize.LETTER.getHeight() - 40 - logo.getScaledHeight();

                logo.setAbsolutePosition(x, y);
                document.add(logo);
            }

            EmpleadosDTO emp = dto.getEmpleado();

            int mes = Integer.parseInt(emp.getTrimestre());
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

            Paragraph titulo = new Paragraph("RECIBO DE NÓMINA", tituloFont);
            document.add(titulo);

            Paragraph periodoPdf = new Paragraph("PERIODO " + periodo, boldFont);
            document.add(periodoPdf);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Nombre del empleado: " + emp.getNombre() + " " + emp.getApellido(), boldFont));
            document.add(new Paragraph("No. de Empleado: " + numEmpleado, smallFont));
            document.add(new Paragraph("RFC: " + emp.getRfc(), smallFont));
            document.add(new Paragraph("Compañía: " + emp.getCompania(), smallFont));
            document.add(new Paragraph("\n"));
            document.add(new Paragraph(emp.getNota(), smallFont));

            document.add(new Paragraph("\n\n"));

            PercepcionDTO p = dto.getPercepcion();

            PdfPTable tablaPercepciones = new PdfPTable(new float[]{3, 2});
            tablaPercepciones.setWidthPercentage(95);

            PdfPCell seccion = new PdfPCell(new Phrase("PERCEPCIÓN", new Font(Font.HELVETICA, 13, Font.BOLD)));
            seccion.setColspan(2);
            seccion.setBackgroundColor(Color.GRAY);
            seccion.setHorizontalAlignment(Element.ALIGN_CENTER);
            seccion.setPadding(6);

            tablaPercepciones.addCell(seccion);

            PdfPCell hp1 = new PdfPCell(new Phrase("CONCEPTO", headerFont));
            PdfPCell hp2 = new PdfPCell(new Phrase("IMPORTE", headerFont));

            hp1.setBackgroundColor(Color.GRAY);
            hp2.setBackgroundColor(Color.GRAY);
            hp1.setHorizontalAlignment(Element.ALIGN_CENTER);
            hp2.setHorizontalAlignment(Element.ALIGN_CENTER);
            hp1.setPadding(5);
            hp2.setPadding(5);

            tablaPercepciones.addCell(hp1);
            tablaPercepciones.addCell(hp2);

            PdfPCell p1 = new PdfPCell(new Phrase("Sueldo"));
            PdfPCell p2 = new PdfPCell(new Phrase("$ " + p.getSueldo()));

            p1.setBackgroundColor(lightGray);
            p2.setBackgroundColor(lightGray);
            p2.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tablaPercepciones.addCell(p1);
            tablaPercepciones.addCell(p2);

            PdfPCell p3 = new PdfPCell(new Phrase("Sueldo Bruto"));
            PdfPCell p4 = new PdfPCell(new Phrase("$ " + p.getSueldoBruto()));

            p3.setHorizontalAlignment(Element.ALIGN_LEFT);
            p4.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tablaPercepciones.addCell(p3);
            tablaPercepciones.addCell(p4);

            document.add(tablaPercepciones);

            document.add(new Paragraph(" "));

            DeduccionDTO d = dto.getDeduccion();

            PdfPTable tablaDeducciones = new PdfPTable(new float[]{3, 2});
            tablaDeducciones.setWidthPercentage(95);

            PdfPCell seccion2 = new PdfPCell(new Phrase("DEDUCCIONES", new Font(Font.HELVETICA, 13, Font.BOLD)));
            seccion2.setColspan(2);
            seccion2.setBackgroundColor(Color.RED);
            seccion2.setHorizontalAlignment(Element.ALIGN_CENTER);
            seccion2.setPadding(6);

            tablaDeducciones.addCell(seccion2);

            PdfPCell hd1 = new PdfPCell(new Phrase("CONCEPTO", headerFont));
            PdfPCell hd2 = new PdfPCell(new Phrase("IMPORTE", headerFont));

            hd1.setBackgroundColor(Color.RED);
            hd2.setBackgroundColor(Color.RED);
            hd1.setHorizontalAlignment(Element.ALIGN_CENTER);
            hd2.setHorizontalAlignment(Element.ALIGN_CENTER);
            hd1.setPadding(5);
            hd2.setPadding(5);

            tablaDeducciones.addCell(hd1);
            tablaDeducciones.addCell(hd2);

            PdfPCell d1 = new PdfPCell(new Phrase("ISR"));
            PdfPCell d2 = new PdfPCell(new Phrase("$ " + d.getIsr()));

            d2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            d1.setBackgroundColor(lightGray);
            d2.setBackgroundColor(lightGray);

            tablaDeducciones.addCell(d1);
            tablaDeducciones.addCell(d2);

            PdfPCell d3 = new PdfPCell(new Phrase("IMSS"));
            PdfPCell d4 = new PdfPCell(new Phrase("$ " + d.getImss()));

            d4.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tablaDeducciones.addCell(d3);
            tablaDeducciones.addCell(d4);

            PdfPCell d5 = new PdfPCell(new Phrase("Fondo de ahorro"));
            PdfPCell d6 = new PdfPCell(new Phrase("$ " + d.getFondoAhorro()));

            d5.setBackgroundColor(lightGray);
            d6.setBackgroundColor(lightGray);
            d6.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tablaDeducciones.addCell(d5);
            tablaDeducciones.addCell(d6);

            PdfPCell d7 = new PdfPCell(new Phrase("Total deducciones"));
            PdfPCell d8 = new PdfPCell(new Phrase("$ " + d.getTotalDeducciones()));

            d8.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tablaDeducciones.addCell(d7);
            tablaDeducciones.addCell(d8);

            document.add(tablaDeducciones);

            document.add(new Paragraph(" "));

            PdfPTable tablaResumen = new PdfPTable(new float[]{3, 2});
            tablaResumen.setWidthPercentage(95);

            PdfPCell seccion3 = new PdfPCell(new Phrase("RESUMEN", new Font(Font.HELVETICA, 13, Font.BOLD)));
            seccion3.setColspan(2);
            seccion3.setBackgroundColor(Color.MAGENTA);
            seccion3.setHorizontalAlignment(Element.ALIGN_CENTER);
            seccion3.setPadding(6);

            tablaResumen.addCell(seccion3);

            PdfPCell hr1 = new PdfPCell(new Phrase("CONCEPTO", headerFont));
            PdfPCell hr2 = new PdfPCell(new Phrase("IMPORTE", headerFont));

            hr1.setBackgroundColor(Color.MAGENTA);
            hr2.setBackgroundColor(Color.MAGENTA);
            hr1.setHorizontalAlignment(Element.ALIGN_CENTER);
            hr2.setHorizontalAlignment(Element.ALIGN_CENTER);

            tablaResumen.addCell(hr1);
            tablaResumen.addCell(hr2);

            PdfPCell r1 = new PdfPCell(new Phrase("Neto a pagar"));
            PdfPCell r2 = new PdfPCell(new Phrase("$ " + dto.getSueldoNeto()));

            r1.setBackgroundColor(lightGray);
            r2.setBackgroundColor(lightGray);
            r2.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tablaResumen.addCell(r1);
            tablaResumen.addCell(r2);

            document.add(tablaResumen);
        }

        return out.toByteArray();
    }
}
