package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
