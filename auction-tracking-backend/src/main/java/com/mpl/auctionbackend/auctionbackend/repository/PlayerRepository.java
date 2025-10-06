package com.mpl.auctionbackend.auctionbackend.repository;

import com.mpl.auctionbackend.auctionbackend.entity.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<PlayerEntity,Long> {
        Optional<PlayerEntity> findByPlayerId(String playerId);

}
