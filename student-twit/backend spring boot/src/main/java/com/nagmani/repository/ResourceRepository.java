package com.nagmani.repository;

import com.nagmani.enums.ResourceStatus;
import com.nagmani.model.Resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findBySubjectIdAndStatusOrderByCreatedAtDesc(Long subjectId, ResourceStatus status);
    List<Resource> findByStatusOrderByCreatedAtDesc(ResourceStatus status);
}