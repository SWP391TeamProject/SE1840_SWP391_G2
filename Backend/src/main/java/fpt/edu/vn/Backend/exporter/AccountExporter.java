package fpt.edu.vn.Backend.exporter;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.util.List;

public class AccountExporter {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<AccountDTO> listAccounts;

    public AccountExporter(List<AccountDTO> listAccounts) {
        this.listAccounts = listAccounts;
        workbook = new XSSFWorkbook();
    }


    private void writeHeaderLine() {
        sheet = workbook.createSheet("Accounts");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);
        int columnCount = 0;
        createCell(row, columnCount++, "Account ID", style);
        createCell(row, columnCount++, "Email", style);
        createCell(row, columnCount++, "Nick Name", style);
        createCell(row, columnCount++, "Role", style);
        createCell(row, columnCount++, "Phone", style);
        createCell(row, columnCount++, "Balance", style);
        createCell(row, columnCount++, "Create Date", style);
        createCell(row, columnCount++, "Update Date", style);
        createCell(row, columnCount++, "Status", style);
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

        for (AccountDTO user : listAccounts) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, user.getAccountId(), style);
            createCell(row, columnCount++, user.getEmail(), style);
            createCell(row, columnCount++, user.getNickname(), style);
            createCell(row, columnCount++, user.getRole().toString(), style);
            createCell(row, columnCount++, user.getPhone(), style);
            createCell(row, columnCount++, user.getBalance().toString(), style);
            createCell(row, columnCount++, user.getCreateDate().toString(), style);
            createCell(row, columnCount++, user.getUpdateDate().toString(), style);
            createCell(row, columnCount++, user.getStatus().name(), style);


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
