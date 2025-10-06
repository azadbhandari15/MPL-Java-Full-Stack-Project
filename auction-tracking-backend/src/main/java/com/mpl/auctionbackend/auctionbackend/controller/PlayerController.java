package com.mpl.auctionbackend.auctionbackend.controller;

import com.mpl.auctionbackend.auctionbackend.model.PlayerDetails;
import com.mpl.auctionbackend.auctionbackend.model.PlayerPurseDto;
import com.mpl.auctionbackend.auctionbackend.model.PlayerSoldRequestDto;
import com.mpl.auctionbackend.auctionbackend.service.PlayerService;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/findRandomPlayer")
    public ResponseEntity<PlayerDetails> findRandomPlayer(){
        return ResponseEntity.ok(playerService.findRandomPlayer());
    }


    @PostMapping("/insert-players")
    public String insertPlayers(@RequestParam("file")MultipartFile file) throws Exception{
        playerService.persistPlayers(file.getInputStream());
        return "Players has been persisted";
    }

    @PostMapping("/sell-player")
    public String sellPlayer(@RequestBody PlayerSoldRequestDto playerSoldRequestDto){
        playerService.updatePlayerStatus(playerSoldRequestDto);
        return "Player is Sold";
    }

    @GetMapping("/find-player-purse-details")
    public ResponseEntity<List<PlayerPurseDto>> retrievePlayerDetails(){
        return ResponseEntity.ok(playerService.retrievePlayerPurse());
    }


}
