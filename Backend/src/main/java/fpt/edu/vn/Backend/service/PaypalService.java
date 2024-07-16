package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.request.PayPalPaymentRequestDTO;
import fpt.edu.vn.Backend.DTO.response.PaypalCaptureResponseDTO;
import fpt.edu.vn.Backend.exception.PaypalRequestException;

public interface PaypalService {
    String getAccessToken();
    String createOrder(PayPalPaymentRequestDTO dto) throws PaypalRequestException;
    PaypalCaptureResponseDTO captureOrder(String orderId);
}
