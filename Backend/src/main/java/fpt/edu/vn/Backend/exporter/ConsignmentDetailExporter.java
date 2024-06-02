package fpt.edu.vn.Backend.exporter;

import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class ConsignmentDetailExporter {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<ConsignmentDetailDTO> listConsignmentDetails;

    public ConsignmentDetailExporter(List<ConsignmentDetailDTO> listConsignmentDetails) {
        this.listConsignmentDetails = listConsignmentDetails;
        workbook = new XSSFWorkbook();
    }


    private void writeHeaderLine() {
        sheet = workbook.createSheet("Consignment Details");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);
        int columnCount = 0;
        createCell(row, columnCount++, "Consignment Detail ID", style);
        createCell(row, columnCount++, "Status", style);
        createCell(row, columnCount++, "Description", style);
        createCell(row, columnCount++, "Price", style);
        createCell(row, columnCount++, "Consignment ID", style);
        createCell(row, columnCount++, "Account ID", style);
    }

    private void createCell(Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void writeDataLines() {
        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        style.setFont(font);

        for (ConsignmentDetailDTO detail : listConsignmentDetails) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, detail.getConsignmentDetailId(), style);
            createCell(row, columnCount++, detail.getStatus(), style);
            createCell(row, columnCount++, detail.getDescription(), style);
            createCell(row, columnCount++, detail.getPrice().toString(), style);
            createCell(row, columnCount++, detail.getConsignmentId(), style);
            createCell(row, columnCount++, detail.getAccount(), style);

        }
    }

    public void export(HttpServletResponse response) {
        try {
            writeHeaderLine();
            writeDataLines();

            ServletOutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            workbook.close();

            outputStream.close();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error exporting data to Excel file: " + e.getMessage());
        }

    }
}
