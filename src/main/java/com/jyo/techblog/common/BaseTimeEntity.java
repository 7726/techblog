package com.jyo.techblog.common;


import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * createdAt, updatedAt을 공통으로 관리하기 위한 추상 클래스
 */
@Getter
@MappedSuperclass  // 이 클래스를 상속한 엔티티의 필드로 매핑되게 해줌
@EntityListeners(AuditingEntityListener.class)  // JPA Auditing 사용
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(updatable = false)  // 생성 시에만 값이 들어가도록
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

}
