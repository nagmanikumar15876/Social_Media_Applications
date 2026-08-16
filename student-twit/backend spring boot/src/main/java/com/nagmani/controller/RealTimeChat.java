package com.nagmani.controller;


import com.nagmani.model.Message;
import com.nagmani.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class RealTimeChat {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @MessageMapping("/chat/{groupId}")
    public Message sendToUser( @Payload Message message ,
    @DestinationVariable String groupId) throws Exception {

        System.out.println("Message Received = " + message.getContent());
        simpMessagingTemplate.convertAndSendToUser(
                groupId,"/private" , message);

       return message;
    }

}
