package fpt.edu.vn.Backend.exporter;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
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

public class ConsignmentExporter {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<ConsignmentDTO> list;

    public ConsignmentExporter(List<ConsignmentDTO>  listConsignments) {
        this.list = listConsignments;
        workbook = new XSSFWorkbook();
    }

    private void writeHeaderLine() {
        sheet = workbook.createSheet("Consignments");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);
        int columnCount = 0;
        createCell(row, columnCount++, "Consignment ID", style);
        createCell(row, columnCount++, "Title", style);
        createCell(row, columnCount++, "Sender Name", style);
        createCell(row, columnCount++, "Sender Phone", style);
        createCell(row, columnCount++, "Sender Email", style);
        createCell(row, columnCount++, "Prefer Contact", style);
        createCell(row, columnCount++, "Staff", style);
        createCell(row, columnCount++, "Status", style);




        // Add more headers as needed
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

        for (ConsignmentDTO consignment : list) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, consignment.getConsignmentId(), style);
            createCell(row, columnCount++, consignment.getConsignmentDetails().stream().filter(
                    consignmentDetailDTO -> consignmentDetailDTO.getStatus().equals("REQUEST"))
                    .findFirst().orElseThrow(()->new ResourceNotFoundException("No Consignment Detail type Request"))
                    .getDescription(), style);
            createCell(row, columnCount++, consignment.getConsignmentDetails().stream().filter(
                            consignmentDetailDTO -> consignmentDetailDTO.getStatus().equals("REQUEST"))
                    .findFirst().orElseThrow(()->new ResourceNotFoundException("No Consignment Detail type Request"))
                    .getAccount().getNickname(), style);
            createCell(row, columnCount++, consignment.getConsignmentDetails().stream().filter(
                            consignmentDetailDTO -> consignmentDetailDTO.getStatus().equals("REQUEST"))
                    .findFirst().orElseThrow(()->new ResourceNotFoundException("No Consignment Detail type Request"))
                    .getAccount().getPhone(), style);
            createCell(row, columnCount++, consignment.getConsignmentDetails().stream().filter(
                            consignmentDetailDTO -> consignmentDetailDTO.getStatus().equals("REQUEST"))
                    .findFirst().orElseThrow(()->new ResourceNotFoundException("No Consignment Detail type Request"))
                    .getAccount().getEmail(), style);
            createCell(row, columnCount++, consignment.getPreferContact(), style);
            createCell(row, columnCount++, consignment.getStaff().getNickname()+"-"+consignment.getStaff().getAccountId(), style);
            createCell(row, columnCount++, consignment.getStatus(), style);
        }
    }

    public void export(HttpServletResponse response){
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