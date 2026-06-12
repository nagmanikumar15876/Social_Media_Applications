package com.nagmani.service;

import com.nagmani.model.Message;
import com.nagmani.model.User;
import java.util.List;

public interface MessageService {
    Message createMessage(User user, Integer chatId, Message req) throws Exception;
    List<Message> findChatsMessages(Integer chatId) throws Exception;
}
