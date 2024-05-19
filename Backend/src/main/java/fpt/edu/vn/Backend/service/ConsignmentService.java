package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.repository.ConsignmentRepos;

public interface ConsignmentService {

    void requestConsignment(int userId, int auctionItemId);

    void sendInitialEvaluation(int consignmentId, String evaluation);

    void sendFinalEvaluation(int consignmentId, String evaluation);

    void updateConsignmentStatus(int consignmentId, String status);




}
