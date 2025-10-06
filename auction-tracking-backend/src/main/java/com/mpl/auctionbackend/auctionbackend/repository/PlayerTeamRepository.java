package com.mpl.auctionbackend.auctionbackend.repository;

import com.mpl.auctionbackend.auctionbackend.entity.PlayerEntity;
import com.mpl.auctionbackend.auctionbackend.entity.PlayerTeamEntity;
import com.mpl.auctionbackend.auctionbackend.model.PlayerPurseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlayerTeamRepository extends JpaRepository<PlayerTeamEntity,Long> {

    PlayerTeamEntity findByTeamName(String teamName);

    @Query("select new com.mpl.auctionbackend.auctionbackend.model.PlayerPurseDto(pte.teamName,pte.purseAmount) from PlayerTeamEntity pte")
    List<PlayerPurseDto> findPlayerDetails();
}
