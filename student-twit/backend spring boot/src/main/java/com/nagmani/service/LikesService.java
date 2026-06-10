package com.nagmani.service;

import java.util.List;

import com.nagmani.exception.LikeException;
import com.nagmani.exception.TwitException;
import com.nagmani.exception.UserException;
import com.nagmani.model.Like;
import com.nagmani.model.User;

public interface LikesService {
	
	public Like likeTwit(Long twitId, User user) throws UserException, TwitException;
	
	public Like unlikeTwit(Long twitId, User user) throws UserException, TwitException, LikeException;
	
	public List<Like> getAllLikes(Long twitId) throws TwitException;

}
