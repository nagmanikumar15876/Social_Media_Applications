package com.nagmani.service;

import com.nagmani.model.Chat;
import com.nagmani.model.User;
import java.util.List;

public interface ChatService {
    Chat createChat(User reqUser, User user2) throws Exception;
    Chat findChatById(Integer chatId) throws Exception;
    List<Chat> findUsersChat(Long userId) throws Exception;
}