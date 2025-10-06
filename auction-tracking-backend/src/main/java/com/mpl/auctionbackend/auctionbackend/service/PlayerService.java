package com.mpl.auctionbackend.auctionbackend.service;

import com.mpl.auctionbackend.auctionbackend.model.PlayerPurseDto;
import com.mpl.auctionbackend.auctionbackend.model.PlayerDetails;
import com.mpl.auctionbackend.auctionbackend.model.PlayerSoldRequestDto;

import java.io.InputStream;
import java.util.List;

public interface PlayerService {
    PlayerDetails findRandomPlayer();
    void persistPlayers(InputStream inputStream);
    void updatePlayerStatus(PlayerSoldRequestDto playerSoldRequestDto);
    List<PlayerPurseDto> retrievePlayerPurse();
}
