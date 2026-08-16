package com.nagmani.service;


import com.nagmani.model.Chat;
import com.nagmani.model.User;
import com.nagmani.repository.ChatRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class ChatServiceImplementation implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Override
    public Chat createChat(User reqUser, User user2) throws Exception {

        List<Chat> chats = chatRepository.findByUserId(reqUser.getId());

        for(Chat chat : chats){

            boolean hasReqUser =
                    chat.getUsers().stream()
                            .anyMatch(u -> u.getId().equals(reqUser.getId()));

            boolean hasUser2 =
                    chat.getUsers().stream()
                            .anyMatch(u -> u.getId().equals(user2.getId()));

            if(hasReqUser && hasUser2){
                return chat;
            }
        }

        Chat chat = new Chat();
        chat.getUsers().add(reqUser);
        chat.getUsers().add(user2);

        return chatRepository.save(chat);
    }


    @Override
    public Chat findChatById(Integer chatId) throws Exception {
        Optional<Chat> opt = chatRepository.findById(chatId);
        if (opt.isEmpty()) {
            throw new Exception("Chat not found with id " + chatId);
        }
        return opt.get();
    }

    @Override
    public List<Chat> findUsersChat(Long userId) throws Exception {
        return chatRepository.findByUserId(userId);
    }
}
