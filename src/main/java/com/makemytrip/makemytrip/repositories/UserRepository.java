package com.makemytrip.makemytrip.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.makemytrip.makemytrip.models.Users;

public interface UserRepository extends MongoRepository<Users,String>{
    Users findByEmail(String email);
    
}

