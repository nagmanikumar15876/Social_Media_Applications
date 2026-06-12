package com.nagmani.controller;

import com.nagmani.model.Message;
import com.nagmani.model.User;
import com.nagmani.service.MessageService;
import com.nagmani.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService; // Corrected typo from userSerivice

    @PostMapping("/api/messages/chat/{chatId}")
    public Message createMessage(
            @RequestBody Message req,
            @RequestHeader("Authorization") String jwt,
            @PathVariable Integer chatId) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        return messageService.createMessage(user, chatId, req);
    }

    @GetMapping("/api/messages/chat/{chatId}")
    public List<Message> findChatsMessage(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Integer chatId) throws Exception {

        userService.findUserProfileByJwt(jwt); // Validates user exists
        return messageService.findChatsMessages(chatId);
    }
}