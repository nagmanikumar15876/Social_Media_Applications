package com.nagmani.service;

import java.util.List;

import com.nagmani.exception.TwitException;
import com.nagmani.exception.UserException;
import com.nagmani.model.Twit;
import com.nagmani.model.User;
import com.nagmani.request.TwitReplyRequest;

public interface TwitService {
	
	
	public Twit createTwit(Twit req,User user)throws UserException, TwitException;
	
	public List<Twit> findAllTwit();
	
	public Twit retwit(Long twitId, User user) throws UserException, TwitException;
	
	public Twit findById(Long twitId) throws TwitException;
	
	public void deleteTwitById(Long twitId,Long userId) throws TwitException, UserException;
	
	public Twit removeFromRetwit(Long twitId, User user) throws TwitException, UserException;
	
	public Twit createReply(TwitReplyRequest req,User user) throws TwitException;
	
	public List<Twit> getUsersTwit(User user);
	
	public List<Twit> findByLikesContainsUser(User user);
	
	

}
