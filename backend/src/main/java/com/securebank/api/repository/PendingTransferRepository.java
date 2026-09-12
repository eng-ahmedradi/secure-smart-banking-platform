package com.securebank.api.repository;

import com.securebank.api.model.PendingTransfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingTransferRepository extends JpaRepository<PendingTransfer, Long> {
}
