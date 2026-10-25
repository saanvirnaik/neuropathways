package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.dto.ContactRequest;
import org.neurohearts.neuropathways.entity.ContactMessage;
import org.neurohearts.neuropathways.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {
    private final ContactMessageRepository repository;

    public ContactService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void saveMessage(ContactRequest request) {

        ContactMessage message = new ContactMessage();

        message.setName(request.getName().trim());
        message.setEmail(request.getEmail().trim());
        message.setTopic(request.getTopic());
        message.setMessage(request.getMessage().trim());
        message.setStatus("NEW");

        repository.save(message);
    }
}
