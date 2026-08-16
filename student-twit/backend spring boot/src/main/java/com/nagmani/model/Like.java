package com.nagmani.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name="likes")
public class Like {
	
  	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@ManyToOne
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;

	@ManyToOne
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Twit twit;
  	
 
}
