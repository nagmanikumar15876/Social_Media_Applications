package com.nagmani.controller;



import com.nagmani.model.Chat;
import com.nagmani.model.User;
import com.nagmani.request.CreateChatRequest;
import com.nagmani.service.ChatService;
import com.nagmani.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

@RestController
public class ChatController {



    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @PostMapping("/api/chats")
    public Chat createChat(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreateChatRequest req) throws Exception {

        User reqUser = userService.findUserProfileByJwt(jwt);
        User user2 = userService.findUserById(req.getUserId().longValue());

        return chatService.createChat(reqUser, user2);
    }



    @GetMapping("/api/chats")
    public List<Chat> findUsersChat(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        return chatService.findUsersChat(user.getId());
    }
}