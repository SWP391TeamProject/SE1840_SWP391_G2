package fpt.edu.vn.Backend.DTO;

import lombok.Data;

import java.io.Serializable;

@Data
public class PaginationDTO implements Serializable {
    private int currentPage;
    private int size;
    private long totalElements;
    private int totalPages;
    private String sort;

    public PaginationDTO() {}

    public PaginationDTO(int currentPage, int size, long totalElements, int totalPages) {
        this.currentPage = currentPage;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

}